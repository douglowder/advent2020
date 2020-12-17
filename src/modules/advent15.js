const fs = require('fs');

const readInput = (inputFilePath) =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .split(',')
    .map((n) => parseInt(n));

const findNumber = (inputFilePath, iterations) => {
  const input = readInput(inputFilePath);
  const numbersSeen = new Set();
  const previousTurn = new Map();
  let lastNumberSpoken = 0;
  for (let i = 0; i < input.length - 1; i++) {
    numbersSeen.add(input[i]);
    previousTurn.set(input[i], i);
  }
  lastNumberSpoken = input[input.length - 1];
  for (let j = input.length; j < iterations; j++) {
    let thisNumber = 0;
    if (!numbersSeen.has(lastNumberSpoken)) {
      numbersSeen.add(lastNumberSpoken);
    } else {
      thisNumber = j - 1 - previousTurn.get(lastNumberSpoken);
    }
    previousTurn.set(lastNumberSpoken, j - 1);
    lastNumberSpoken = thisNumber;
  }
  return lastNumberSpoken;
};

const part1 = (inputFilePath) => {
  return findNumber(inputFilePath, 2020);
};

const part2 = (inputFilePath) => {
  return findNumber(inputFilePath, 30000000);
};

module.exports = {
  part1,
  part2,
};
