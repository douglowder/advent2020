const fs = require('fs');

const seatKey = (x, y) => `[${x}, ${y}]`;

const readInput = (inputFilePath) => {
  const seatMap = new Map();
  const rows = fs.readFileSync(inputFilePath, 'utf-8').split('\n');
  const height = rows.length;
  const width = rows[0].length;
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      const c = rows[i].substring(j, j + 1);
      if (c === 'L') {
        seatMap.set(seatKey(j, i), {
          x: j,
          y: i,
          occupied: false,
        });
      } else if (c === '#') {
        seatMap.set(seatKey(j, i), {
          x: j,
          y: i,
          occupied: true,
        });
      }
    }
  }
  addVisibleNeighbors(seatMap, height, width);
  return seatMap;
};

const areSeatMapsEqual = (seatMap1, seatMap2) => {
  if (!seatMap1 || !seatMap2) {
    return false;
  }
  for (let key of seatMap1.keys()) {
    if (!seatMap2.has(key)) {
      return false;
    }
    const v1 = seatMap1.get(key);
    const v2 = seatMap2.get(key);
    if (v1.occupied !== v2.occupied) {
      return false;
    }
  }
  return true;
};

const occupiedSeats = (seatMap) => {
  let count = 0;
  for (let key of seatMap.keys()) {
    count = count + (seatMap.get(key).occupied ? 1 : 0);
  }
  return count;
};

const neighborOffsets = [
  {x: -1, y: -1},
  {x: 0, y: -1},
  {x: 1, y: -1},
  {x: -1, y: 0},
  {x: 1, y: 0},
  {x: -1, y: 1},
  {x: 0, y: 1},
  {x: 1, y: 1},
];

const addVisibleNeighbors = (seatMap, height, width) => {
  for (let key of seatMap.keys()) {
    const {x, y, occupied} = seatMap.get(key);
    const visibleNeighbors = [];
    for (let n of neighborOffsets) {
      let xc = x;
      let yc = y;
      let neighborKey;
      while (xc >= 0 && xc < width && yc >= 0 && yc < height) {
        xc = xc + n.x;
        yc = yc + n.y;
        neighborKey = seatKey(xc, yc);
        if (seatMap.has(neighborKey)) {
          visibleNeighbors.push(neighborKey);
          break;
        }
      }
    }
    seatMap.get(key).visibleNeighbors = visibleNeighbors;
  }
};

const iterateSeatMap1 = (seatMap) => {
  const next = new Map();
  for (let key of seatMap.keys()) {
    let {x, y, occupied, visibleNeighbors} = seatMap.get(key);
    const numberOfOccupiedNeighbors = neighborOffsets
      .map((o) =>
        seatMap.has(seatKey(x + o.x, y + o.y))
          ? seatMap.get(seatKey(x + o.x, y + o.y)).occupied
          : false,
      )
      .reduce((a, b) => a + b, 0);
    if (!occupied && numberOfOccupiedNeighbors === 0) {
      occupied = true;
    } else if (occupied && numberOfOccupiedNeighbors >= 4) {
      occupied = false;
    }
    next.set(key, {
      x,
      y,
      occupied,
      visibleNeighbors,
    });
  }
  return next;
};

const iterateSeatMap2 = (seatMap) => {
  const next = new Map();
  for (let key of seatMap.keys()) {
    let {x, y, occupied, visibleNeighbors} = seatMap.get(key);
    const numberOfOccupiedNeighbors = visibleNeighbors
      .map((n) => (seatMap.get(n).occupied ? 1 : 0))
      .reduce((a, b) => a + b, 0);
    if (!occupied && numberOfOccupiedNeighbors === 0) {
      occupied = true;
    } else if (occupied && numberOfOccupiedNeighbors >= 5) {
      occupied = false;
    }
    next.set(key, {
      x,
      y,
      occupied,
      visibleNeighbors,
    });
  }
  return next;
};

const part1 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  let seatMap = iterateSeatMap1(input);
  let count = 1;
  let finished = false;
  let next = seatMap;
  while (!finished) {
    next = iterateSeatMap1(seatMap);
    count = count + 1;
    if (areSeatMapsEqual(seatMap, next)) {
      finished = true;
    } else {
      seatMap = next;
    }
  }

  return occupiedSeats(seatMap);
};

const part2 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  let seatMap = iterateSeatMap2(input);
  let count = 1;
  let finished = false;
  let next = seatMap;
  while (!finished) {
    next = iterateSeatMap2(seatMap);
    count = count + 1;
    if (areSeatMapsEqual(seatMap, next)) {
      finished = true;
    } else {
      seatMap = next;
    }
  }

  return occupiedSeats(seatMap);
};

module.exports = {
  part1,
  part2,
};
