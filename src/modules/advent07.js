const fs = require('fs');

const readInput = inputFilePath => fs.readFileSync(inputFilePath, 'utf-8');

function parentAndChildren(s) {
  const [parentString, childrenString] = s.split(' contain ');
  const parent = parentString.replace(' bags', '');
  const children = [];
  if (childrenString.indexOf('no other') === -1) {
    const childTokens = childrenString.split(', ');
    for (let j = 0; j < childTokens.length; j++) {
      const match = childTokens[j].match(/([0-9]*) ([^ ]*) ([^ ]*) bag*/);
      const childCount = parseInt(match[1]);
      const child = match[2] + ' ' + match[3];
      for (let k = 0; k < childCount; k++) {
        children.push(child);
      }
    }
  }
  return {
    parent,
    children,
  };
}

function addKeyToParentMapIfNeeded(map, key) {
  if (!map.has(key)) {
    map.set(key, new Set());
  }
}

function constructMaps(input) {
  const ruleStrings = input.split('\n');
  const parentMap = new Map();
  const childMap = new Map();
  for (let i = 0; i < ruleStrings.length; i++) {
    const {parent, children} = parentAndChildren(ruleStrings[i]);
    childMap.set(parent, children);
    addKeyToParentMapIfNeeded(parentMap, parent);
    for (let j = 0; j < children.length; j++) {
      addKeyToParentMapIfNeeded(parentMap, children[j]);
      parentMap.get(children[j]).add(parent);
    }
  }
  return {
    parentMap,
    childMap,
  };
}

const part1 = inputFilePath => {
  const input = readInput(inputFilePath);
  const rules = constructMaps(input);
  const possibleParents = new Set();

  function traverseParents(child) {
    possibleParents.add(child);
    const parents = rules.parentMap.get(child);
    for (let parent of parents.values()) {
      traverseParents(parent);
    }
  }

  traverseParents('shiny gold');
  possibleParents.delete('shiny gold');
  return possibleParents.size;
};

const part2 = inputFilePath => {
  const input = readInput(inputFilePath);
  const rules = constructMaps(input);

  function childCount(child) {
    let count = 1;
    const children = rules.childMap.get(child) || [];
    for (let i = 0; i < children.length; i++) {
      count = count + childCount(children[i]);
    }
    return count;
  }
  return childCount('shiny gold') - 1;
};

module.exports = {
  part1,
  part2,
};
