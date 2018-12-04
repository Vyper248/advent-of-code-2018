const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
}

const first = (input) => {
    const sorted = sortLines(input);
    const guards = getMinutes(sorted);
    const currentId = getGuardWhoSleptMost(guards);
    const highestMinute = getHighest(guards, currentId)[0];
    
    console.log('First Star: ', currentId * highestMinute);
    
    second(guards);
};

const second = (guards) => {
    let currentId = '';
    let highestMinute = 0;
    let highestQty = 0;

    for (id in guards){
        const [min, qty] = getHighest(guards, id);
        if (qty > highestQty){
            highestQty = qty;
            highestMinute = min;
            currentId = id;
        }
    }
    
    console.log('Second Star: ', currentId * highestMinute);
};

function sortLines(input){
    const sorted = input.split('\n').sort((a,b) => {
        const date1 = new Date(a.match(/\[([0-9- :]+)\]/)[1]);
        const date2 = new Date(b.match(/\[([0-9- :]+)\]/)[1]);
        return date1 - date2;
    });
    
    return sorted;
}

function getMinutes(sorted){
    const guards = {};
    
    let currentId = '';
    let currentMinute = 0;
    
    sorted.forEach(line => {
        if (line.includes('#')) {
            currentId = line.match(/#([0-9]+)/)[1];
            if (!guards[currentId]) guards[currentId] = [];
            return;
        }
        
        if (line.includes('falls asleep')){
            const time = getTime(line);
            incrementMinute(guards, currentId, time);
            currentMinute = time;
        } 
        
        else if (line.includes('wakes up')){
            const time = getTime(line);
            for (let i = currentMinute+1; i < time; i ++){
                incrementMinute(guards, currentId, i);
            }
        }
    });
    
    return guards;
}

function getGuardWhoSleptMost(guards){
    let currentId = '';
    let asleepTime = 0;
    
    for (id in guards){
        const total = guards[id].reduce((a,c) => a+=c, 0);
        if (total > asleepTime){
            asleepTime = total;
            currentId = id;
        }
    }
    
    return currentId;
}

function getHighest(guards, id){
    let highestMinute = 0;
    let highestQty = 0;
    
    guards[id].forEach((qty, min) => {
        if (qty > highestQty) {
            highestMinute = min;
            highestQty = qty;
        }
    });
    
    return [highestMinute, highestQty];
}

function incrementMinute(guards, id, minute){
    if (!guards[id][minute]) guards[id][minute] = 1;
    else guards[id][minute]++;
}

function getTime(line){
    return parseInt(line.match(/[0-9]+\:([0-9]+)/)[1]);
}

readFile('day4Input.txt', runFunctions);