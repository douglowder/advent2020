const fs = require('fs');

const readInput = (inputFilePath) =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .split('\n')
    .map((n) => BigInt(n));

const seven = BigInt(7);
const twentyTwenty1227 = BigInt(20201227);

const part1 = (inputFilePath) => {
  const [cardPublicKey, doorPublicKey] = readInput(inputFilePath);

  let value = BigInt(1);
  let loopSize = 0;

  while (value !== doorPublicKey) {
    value = (value * seven) % twentyTwenty1227;
    loopSize++;
  }

  let encryptionKey = BigInt(1);
  for (let i = 0; i < loopSize; i++) {
    encryptionKey = (encryptionKey * cardPublicKey) % twentyTwenty1227;
  }

  return encryptionKey;
};

const part2 = (inputFilePath) => {
  return 'You are a winner!';
};

module.exports = {
  part1,
  part2,
};
