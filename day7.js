const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {    
    const steps = getStepList(input);
    const order = path(steps);
    console.log('First Star: ', order);
};

function path(steps){
    const done = [];
    while (done.length < Object.values(steps).length){
        const possible = possibleSteps(steps, done)[0];
        done.push(possible);
    }
    return done.join('');
}

function possibleSteps(steps, done, workers = []){
    return Object.values(steps).reduce((possible, step) => {
        if (done.includes(step.step)) return possible; //check if done
        if (workers.some(worker => worker.step === step.step)) return possible; //check if allocated
        if (step.prev.length === 0) possible.push(step.step); //check if no requirements
        else if (step.prev.every(prevStep => done.includes(prevStep))) possible.push(step.step); //check if all requirements met
        return possible;
    }, []).sort();
}

function getStepList(input){
    const steps = {};
    input.split('\n').forEach(line => {
        const first = line.match(/Step ([A-Z]) must/)[1];
        const second = line.match(/step ([A-Z]) can/)[1];
        pushStep(steps, first, second);
    });
    return steps;
}

function pushStep(steps, first, second){
    if (!steps[first]) steps[first] = {step: first, prev: []};
    if (!steps[second]) steps[second] = {step: second, prev: []};
    steps[second].prev.push(first);
    steps[second].prev = steps[second].prev.sort();
}

const second = (input) => {
    const steps = getStepList(input);
    const time = path2(steps);
    
    console.log('Second Star: ', time);
};

function path2(steps){
    const done = [];
    let time = 0;
    const workers = [{step: '', start: 0}, {step: '', start: 0}, {step: '', start: 0}, {step: '', start: 0}, {step: '', start: 0}];
    while (done.length < Object.values(steps).length){
        checkWorkers(workers, done, time);
        const possible = possibleSteps(steps, done, workers);
        for (step of possible) allocateWorker(workers, step, time);
        time++;
    }

    return time-1;
}

function allocateWorker(workers, step, time){
    for (worker of workers){
        if (worker.step === '') {
            worker.step = step;
            worker.start = time;
            return;
        }
    }
}

function checkWorkers(workers, done, time){
    workers.forEach(worker => {
        if (worker.step === '') return;
        if (worker.start + worker.step.charCodeAt(0)-4 === time) {
            done.push(worker.step);
            worker.step = '';
        }
    });
}

readFile('day7Input.txt', runFunctions);