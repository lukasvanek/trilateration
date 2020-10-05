const M = (x: number) => x * 1000000;
const B = (x: number) => x * 1000000000;

const genBounds = (start: number = 0, step: number = 10, max: number = 100) => {
  const arr: number[] = [start];
  while (arr[arr.length-1] < max) {
    arr.push(arr[arr.length-1] + step)
  }
  return arr;
}

type Fields = {
  [key: string]: {
    bounds: number[],
    format: string,
    title?: string,
    multiplier?: number,
    percent?: boolean
  }
};

export const fields: Fields = {
  'MarketCap': {
    bounds:  [...genBounds(0, M(50), B(1)), ...genBounds(B(2), B(1), B(20)), B(2000)],
    format: '0a',
    title: 'Market Cap.',
    multiplier: M(1)
  },
  'Price': {
    bounds: [...genBounds(0, 2, 50), 200, 500, 1000000],
    format: '0',
  },
  'RSI14': {
    bounds: genBounds(0, 5, 100),
    format: '0',
  },
  'PE': {
    bounds: [...genBounds(0, 3, 60), 100, 200, 10000],
    format: '0',
    title: 'P/E',
  },
  'PB': {
    bounds: [...genBounds(0, 0.5, 6.5), 7, 10, 100, 10000],
    format: '0.0',
    title: 'P/B',
  },
  'PS': {
    bounds: [...genBounds(0, 0.5, 6.5), 7, 10, 100, 10000],
    format: '0.0',
    title: 'P/S',
  },
  'DebtEq': {
    bounds: [...genBounds(0, 0.2, 2), 3, 4, 5, 20000000],
    format: '0.0',
    title: 'Debt/Eq',
  },
  'Employees': {
    bounds: [0, 20, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 10000, 50000, 75000, 100000, 10000000],
    format: '0',
  },
  'Salespast5Y': {
    bounds: [-100, -30, -25, -20, -15, -10, -5, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 10000, 100000, 10000000],
    format: '0',
    title: 'Sales past 5Y',
    percent: true,
  },
  'Recom': {
    bounds: genBounds(1, 0.2, 6),
    format: '0.0',
  },
}