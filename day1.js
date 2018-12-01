const readFile = require('./readFile').readFile;

const first = (input) => {
    let frequency = input.split('\n').reduce((a, c) => {
        return a + Number(c);
    }, 0);
    console.log('First Star: ', frequency);
};

const second = (input) => {
    const freqs = input.split('\n');
    const seen = {0: 1};
    let currentFreq = 0;
    let repeat = false;
    
    while(!repeat){
        for (let i = 0; i < freqs.length; i++){
            currentFreq += Number(freqs[i]);
            if (seen[currentFreq] === 1) {
                console.log('Second Star: ', currentFreq);
                repeat = true;
                break;
            }
            seen[currentFreq] = 1;
        };
    }
};

readFile('day1Input.txt', first);
readFile('day1Input.txt', second);