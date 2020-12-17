const fs = require('fs');

const readInput = (inputFilePath) =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .trim()
    .split('\n')
    .map((n) => parseInt(n));

const constructGraph = (input) => {
  input.sort((a, b) => (a < b ? -1 : 1));
  const graph = new Map();
  graph.set(0, []);
  let i = 0;
  while (input[i] <= 3) {
    graph.get(0).push(input[i]);
    i = i + 1;
  }
  for (let i = 0; i < input.length - 1; i++) {
    graph.set(input[i], []);
    let j = i + 1;
    while (
      input[j] >= input[i] + 1 &&
      input[j] <= input[i] + 3 &&
      j < input.length
    ) {
      graph.get(input[i]).push(input[j]);
      j = j + 1;
    }
  }
  graph.set(input[input.length - 1], [input[input.length - 1] + 3]);
  return graph;
};

const part1 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  const graph = constructGraph(input);
  let ones = 1;
  let threes = 1;
  for (let i = 0; i < input.length - 1; i++) {
    const diff = input[i + 1] - input[i];
    if (diff === 1) {
      ones = ones + 1;
    }
    if (diff === 3) {
      threes = threes + 1;
    }
  }
  return ones * threes;
};

const part2 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  const graph = constructGraph(input);
  const pathCountForNode = new Map();
  pathCountForNode.set(input[input.length - 1], 1);
  for (let i = input.length - 2; i >= 0; i--) {
    const nodes = graph.get(input[i]);
    let count = 0;
    for (let j = 0; j < nodes.length; j++) {
      count = count + pathCountForNode.get(nodes[j]);
    }
    pathCountForNode.set(input[i], count);
  }
  const nodes = graph.get(0);
  let totalPathCount = 0;
  for (let k = 0; k < nodes.length; k++) {
    totalPathCount = totalPathCount + pathCountForNode.get(nodes[k]);
  }
  return totalPathCount;
};

module.exports = {
  part1,
  part2,
};
