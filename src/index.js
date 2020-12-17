const {Command, flags} = require('@oclif/command');

const fs = require('fs');

const moduleDir = `${__dirname}/modules`;
const inputDir = `${__dirname}/input`;
const testInputDir = `${__dirname}/testInput`;

const moduleMap = new Map();
try {
  fs.readdirSync(moduleDir).forEach((file) => {
    const match = file.match(/(advent)([0-9][0-9]).js/);
    if (match && match.length === 3) {
      const module = require('./modules/' + match[1] + match[2]);
      moduleMap.set(match[2], module);
    }
  });
} catch (e) {} // directory does not exist

const inputMap = new Map();
try {
  fs.readdirSync(inputDir).forEach((file) => {
    const match = file.match(/(input)([0-9][0-9]).txt/);
    if (match && match.length === 3) {
      inputMap.set(match[2], `${inputDir}/input${match[2]}.txt`);
    }
  });
} catch (e) {} // directory does not exist

const testInputMap = new Map();
try {
  fs.readdirSync(testInputDir).forEach((file) => {
    const match = file.match(/(input)([0-9][0-9]).txt/);
    if (match && match.length === 3) {
      testInputMap.set(match[2], `${testInputDir}/input${match[2]}.txt`);
    }
  });
} catch (e) {} // directory does not exist

const validDays = Array.from(moduleMap.keys())
  .map((n) => parseInt(n))
  .sort((a, b) => (a < b ? -1 : 1));

const runSolutionForDay = (dayString, isTest, cmd) => {
  if (moduleMap.size === 0) {
    cmd.log('  No Advent of Code solutions have been implemented');
    return;
  }
  if (!moduleMap.has(dayString)) {
    cmd.log(`Day must be either "all", "latest", or one of ${validDays}`);
    return;
  }
  if (isTest && !testInputMap.has(dayString)) {
    cmd.log('  Source module exists, but no test input file is provided');
    return;
  }
  if (!isTest && !inputMap.has(dayString)) {
    cmd.log('  Source module exists, but no input file is provided');
    return;
  }
  const inputPath = isTest
    ? testInputMap.get(dayString)
    : inputMap.get(dayString);
  const moduleForDay = moduleMap.get(dayString);
  cmd.log(
    isTest ? `Day ${dayString} test solutions:` : `Day ${dayString} solutions:`,
  );
  cmd.log('   ' + moduleForDay.part1(inputPath));
  cmd.log('   ' + moduleForDay.part2(inputPath));
};

const runSolutionForAllDays = (isTest, cmd) => {
  if (moduleMap.size === 0) {
    cmd.log('  No Advent of Code solutions have been implemented');
    return;
  }
  for (let day of validDays) {
    const dayString = day < 10 ? `0${day}` : `${day}`;
    runSolutionForDay(dayString, isTest, cmd);
  }
};

const runSolutionForLatestDay = (isTest, cmd) => {
  if (moduleMap.size === 0) {
    cmd.log('  No Advent of Code solutions have been implemented');
    return;
  }
  const day = validDays[validDays.length - 1];
  const dayString = day < 10 ? `0${day}` : `${day}`;
  runSolutionForDay(dayString, isTest, cmd);
};

class AdventCommand extends Command {
  async run() {
    try {
      const {flags} = this.parse(AdventCommand);
      let day = flags.day;
      if (!day) {
        this._help();
        return;
      }
      if (day.length === 1) {
        day = `0${day}`;
      }
      const isTest = flags.test || false;
      switch (day) {
        case 'all':
          this.log('Running solutions for all AoC days');
          runSolutionForAllDays(isTest, this);
          break;
        case 'latest':
          this.log('Running solution for latest AoC day');
          runSolutionForLatestDay(isTest, this);
          break;
        default:
          this.log(`Running AoC solution for day ${day}`);
          runSolutionForDay(day, isTest, this);
      }
    } catch (e) {
      if (e.code !== 'EEXIT') {
        console.error('  Stack: ' + e.stack);
      }
      const oclifHandler = require('@oclif/errors/handle');
      // do any extra work with error
      return oclifHandler(e);
    }
    return 0;
  }
}

AdventCommand.description = `Runs AdventOfCode solutions.
...
Each solution is a module in \`src/modules\`, and exports two methods, \`part1(inputFilePath)\` and \`part2(inputFilePath)\`.  The CLI looks for these and runs them with either the real input, or the test input (taken from the Advent of Code problem descriptions).
`;

AdventCommand.flags = {
  help: flags.help({char: 'h', description: 'Show CLI help'}),
  day: flags.string({
    char: 'd',
    description:
      'Which day to run solutions for, or "all" to run all days, or "latest" to run the most recent day',
  }),
  test: flags.boolean({
    char: 't',
    description: 'If true, use the test input instead of the real input',
  }),
};

AdventCommand.usage = '--day <all|latest|1|2|3|...|25> <--test>';

module.exports = AdventCommand;
