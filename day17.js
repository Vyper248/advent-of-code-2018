const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
}

const first = (input) => {   
    const [grid, lowX, highX, lowY, highY] = getGrid(input);
        
    flow(grid, lowX, highX, highY, 500, 0);
    
    display(grid, lowX, highX, 0);
    
    let water = countWater(grid, lowX, highX, lowY, highY);
    console.log('First Star: ', water);
    
    let left = retained(grid, lowX, highX, lowY, highY);
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

const countWater = (grid, lowX, highX, lowY, highY) => {
    let water = 0;
    for (let x = lowX-5; x <= highX+4; x++){
        for (let y = lowY; y <= highY; y++){
            if (grid[x][y] === '~' || grid[x][y] === '|') water++;
        }
    }
    return water;
};

const retained = (grid, lowX, highX, lowY, highY) => {
    let water = 0;
    for (let x = lowX-5; x <= highX+4; x++){
        for (let y = lowY; y <= highY; y++){
            if (grid[x][y] === '~') water++;
        }
    }
    return water;
}

const flow = (grid, lowX, highX, highY, x, y) => {
    // console.log('Flowing from: ', x, y);
    let bottom = findClay(grid, x, y, highY);
    // console.log('Found clay at: ', x, bottom);
    
    // console.log('Falling from ', y, ' to ', bottom, ' at x: ', x);
    if (grid[x][bottom+1] === '|') {
        fall(grid, x, y, bottom);
        return;
    }
    
    fall(grid, x, y, bottom);
    
    if (bottom === highY) return;
    
    let spreadFrom, spreadTo;
    
    while (true){
        [canFill, from, to] = checkContained(lowX, highX, grid, x, bottom);
        if (canFill){
            // console.log('Filling from: ', from, ' to: ', to, ' at y: ', bottom);
            fill(grid, bottom, from, to);
            bottom--;
        } else {
            spreadFrom = from;
            spreadTo = to;
            break;
        }
    }
    
    // console.log('Spreading from: ', spreadFrom, ' to: ', spreadTo, ' bottom is: ', bottom);
    spread(grid, bottom, spreadFrom, spreadTo);
    
    if (grid[spreadFrom][bottom+1] === '.' && bottom+1 < highY) flow(grid, lowX, highX, highY, spreadFrom, bottom);
    if (grid[spreadTo][bottom+1] === '.' && bottom+1 < highY) flow(grid, lowX, highX, highY, spreadTo, bottom);
};

const fall = (grid, x, from, to) => {
    for (let y = from; y <= to; y++){
        grid[x][y] = '|';
    }
};

const fill = (grid, y, from, to) => {
    for (let x = from; x <= to; x++){
        grid[x][y] = '~';
    }
};

const spread = (grid, y, from, to) => {
    for (let x = from; x <= to; x++){
        grid[x][y] = '|';
    }
};

const findClay = (grid, x, y, highY) => {
    for (let i = y+1; i <= highY; i++){
        if (hitClay(grid, x, i)) return i;
    }
    return highY;
};

const hitClay = (grid, x, y) => {
    if (grid[x][y+1] === '#' || grid[x][y+1] === '|') return true;
    return false;
};

const checkContained = (lowX, highX, grid, x, y) => {
    let onRight = false;
    let to = highX;
    let onLeft = false;
    let from = lowX;
    for (let i = x+1; i <= highX+4; i++){
        if (grid[i][y] === '#'){//found a clay wall to the right
            onRight = true;
            to = i-1;
            break;
        }
        if (grid[i][y+1] === '.' || grid[i][y+1] === '|'){//found a hole to the right, so won't be contained
            to = i;
            break;
        }
    }
    
    for (let i = x-1; i >= lowX-4; i--){
        if (grid[i][y] === '#'){//found a clay wall to the right
            onLeft = true;
            from = i+1;
            break;
        }
        if (grid[i][y+1] === '.' || grid[i][y+1] === '|'){//found a hole to the left, so won't be contained
            from = i;
            break;
        }
    }
    
    if (onRight && onLeft) return [true, from, to];
    return [false, from, to];
};

const getGrid = (input) => {
    let highX = 0;
    let highY = 0;
    let lowX = Infinity;
    let lowY = Infinity;
    
    let xLines = [];
    let yLines = [];
    
    input.split('\n').forEach(line => {
        //x=464, y=786..795
        //y=1588, x=414..417
        
        const parts = line.split(',');
        if (parts[0].includes('x')){
            const x = Number(parts[0].replace('x=', ''));
            if (x > highX) highX = x;
            if (x < lowX) lowX = x;
            const yParts = parts[1].replace('y=', '');
            const from = Number(yParts.split('..')[0]);
            if (from > highY) highY = from;
            if (from < lowY) lowY = from;
            const to = Number(yParts.split('..')[1]);
            if (to > highY) highY = to;
            if (from < lowY) lowY = from;
            xLines.push({x, from, to});
        } else {
            const y = Number(parts[0].replace('y=', ''));
            if (y > highY) highY = y;
            if (y < lowY) lowY = y;
            const xParts = parts[1].replace('x=', '');
            const from = Number(xParts.split('..')[0]);
            if (from > highX) highX = from;
            if (from < lowX) lowX = from;
            const to = Number(xParts.split('..')[1]);
            if (to > highX) highX = to;
            if (from < lowX) lowX = from;
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

readFile('day17Input.txt', runFunctions);