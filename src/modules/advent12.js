const fs = require('fs');

const readInput = (inputFilePath) =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .split('\n')
    .map((s) => {
      return {
        action: s.substring(0, 1),
        count: parseInt(s.substring(1)),
      };
    });

const directions = new Map([
  ['N', {x: 0, y: 1}],
  ['S', {x: 0, y: -1}],
  ['E', {x: 1, y: 0}],
  ['W', {x: -1, y: 0}],
]);

const leftTurn = new Map([
  ['N', 'W'],
  ['W', 'S'],
  ['S', 'E'],
  ['E', 'N'],
]);

const rightTurn = new Map([
  ['N', 'E'],
  ['E', 'S'],
  ['S', 'W'],
  ['W', 'N'],
]);

const leftTurnTransform = (v) => {
  return {
    x: -v.y,
    y: v.x,
  };
};

const rightTurnTransform = (v) => {
  return {
    x: v.y,
    y: -v.x,
  };
};

const part1 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  let x = 0;
  let y = 0;
  let dir = 'E';
  for (let round of input) {
    let n = round.count;
    switch (round.action) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
      case 'F':
        let thisRoundDirection = round.action;
        if (thisRoundDirection === 'F') {
          thisRoundDirection = dir;
        }
        x = x + n * directions.get(thisRoundDirection).x;
        y = y + n * directions.get(thisRoundDirection).y;
        break;
      case 'L':
        while (n > 0) {
          dir = leftTurn.get(dir);
          n = n - 90;
        }
        break;
      case 'R':
        while (n > 0) {
          dir = rightTurn.get(dir);
          n = n - 90;
        }
        break;
      default:
    }
  }
  return Math.abs(x) + Math.abs(y);
};

const part2 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  let x = 0;
  let y = 0;
  let wpx = 10;
  let wpy = 1;

  for (let round of input) {
    let n = round.count;
    switch (round.action) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        let thisRoundDirection = round.action;
        wpx = wpx + n * directions.get(thisRoundDirection).x;
        wpy = wpy + n * directions.get(thisRoundDirection).y;
        break;
      case 'L':
        while (n > 0) {
          const vt = leftTurnTransform({x: wpx, y: wpy});
          wpx = vt.x;
          wpy = vt.y;
          n = n - 90;
        }
        break;
      case 'R':
        while (n > 0) {
          const vt = rightTurnTransform({x: wpx, y: wpy});
          wpx = vt.x;
          wpy = vt.y;
          n = n - 90;
        }
        break;
      case 'F':
        x = x + n * wpx;
        y = y + n * wpy;
        break;
      default:
    }
  }
  return Math.abs(x) + Math.abs(y);
};

module.exports = {
  part1,
  part2,
};
