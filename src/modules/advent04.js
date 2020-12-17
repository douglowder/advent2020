const fs = require('fs');
const {isNumber} = require('util');

function passportFromString(s) {
  const tokens = s.replace(/\n/g, ' ').split(' ');
  const passport = {};
  for (let i = 0; i < tokens.length; i++) {
    const [key, value] = tokens[i].split(':');
    if (key && value) {
      passport[key] = value;
    }
  }
  return passport;
}

function setOfValidStringValues(ll, ul) {
  const values = new Set();
  for (let i = ll; i <= ul; i++) {
    values.add('' + i);
  }
  return values;
}

const values1920To2002 = setOfValidStringValues(1920, 2002);
const values2010To2020 = setOfValidStringValues(2010, 2020);
const values2020To2030 = setOfValidStringValues(2020, 2030);
const values150To193 = setOfValidStringValues(150, 193);
const values59To76 = setOfValidStringValues(59, 76);
const valuesForEyeColor = new Set([
  'amb',
  'blu',
  'brn',
  'gry',
  'grn',
  'hzl',
  'oth',
]);
const regexForHairColor = /#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]/;
const regexForPid = /[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/;

function exactMatchForRegex(s, r) {
  if (!s) {
    return false;
  }
  const match = s.match(r);
  return match && match.length === 1 && match[0] === s;
}

function passportIsValid1(p) {
  return (p.byr && p.iyr && p.eyr && p.hgt && p.hcl && p.ecl && p.pid) || false;
}

function passportIsValid2(p) {
  const result =
    values1920To2002.has(p.byr) &&
    values2010To2020.has(p.iyr) &&
    values2020To2030.has(p.eyr) &&
    p.hgt &&
    ((p.hgt.endsWith('cm') && values150To193.has(p.hgt.substring(0, 3))) ||
      (p.hgt.endsWith('in') && values59To76.has(p.hgt.substring(0, 2)))) &&
    exactMatchForRegex(p.hcl, regexForHairColor) &&
    valuesForEyeColor.has(p.ecl) &&
    exactMatchForRegex(p.pid, regexForPid);
  return result;
}

const readInput = inputFilePath =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .trim()
    .split('\n\n')
    .map(s => passportFromString(s));

function numberOfValidPassports(validityTest, input) {
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    if (validityTest(input[i])) {
      count = count + 1;
    }
  }
  return count;
}

const part1 = inputFilePath => {
  const input = readInput(inputFilePath);
  return numberOfValidPassports(passportIsValid1, input);
};

const part2 = inputFilePath => {
  const input = readInput(inputFilePath);
  return numberOfValidPassports(passportIsValid2, input);
};

module.exports = {
  part1,
  part2,
};
