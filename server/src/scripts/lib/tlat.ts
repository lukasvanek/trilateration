import * as R from 'ramda'

const earthR = 6378137

const radians = (degrees: number) => (degrees * Math.PI) / 180

const degrees = (radians: number) => (radians * 180) / Math.PI

export const coordinatesDist = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const dLat = radians(lat2 - lat1)
  const dLon = radians(lon2 - lon1)

  const lat1rad = radians(lat1)
  const lat2rad = radians(lat2)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1rad) *
      Math.cos(lat2rad)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthR * c // distance in m
}

const degToMLat = (deg: number) => radians(deg) * earthR

const mToDegLat = (m: number) => degrees(m / earthR)

const degToMLon = (deg: number, lat: number) =>
  radians(deg) * earthR * Math.cos(radians(lat))

const mToDegLon = (m: number, lat: number) =>
  degrees(m / (earthR * Math.cos(radians(lat))))

export const geoIntersection = (
  lat1: number,
  lon1: number,
  r1: number,
  lat2: number,
  lon2: number,
  r2: number,
) => {
  const A = { lat: degToMLat(lat1), lon: degToMLon(lon1, lat1), r: r1 }
  const B = { lat: degToMLat(lat2), lon: degToMLon(lon2, lat1), r: r2 }

  const d = Math.hypot(B.lat - A.lat, B.lon - A.lon)

  if (d <= A.r + B.r && d >= Math.abs(B.r - A.r)) {
    const x = (A.r * A.r - B.r * B.r + d * d) / (2 * d)
    const y = Math.sqrt(A.r * A.r - x * x)

    const eX = (B.lat - A.lat) / d
    const eY = (B.lon - A.lon) / d

    return [
      [
        mToDegLat(A.lat + x * eX - y * eY),
        mToDegLon(A.lon + x * eY + y * eX, lat1),
      ],
      [
        mToDegLat(A.lat + x * eX + y * eY),
        mToDegLon(A.lon + x * eY - y * eX, lat1),
      ],
    ]
  } else {
    // No Intersection, far outside or one circle is inside the other
    return null
  }
}

const combinations = (xs, n) =>
  n == 0
    ? [[]]
    : R.isEmpty(xs)
    ? []
    : R.concat(
        R.map(R.prepend(R.head(xs)), combinations(R.tail(xs), n - 1)),
        combinations(R.tail(xs), n),
      )

const intersectionOfRadars = (A, B) =>
  geoIntersection(
    A.coordinates[0],
    A.coordinates[1],
    A.distance,
    B.coordinates[0],
    B.coordinates[1],
    B.distance,
  )

const mean = R.lift(R.divide)(R.sum, R.length)

export const trilaterate = ([A, B, C]) => {
  const intersectionPairs = [
    [A, B],
    [B, C],
    [C, A],
  ].map((pair) => intersectionOfRadars(pair[0], pair[1]))

  const circInterPoints = R.unnest(intersectionPairs).filter((p) => !!p)

  const combs = combinations(circInterPoints, 2)
    .map((x) => ({
      points: x,
      d: coordinatesDist(x[0][0], x[0][1], x[1][0], x[1][1]),
    }))
    .sort((a, b) => a.d - b.d)

  const densePoints = R.pipe(
    R.take(3),
    R.pluck('points'),
    R.unnest,
    R.uniq,
  )(combs)

  //console.log(densePoints)

  const lats = R.pluck(0)(densePoints)
  const lons = R.pluck(1)(densePoints)

  return [mean(lats), mean(lons)]
}
