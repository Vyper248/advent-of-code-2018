const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
}

const first = (input) => {   
    const [grid, lowX, highX, lowY, highY] = getGrid(input);
        
    flow(grid, lowX, highX, highY, 500, 0);
    
    // display(grid, lowX, highX, 0);
    
    let water = countStr(grid, lowX, highX, lowY, highY, '~', '|');
    console.log('First Star: ', water);
    
    let left = countStr(grid, lowX, highX, lowY, highY, '~');
    console.log('Second Star: ', left);
};

//can display all with 'node day17.js | less' - use enter to go down and q to exit
const display = (grid, lowX, highX) => {
    let max = grid[lowX].length;
    for (let y = 0; y < max; y++){
        let str = '';
        for (let x = lowX-1; x < highX+2; x++){
            str += grid[x][y];
        }
        console.log(str);
    }
};

const countStr = (grid, lowX, highX, lowY, highY, str1, str2) => {
    let total = 0;
    for (let x = lowX-5; x <= highX+4; x++){
        for (let y = lowY; y <= highY; y++){
            if (grid[x][y] === str1) total++;
            else if (str2 && grid[x][y] === str2) total++;
        }
    }
    return total;
}

const flow = (grid, lowX, highX, highY, x, y) => {
    let bottom = findClay(grid, x, y, highY);
    fall(grid, x, y, bottom);//let water fall down to bottom position
    
    if (grid[x][bottom+1] === '|') return; //if hitting water, then fall to it and stop (will merge with it) 
    if (bottom === highY) return; //if hitting bottom of grid, stop
    
    //while within a contained area, fill with water, otherwise get positions to spread to
    let spreadFrom, spreadTo;
    while (true){
        [canFill, from, to] = checkContained(lowX, highX, grid, x, bottom);
        if (canFill){
            fillWith(grid, bottom, from, to, '~');
            bottom--;
        } else {
            spreadFrom = from;
            spreadTo = to;
            break;
        }
    }
    
    //spread water
    fillWith(grid, bottom, spreadFrom, spreadTo, '|');
    
    //using end positions of spread, begin flow again
    if (grid[spreadFrom][bottom+1] === '.') flow(grid, lowX, highX, highY, spreadFrom, bottom);
    if (grid[spreadTo][bottom+1] === '.') flow(grid, lowX, highX, highY, spreadTo, bottom);
};

const fall = (grid, x, from, to) => {
    for (let y = from; y <= to; y++){
        grid[x][y] = '|';
    }
};

const fillWith = (grid, y, from, to, str) => {
    for (let x = from; x <= to; x++){
        grid[x][y] = str;
    }
};

const findClay = (grid, x, y, highY) => {
    for (let i = y+1; i <= highY; i++){
        if (hitClayOrWater(grid, x, i)) return i;
    }
    return highY;
};

const hitClayOrWater = (grid, x, y) => {
    if (grid[x][y+1] === '#' || grid[x][y+1] === '|') return true;
    return false;
};

//check if inside a contained area and return that area. If not, return positions to spread from and to
const checkContained = (lowX, highX, grid, x, y) => {
    let onLeft = false;
    let from = lowX;
    let onRight = false;
    let to = highX;
    
    //check to the left of position
    for (let i = x-1; i >= lowX-4; i--){
        [onLeft, from, foundOther] = checkPosition(grid, i, y, lowX, 1);
        if (onLeft) break;
        if (foundOther) break;
    }
    
    //check to the right of position
    for (let i = x+1; i <= highX+4; i++){
        [onRight, to, foundOther] = checkPosition(grid, i, y, highX, -1);
        if (onRight) break;
        if (foundOther) break;
    }
    
    if (onRight && onLeft) return [true, from, to];
    return [false, from, to];
};

const checkPosition = (grid, x, y, defPos, dir) => {
    if (grid[x][y] === '#'){//found a clay wall to the right
        return [true, x+dir, false];
    }
    if (grid[x][y+1] === '.' || grid[x][y+1] === '|'){//found a hole or water to the left, so won't be contained
        return [false, x, true];
    }
    return [false, defPos, false];
}

const getGrid = (input) => {
    let highX = 0;
    let highY = 0;
    let lowX = Infinity;
    let lowY = Infinity;
    
    let xLines = [];
    let yLines = [];
    
    input.split('\n').forEach(line => {
        const parts = line.split(',');
        if (parts[0].includes('x')){
            const x = Number(parts[0].replace('x=', ''));
            const [from, to] = parts[1].replace(/[x|y]=/, '').split('..').map(Number);
            [lowX, highX, lowY, highY] = compareValues(x, lowX, highX, from, to, lowY, highY);
            xLines.push({x, from, to});
        } else {
            const y = Number(parts[0].replace('y=', ''));
            const [from, to] = parts[1].replace(/[x|y]=/, '').split('..').map(Number);
            [lowY, highY, lowX, highX] = compareValues(y, lowY, highY, from, to, lowX, highX);
            yLines.push({y, from, to});
        }
    });
    
    let grid = [];
    
    //fill grid with sand
    for (let x = lowX-5; x < highX+5; x++){
        for (let y = 0; y <= highY; y++){
            if (!grid[x]) grid[x] = [];
            grid[x][y] = '.';
        }
    }
    
    //add spring
    grid[500][0] = '+';
    
    //add clay
    xLines.forEach(line => {
        for (let i = line.from; i <= line.to; i++){
            grid[line.x][i] = '#';
        }
    });
    
    yLines.forEach(line => {
        for (let i = line.from; i <= line.to; i++){
            grid[i][line.y] = '#';
        }
    });
        
    return [grid, lowX, highX, lowY, highY];
};

const compareValues = (a, lowA, highA, from, to, lowB, highB) => {
    if (a > highA) highA = a;
    if (a < lowA) lowA = a;
    if (from < lowB) lowB = from;
    if (to > highB) highB = to;
    return [lowA, highA, lowB, highB];
}

readFile('day17Input.txt', runFunctions);