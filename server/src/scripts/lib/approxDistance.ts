const findNearestNeighbourUp = (index: number, arr: any[]) => {
  let stepsNeeded = 0;
  for (let i = index; i < arr.length; i++) {
    if (arr[i].distance === null) {
      stepsNeeded++;
    } else {
      return [stepsNeeded, arr[i].distance];
    }
  }
  return [stepsNeeded, null];
}

const findNearestNeighbourDown = (index: number, arr: any[]) => {
  let stepsNeeded = 0;
  for (let i = index; i >= 0; i--) {
    if (arr[i].distance === null) {
      stepsNeeded++;
    } else {
      return [stepsNeeded, arr[i].distance];
    }
  }
  return [stepsNeeded, 0];
}

const normNumber = (num: number) => Number(num.toFixed(3))

export const getApproxDistance = (index: number, arr: any[]) => {
  const [stepsDown, neighDistDown] = findNearestNeighbourDown(index, arr);
  let [stepsUp, neighDistUp] = findNearestNeighbourUp(index, arr);
  let limitless = false;
  if (neighDistUp === null) {
    neighDistUp = neighDistDown + 100;
    limitless = true;
  }
  const step = (neighDistUp - neighDistDown) / (stepsUp + stepsDown);
  const distance = normNumber(neighDistDown + (stepsDown * step));
  const deviationRange = [
    normNumber(distance - neighDistDown),
    limitless ? Infinity : normNumber(neighDistUp - distance)
  ];
  return {
    distance,
    deviationRange
  }
}
