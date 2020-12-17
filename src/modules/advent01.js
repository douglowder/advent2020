const fs = require('fs');

const readInput = (inputFilePath) => {
  const input = fs
    .readFileSync(inputFilePath, 'utf-8')
    .trim()
    .split('\n')
    .map((n) => {
      return parseInt(n);
    });
  input.sort((n1, n2) => {
    return n1 < n2 ? -1 : 1;
  });
  return input;
};

const part1 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  const inputSet = new Set(input);
  return input
    .filter((n) => inputSet.has(2020 - n))
    .map((n) => n * (2020 - n))[0];
};

const part2 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  const inputSet = new Set(input);
  return input.map((n, i) =>
    input
      .filter((m, j) => j > i && inputSet.has(2020 - m - n))
      .map((m) => m * n * (2020 - m - n)),
  )[0];
};

module.exports = {
  part1,
  part2,
};
