class CircularBuffer {
  // Implement as a simple array, where array position is the value (- 1), and
  // array contents points to the next value in the buffer
  constructor(a) {
    this.size = a.length;
    this.array = new Array(a.length).fill(-1);
    let c = a.shift();
    this.current = c;
    for (let n of a) {
      this.array[c - 1] = n;
      c = n;
    }
    this.array[c - 1] = this.current;
  }
  insert(m, a) {
    // Place elements of array a after element m
    const next = this.array[m - 1];
    let c = m;
    for (let n of a) {
      this.array[c - 1] = n;
      c = n;
    }
    this.array[c - 1] = next;
  }
  delete(m, count) {
    // Remove count elements after m and return them
    const removedElements = [];
    for (let i = 0; i < count; i++) {
      let toBeRemoved = this.array[m - 1];
      let next = this.array[toBeRemoved - 1];
      this.array[m - 1] = next;
      removedElements.push(toBeRemoved);
    }
    return removedElements;
  }
  next(n) {
    return this.array[n - 1];
  }
  current() {
    return this.current;
  }
  toArrayAfterOne() {
    const a = [];
    let n = this.next(1);
    while (n !== 1) {
      a.push(n);
      n = this.next(n);
    }
    return a;
  }
  twoNumbersAfterOne() {
    return [this.next(1), this.next(this.next(1))];
  }
}

const fs = require('fs');

const readInput = (inputFilePath) =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .split('')
    .map((n) => parseInt(n));

const iterateCups = (cups) => {
  let c = cups.current;
  const size = cups.size;
  const removed = cups.delete(c, 3);
  const removedSet = new Set(removed);
  let destination = null;
  for (let n = 0; n < size; n++) {
    let k = c - 1 - n;
    if (k < 1) {
      k = k + size;
    }
    if (!removedSet.has(k)) {
      destination = k;
      break;
    }
  }

  cups.insert(destination, removed);
  cups.current = cups.next(cups.current);
};

const part1 = (inputFilePath) => {
  const cups = new CircularBuffer(readInput(inputFilePath));
  for (let i = 0; i < 100; i++) {
    iterateCups(cups);
  }
  return cups.toArrayAfterOne().join('');
};

const part2 = (inputFilePath) => {
  const array = readInput(inputFilePath);
  for (i = 10; i <= 1000000; i++) {
    array.push(i);
  }
  const cups = new CircularBuffer(array);
  for (let i = 0; i < 10000000; i++) {
    iterateCups(cups);
  }
  return cups.twoNumbersAfterOne().reduce((a, b) => a * b, 1);
};

module.exports = {
  part1,
  part2,
};
