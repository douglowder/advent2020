const fs = require('fs');

const readInput = (inputFilePath) => {
  const input = fs.readFileSync(inputFilePath, 'utf-8');
  const lines = input.split('\n');
  const earliestTime = parseInt(lines[0]);
  const buses = lines[1]
    .split(',')
    .map((n, i) => {
      return {
        id: n === 'x' ? 'x' : parseInt(n),
        offset: i,
      };
    })
    .filter((b) => b.id !== 'x');
  return {
    earliestTime,
    buses,
  };
};

const part1 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  const busArrivalTimes = input.buses
    .map((b) => {
      const n = b.id;
      let time = Math.floor(input.earliestTime / n) * n;
      if (time < input.earliestTime) {
        time = time + n;
      }
      return {
        busID: n,
        delay: time - input.earliestTime,
      };
    })
    .sort((a, b) => (a.delay < b.delay ? -1 : 1));

  return busArrivalTimes[0].busID * busArrivalTimes[0].delay;
};

const busMatchTime = (bus1, bus2) => {
  let n = bus1.id + bus1.offset;
  while ((n + bus2.offset) % bus2.id !== 0) {
    n = n + bus1.id;
  }
  return n;
};

const combinedBus = (bus1, bus2) => {
  let matchTime = busMatchTime(bus1, bus2);
  return {
    id: bus1.id * bus2.id,
    offset: matchTime,
  };
};

const part2 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  let thisBus = input.buses[0];
  for (let i = 1; i < input.buses.length; i++) {
    thisBus = combinedBus(thisBus, input.buses[i]);
  }
  return thisBus.offset;
};

module.exports = {
  part1,
  part2,
};
