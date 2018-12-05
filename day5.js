const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {
    const final = removePairs(input);
    console.log('First Star: ', final.length);
};

const second = (input) => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let shortest = 1000000;
    letters.split('').forEach(letter => {
        let regex = new RegExp(letter, 'gi');
        const removed = input.replace(regex, '');
        const final = removePairs(removed);
        if (final.length < shortest) shortest = final.length;
    });
    console.log('Second Star: ', shortest);
};

function removePairs(string){
    const initialString = string;
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    letters.split('').forEach(letter => {
        let regex = new RegExp(letter+letter.toUpperCase(), 'g');
        let regex2 = new RegExp(letter.toUpperCase()+letter, 'g');
        string = string.replace(regex, '');
        string = string.replace(regex2, '');
    });

    if (string.length < initialString.length) string = removePairs(string);

    return string;
}

readFile('day5Input.txt', runFunctions);