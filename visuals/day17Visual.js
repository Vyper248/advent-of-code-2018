const SPEED = 30;
const SPEED_MULT = 2;
let LOWX, HIGHX;
const SIZE = 5;
let startPoint = 500;
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.fillStyle = "#000000";

const runFunctions = (input) => {
    first(input);
}

const first = (input) => {   
    const [grid, lowX, highX, lowY, highY] = getGrid(input);
    
    
    flow(grid, lowX, highX, highY, startPoint, 0);
};

const flow = (grid, lowX, highX, highY, x, y) => {
    if (x > highX || x < lowX) return;
    
    let bottom = findClay(grid, x, y, highY);

    fall(grid, x, y, bottom).then(()=>{//let water fall down to bottom position
        if (grid[x][bottom+1] === '|') return; //if hitting water, then fall to it and stop (will merge with it) 
        if (bottom === highY) return; //if hitting bottom of grid, stop
        
        fillArea(grid, bottom, x).then(({spreadFrom, spreadTo, bottom})=>{
            //spread water
            fillWith(grid, bottom, spreadFrom, spreadTo, '|');
            
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
            for (let i = 0; i < SPEED_MULT; i++){
                let [canFill, from, to] = checkContained(LOWX, HIGHX, grid, x, bottom);
                if (canFill){
                    fillWith(grid, bottom, from, to, '~');
                    bottom--;
                } else {
                    spreadFrom = from;
                    spreadTo = to;
                    clearInterval(timer);
                    resolve({spreadFrom, spreadTo, bottom});
                }
            }
        }, SPEED);
    });
}

const fall = (grid, x, from, to) => {
    return new Promise((resolve, reject) => {
        let y = from;
        let timer = setInterval(()=>{
            for (let i = 0; i < SPEED_MULT; i++){
                if (y <= to){
                    grid[x][y] = '|';
                    ctx.fillRect((x-LOWX)*SIZE,y*SIZE,SIZE,SIZE);
                    y++;
                } else {
                    clearInterval(timer);
                    resolve();
                }
            }
        }, SPEED);
    });
};

const fillWith = (grid, y, from, to, str) => {
    for (let x = from; x <= to; x++){
        grid[x][y] = str;
        ctx.fillRect((x-LOWX)*SIZE,y*SIZE,SIZE,SIZE);
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
    
    LOWX = lowX;
    HIGHX = highX;
    
    createHtmlGrid(grid, lowX, highX, lowY, highY);
    
    return [grid, lowX, highX, lowY, highY];
};

const createHtmlGrid = (grid, lowX, highX, lowY, highY) => {
    let max = grid[lowX].length;
    c.width = (highX-lowX+1)*SIZE;
    c.height = (highY+1)*SIZE;
    ctx.fillStyle = "#555555";
    
    for (let y = 0; y < max; y++){
        for (let x = lowX-1; x < highX+2; x++){
            if (grid[x][y] === '#') ctx.fillRect((x-LOWX)*SIZE,y*SIZE,SIZE,SIZE);
        }
    } 
    
    ctx.fillStyle = "#aaeaff";
}

const compareValues = (a, lowA, highA, from, to, lowB, highB) => {
    if (a > highA) highA = a;
    if (a < lowA) lowA = a;
    if (from < lowB) lowB = from;
    if (to > highB) highB = to;
    return [lowA, highA, lowB, highB];
}

document.querySelector('body').addEventListener('click', (e)=>{
    let gridWidth = parseInt(window.getComputedStyle(c).width);
    let offset = (window.innerWidth - gridWidth)/2;
    let clickX = e.clientX - offset;
    let percentage = clickX / gridWidth;
    let pos = Math.round((percentage*(HIGHX-LOWX))+LOWX);
    window.location.replace('day17Visual.html?x='+pos);
});

fetch('../day17Input.txt').then(resp => resp.text()).then(data => {
    var url = new URL(window.location.href);
    var x = Number(url.searchParams.get("x"));
    if (x) startPoint = x;
    runFunctions(data);
});