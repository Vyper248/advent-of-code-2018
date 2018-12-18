const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let grid = getGrid(input);
    for (let i = 0; i < 10; i++){
        grid = iterate(grid);
    }
    
    console.log('First Star: ', resources(grid));
};

const second = (input) => {
    let grid = getGrid(input);
    let gridStates = [];
    let total = 1000000000;
    for (let i = 0; i < total; i++){
        grid = iterate(grid);
        const state = curState(grid);
        if (gridStates.includes(state)) {
            let diff = i - gridStates.indexOf(state);
            i += diff * Math.floor((total - i) / diff);
        } else {
            gridStates.push(state);
        }
    }

    console.log('Second Star: ', resources(grid));
};

const curState = (grid) => {
    return grid.map(row => row.join('')).join('');
};

const resources = (grid) => {
    let state = curState(grid);
    let trees = state.match(/\|/g).length;
    let lumberyards = state.match(/#/g).length;
    return trees * lumberyards;
};

const iterate = (grid) => {
    let newGrid = grid.map((row,y) => {
        let newRow = row.map((acre,x) => {
            return checkAcre(acre, x, y, grid);
        });
        return newRow;
    });
    return newGrid;
};

const checkAcre = (acre, x, y, grid) => {
    switch (acre) {
        case '.': if (checkFor(grid, x, y, '|', 3)) return '|'; break;
        case '|': if (checkFor(grid, x, y, '#', 3)) return '#'; break;
        case '#': return checkFor(grid, x, y, '#', 1, '|', 1) ? '#' : '.'; break;
    }
    return acre;
};

const checkFor = (grid, x, y, str, a1, str2, a2) => {
    let qty1 = 0;
    let qty2 = 0;
    for (let i = x-1; i <= x+1; i++){
        for (let j = y-1; j <= y+1; j++){
            if (i === x && j === y) continue;
            if (grid[j] === undefined) continue;
            if (grid[j][i] === str) qty1++;
            if (grid[j][i] === str2) qty2++;
            if (!str2 && qty1 >= a1) return true;
            if (str2 && (qty1 >= a1 && qty2 >= a2)) return true;
        }
    }
    return false;
};

const getGrid = (input) => {
    let grid = input.split('\n').map(line => line.split(''));
    return grid;
}

readFile('day18Input.txt', runFunctions);