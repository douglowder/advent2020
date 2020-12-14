/*
--- Day 14: Docking Data ---

As your ferry approaches the sea port, the captain asks for your help again.
The computer system that runs this port isn't compatible with the docking
program on the ferry, so the docking parameters aren't being correctly
initialized in the docking program's memory.

After a brief inspection, you discover that the sea port's computer system uses
a strange bitmask system in its initialization program. Although you don't have
the correct decoder chip handy, you can emulate it in software!

The initialization program (your puzzle input) can either update the bitmask or
write a value to memory. Values and memory addresses are both 36-bit unsigned
integers. For example, ignoring bitmasks for a moment, a line like mem[8] = 11
would write the value 11 to memory address 8.

The bitmask is always given as a string of 36 bits, written with the most
significant bit (representing 2^35) on the left and the least significant bit
(2^0, that is, the 1s bit) on the right. The current bitmask is applied to
values immediately before they are written to memory: a 0 or 1 overwrites the
corresponding bit in the value, while an X leaves the bit in the value
unchanged.

For example, consider the following program:

mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0

This program starts by specifying a bitmask (mask = ....). The mask it
specifies will overwrite two bits in every written value: the 2s bit is
overwritten with 0, and the 64s bit is overwritten with 1.

The program then attempts to write the value 11 to memory address 8. By
expanding everything out to individual bits, the mask is applied as follows:

value:  000000000000000000000000000000001011  (decimal 11)
mask:   XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
result: 000000000000000000000000000001001001  (decimal 73)

So, because of the mask, the value 73 is written to memory address 8 instead.
Then, the program tries to write 101 to address 7:

value:  000000000000000000000000000001100101  (decimal 101)
mask:   XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
result: 000000000000000000000000000001100101  (decimal 101)

This time, the mask has no effect, as the bits it overwrote were already the
values the mask tried to set. Finally, the program tries to write 0 to address
8:

value:  000000000000000000000000000000000000  (decimal 0)
mask:   XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
result: 000000000000000000000000000001000000  (decimal 64)

64 is written to address 8 instead, overwriting the value that was there previously.

To initialize your ferry's docking program, you need the sum of all values left
in memory after the initialization program completes. (The entire 36-bit
address space begins initialized to the value 0 at every address.) In the above
example, only two values in memory are not zero - 101 (at address 7) and 64 (at
address 8) - producing a sum of 165.

Execute the initialization program. What is the sum of all values left in
memory after it completes?

The first half of this puzzle is complete! It provides one gold star: *

--- Part Two ---

For some reason, the sea port's computer system still can't communicate with
your ferry's docking program. It must be using version 2 of the decoder chip!

A version 2 decoder chip doesn't modify the values being written at all.
Instead, it acts as a memory address decoder. Immediately before a value is
written to memory, each bit in the bitmask modifies the corresponding bit of
the destination memory address in the following way:

If the bitmask bit is 0, the corresponding memory address bit is unchanged.
If the bitmask bit is 1, the corresponding memory address bit is overwritten with 1.
If the bitmask bit is X, the corresponding memory address bit is floating.

A floating bit is not connected to anything and instead fluctuates
unpredictably. In practice, this means the floating bits will take on all
possible values, potentially causing many memory addresses to be written all at
once!

For example, consider the following program:

mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1

When this program goes to write to memory address 42, it first applies the bitmask:

address: 000000000000000000000000000000101010  (decimal 42)
mask:    000000000000000000000000000000X1001X
result:  000000000000000000000000000000X1101X

After applying the mask, four bits are overwritten, three of which are
different, and two of which are floating. Floating bits take on every possible
combination of values; with two floating bits, four actual memory addresses are
written:

000000000000000000000000000000011010  (decimal 26)
000000000000000000000000000000011011  (decimal 27)
000000000000000000000000000000111010  (decimal 58)
000000000000000000000000000000111011  (decimal 59)

Next, the program is about to write to memory address 26 with a different bitmask:

address: 000000000000000000000000000000011010  (decimal 26)
mask:    00000000000000000000000000000000X0XX
result:  00000000000000000000000000000001X0XX

This results in an address with three floating bits, causing writes to eight
memory addresses:

000000000000000000000000000000010000  (decimal 16)
000000000000000000000000000000010001  (decimal 17)
000000000000000000000000000000010010  (decimal 18)
000000000000000000000000000000010011  (decimal 19)
000000000000000000000000000000011000  (decimal 24)
000000000000000000000000000000011001  (decimal 25)
000000000000000000000000000000011010  (decimal 26)
000000000000000000000000000000011011  (decimal 27)

The entire 36-bit address space still begins initialized to the value 0 at
every address, and you still need the sum of all values left in memory at the
end of the program. In this example, the sum is 208.

Execute the initialization program using an emulator for a version 2 decoder
chip. What is the sum of all values left in memory after it completes?

 */
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
