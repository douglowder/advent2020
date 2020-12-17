const fs = require('fs');

const readInput = inputFilePath => fs.readFileSync(inputFilePath, 'utf-8');

function numQuestionsWithAnyYesAnswers(group) {
  const forms = group.split('\n');
  const questionSet = new Set();
  for (let i = 0; i < forms.length; i++) {
    forms[i].split('').map(c => questionSet.add(c));
  }
  return questionSet.size;
}

function setWithAllLetters() {
  return new Set([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]);
}

function numQuestionsWithAllYesAnswers(group) {
  const forms = group.split('\n');
  const questionSet = setWithAllLetters();
  for (let i = 0; i < forms.length; i++) {
    const missingLetters = setWithAllLetters();
    forms[i].split('').map(c => missingLetters.delete(c));
    for (let c of missingLetters) {
      questionSet.delete(c);
    }
  }
  return questionSet.size;
}

const part1 = inputFilePath => {
  const input = readInput(inputFilePath);
  return input
    .split('\n\n')
    .map(s => numQuestionsWithAnyYesAnswers(s))
    .reduce((a, b) => a + b, 0);
};

const part2 = inputFilePath => {
  const input = readInput(inputFilePath);
  return input
    .split('\n\n')
    .map(s => numQuestionsWithAllYesAnswers(s))
    .reduce((a, b) => a + b, 0);
};

module.exports = {
  part1,
  part2,
};
