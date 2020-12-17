const fs = require('fs');

const seatID = s => {
  const rowString = s
    .substring(0, 7)
    .replace(/B/g, '1')
    .replace(/F/g, '0');
  const colString = s
    .substring(7)
    .replace(/R/g, '1')
    .replace(/L/g, '0');
  const row = parseInt(rowString, 2);
  const col = parseInt(colString, 2);
  return row * 8 + col;
};

const readInput = inputFilePath => {
  const seatIDs = fs
    .readFileSync(inputFilePath, 'utf-8')
    .trim()
    .split('\n')
    .map(s => seatID(s));
  seatIDs.sort((a, b) => (a < b ? -1 : 1));
  return seatIDs;
};

const part1 = inputFilePath => {
  const seatIDs = readInput(inputFilePath);
  return seatIDs[seatIDs.length - 1];
};

const part2 = inputFilePath => {
  const seatIDs = readInput(inputFilePath);
  const seatIDSet = new Set(seatIDs);
  for (let i = seatIDs[0]; i <= part1(); i++) {
    if (!seatIDSet.has(i)) {
      return i;
    }
  }
};

const part2Alternate = inputFilePath => {
  const seatIDs = readInput(inputFilePath);
  const sumOfSeatIDs = seatIDs.reduce((a, b) => a + b, 0);
  const expectedSum =
    (seatIDs[seatIDs.length - 1] - seatIDs[0] + 1) *
    (seatIDs[0] + seatIDs[seatIDs.length - 1]) /
    2;
  return expectedSum - sumOfSeatIDs;
};

module.exports = {
  part1,
  part2: part2Alternate,
};
