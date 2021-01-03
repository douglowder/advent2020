class CircularBuffer {
  constructor(a) {
    this.map = new Map();
    this.current = null;
    if (a && a.length > 0) {
      let c = a.shift();
      this.current = c;
      this.insert(c);
      for (let n of a) {
        this.insert(n, c);
        c = n;
      }
    }
  }
  size() {
    return this.map.size;
  }
  insert(n, m) {
    if (this.map.size === 0) {
      // Insert n and have it point to itself
      this.map.set(n, {
        value: n,
        prev: n,
        next: n,
      });
      return;
    }
    if (m && this.map.has(m)) {
      if (this.map.size === 1) {
        this.map.set(m, {
          value: m,
          next: n,
          prev: n,
        });
        this.map.set(n, {
          value: n,
          next: m,
          prev: m,
        });
      } else {
        // n goes after m
        const before_n = this.map.get(m);
        const after_n = this.map.get(before_n.next);
        this.map.set(n, {
          value: n,
          prev: before_n.value,
          next: after_n.value,
        });
        this.map.set(before_n.value, {
          value: before_n.value,
          prev: before_n.prev,
          next: n,
        });
        this.map.set(after_n.value, {
          value: after_n.value,
          prev: n,
          next: after_n.next,
        });
      }
      return;
    }
  }
  insertArray(a, m) {
    // insert array of values after m
    let c = m;
    for (let n of a) {
      this.insert(n, c);
      c = n;
    }
  }
  delete(n) {
    if (this.map.has(n)) {
      if (this.map.size === 1) {
        this.map.delete(n);
      } else if (this.map.size === 2) {
        const remainingValue = this.map.get(n).next;
        this.map.set(remainingValue, {
          value: remainingValue,
          next: remainingValue,
          prev: remainingValue,
        });
        this.map.delete(n);
      } else {
        const before_n = this.map.get(this.map.get(n).prev);
        const after_n = this.map.get(this.map.get(n).next);
        this.map.set(before_n.value, {
          value: before_n.value,
          prev: before_n.prev,
          next: after_n.value,
        });
        this.map.set(after_n.value, {
          value: after_n.value,
          prev: before_n.value,
          next: after_n.next,
        });
        this.map.delete(n);
      }
    }
  }
  deleteArray(a) {
    for (let n of a) {
      this.delete(n);
    }
  }
  next(n) {
    return this.map.get(n).next;
  }
  prev(n) {
    return this.map.get(n).prev;
  }
  current() {
    return this.current;
  }
  has(n) {
    return this.map.has(n);
  }
  toArray() {
    const a = [this.current];
    let n = this.next(this.current);
    while (n !== this.current) {
      a.push(n);
      n = this.next(n);
    }
    return a;
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
  const size = cups.size();
  let c = cups.current;
  const removed = [];
  for (let i = 0; i < 3; i++) {
    c = cups.next(c);
    removed.push(c);
  }
  removed.map((r) => cups.delete(r));
  for (let i = 0; i < 3; i++) {
    cups.delete(removed[i]);
  }
  c = cups.current;
  let destination = null;
  for (let n = 0; n < size; n++) {
    let k = c - 1 - n;
    if (k < 1) {
      k = k + size;
    }
    if (cups.has(k)) {
      destination = k;
      break;
    }
  }
  cups.insertArray(removed, destination);
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
