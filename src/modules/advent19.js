const {match} = require('assert');
const fs = require('fs');

const readInput = (inputFilePath) => {
  const [ruleStrings, messages] = fs
    .readFileSync(inputFilePath, 'utf-8')
    .split('\n\n')
    .map((t) => t.split('\n'));
  const ruleMap = new Map();
  ruleStrings.map((s) => processRuleString(ruleMap, s));
  return {
    ruleMap,
    messages,
  };
};

const processRuleString = (ruleMap, s) => {
  const [key, valueString] = s.split(': ');
  ruleMap.set(key, []);
  const ruleSets = valueString.split(' | ').map((vs) => {
    ruleMap.get(key).push(vs.replace(/\"/g, '').split(' '));
  });
};

const regexFromRule = (ruleMap, key) => {
  const rules = ruleMap.get(key);
  if (rules[0][0] === 'a') {
    return /a/;
  }
  if (rules[0][0] === 'b') {
    return /b/;
  }
  const regexArray = [];
  for (let rule of rules) {
    regexArray.push(
      rule
        .map((ruleKey) => regexFromRule(ruleMap, ruleKey))
        .reduce(
          (a, re) =>
            a === null
              ? re
              : new RegExp('(' + a.source + ')(' + re.source + ')'),
          null,
        ),
    );
  }
  return regexArray.reduce(
    (a, re) => (a === null ? re : new RegExp(a.source + '|' + re.source)),
    null,
  );
};

const part1 = (inputFilePath) => {
  const {ruleMap, messages} = readInput(inputFilePath);
  const regex = regexFromRule(ruleMap, '0');
  return messages.filter((m) => {
    const matches = m.match(regex);
    return matches && matches.length >= 1 && matches[0] === m;
  }).length;
};

const part2 = (inputFilePath) => {
  const {ruleMap, messages} = readInput(inputFilePath);
  // 8: 42 | 42 8
  //    means match rule 42 any number of times.
  //    (We could probably do this in a regex, but to save time, we do the below
  //     to approximate the true solution)
  processRuleString(
    ruleMap,
    '8: 42 | 42 42 | 42 42 42 | 42 42 42 42 | 42 42 42 42 42 | 42 42 42 42 42 42 | 42 42 42 42 42 42 42',
  );
  // 11: 42 31 | 42 11 31
  //    means match 42 n times followed by matching 31 the same number of times.
  //    (This can't be done in a true regex (maybe with forward references) but
  //     again we approximate this with the expression below)
  processRuleString(
    ruleMap,
    '11: 42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31 | 42 42 42 42 42 31 31 31 31 31 | 42 42 42 42 42 42 31 31 31 31 31 31',
  );
  const regex = regexFromRule(ruleMap, '0');
  return messages.filter((m) => {
    const matches = m.match(regex);
    return matches && matches.length >= 1 && matches[0] === m;
  }).length;
};

module.exports = {
  part1,
  part2,
};
