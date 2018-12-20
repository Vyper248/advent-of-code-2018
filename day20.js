const readFile = require('./readFile').readFile;

const both = (input) => {
    let points = getValidPoints(input);
    pathfind(points, '0,0');
};

const pathfind = (points, start) => {
    let first = {pos: start, prev: null, score: 0};
    let nodes = [first]; //nodes to check next
    let checked = []; //nodes already checked
    let highestScore = 0;
    let over1000 = 0;
    
    while (nodes.length > 0) {
        let node = nodes.shift();
        checked.push(node.pos);
        let adjacentArr = getAdjacent(points, node, checked);
        for (adjacentNode of adjacentArr) {
            adjacentNode.prev = node;
            adjacentNode.score = node.score+1;
            if (adjacentNode.score >= 1000) over1000++;
            if (adjacentNode.score > highestScore) highestScore++;
            nodes.push(adjacentNode);
        }
    }
    
    console.log('First Star: ', highestScore);
    console.log('Second Star: ', over1000);
}

const getAdjacent = (points, node, checked) => {
    let adjacent = [];
    adjacent.push(...checkValid(points, checked, node.pos, 1, -1));
    adjacent.push(...checkValid(points, checked, node.pos, 1, 1));
    adjacent.push(...checkValid(points, checked, node.pos, 0, -1));
    adjacent.push(...checkValid(points, checked, node.pos, 0, 1));
    return adjacent;
};

//if position is valid, no wall, so add next position to array of nodes to check (only need to check rooms)
const checkValid = (arr1, arr2, point, axis, amnt) => {
    let pos = arr(point);
    pos[axis] += amnt;
    let pos2 = arr(point);
    pos2[axis] += amnt*2;
    return arr1.includes(str(pos)) && !arr2.includes(str(pos2)) ? [{pos: str(pos2)}] : [];
};

//don't need to build a grid of walls, just need an array of valid points for pathfinding
const getValidPoints = (input) => {
    input = input.replace(/(\^|\$)/g, '');
    let validPoints = [];
    let pos = [0,0];
    let startPoints = [str(pos)];
    
    input.split('').forEach(a => {
        switch(a){
            case '(': startPoints.push(str(pos)); break;
            case ')': pos = arr(startPoints.pop()); break;
            case '|': pos = arr(startPoints[startPoints.length-1]); break;
            case 'N': move(pos, validPoints, 1, -1); break;
            case 'E': move(pos, validPoints, 0, 1); break;
            case 'S': move(pos, validPoints, 1, 1); break;
            case 'W': move(pos, validPoints, 0, -1); break;
        }
    });
    
    return validPoints;
}

const str = (pos) => {
    return pos.join(',');
};

const arr = (pos) => {
    return pos.split(',').map(Number);
};

//for each direction, move 2 spaces, 1 for the door and one for the room
const move = (pos, validPoints, axis, dir) => {
    pos[axis] += dir;
    validPoints.push(str(pos));
    pos[axis] += dir;
    validPoints.push(str(pos));
}

readFile('day20Input.txt', both);