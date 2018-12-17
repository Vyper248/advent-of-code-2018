const SPEED = 30;
let LOWX, HIGHX;

const runFunctions = (input) => {
    first(input);
}

const first = (input) => {   
    const [grid, lowX, highX, lowY, highY] = getGrid(input);
    LOWX = lowX;
    HIGHX = highX;
    
    flow(grid, lowX, highX, highY, 500, 0);
};

const flow = (grid, lowX, highX, highY, x, y) => {
    let bottom = findClay(grid, x, y, highY);

    fall(grid, x, y, bottom).then(()=>{//let water fall down to bottom position
        if (grid[x][bottom+1] === '|') return; //if hitting water, then fall to it and stop (will merge with it) 
        if (bottom === highY) return; //if hitting bottom of grid, stop
        
        fillArea(grid, bottom, x).then(({spreadFrom, spreadTo, bottom})=>{
            //spread water
            fillWith(grid, bottom, spreadFrom, spreadTo, '|');
            updateHtmlGrid(grid, bottom);
            
            //using end positions of spread, begin flow again
            if (grid[spreadFrom][bottom+1] === '.') flow(grid, lowX, highX, highY, spreadFrom, bottom);
            if (grid[spreadTo][bottom+1] === '.') flow(grid, lowX, highX, highY, spreadTo, bottom);
        });
    });
};

const fillArea = (grid, bottom, x) => {
    return new Promise((resolve, reject) => {
        //while within a contained area, fill with water, otherwise get positions to spread to
        let spreadFrom, spreadTo;
        let timer = setInterval(()=>{
            let [canFill, from, to] = checkContained(LOWX, HIGHX, grid, x, bottom);
            if (canFill){
                fillWith(grid, bottom, from, to, '~');
                updateHtmlGrid(grid, bottom);
                bottom--;
            } else {
                spreadFrom = from;
                spreadTo = to;
                clearInterval(timer);
                resolve({spreadFrom, spreadTo, bottom});
            }
        }, SPEED);
    });
}

const fall = (grid, x, from, to) => {
    return new Promise((resolve, reject) => {
        let y = from;
        let timer = setInterval(()=>{
            if (y <= to){
                grid[x][y] = '|';
                updateHtmlGrid(grid, y);
                y++;
            } else {
                clearInterval(timer);
                resolve();
            }
        }, SPEED);
    });
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
    
    createHtmlGrid(grid, lowX, highX);
    
    return [grid, lowX, highX, lowY, highY];
};

const createHtmlGrid = (grid, lowX, highX) => {
    let max = grid[lowX].length;
    let displayGrid = document.querySelector('.grid');
    for (let y = 0; y < max; y++){
        let str = '';
        for (let x = lowX-1; x < highX+2; x++){
            if (grid[x][y] === '~' || grid[x][y] === '|') str += '<span class="water">&nbsp;</span>';
            else if (grid[x][y] === '#') str += '<span class="clay">&nbsp;</span>';
            else str += '&nbsp;';
        }
        
        let newDiv = document.createElement('div');
        newDiv.innerHTML = str;
        newDiv.setAttribute('id', 'row'+y);
        newDiv.classList.add('row');
        displayGrid.appendChild(newDiv);
    }    
}

const updateHtmlGrid = (grid, y) => {
    let str = '';
    for (let x = LOWX-1; x < HIGHX+2; x++){
        if (grid[x][y] === '~' || grid[x][y] === '|') str += '<span class="water">&nbsp;</span>';
        else if (grid[x][y] === '#') str += '<span class="clay">&nbsp;</span>';
        else str += '&nbsp;';
    }
    let div = document.querySelector('#row'+y);
    div.innerHTML = str;
}

const compareValues = (a, lowA, highA, from, to, lowB, highB) => {
    if (a > highA) highA = a;
    if (a < lowA) lowA = a;
    if (from < lowB) lowB = from;
    if (to > highB) highB = to;
    return [lowA, highA, lowB, highB];
}

fetch('day17Input.txt').then(resp => resp.text()).then(data => {
    runFunctions(data);
});