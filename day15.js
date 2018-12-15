const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let [grid, units] = getGridAndUnits(input);
    
       
    let moveToMake = true;
    let iterations = 0;
    while (moveToMake && iterations < 100) {
        [units, moveToMake] = iteration(units, grid);
        if (moveToMake) iterations++;
    }
    
    let remainingHP = units.reduce((a,c) => {
        if (c.hp > 0) a += c.hp;
        return a;
    }, 0);
    
    console.log('First Star: ', (iterations-1) * remainingHP);
};

const second = (input) => {
    let [grid, units] = getGridAndUnits(input, 4);
    let elfNumber = units.filter(unit => unit.type === 'E').length;
       
    let moveToMake = true;
    let elfDied = true;
    let iterations = 0;
    let powerTried = 4;//25 is correct
    while (elfDied === true && powerTried < 50) {
        [grid, units] = getGridAndUnits(input, powerTried);
        // console.log('Trying power: ', powerTried);
        iterations = 0;
        moveToMake = true;
        while (moveToMake) {
            [units, moveToMake] = iteration(units, grid);
            if (moveToMake) iterations++;
            if (!checkElves(units, elfNumber)) break;
        }
        
        if (checkElves(units, elfNumber)) elfDied = false;
        else powerTried++;
    }
    
    let remainingHP = units.reduce((a,c) => {
        if (c.hp > 0) a += c.hp;
        return a;
    }, 0);
    
    console.log('Second Star: ', (iterations-1) * remainingHP);
};

const checkElves = (units, elfNumber) => {
    if (units.filter(unit => unit.type === 'E').length !== elfNumber) return false;
    return true;
};

const iteration = (units, grid) => {
    let moveToMake = false;
    units.forEach(unit => {
        let didSomething = attackOrMove(grid, unit, units);
        if (didSomething) moveToMake = true;
    });
    units = units.filter(unit => unit.hp > 0);
    units = sortArr(units);
    return [units, moveToMake];
};

const attackOrMove = (grid, obj, units) => {
    if (obj.hp <= 0) return false;
    // console.log('Unit turn: ', obj);
    let enemies;
    if (obj.type === 'E') enemies = units.filter(obj => obj.type === 'G' && obj.hp > 0); 
    if (obj.type === 'G') enemies = units.filter(obj => obj.type === 'E' && obj.hp > 0); 
    
    if (enemies.length === 0) return false;
        
    //attack adjacent if there are any
    let attacked = attackAdjacent(enemies, obj);
    if (attacked) return true;
    
    //otherwise find an enemy and move to position if possible
    let moved = moveUnit(grid, enemies, obj, units);
    if (moved) return true;
    
    return false;
}

const moveUnit = (grid, enemies, obj, units) => {
    let targetPositions = [];
    
    enemies.forEach(enemy => targetPositions.push(...getAdjacent(grid, enemy, units)));
    
    targetPositions = sortArr(targetPositions);
    
    // console.log('Target Positions: ', targetPositions);
    
    let closestDistance = Infinity;
    let positionToMove;
    targetPositions.forEach(target => {
        let [distance, position] = pathfind(grid, units, obj, target);
        // console.log('Distance to ', target, ' is ', distance);
        if (distance !== undefined && distance < closestDistance){
            closestDistance = distance;
            positionToMove = position;
        }
    });
    
    if (positionToMove !== undefined){
        obj.x = positionToMove.x;
        obj.y = positionToMove.y;
        // console.log('Moving to: ', positionToMove.x, positionToMove.y);
        //after moving, try attacking again
        attackAdjacent(enemies, obj);
        return true;
    } else {
        // console.log("Can't do anything");
        return false;
    }
};

