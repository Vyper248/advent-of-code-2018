const runFunctions = () => {
    let input = 846601;
    first(input);
    input = '846601';
    second(input);
}

const first = (input) => {   
    const scores = [3,7];
    let current = [0,1];
    
    while (scores.length < input+10){
        let sum = scores[current[0]] + scores[current[1]];
        let parts = sum.toString().split('').map(Number);
        scores.push(...parts);
        current = current.map(elf => {
            let add = scores[elf]+1;
            return (elf + add)%scores.length;
        });
    }
    
    console.log('First Star: ', scores.slice(input, input+10).join(''));
};

const second = (input) => {   
    const scores = [3,7];
    let current = [0,1];
    let latest = [3,7]; //keep track of latest scores to check against input - more efficient than slicing scores array each check
    
    let found = false;
    let length = 0;
    while (found === false){
        let sum = scores[current[0]] + scores[current[1]];
        let parts = sum.toString().split('').map(Number);

        parts.forEach((score,i) => {
            latest.push(score);
            scores.push(score);
            if (latest.length > input.length) latest.shift();
            if (latest.join('') === input) {
                found = true;
                length = scores.length-input.length;
            }
        });
        
        current = current.map(elf => {
            let add = scores[elf]+1;
            return (elf + add)%scores.length;
        });
    }
    
    console.log('Second Star: ', length);
};

runFunctions();