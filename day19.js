const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let [pointer, instructions] = getInstructions(input);
    let registers = [0,0,0,0,0,0];
    let ip = 0;
    
    while (instructions[ip]){
        let instruction = instructions[ip];
        registers[pointer] = ip;
        evalCode(instruction.code, registers, instruction.instr);
        ip = registers[pointer];
        ip++;
    }
    
    console.log('First Star: ', registers[0]);
};

const second = (input) => {
    let [pointer, instructions] = getInstructions(input);
    let registers = [1,0,0,0,0,0];
    let ip = 0;
    
    //find value to test
    let count = 0;
    let lastValue = 0;
    while (instructions[ip] && count < 25){
        let instruction = instructions[ip];
        registers[pointer] = ip;
        evalCode(instruction.code, registers, instruction.instr);
        ip = registers[pointer];
        ip++;
        count++;
        // console.log(count, registers); //value fixed at 17, but 25 gives a bit more leeway for other inputs in case they're different
    }
    
    let value = registers[4];
    
    //faster version of day19Breakdown.js, made to work with other inputs (in theory)
    //see that file to see how instructions were converted to a function
    let sum = 0;
    let counter = 0;
    while (sum < value) {
        if (value % counter === 0) sum += counter;
        counter++;
    }
    
    console.log('Second Star: ', sum);
};

const evalCode = (code, regs, instr) => {
    switch(code){
        case 'addr': regs[instr[2]] = regs[instr[0]] + regs[instr[1]]; break;
        case 'addi': regs[instr[2]] = regs[instr[0]] + instr[1]; break;
        case 'setr': regs[instr[2]] = regs[instr[0]]; break;
        case 'seti': regs[instr[2]] = instr[0]; break;
        case 'mulr': regs[instr[2]] = regs[instr[0]] * regs[instr[1]]; break;
        case 'muli': regs[instr[2]] = regs[instr[0]] * instr[1]; break;
        case 'banr': regs[instr[2]] = regs[instr[0]] & regs[instr[1]]; break;
        case 'bani': regs[instr[2]] = regs[instr[0]] & instr[1]; break;
        case 'borr': regs[instr[2]] = regs[instr[0]] | regs[instr[1]]; break;
        case 'bori': regs[instr[2]] = regs[instr[0]] | instr[1]; break;
        case 'gtir': regs[instr[2]] = instr[0] > regs[instr[1]] ? 1 : 0; break;
        case 'gtri': regs[instr[2]] = regs[instr[0]] > instr[1] ? 1 : 0; break;
        case 'gtrr': regs[instr[2]] = regs[instr[0]] > regs[instr[1]] ? 1 : 0; break;
        case 'eqir': regs[instr[2]] = instr[0] === regs[instr[1]] ? 1 : 0; break;
        case 'eqri': regs[instr[2]] = regs[instr[0]] === instr[1] ? 1 : 0; break;
        case 'eqrr': regs[instr[2]] = regs[instr[0]] === regs[instr[1]] ? 1 : 0; break;
    }
};

const getInstructions = (input) => {
    let instructions = input.split('\n');
    let ip = Number(instructions[0].replace('#ip ', ''));
    instructions.shift();
    instructions = instructions.map(line => {
        let code = line.substr(0,4);
        let instr = line.substr(5).split(' ').map(Number);
        return {code, instr};
    });
    return [ip, instructions];
};

readFile('day19Input.txt', runFunctions);