# advent2020

My hacky solutions for [Advent Of Code 2020](https://adventofcode.com), with a CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

_SPOILER ALERT_: If you are looking at this before December 25, 2020, and are trying to solve the code puzzles yourself, don't open any source file until you've solved the puzzle for that day!!!!

### Notes

- Code is all my own, feel free to give me savage code reviews in the comments :)
- Comments at the beginning of each source file are copyright [Eric Wastl](http://was.tl/), the creator of Advent Of Code, and are reproduced here just for convenience
- The `main` branch has no solution source files.  To see those, look at the branch named `dayxx`, where `xx` is a number between 1 and 25.  Each branch will show the solutions for that day and all previous solutions.

<!-- toc -->
* [advent2020](#advent2020)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g advent2020
$ advent2020 COMMAND
running command...
$ advent2020 (-v|--version|version)
advent2020/0.0.0 darwin-x64 node-v12.16.3
$ advent2020 --help [COMMAND]
USAGE
  $ advent2020 COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`advent2020 advent`](#advent2020-advent)
* [`advent2020 help [COMMAND]`](#advent2020-help-command)

## `advent2020 advent`

Runs AdventOfCode solutions.

```
USAGE
  $ advent2020 advent

OPTIONS
  -d, --day=day  [default: latest] Which day to run solutions for, or "all" to run all days, or "latest" to run the most
                 recent day

  -t, --test     If true, use the test input instead of the real input

DESCRIPTION
  ...
  Each solution is a module in `src/modules`, and exports two methods, `part1(inputFilePath)` and 
  `part2(inputFilePath)`.  The CLI looks for these and runs them with either the real input, or the test input (taken 
  from the Advent of Code problem descriptions).
```

_See code: [src/commands/advent.js](https://github.com/dlowder-salesforce/advent2020/blob/v0.0.0/src/commands/advent.js)_

## `advent2020 help [COMMAND]`

display help for advent2020

```
USAGE
  $ advent2020 help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_
<!-- commandsstop -->
