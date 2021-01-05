const fs = require('fs');

// Use axial coordinate system
// (https://www.redblobgames.com/grids/hexagons/#coordinates)
const directionsMap = new Map([
  ['e', [1, 0]],
  ['w', [-1, 0]],
  ['ne', [1, -1]],
  ['nw', [0, -1]],
  ['se', [0, 1]],
  ['sw', [-1, 1]],
]);

const directionPathFromLine = (l) => {
  const directions = [];
  const tokens = l.split('');
  while (tokens.length > 0) {
    const c = tokens.shift();
    switch (c) {
      case 'e':
      case 'w':
        directions.push(c);
        break;
      case 'n':
      case 's':
        directions.push(c + tokens.shift());
        break;
    }
  }
  return directions.map((d) => directionsMap.get(d));
};

const locationToKey = (l) => `${l[0]},${l[1]}`;
const keyToLocation = (k) => k.split(',').map((n) => parseInt(n));

const tileNeighbors = (k) => {
  const location = keyToLocation(k);
  const neighbors = [];
  for (let d of directionsMap.keys()) {
    const direction = directionsMap.get(d);
    const neighborLocation = [
      location[0] + direction[0],
      location[1] + direction[1],
    ];
    neighbors.push(locationToKey(neighborLocation));
  }
  return neighbors;
};

const iterateFloor = (blackTiles) => {
  const tilesToCheck = new Set();
  for (let t of blackTiles) {
    tilesToCheck.add(t);
    for (let n of tileNeighbors(t)) {
      tilesToCheck.add(n);
    }
  }
  const tilesToFlip = [];
  for (let t of tilesToCheck) {
    let nBlackNeighbors = 0;
    for (let n of tileNeighbors(t)) {
      if (blackTiles.has(n)) {
        nBlackNeighbors = nBlackNeighbors + 1;
      }
    }
    if (blackTiles.has(t)) {
      if (nBlackNeighbors === 0 || nBlackNeighbors > 2) {
        tilesToFlip.push(t);
      }
    } else {
      if (nBlackNeighbors === 2) {
        tilesToFlip.push(t);
      }
    }
  }
  for (let t of tilesToFlip) {
    if (blackTiles.has(t)) {
      blackTiles.delete(t);
    } else {
      blackTiles.add(t);
    }
  }
};

const readInput = (inputFilePath) =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .split('\n')
    .map((l) => directionPathFromLine(l));

const blackTilesFromTilePaths = (tilePaths) => {
  const blackTiles = new Set();
  for (let path of tilePaths) {
    let location = [0, 0];
    for (let step of path) {
      location[0] = location[0] + step[0];
      location[1] = location[1] + step[1];
    }
    const key = locationToKey(location);
    if (blackTiles.has(key)) {
      blackTiles.delete(key);
    } else {
      blackTiles.add(key);
    }
  }
  return blackTiles;
};

const part1 = (inputFilePath) => {
  const tilePaths = readInput(inputFilePath);
  const blackTiles = blackTilesFromTilePaths(tilePaths);
  return blackTiles.size;
};

const part2 = (inputFilePath) => {
  const tilePaths = readInput(inputFilePath);
  const blackTiles = blackTilesFromTilePaths(tilePaths);
  for (let i = 0; i < 100; i++) {
    iterateFloor(blackTiles);
  }
  return blackTiles.size;
};

module.exports = {
  part1,
  part2,
};
