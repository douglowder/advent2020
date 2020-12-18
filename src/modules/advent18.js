// Template for a new Advent module

const fs = require('fs');

const readInput = (inputFilePath) =>
  fs.readFileSync(inputFilePath, 'utf-8').split('\n');

const computeNodeFlat = (node) => {
  let expression = node.replace(/\(/g, '').replace(/\)/g, '');
  let op = null;
  return expression.split(' ').reduce((accumulator, token) => {
    switch (token) {
      case '*':
      case '+':
        op = token;
        break;
      default:
        let n = parseInt(token);
        switch (op) {
          case '*':
            accumulator = accumulator * n;
            break;
          case '+':
            accumulator = accumulator + n;
            break;
          default:
            accumulator = n;
        }
    }
    return accumulator;
  }, 0);
};

const computeNodeAddBeforeMultiply = (node) => {
  let expression = node.replace(/\(/g, '').replace(/\)/g, '');
  let op = null;
  let stack = [];
  expression
    .split(' ')
    .map((token) => {
      switch (token) {
        case '*':
        case '+':
          op = token;
          break;
        default:
          let n = parseInt(token);
          switch (op) {
            case '+':
              stack[stack.length - 1] = stack[stack.length - 1] + n;
              break;
            case '*':
            default:
              stack.push(n);
          }
      }
    });
    return stack.reduce((a, b) => a * b, 1);
};

const compute = (s, computeNodeFunction) => {
  let expression = s;
  while (expression.indexOf('(') !== -1 && expression.indexOf(')') !== -1) {
    const matches = expression.match(/(\([^\(\)]*\))/g);
    if (matches && matches.length > 0) {
      matches.map((s) => {
        expression = expression.replace(s, `${computeNodeFunction(s)}`);
      });
    }
  }
  return computeNodeFunction(expression);
};

const part1 = (inputFilePath) => {
  return readInput(inputFilePath)
    .map((s) => compute(s, computeNodeFlat))
    .reduce((a, b) => a + b, 0);
};

const part2 = (inputFilePath) => {
  return readInput(inputFilePath)
    .map((s) => compute(s, computeNodeAddBeforeMultiply))
    .reduce((a, b) => a + b, 0);
};

module.exports = {
  part1,
  part2,
};
