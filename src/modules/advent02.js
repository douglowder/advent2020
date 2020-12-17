const fs = require('fs');

const readInput = (inputFilePath) =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .trim()
    .split('\n')
    .map((s) => {
      const tokens = s.split(' ');
      const ll = parseInt(tokens[0].split('-')[0]);
      const ul = parseInt(tokens[0].split('-')[1]);
      const c = tokens[1].split(':')[0];
      const pw = tokens[2];
      return {
        ll,
        ul,
        c,
        pw,
      };
    });

const part1 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  return input
    .map(({ll, ul, c, pw}) =>
      pw.split('').filter((s) => s === c).length >= ll &&
      pw.split('').filter((s) => s === c).length <= ul
        ? 1
        : 0,
    )
    .reduce((a, b) => a + b, 0);
};

const part2 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  return input
    .map(({ll, ul, c, pw}) =>
      (ll >= 1 && ll <= pw.length && pw[ll - 1] === c ? 1 : 0) +
        (ul >= 1 && ul <= pw.length && pw[ul - 1] === c ? 1 : 0) ===
      1
        ? 1
        : 0,
    )
    .reduce((a, b) => a + b, 0);
};

module.exports = {
  part1,
  part2,
};
