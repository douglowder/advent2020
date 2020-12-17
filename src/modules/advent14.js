const fs = require('fs');

const readInput = (inputFilePath, index) => {
  // This problem had different test inputs for part1 and part2,
  // hence this hack to split the test input file
  const text = fs.readFileSync(inputFilePath, 'utf-8');
  if (text.indexOf('\n----------\n') !== -1) {
    return text.split('\n----------\n')[index].split('\n');
  } else {
    return text.split('\n');
  }
};

const updateMask = (maskInstruction) => {
  const maskString = maskInstruction.split(' = ')[1];
  const mask = new Map();
  maskString.split('').map((s, i) => {
    if (s === '1' || s === '0') {
      mask.set(maskString.length - i - 1, s);
    }
  });
  return mask;
};

const integerStringToBitArray = (s) => {
  const bigint = BigInt(s);
  const two = BigInt(2);
  const one = BigInt(1);
  const result = [];
  for (let i = 0; i < 36; i++) {
    const bit = (bigint / two ** BigInt(i)) % two;
    result.push(bit === one ? '1' : '0');
  }
  return result;
};

const bitArrayToBigInt = (a) => {
  const valueString = '0b' + a.map((d, i, a) => a[a.length - i - 1]).join('');
  return BigInt(valueString);
};

const writeToMemory1 = (memory, mask, writeInstruction) => {
  const match = writeInstruction.match(/mem\[([0-9]*)\] = ([0-9]*)/);
  if (match && match.length === 3) {
    const address = BigInt(match[1]);
    const valueBitArray = integerStringToBitArray(match[2]);
    for (let i = 0; i < 36; i++) {
      if (mask.has(i)) {
        bit = mask.get(i) === '1';
        if (bit) {
          valueBitArray[i] = '1';
        } else {
          valueBitArray[i] = '0';
        }
      }
    }
    const value = bitArrayToBigInt(valueBitArray);
    memory.set(address, value);
  }
};

const permuteMemoryAddressWithMask = (
  memory,
  addressArray,
  mask,
  index,
  callback,
) => {
  if (index === 36) {
    callback();
    return;
  }
  const existingBit = addressArray[index];
  if (mask.has(index)) {
    addressArray[index] = mask.get(index) === '1' ? '1' : existingBit;
    permuteMemoryAddressWithMask(
      memory,
      addressArray,
      mask,
      index + 1,
      callback,
    );
  } else {
    addressArray[index] = '1';
    permuteMemoryAddressWithMask(
      memory,
      addressArray,
      mask,
      index + 1,
      callback,
    );
    addressArray[index] = '0';
    permuteMemoryAddressWithMask(
      memory,
      addressArray,
      mask,
      index + 1,
      callback,
    );
  }
  addressArray[index] = existingBit;
};

const writeToMemory2 = (memory, mask, writeInstruction) => {
  const match = writeInstruction.match(/mem\[([0-9]*)\] = ([0-9]*)/);
  if (match && match.length === 3) {
    const addressArray = integerStringToBitArray(match[1]);
    const value = BigInt(match[2]);
    permuteMemoryAddressWithMask(memory, addressArray, mask, 0, () => {
      const address = bitArrayToBigInt(addressArray);
      memory.set(address, value);
    });
  }
};

const writeToMemory = [writeToMemory1, writeToMemory2];

const executeInstructions = (inputFilePath, partIndex) => {
  const input = readInput(inputFilePath, partIndex);

  const memory = new Map();
  let mask = new Map();
  for (let line of input) {
    if (line.startsWith('mask')) {
      mask = updateMask(line);
    } else if (line.startsWith('mem')) {
      writeToMemory[partIndex](memory, mask, line);
    }
  }
  let sum = 0n;
  for (let key of memory.keys()) {
    sum = sum + memory.get(key);
  }
  return sum;
};

const part1 = (inputFilePath) => {
  return executeInstructions(inputFilePath, 0);
};

const part2 = (inputFilePath) => {
  return executeInstructions(inputFilePath, 1);
};

module.exports = {
  part1,
  part2,
};
