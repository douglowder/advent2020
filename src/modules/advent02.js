const fs = require('fs');

const readInput = inputFilePath =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .trim()
    .split('\n')
    .map(s => {
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

const part1 = inputFilePath => {
  const input = readInput(inputFilePath);
  let valid = 0;

  for (let i = 0; i < input.length; i++) {
    const {ll, ul, c, pw} = input[i];
    const count = pw.split('').filter(s => s === c).length;
    if (count >= ll && count <= ul) {
      valid = valid + 1;
    }
  }
  return valid;
};

const part2 = inputFilePath => {
  const input = readInput(inputFilePath);
  let valid = 0;

  for (let i = 0; i < input.length; i++) {
    const {ll, ul, c, pw} = input[i];
    const count =
      (ll >= 1 && ll <= pw.length && pw[ll - 1] === c ? 1 : 0) +
      (ul >= 1 && ul <= pw.length && pw[ul - 1] === c ? 1 : 0);
    if (count === 1) {
      valid = valid + 1;
    }
  }
  return valid;
};

module.exports = {
  part1,
  part2,
};
