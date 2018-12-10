const readFile = require('./readFile').readFile;
//IMPORTANT:
let speedMultiplier = 5209;//Allows displaying of result faster - change to 1 if testing with other inputs, 5209 for quick result

const runFunctions = (input) => {
    both(input);
}

const both = (input) => {   
    const points = createPoints(input);
    const counter = iteratePoints(points);
    const [width, height] = trimAndGetDimensions(points);
    console.log('First Star:');
    displayPoints(points, width, height);
    console.log('Second Star: ', counter*speedMultiplier);
};

const createPoints = (input) => {
    const points = [];
    
    input.split('\n').forEach(line => {
        const pos = line.match(/position=\<([-0-9, ]+)\>/)[1].split(', ').map(Number);
        const vel = line.match(/velocity=\<([-0-9, ]+)\>/)[1].split(', ').map(Number);
        const point = new Point(pos, vel);
        points.push(point);
    });
    
    return points;
}

const iteratePoints = (points) => {
    let counter = 0;
    while(checkForWord(points) === false) {
        iterate(points);
        counter++;
    }
    return counter;
}

const iterate = (points) => {
    points.forEach(point => {
        point.x += point.velX*speedMultiplier;
        point.y += point.velY*speedMultiplier;
    });
}

const checkForWord = (points) => {
    const mapX = {};
    points.forEach(point => {
        if (!mapX[point.x]) mapX[point.x] = 0;
        mapX[point.x]++;
    });
    
    let lotsX = false;
    Object.values(mapX).forEach(x => {
        if (x > 20) lotsX = true;
    });
    
    if (lotsX) return true;
    else return false;
}

const trimAndGetDimensions = (points) => {
    let maxX = 0;
    let maxY = 0;
    let minX = 1000000;
    let minY = 1000000;
    points.forEach(point => {
        if (point.x > maxX) maxX = point.x;
        if (point.y > maxY) maxY = point.y;
        if (point.x < minX) minX = point.x;
        if (point.y < minY) minY = point.y;
    });
        
    points.forEach(point => {
        point.x -= minX;
        point.y -= minY;
    });
    
    let width = maxX - minX;
    let height = maxY - minY;
    
    return [width, height];
}

const displayPoints = (points, width, height) => {
    for (let y = 0; y <= height; y++){
        let line = '';
        for (let x = 0; x <= width; x++){
            if (atPoint(points, x, y)) line += '#';
            else line += '.';
        }
        console.log(line);
    }
}

const atPoint = (points, x, y) => {
    for (point of points){
        if (point.x === x && point.y === y){
            return true;
        }
    };
}

function Point(pos, vel) {
    this.x = pos[0];
    this.y = pos[1];
    this.velX = vel[0];
    this.velY = vel[1];
    return this;
};

readFile('day10Input.txt', runFunctions);