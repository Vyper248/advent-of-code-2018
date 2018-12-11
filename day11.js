const runFunctions = () => {
    let input = 8868;
    // input = 18;//test
    first(input);
    second(input);
}

const first = (input) => {   
    const grid = getGrid(input);
    
    let highest = 0;
    let highX = 0;
    let highY = 0;
    for (let x = 0; x < 298; x++){
        for (let y = 0; y < 298; y++){
            const total = getTotal(grid, x, y);
            if (total > highest) {
                highest = total;
                highX = x+1;
                highY = y+1;
            }
        }
    }
    
    console.log('First Star: ', highX + ',' + highY);
};

const second = (input) => {
    const grid = getGrid(input);
        
    let highest = 0;
    let highX = 0;
    let highY = 0;
    let highSize = 0;
    for (let x = 0; x < 299; x++){
        for (let y = 0; y < 299; y++){
            const minSize = getMinSize(x,y);
            for (let size = 1; size <= minSize; size++){
                const total = getTotal(grid, x, y, size);
                if (total > highest) {
                    highest = total;
                    highX = x+1;
                    highY = y+1;
                    highSize = size;
                }
            }
        }
    }
    
    console.log('Second Star: ', highX + ',' + highY + ',' + highSize);
};

const getGrid = (input) => {
    const grid = [];
    for (let x = 0; x < 300; x++){
        for (y = 0; y < 300; y++){
            const power = getPower(x+1,y+1,input);
            addPower(grid, x, y, power);
        }
    }
    return grid;
};

const getMinSize = (x,y) => {
    let min = 15; //set to 299 to test full range, or set low and increment by 5 each test and see when result stops changing (which then may or may not be correct)
    if (299-x < min) min = 299-x;
    if (299-y < min) min = 299-y;
    return min;
}

const getTotal = (grid, x, y, size=3) => {
    let total = 0;
    for (let i = x; i < x+size; i++){
        for (let j = y; j < y+size; j++){
            total += grid[i][j];
        }
    }
    return total;
};

const getPower = (x,y,serial) => {
    const rackID = x+10;
    let power = rackID * y;
    power += serial;
    power *= rackID;
    power = getHundreds(power);
    power -= 5;
    return power;
};

const getHundreds = (n) => {
    if (n < 100) return 0;
    return parseInt(n.toString().substr(-3, 1));
};

const addPower = (grid, x, y, power) => {
    if (!grid[x]) grid[x] = [];
    grid[x][y] = power;
};

runFunctions();