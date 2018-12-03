const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {
    const array = [];
    let inches = 0;
    
    input.split('\n').forEach(line => {
        const [x,y,w,h] = getValues(line);
        
        for (let i = 0; i < w; i++){
            for (let j = 0; j < h; j++){
                addPos(array, x+i, y+j);
            }
        }
    });
    
    array.forEach(row => {
        row.forEach(cell => {
            if (cell > 1) inches++;
        });
    });
    
    console.log('First Star:', inches);
};

const second = (input) => {
    const array = [];
    const valid = {};
    
    input.split('\n').forEach(line => {
        const [x,y,w,h,id] = getValues(line);
        valid[id] = true;
        
        for (let i = 0; i < w; i++){
            for (let j = 0; j < h; j++){
                const check = getPos(array, x+i, y+j);
                if (check !== 0){
                    valid[id] = false;
                    valid[check] = false;
                }
                setPos(array, x+i, y+j, id);
            }
        }
    });
    
    let correctId = 0;
    Object.keys(valid).forEach(id => {
        if (valid[id]) correctId = id;
    });
    
    console.log('Second Star: ', correctId);
};

function getPos(array, x, y){
    checkPos(array, x, y);
    return array[y][x];
}

function addPos(array, x, y){
    checkPos(array, x, y);
    array[y][x]++;
}

function setPos(array, x, y, val){
    checkPos(array, x, y);
    array[y][x] = val;
}

function checkPos(array, x, y){
    if (array[y] === undefined) array[y] = [];
    if (array[y][x] === undefined) array[y][x] = 0;
}

function getValues(line){
    const coords = line.match(/[0-9]+,[0-9]+/)[0];
    const [x,y] = coords.split(',').map(a => parseInt(a));
    const size = line.match(/[0-9]+x[0-9]+/)[0];
    const [w,h] = size.split('x').map(a => parseInt(a));
    const id = parseInt(line.match(/\#[0-9]+/)[0].replace('#',''));
    return [x,y,w,h,id];
}

readFile('day3Input.txt', runFunctions);