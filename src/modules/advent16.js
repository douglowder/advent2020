const fs = require('fs');

const readInput = (inputFilePath) => {
  const lines = fs.readFileSync(inputFilePath, 'utf-8').split('\n');
  const fields = new Map();
  const allValidValues = new Set();
  let reachedYourTicket = false;
  let reachedNearbyTickets = false;
  let yourTicket = null;
  const nearbyTickets = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(
      /([^:]*): ([0-9]*)-([0-9]*) or ([0-9]*)-([0-9]*)/,
    );
    if (match && match.length === 6) {
      const key = match[1];
      const range1 = [parseInt(match[2]), parseInt(match[3])];
      const range2 = [parseInt(match[4]), parseInt(match[5])];
      const validValues = new Set();
      for (let r1 = range1[0]; r1 <= range1[1]; r1++) {
        validValues.add(r1);
        allValidValues.add(r1);
      }
      for (let r2 = range2[0]; r2 <= range2[1]; r2++) {
        validValues.add(r2);
        allValidValues.add(r2);
      }
      fields.set(key, validValues);
    }
  }
  for (let j = 0; j < lines.length; j++) {
    if (lines[j].startsWith('your ticket')) {
      reachedYourTicket = true;
    } else if (reachedYourTicket) {
      yourTicket = lines[j].split(',');
      reachedYourTicket = false;
    }
  }
  for (let k = 0; k < lines.length; k++) {
    if (lines[k].indexOf('nearby tickets') !== -1) {
      reachedNearbyTickets = true;
    } else if (reachedNearbyTickets && lines[k].match(/[0-9,]/)) {
      nearbyTickets.push(lines[k].split(',').map((n) => parseInt(n)));
    }
  }
  return {
    yourTicket,
    nearbyTickets,
    fields,
    allValidValues,
  };
};

const part1 = (inputFilePath) => {
  const {yourTicket, nearbyTickets, fields, allValidValues} = readInput(
    inputFilePath,
  );
  let sum = 0;
  for (let t of nearbyTickets) {
    for (let n of t) {
      if (!allValidValues.has(n)) {
        sum = sum + n;
      }
    }
  }
  return sum;
};

const part2 = (inputFilePath) => {
  const {yourTicket, nearbyTickets, fields, allValidValues} = readInput(
    inputFilePath,
  );
  const validNearbyTickets = [];
  for (let t of nearbyTickets) {
    let ticketIsValid = true;
    for (let n of t) {
      if (!allValidValues.has(n)) {
        ticketIsValid = false;
        break;
      }
    }
    if (ticketIsValid) {
      validNearbyTickets.push(t);
    }
  }
  const possibleFieldArray = [];
  for (let i = 0; i < yourTicket.length; i++) {
    const possibleFields = new Set();
    for (let name of fields.keys()) {
      let possible = true;
      for (let j = 0; j < validNearbyTickets.length; j++) {
        if (!fields.get(name).has(validNearbyTickets[j][i])) {
          possible = false;
          break;
        }
      }
      if (possible) {
        possibleFields.add(name);
      }
    }
    possibleFieldArray.push(possibleFields);
  }
  while (
    possibleFieldArray.map((s) => s.size).reduce((a, b) => a + b, 0) >
    possibleFieldArray.length
  ) {
    const definites = possibleFieldArray
      .filter((s) => s.size === 1)
      .map((s) => Array.from(s)[0]);
    for (let key of definites) {
      for (let p of possibleFieldArray) {
        if (p.size > 1) {
          p.delete(key);
        }
      }
    }
  }
  const fieldNames = possibleFieldArray.map((p) => Array.from(p)[0]);
  return yourTicket
    .filter((v, i) => fieldNames[i].startsWith('departure'))
    .reduce((a, b) => a * b, 1);
};

module.exports = {
  part1,
  part2,
};
