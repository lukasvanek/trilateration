import * as gapi from '../apis/gapi2'
import GsrsHistory from '../../features/gsrs/modelHistory'
import GsrsActual from '../../features/gsrs/modelActual'
import Lctns from '../../features/lctn/model'
import R from 'ramda'
import { getApproxDistance } from '../lib/approxDistance'
import { trilaterate, coordinatesDist } from '../lib/tlat'

const accounts = [
  {
    email: 'xxx@xxx.com',
    password: 'xxx',
  },
  // add another 2 accs
]

const radarPositions = [
  [49.251265, 16.455809],
  [49.285807, 16.752566],
  [49.087493, 16.605575],
]

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t))

const relevantChanges = ['displayName', 'aboutMe', 'identity', 'hashtags']

const didProfileChanged = (oldObj: any, newObj: any) => {
  const changes = relevantChanges.map((key) => {
    const cond =
      JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key]) &&
      newObj[key] !== undefined
    return cond
  })
  return changes.includes(true)
}

const processProfile = async (profile: any) => {
  const actualProfile = await GsrsActual.findOne({
    profileId: profile.profileId,
  }).lean()

  if (!actualProfile) {
    return await GsrsActual.create(profile)
  }
  if (didProfileChanged(actualProfile, profile)) {
    const legacy = R.omit(['_id', 'updatedAt'], actualProfile)
    await GsrsHistory.create(legacy)
  }

  return await GsrsActual.updateOne({ profileId: profile.profileId }, profile)
}

const commonProfiles = (pResults: any, filterBy = 'profileId') => {
  const ids = pResults.map((pr) => R.pluck(filterBy)(pr))
  const intersectedIds = ids.reduce((a: any, arr: any) =>
    a.filter((x: any) => arr.includes(x)),
  )
  return R.pipe(
    R.flatten,
    R.uniqBy((x) => x[filterBy]),
    R.filter((p) => intersectedIds.includes(p[filterBy])),
  )(pResults)
}

const doIt = async (age: number) => {
  const profileResults: any = []

  for (const [i, acc] of accounts.entries()) {
    let data: any = {
      profiles: [],
    }
    try {
      data = await gapi.getLocations({
        creds: acc,
        latlng: radarPositions[i],
        params: {
          ageMinimum: age,
          ageMaximum: age,
        },
      })
    } catch (err) {
      console.log(err)
    }

    for (const p of data.profiles) {
      await processProfile(p)
    }

    const corrected = data.profiles.map((p: any, i: number) => {
      if (p.distance) return p
      return {
        ...p,
        ...getApproxDistance(i, data.profiles),
      }
    })

    profileResults.push(corrected)

    await delay(1000)
  }

  const common: any = commonProfiles(profileResults)

  if (common.length < 1) {
    console.log('zero common profiles of used radars')
  }

  const withRadars = common.map((p: any) => {
    const radars = radarPositions.map((r, i) => {
      const profileFromScan = R.find((x) => x.profileId === p.profileId)(
        profileResults[i],
      )
      const radar = {
        coordinates: r,
        distance: profileFromScan.distance,
      }
      if (profileFromScan.deviationRange) {
        radar.deviationRange = profileFromScan.deviationRange
      }
      return radar
    })

    return {
      ...p,
      radars,
      computedLoc: trilaterate(radars),
    }
  })

  for (const p of withRadars) {
    console.log(p.displayName)
    console.log('computedLoc', p.computedLoc)

    const oldLctn: any = await Lctns.findOne({
      guid: p.profileId,
      last: true,
    }).lean()

    let diff

    if (oldLctn) {
      const oldLatLon = R.reverse(oldLctn.computedLoc.coordinates)
      diff = coordinatesDist(
        oldLatLon[0] as number,
        oldLatLon[1] as number,
        p.computedLoc[0],
        p.computedLoc[1],
      )
    }

    if (!oldLctn || diff > 25) {
      console.log('ok-diff', diff)
      const newLctn: any = {
        guid: p.profileId,
        seen: new Date(p.seen),
        n: oldLctn ? oldLctn.n + 1 : 1,
        last: true,
        radars: p.radars.map((r: any) => ({
          ...r,
          coordinates: R.reverse(r.coordinates), // mongoformat
        })),
        computedLoc: {
          type: 'Point',
          coordinates: R.reverse(p.computedLoc),
        },
      }
      if (!isNaN(newLctn.computedLoc.coordinates[0])) {
        // TODO how this happens?
        if (oldLctn) {
          await Lctns.updateOne({ _id: oldLctn._id }, { last: false })
        }
        await Lctns.create(newLctn)
      }
    } else {
      console.log('small-diff')
    }
  }

  console.log('done for', age)
  return
}

const run = async () => {
  let age = 20

  while (age < 21) {
    await doIt(age)
    age++
  }

  console.log('done for all ages')
}

const loop = async () => {
  while (0 < 1) {
    await run()
  }
}

export default loop
