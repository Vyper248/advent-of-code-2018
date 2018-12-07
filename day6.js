const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {
    [coords, maxX, maxY] = getCoords(input);

    //check all coords in area. Look at distance from all nodes and add to node area if closest
    for (let y = 0; y < maxY; y++){
        for (let x = 0; x < maxX; x++){
            const closestCoord = checkDistances(coords, x, y, true); //true = increment area
            if (closestCoord && (x < 2 || x > maxX-2 || y < 2 || y > maxY-2)) closestCoord.infinite = true; //if position is close to edge, that node is infinite
        }
    }
    
    //get highest area that isn't infinite
    let highest = coords.reduce((a,c) => {
        if (!c.infinite && c.area > a) a = c.area;
        return a;
    }, 0)
    
    console.log('First Star: ', highest);
};

const second = (input) => {
    [coords, maxX, maxY] = getCoords(input);

    //check all coords in area. Look at distance from all close nodes and add closest
    let areaSize = 0;
    let size = 10000;
    let area = size/coords.length;
    for (let y = -area; y < maxY+area; y++){
        for (let x = -area; x < maxX+area; x++){
            let sum = checkDistanceSum(coords, x, y, size);
            if (sum < size) areaSize++;
        }
    }
    console.log('Second Star: ', areaSize);
};

function getCoords(input){
    let maxX = 0;
    let maxY = 0;
    const coords = input.split('\n').map((line,id) => {
        let [x,y] = line.split(',').map(Number);
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        return {x, y, id, area:0}
    });
    return [coords, maxX, maxY];
}

function checkDistanceSum(coords, x, y, size){
    let sum = 0;
    coords.forEach(coord => {
        if (sum > size) return;
        sum += distance(coord.x, coord.y, x, y);
    });
    return sum;
}

function checkDistances(coords, x, y, increment = false){
    let closest = 2000;
    let closestCoord;
    let equal = false;
    coords.forEach((coord,i) => {
        const dist = distance(coord.x, coord.y, x, y);
        if (dist < closest) {
            closest = dist;
            closestCoord = coord;
            equal = false;
        } else if (dist === closest){
            equal = true;
        }
    });
    if (!equal && closestCoord){
        if (increment) closestCoord.area++;
        return closestCoord;
    }
    return null;
}

function distance(x1, y1, x2, y2){
    let distX = Math.abs(x2-x1);
    let distY = Math.abs(y2-y1);
    return distX + distY;
}

readFile('day6Input.txt', runFunctions);