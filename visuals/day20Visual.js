let lowX = 0;
let lowY = 0;
let divs = [];
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.fillStyle = "#000000";
const SIZE = 5;
const SPEED_MULT = 3;

const both = (input) => {
    let points = getValidPoints(input);
    pathfind(points, '0,0');
};

const pathfind = (points, start) => {
    let first = {pos: start, score: 0, prev: null};
    let nodes = [first]; //nodes to check next
    let checked = new Set(); //nodes already checked
    let highestScore = 0;
    let over1000 = 0;
    let furthestNode = first;
    
    getLowPoints(points);
    
    let timer = setInterval(()=>{
        for (let i = 0; i < SPEED_MULT; i++){
            if (nodes.length === 0){
                clearInterval(timer);
                showPathBack(furthestNode);
                return;
            }

            let node = nodes.shift();
            checked.add(node.pos);
            let adjacentArr = getAdjacent(points, node, checked);
            for (adjacentNode of adjacentArr) {
                adjacentNode.score = node.score+1;
                adjacentNode.prev = node;
                if (adjacentNode.score >= 1000) over1000++;
                if (adjacentNode.score > highestScore) {
                    highestScore++;
                    furthestNode = adjacentNode;
                }
                nodes.push(adjacentNode);
                addPoint(adjacentNode.pos);
            }
        }
    });
}

const showPathBack = (furthestNode) => {
    //show end point
    ctx.fillStyle = "#00FF00";
    addPoint(furthestNode.pos);
    furthestNode = furthestNode.prev;
    
    ctx.fillStyle = "#FF0000";
    
    let timer2 = setInterval(() => {
        for (let i = 0; i < SPEED_MULT; i++){
            if (furthestNode.prev === null){
                clearInterval(timer2);
                //show start point
                ctx.fillStyle = "#00FF00";
                addPoint(furthestNode.pos);
                return;
            }

            addPoint(furthestNode.pos);
            furthestNode = furthestNode.prev;
        }
    });
};

const getLowPoints = (points) => {
    points.forEach(pos => {
        let arr = pos.split(',').map(Number);
        if (arr[0] < lowX) lowX = arr[0];
        if (arr[1] < lowY) lowY = arr[1];
    });
    lowX *= SIZE;
    lowY *= SIZE;
};

const addPoint = (pos) => {
    let position = pos.split(',').map(Number);
    ctx.fillRect((position[0]*SIZE)+Math.abs(lowX), (position[1]*SIZE)+Math.abs(lowY), SIZE, SIZE);
};

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
    return arr1.has(str(pos)) && !arr2.has(str(pos)) ? [{pos: str(pos)}] : [];
};

//don't need to build a grid of walls, just need an array of valid points for pathfinding
const getValidPoints = (input) => {
    input = input.replace(/(\^|\$)/g, '');
    let validPoints = new Set();
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
    validPoints.add(str(pos));
    pos[axis] += dir;
    validPoints.add(str(pos));
}

fetch('../day20Input.txt').then(resp => resp.text()).then(data => {
    both(data);
});