const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    const [tests] = getArrays(input);    
    let overThree = 0;

    tests.forEach(test => {
        let code = test.instr[0];
        let works = checkCodes(test);
        if (works.length >= 3) overThree++;
    });
    
    console.log('First Star: ', overThree);
};

const second = (input) => {
    const [tests, instructions] = getArrays(input);
    const optcodes = {};
    for (let i = 0; i < 16; i++){
        optcodes[i] = [];
    }
        
    //go through tests and get list of possible codes
    tests.forEach(test => {
        let code = test.instr[0];
        let works = checkCodes(test);
        if (optcodes[code].length === 0) optcodes[code] = works;
        else optcodes[code] = compareCodes(optcodes[code], works);
    });
    
    //find codes and re-organise optcodes
    findCodes(optcodes);
    for (let i = 0; i < 16; i++){
        optcodes[i] = optcodes[i][0];
    }
    
    //goes through instructions
    let register = instructions[0];
    instructions.forEach(instr => {
        let code = instr[0];
        evalCode(optcodes[code], register, instr);
    });
    
    console.log('Second Star:', register[0]);
};

const compareCodes = (arr1, arr2) => {
    let same = [];
    for (code of arr1) {
        if (arr2.includes(code)) same.push(code);
    }
    return same;
};

const findCodes = (tests) => {
    let done = [];
    
    while (Object.values(tests).reduce((a,c) => c.length > a ? a = c.length: a, 0) > 1){
        Object.values(tests).forEach((arr,i) => {
            if (done.includes(i)) return;
            if (arr.length === 1) {
                removeCodes(tests, arr[0], i);
                done.push(i);
            }
        });
    }
};

const removeCodes = (codes, codeStr, except) => {
    Object.values(codes).forEach((arr,i) => {
        if (i === except) return;
        if (arr.includes(codeStr)) arr.splice(arr.indexOf(codeStr), 1);
    });
};

const checkCodes = ({before, after, instr}) => {
    const codes = ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'];
    const works = [];
    codes.forEach(code => {
        let beforeArr = before.split(', ').map(Number);
        evalCode(code, beforeArr, instr);
        if (beforeArr.join(', ') === after){
            works.push(code);
        }
    });
    return works;
}

const evalCode = (code, regs, instr) => {
    switch(code){
        case 'addr': regs[instr[3]] = regs[instr[1]] + regs[instr[2]]; break;
        case 'addi': regs[instr[3]] = regs[instr[1]] + instr[2]; break;
        case 'mulr': regs[instr[3]] = regs[instr[1]] * regs[instr[2]]; break;
        case 'muli': regs[instr[3]] = regs[instr[1]] * instr[2]; break;
        case 'banr': regs[instr[3]] = regs[instr[1]] & regs[instr[2]]; break;
        case 'bani': regs[instr[3]] = regs[instr[1]] & instr[2]; break;
        case 'borr': regs[instr[3]] = regs[instr[1]] | regs[instr[2]]; break;
        case 'bori': regs[instr[3]] = regs[instr[1]] | instr[2]; break;
        case 'setr': regs[instr[3]] = regs[instr[1]]; break;
        case 'seti': regs[instr[3]] = instr[1]; break;
        case 'gtir': regs[instr[3]] = instr[1] > regs[instr[2]] ? 1 : 0; break;
        case 'gtri': regs[instr[3]] = regs[instr[1]] > instr[2] ? 1 : 0; break;
        case 'gtrr': regs[instr[3]] = regs[instr[1]] > regs[instr[2]] ? 1 : 0; break;
        case 'eqir': regs[instr[3]] = instr[1] === regs[instr[2]] ? 1 : 0; break;
        case 'eqri': regs[instr[3]] = regs[instr[1]] === instr[2] ? 1 : 0; break;
        case 'eqrr': regs[instr[3]] = regs[instr[1]] === regs[instr[2]] ? 1 : 0; break;
    }
};

const getArrays = (input) => {
    let arr = input.split('\n');
    
    let newSet = true;
    let second = false;
    let currentObj = {};
    let tests = [];
    let instructions = [];
    arr.forEach(line => {
        if (newSet && line.length === 0) second = true;
        if (second && line.length > 0) {
            instructions.push(line.split(' ').map(Number));
            return;
        }
        
        if (newSet && line.length > 0) {
            currentObj = {before:[], after:[], instr:[]};
            tests.push(currentObj);
        }
        
        if (line.includes('Before')) currentObj.before = line.match(/\[([0-9, ]+)\]/)[1];
        else if (line.includes('After')) currentObj.after = line.match(/\[([0-9, ]+)\]/)[1];
        else if (line.length > 0) currentObj.instr = line.split(' ').map(Number);
        else {
            newSet = true;
            return;
        }
        newSet = false;
    });

    return [tests, instructions];
};

readFile('day16Input.txt', runFunctions);