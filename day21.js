const readFile = require('./readFile').readFile;

const both = (input) => {
    let lines = input.split('\n');
    let regEx = /[0-9]+/g;
    let a = Number(lines[7].match(regEx)[1]);
    let b = Number(lines[8].match(regEx)[0]);
    let c = Number(lines[11].match(regEx)[1]);
    let d = Number(lines[12].match(regEx)[1]);
    let e = Number(lines[13].match(regEx)[1]);
    runOptimised(a, b, c, d, e);
};

//instructions converted to function and optimised to run fast (~5.5ms)
const runOptimised = (a, b, c, d, e) => {
    let reg2 = 0;
    let reg3 = 0;
    let reg4 = 0;
    let reg5 = 0;
    let set = new Set();//keep track of values that work

    reg5 = 123;
    let counter = 0;
    let lowestCounter = Infinity;
    let lowestReg;
    let highestCounter = 0;
    let highestReg;
    while (true){
        counter++;
        reg5 = reg5 & 456; //01
        if (reg5 === 72){ //02
            reg5 = 0; //05
            while (true){
                counter++;
                reg4 = reg5 | a; //06
                reg5 = b; //07
                while (true) {
                    counter++;
                    reg2 = reg4 & 255; //08
                    reg5 += reg2; //09
                    reg5 = reg5 & c; //10
                    reg5 *= d; //11
                    reg5 = reg5 & e; //12
                    if (256 > reg4) { //13
                        if (set.has(reg5)) { //if values start looping, end program
                            console.log('First Star: ', lowestReg);
                            console.log('Second Star: ', highestReg);
                            return;
                        } else { //otherwise, keep track of highest and lowest and add to set
                            if (counter < lowestCounter) {
                                lowestCounter = counter;
                                lowestReg = reg5;
                            }
                            if (counter > highestCounter) {
                                highestCounter = counter;
                                highestReg = reg5;
                            }
                            set.add(reg5);
                        }
                        break;
                    } else {
                        reg4 = Math.floor(reg4/256);//optimised while loop (18-27) to this 
                    }
                }
            }
        }
    }
    
};

readFile('day21Input.txt', both);