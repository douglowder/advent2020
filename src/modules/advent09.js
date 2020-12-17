const fs = require('fs');

const readInput = inputFilePath =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .trim()
    .split('\n')
    .map(n => parseInt(n));

function testNumberAtIndex(input, index, depth) {
  const testNumber = input[index];
  const numberSet = new Set(input.slice(index - depth, index));
  let result = false;
  for (let n of numberSet.values()) {
    if (numberSet.has(testNumber - n)) {
      result = true;
      break;
    }
  }
  return result;
}

function findContiguousSum(input, expectedSum) {
  for (let i = 0; i < input.length - 1; i++) {
    let j = i;
    let sum = input[j];
    while (sum < expectedSum && j < input.length - 1) {
      j = j + 1;
      sum = sum + input[j];
    }
    if (sum === expectedSum) {
      return {
        i,
        j,
      };
    }
  }
}

const part1 = inputFilePath => {
  const input = readInput(inputFilePath);
  const depth = input.length > 25 ? 25 : 5;
  for (let i = depth; i < input.length; i++) {
    if (!testNumberAtIndex(input, i, depth)) {
      return input[i];
    }
  }
};

const part2 = inputFilePath => {
  const input = readInput(inputFilePath);
  const {i, j} = findContiguousSum(input, part1(inputFilePath));
  const range = input.slice(i, j);
  range.sort((a, b) => (a < b ? -1 : 1));
  return range[0] + range[range.length - 1];
};

module.exports = {
  part1,
  part2,
};