const attackAdjacent = (enemies, obj) => {
    let adjacentEnemies = [];
    enemies.forEach(enemy => {
        if (enemy.x === obj.x+1 && enemy.y === obj.y) adjacentEnemies.push(enemy);
        if (enemy.x === obj.x-1 && enemy.y === obj.y) adjacentEnemies.push(enemy);
        if (enemy.x === obj.x && enemy.y === obj.y-1) adjacentEnemies.push(enemy);
        if (enemy.x === obj.x && enemy.y === obj.y+1) adjacentEnemies.push(enemy);
    });
    // console.log("Adjacent Enemies: ", adjacentEnemies);
    //if there's adjacent enemies, pick one to attack
    if (adjacentEnemies.length > 0){
        if (adjacentEnemies.length > 1) adjacentEnemies = adjacentEnemies.sort((a,b) => {
            if (a.hp !== b.hp) return a.hp-b.hp;
            else if (a.y !== b.y) return a.y-b.y;
            else return a.x-b.x;
        });
        let toAttack = adjacentEnemies[0];
        toAttack.hp -= obj.ap;
        // console.log('Unit Attacked ', toAttack, obj.ap);
        return true;
    }
    return false;
}

//find closest path and return distance and first position to move to
const pathfind = (grid, units, objA, target) => {
    objA.score = 0;
    let nodes = [objA]; //nodes to check next
    let checked = []; //nodes already checked
    let path = [];
    
    while (nodes.length > 0) {
        let node = nodes.shift();
        checked.push(node);
        let others = []; others.push(...checked); others.push(...nodes);
        let adjacentArr = getAdjacent(grid, node, units, others);
        for (adjacentNode of adjacentArr) {
            adjacentNode.prev = node;
            adjacentNode.score = node.score+1;
            if (adjacentNode.x == target.x && adjacentNode.y === target.y) { //found path
                let current = adjacentNode;
                while (current !== undefined) {
                    if (current !== objA) path.push(current);
                    current = current.prev;
                }
                nodes = [];
                break;
            } else {
                nodes.push(adjacentNode);
            }
        };
    }
    
    if (path.length > 0){
        let distance = path[0].score;
        let first = path[path.length-1];
        return [distance, first];
    } else {
        return [undefined, undefined];
    }
}

const getAdjacent = (grid, obj, units, other=[]) => {
    let adjacent = [];
    if (checkPos(obj.x, obj.y-1, grid, units, other)) adjacent.push({x:obj.x, y:obj.y-1});
    if (checkPos(obj.x-1, obj.y, grid, units, other)) adjacent.push({x:obj.x-1, y:obj.y});
    if (checkPos(obj.x+1, obj.y, grid, units, other)) adjacent.push({x:obj.x+1, y:obj.y});
    if (checkPos(obj.x, obj.y+1, grid, units, other)) adjacent.push({x:obj.x, y:obj.y+1});
    return adjacent;
}

//check if position empty
const checkPos = (x, y, grid, units, other=[]) => {
    if (grid[y][x] !== '.') return false;
    if (units.find(obj => obj.x === x && obj.y === y && obj.hp > 0) !== undefined) return false;
    if (other.find(obj => obj.x === x && obj.y === y) !== undefined) return false;
    return true;
}

const distance = (objA, objB) => {
    return Math.abs(objA.x-objB.x) + Math.abs(objA.y-objB.y);
}

//sort an array ob objects with x/y positions from top-bottom left-right
const sortArr = (arr) => {
    arr = arr.sort((a,b) => {
        if(a.y !== b.y) return a.y-b.y;
        else return a.x-b.x;
    });
    return arr;
}

const getGridAndUnits = (input, power=3) => {
    const units = [];
    
    const grid = input.split('\n').map((line,y) => {
        const lineArr = line.split('').map((pos,x) => {
            if (pos === 'G' || pos === 'E'){
                let unit = {x, y, hp: 200, type: pos, ap: 3};
                if (pos === 'E') unit.ap = power;
                units.push(unit);
                return '.';
            } else return pos;
        });
        return lineArr;
    });
    
    return [grid, units];
}

readFile('day15Input.txt', runFunctions);