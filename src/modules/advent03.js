const fs = require('fs');

const readInput = inputFilePath =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .trim()
    .split('\n')
    .map(s => s.split(''));

const trees = (xslope, yslope, input) => {
  const height = input.length;
  const width = input[0].length;

  let x = xslope;
  let y = yslope;
  let count = 0;
  do {
    if (input[y][x % width] === '#') {
      count = count + 1;
    }
    x = x + xslope;
    y = y + yslope;
  } while (y < height);
  return count;
};

const part1 = inputFilePath => {
  const input = readInput(inputFilePath);
  return trees(3, 1, input);
};

const part2 = inputFilePath => {
  const input = readInput(inputFilePath);
  return (
    trees(1, 1, input) *
    trees(3, 1, input) *
    trees(5, 1, input) *
    trees(7, 1, input) *
    trees(1, 2, input)
  );
};

module.exports = {
  part1,
  part2,
};
