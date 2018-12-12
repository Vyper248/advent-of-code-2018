const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let [state, conditions] = getStateAndConditions(input);
    let center = 0;

    for (let i = 0; i < 20; i++){
        [state, center] = getNextGeneration(state, conditions, center);
    }

    let totalPlants = getTotal(state, center);
    
    console.log('First Star: ', totalPlants);
};

const second = (input) => {
    let [state, conditions] = getStateAndConditions(input);
    let center = 0;
    let lastTrimmed = state.join('');
    
    let stopPoint = 0;
    for (let i = 0; i < 50000000000; i++){
        [state, center] = getNextGeneration(state, conditions, center);
        //if state is the same as last state (even if just shifted), then all future states will be the same too, with an offset
        if (trimState(state).join('') === lastTrimmed){
            stopPoint = i;
            break;
        }
        lastTrimmed = trimState(state).join('');
    }
    
    let addition = 50000000000-stopPoint-1; //get the offset here
    let totalPlants = getTotal(state, center, addition);
    
    console.log('Second Star: ', totalPlants);
};

const getTotal = (state, center, addition = 0) => {
    return state.reduce((a,c,i) => {
        if (c === '#') a+=i+center+addition;
        return a;
    }, 0);
}

const getStateAndConditions = (input) => {
    let split = input.split('\n');
    let state = split[0].replace('initial state: ', '').split('');
    split.splice(0,2);
    let conditions = split.map(condition => {
        let note = condition.substr(0,5);
        let result = condition[9];
        return {note, result};
    });
    return [state, conditions];
};

const getNextGeneration = (state, conditions, center) => {
    let nextState = [];
        
    let addNew = false;
    for (let i = -5; i < state.length+5; i++) {
        let nextPot = getNextState(state, conditions, i);
        if ((i < 0 && nextPot === '#') || addNew){
            if (!addNew) center += i;
            nextState.push(nextPot);
            addNew = true;
        } else if (i >= 0) {
            nextState.push(nextPot);
        }
    }
    
    return [nextState, center];
};

const getNextState = (state, conditions, index) => {
    const C = state[index] || '.';
    const L1 = state[index-1] || '.';
    const L2 = state[index-2] || '.';
    const R1 = state[index+1] || '.';
    const R2 = state[index+2] || '.';
    const test = L2+L1+C+R1+R2;
    const condition = conditions.find(cond => cond.note === test);
    return condition.result;
};

const trimState = (state) => {
    let first = state.indexOf('#');
    let last = state.lastIndexOf('#');
    let newState = state.slice(first, last+1);
    return newState;
};

readFile('day12Input.txt', runFunctions);