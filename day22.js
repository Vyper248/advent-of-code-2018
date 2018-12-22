
const runFunctions = () => {
    let input = '3339-10,715';
    first(input);
    second(input);
}

//7915
const first = (input) => {   
    const grid = getGrid(input);
    
    const risk = grid.reduce((a,c) => {
        return a += c.reduce((a,c) => a += c, 0);
    },0);
    console.log('First Star: ', risk);
};

//980
const second = (input) => {
    let grid = getGrid(input, 2.5);
    grid = grid.map((row,y) => row.map((p,x) => {
        if (p === 0) return '.';
        if (p === 1) return '=';
        if (p === 2) return '|';
        return p;
    }));
    const target = input.split('-')[1];

    let endNode = pathfind(grid, target);
    if (!endNode) return;
    
    console.log('Second Star: ', endNode.gScore);
};

const pathfind = (grid, target) => {
    let nodes = [{pos: '0,0', gScore: 0, prev: null, tool: 'T'}];
    let checked = {'0,0T': nodes[0]};
    
    let endNode = {gScore: Infinity};
    
    while (nodes.length > 0){
        nodes = nodes.sort((a,b) => a.gScore - b.gScore);

        let currentNode = nodes.shift();
        
        if (currentNode.pos === target){
            if (currentNode.gScore < endNode.gScore){
                endNode = currentNode;
            }
            continue;
        }
        
        let adjacent = getAdjacent(grid, currentNode);

        for (pos of adjacent) {
            let [time, tool] = getTimeAndTool(grid, currentNode.pos, pos, currentNode.tool, target);
            let tentative_gScore = currentNode.gScore + time;
            let node = checked[pos+tool] ? checked[pos+tool] : createNode(pos);
            
            if (tentative_gScore > endNode.gScore) continue;
                        
            if (!checked[pos+tool]) {
                checked[pos+tool] = node;
                node.tool = tool;
            }
            
            if (tentative_gScore < node.gScore){
                node.gScore = tentative_gScore;
                node.prev = currentNode;
                node.tool = tool;
                nodes.push(node);
            }
        }
    }
    
    return endNode;
};

const commonTool = (a, b) => {
    let common = [];
    a.forEach(tool => {
        if (b.includes(tool)) common.push(tool);
    });
    return common;
}

const getTimeAndTool = (grid, from, to, tool, target) => {
    let [x1,y1] = arr(from);
    let [x2,y2] = arr(to);
    let [tx,ty] = arr(target);
    let a = grid[y1][x1];
    let b = grid[y2][x2];
    
    let allowed = {
        '.': ['C', 'T'],
        '=': ['C', 'N'],
        '|': ['T', 'N']
    }
        
    let nextTools = commonTool(allowed[a], allowed[b]);
    if (x2 === tx && y2 === ty){
        if (nextTools.includes(tool) && tool === 'T') return [1, 'T'];
        if (nextTools.includes(tool) && tool !== 'T') return [8, 'T'];
        else return [15, 'T'];
    }
    if (!nextTools.includes(tool)) return [8, nextTools[0]];
    else return [1, tool];
};

const getAdjacent = (grid, {pos}) => {
    let [x,y] = arr(pos);
    let adjacent = [];
    if (grid[y] && grid[y][x+1]) adjacent.push((x+1)+','+y);
    if (grid[y] && grid[y][x-1]) adjacent.push((x-1)+','+y);
    if (grid[y+1] && grid[y+1][x]) adjacent.push(x+','+(y+1));
    if (grid[y-1] && grid[y-1][x]) adjacent.push(x+','+(y-1));
    return adjacent;
};

const createNode = (pos) => {
    return {pos, gScore:Infinity, prev: null, tool: ''};
};

const costEstimate = (pos, target) => {
    let start = arr(pos);
    let end = arr(target);
    let distance = Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);
    return distance;
};

const arr = (pos) => {
    return pos.split(',').map(Number);
};

const getGrid = (input, mult=1) => {
    const depth = Number(input.split('-')[0]);
    const target = input.split('-')[1].split(',').map(Number);
    const erosion = [];
    const typeGrid = [];
    
    for (let x = 0; x <= target[0]*mult; x++){
        for (let y = 0; y <= target[1]*mult; y++){
            const erosionLevel = getErosionLevel(erosion, x, y, depth, target);
            add(erosion, x, y, erosionLevel);
            const type = erosionLevel % 3;
            add(typeGrid, x, y, type);
        }
    }
    
    return typeGrid;
};

const add = (grid, x, y, val) => {
    if (!grid[y]) grid[y] = [];
    grid[y][x] = val;
};

const getErosionLevel = (erosion, x, y, depth, target) => {
    return (getGeoIndex(erosion, x,y,depth,target) + depth)%20183;
};

const getGeoIndex = (erosion, x, y, depth, target) => {
    if (x === 0 && y === 0) return 0;
    if (x === target[0] && y === target[1]) return 0;
    if (y === 0) return x * 16807;
    if (x === 0) return y * 48271;
    return erosion[y][x-1] * erosion[y-1][x];
};

runFunctions();