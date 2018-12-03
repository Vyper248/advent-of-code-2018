const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {
    let twos = 0;
    let threes = 0;
    input.split('\n').forEach(line => {
        const letters = {};
        for (let letter of line) {
            if (letters[letter]) letters[letter]++;
            else letters[letter] = 1;
        }
        
        if (Object.values(letters).some(letter => letter === 2)) twos++;
        if (Object.values(letters).some(letter => letter === 3)) threes++;
    });
    
    const checksum = twos * threes;
    console.log('First Star: ', checksum);
};

const second = (input) => {
    const lines = input.split('\n');
    
    let commonLetters = undefined;
    for (let line1 of lines){
        for (let line2 of lines){
            if (line1 === line2) continue;
            commonLetters = compare(line1, line2);
            if (commonLetters !== undefined) break;
        }
        if (commonLetters !== undefined) break;
    }
    console.log('Second Star: ', commonLetters);
    
    function compare(line1, line2){
        let different = 0;
        let index = 0;
        Array.from(line1).forEach((letter, i) => {
            if (letter != line2[i]){
                different++;
                index = i;
            }
        });
        
        return different === 1 ? line1.substring(0,index)+line1.substring(index+1) : undefined;
    }
};

readFile('day2Input.txt', runFunctions);