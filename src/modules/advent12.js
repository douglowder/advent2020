/*
--- Day 12: Rain Risk ---

Your ferry made decent progress toward the island, but the storm came in faster
than anyone expected. The ferry needs to take evasive actions!

Unfortunately, the ship's navigation computer seems to be malfunctioning;
rather than giving a route directly to safety, it produced extremely circuitous
instructions. When the captain uses the PA system to ask if anyone can help,
you quickly volunteer.

The navigation instructions (your puzzle input) consists of a sequence of
single-character actions paired with integer input values. After staring at
them for a few minutes, you work out what they probably mean:

Action N means to move north by the given value.
Action S means to move south by the given value.
Action E means to move east by the given value.
Action W means to move west by the given value.
Action L means to turn left the given number of degrees.
Action R means to turn right the given number of degrees.
Action F means to move forward by the given value in the direction the ship is currently facing.

The ship starts by facing east. Only the L and R actions change the direction
the ship is facing. (That is, if the ship is facing east and the next
instruction is N10, the ship would move north 10 units, but would still move
east if the following action were F.)

For example:

F10
N3
F7
R90
F11

These instructions would be handled as follows:

F10 would move the ship 10 units east (because the ship starts by facing east) to east 10, north 0.
N3 would move the ship 3 units north to east 10, north 3.
F7 would move the ship another 7 units east (because the ship is still facing east) to east 17, north 3.
R90 would cause the ship to turn right by 90 degrees and face south; it remains at east 17, north 3.
F11 would move the ship 11 units south to east 17, south 8.

At the end of these instructions, the ship's Manhattan distance (sum of the
absolute values of its east/west position and its north/south position) from
its starting position is 17 + 8 = 25.

Figure out where the navigation instructions lead. What is the Manhattan
distance between that location and the ship's starting position?

Your puzzle answer was 441.

The first half of this puzzle is complete! It provides one gold star: *

--- Part Two ---

Before you can give the destination to the captain, you realize that the actual
action meanings were printed on the back of the instructions the whole time.

Almost all of the actions indicate how to move a waypoint which is relative to
the ship's position:

Action N means to move the waypoint north by the given value.
Action S means to move the waypoint south by the given value.
Action E means to move the waypoint east by the given value.
Action W means to move the waypoint west by the given value.
Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
Action F means to move forward to the waypoint a number of times equal to the given value.

The waypoint starts 10 units east and 1 unit north relative to the ship. The
waypoint is relative to the ship; that is, if the ship moves, the waypoint
moves with it.

For example, using the same instructions as above:

F10 moves the ship to the waypoint 10 times (a total of 100 units east and 10
units north), leaving the ship at east 100, north 10. The waypoint stays 10
units east and 1 unit north of the ship.

N3 moves the waypoint 3 units north to 10 units east and 4 units north of the
ship. The ship remains at east 100, north 10.

F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28
units north), leaving the ship at east 170, north 38. The waypoint stays 10
units east and 4 units north of the ship.

R90 rotates the waypoint around the ship clockwise 90 degrees, moving it to 4
units east and 10 units south of the ship. The ship remains at east 170, north
38.

F11 moves the ship to the waypoint 11 times (a total of 44 units east and 110
units south), leaving the ship at east 214, south 72. The waypoint stays 4
units east and 10 units south of the ship.

After these operations, the ship's Manhattan distance from its starting
position is 214 + 72 = 286.

Figure out where the navigation instructions actually lead. What is the
Manhattan distance between that location and the ship's starting position?

 */
const fs = require('fs');

const readInput = (inputFilePath) =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .split('\n')
    .map((s) => {
      return {
        action: s.substring(0, 1),
        count: parseInt(s.substring(1)),
      };
    });

const directions = new Map([
  ['N', {x: 0, y: 1}],
  ['S', {x: 0, y: -1}],
  ['E', {x: 1, y: 0}],
  ['W', {x: -1, y: 0}],
]);

const leftTurn = new Map([
  ['N', 'W'],
  ['W', 'S'],
  ['S', 'E'],
  ['E', 'N'],
]);

const rightTurn = new Map([
  ['N', 'E'],
  ['E', 'S'],
  ['S', 'W'],
  ['W', 'N'],
]);

const leftTurnTransform = (v) => {
  return {
    x: -v.y,
    y: v.x,
  };
};

const rightTurnTransform = (v) => {
  return {
    x: v.y,
    y: -v.x,
  };
};

const part1 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  let x = 0;
  let y = 0;
  let dir = 'E';
  for (let round of input) {
    let n = round.count;
    switch (round.action) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
      case 'F':
        let thisRoundDirection = round.action;
        if (thisRoundDirection === 'F') {
          thisRoundDirection = dir;
        }
        x = x + n * directions.get(thisRoundDirection).x;
        y = y + n * directions.get(thisRoundDirection).y;
        break;
      case 'L':
        while (n > 0) {
          dir = leftTurn.get(dir);
          n = n - 90;
        }
        break;
      case 'R':
        while (n > 0) {
          dir = rightTurn.get(dir);
          n = n - 90;
        }
        break;
      default:
    }
  }
  return Math.abs(x) + Math.abs(y);
};

const part2 = (inputFilePath) => {
  const input = readInput(inputFilePath);
  let x = 0;
  let y = 0;
  let wpx = 10;
  let wpy = 1;

  for (let round of input) {
    let n = round.count;
    switch (round.action) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        let thisRoundDirection = round.action;
        wpx = wpx + n * directions.get(thisRoundDirection).x;
        wpy = wpy + n * directions.get(thisRoundDirection).y;
        break;
      case 'L':
        while (n > 0) {
          const vt = leftTurnTransform({x: wpx, y: wpy});
          wpx = vt.x;
          wpy = vt.y;
          n = n - 90;
        }
        break;
      case 'R':
        while (n > 0) {
          const vt = rightTurnTransform({x: wpx, y: wpy});
          wpx = vt.x;
          wpy = vt.y;
          n = n - 90;
        }
        break;
      case 'F':
        x = x + n * wpx;
        y = y + n * wpy;
        break;
      default:
    }
  }
  return Math.abs(x) + Math.abs(y);
};

module.exports = {
  part1,
  part2,
};
