const fs = require('fs');

const readInput = inputFilePath => fs.readFileSync(inputFilePath, 'utf-8');

function generateProgram(input) {
  const program = [];
  const lines = input.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const tokens = lines[i].split(' ');
    const instr = tokens[0];
    const arg = parseInt(tokens[1]);
    program.push({
      instr,
      arg,
    });
  }
  return program;
}

function runProgram(program) {
  let acc = 0;
  let pc = 0;
  let pcsRun = new Set();
  while (!pcsRun.has(pc) && pc < program.length) {
    pcsRun.add(pc);
    const {instr, arg} = program[pc];
    switch (instr) {
      case 'acc':
        acc = acc + arg;
        pc = pc + 1;
        break;
      case 'jmp':
        pc = pc + arg;
        break;
      case 'nop':
      default:
        pc = pc + 1;
        break;
    }
  }
  return {
    acc,
    pc,
  };
}

const part1 = inputFilePath => {
  const input = readInput(inputFilePath);
  const program = generateProgram(input);
  return runProgram(program).acc;
};

const part2 = inputFilePath => {
  const input = readInput(inputFilePath);
  const program = generateProgram(input);
  for (let i = 0; i < program.length; i++) {
    if (program[i].instr === 'jmp') {
      program[i].instr = 'nop';
      const {acc, pc} = runProgram(program);
      if (pc >= program.length) {
        return acc;
      }
      program[i].instr = 'jmp';
    } else if (program[i].instr === 'nop') {
      program[i].instr = 'jmp';
      const {acc, pc} = runProgram(program);
      if (pc >= program.length) {
        return acc;
      }
      program[i].instr = 'nop';
    }
  }
};

module.exports = {
  part1,
  part2,
};
