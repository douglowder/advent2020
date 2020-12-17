// Template for a new Advent module

const fs = require('fs');

const keyFromVector = (v) => `${v[0]},${v[1]},${v[2]},${v[3]}`;
const vectorFromKey = (key) => key.split(',').map((n) => parseInt(n));

const readInput = (inputFilePath) => {
  const initialState = new Set();
  fs.readFileSync(inputFilePath, 'utf-8')
    .split('\n')
    .forEach((s, i) => {
      s.split('').forEach((c, j) => {
        if (c === '#') {
          const v = [j, i, 0, 0];
          initialState.add(keyFromVector(v));
        }
      });
    });
  return initialState;
};

const neighborKeys3d = (key) => {
  const v = vectorFromKey(key);
  const neighbors = [];
  const a = [-1, 0, 1];
  for (let x of a) {
    for (let y of a) {
      for (let z of a) {
        if (x !== 0 || y !== 0 || z !== 0) {
          neighbors.push(keyFromVector([v[0] + x, v[1] + y, v[2] + z, 0]));
        }
      }
    }
  }
  return neighbors;
};

const neighborKeys4d = (key) => {
  const v = vectorFromKey(key);
  const neighbors = [];
  const a = [-1, 0, 1];
  for (let x of a) {
    for (let y of a) {
      for (let z of a) {
        for (let w of a) {
          if (x !== 0 || y !== 0 || z !== 0 || w !== 0) {
            neighbors.push(
              keyFromVector([v[0] + x, v[1] + y, v[2] + z, v[3] + w]),
            );
          }
        }
      }
    }
  }
  return neighbors;
};

const iterateState = (state, neighborKeysFunction) => {
  const newState = new Set();
  const cellsToCheck = new Set();
  for (let key of state.keys()) {
    cellsToCheck.add(key);
    const neighbors = neighborKeysFunction(key);
    for (let n of neighbors) {
      cellsToCheck.add(n);
    }
  }
  for (let key of cellsToCheck.values()) {
    const numberOfActiveNeighbors = neighborKeysFunction(key).filter((k) =>
      state.has(k),
    ).length;
    if (!state.has(key) && numberOfActiveNeighbors === 3) {
      newState.add(key);
    } else if (
      state.has(key) &&
      (numberOfActiveNeighbors === 2 || numberOfActiveNeighbors === 3)
    ) {
      newState.add(key);
    }
  }
  return newState;
};

const part1 = (inputFilePath) => {
  let state = readInput(inputFilePath);
  for (let i = 0; i < 6; i++) {
    state = iterateState(state, neighborKeys3d);
  }
  return state.size;
};

const part2 = (inputFilePath) => {
  let state = readInput(inputFilePath);
  for (let i = 0; i < 6; i++) {
    state = iterateState(state, neighborKeys4d);
  }
  return state.size;
};

module.exports = {
  part1,
  part2,
};
