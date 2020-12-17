# advent2020

My hacky solutions for [Advent Of Code 2020](https://adventofcode.com), with a CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

_SPOILER ALERT_: If you are looking at this before December 25, 2020, and are trying to solve the code puzzles yourself, don't open any source file until you've solved the puzzle for that day!!!!

### Notes

- Code is all my own, feel free to give me savage code reviews in the comments :)
- Comments at the beginning of each source file are copyright [Eric Wastl](http://was.tl/), the creator of Advent Of Code, and are reproduced here just for convenience
- The `main` branch has no solution source files.  To see those, look at the branch named `dayxx`, where `xx` is a number between 1 and 25.  Each branch will show the solutions for that day and all previous solutions.

### Instructions

```sh-session
$ npm install -g advent2020
$ advent2020
USAGE
  $ advent2020 --day <all|latest|1|2|3|...|25> <--test>

OPTIONS
  -d, --day=day  Which day to run solutions for, or "all" to run all days, or "latest" to run the most recent day
  -h, --help     Show CLI help
  -t, --test     If true, use the test input instead of the real input

DESCRIPTION
  ...
  Each solution is a module in `src/modules`, and exports two methods, `part1(inputFilePath)` and `part2(inputFilePath)`.  The CLI looks for these and runs them 
  with either the real input, or the test input (taken from the Advent of Code problem descriptions).
```
