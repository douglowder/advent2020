const fs = require('fs');

const readInput = inputFilePath => {
  const input = fs
    .readFileSync(inputFilePath, 'utf-8')
    .trim()
    .split('\n')
    .map(n => {
      return parseInt(n);
    });
  input.sort((n1, n2) => {
    return n1 < n2 ? -1 : 1;
  });
  return input;
};

const part1 = inputFilePath => {
  const input = readInput(inputFilePath);
  const inputSet = new Set(input);
  for (let i = 0; i < input.length; i++) {
    if (input[i] >= 2020) {
      break;
    }
    if (inputSet.has(2020 - input[i])) {
      return input[i] * (2020 - input[i]);
    }
  }
};

const part2 = inputFilePath => {
  const input = readInput(inputFilePath);
  const inputSet = new Set(input);
  for (let i = 0; i < input.length - 1; i++) {
    if (input[i] >= 2020) {
      break;
    }
    for (let j = i + 1; j < input.length; j++) {
      if (input[i] + input[j] >= 2020) {
        break;
      }
      if (inputSet.has(2020 - input[i] - input[j])) {
        return input[i] * input[j] * (2020 - input[i] - input[j]);
      }
    }
  }
};

module.exports = {
  part1,
  part2,
};
