const first = (input) => {   
    let grid = getGrid(input);
    setInterval(()=>{
        grid = iterate(grid);
        updateHtmlGrid(grid);
    }, 45);
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
    
    let gridDiv = document.querySelector('#grid');
    grid.forEach((row,y) => {
        let str = row.join('');
        let newDiv = document.createElement('div');
        newDiv.innerHTML = str;
        newDiv.setAttribute('id', 'row'+y);
        newDiv.classList.add('row');
        gridDiv.appendChild(newDiv);
    });
    
    return grid;
}

const updateHtmlGrid = (grid) => {
    grid.forEach((row,y) => {
        let str = row.map(acre => {
            if (acre === '.') return '.';
            if (acre === '#') return '<span class="lumber">#</span>';
            if (acre === '|') return '<span class="tree">|</span>';
        }).join('');
        let newDiv = document.querySelector('#row'+y);
        newDiv.innerHTML = str;
    });
};

fetch('../day18Input.txt').then(resp => resp.text()).then(data => {
    first(data);
});