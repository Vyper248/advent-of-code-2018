const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

//341
const first = (input) => {   
    const list = getList(input);

    let largestR = list.reduce((a,c) => {
        if (c[3] > a[3]) a = c;
        return a;
    }, [0,0,0,0]);
    
    let inRange = getInRange(list, largestR);
    
    console.log('First Star: ', inRange);
};

//105191907
const second = (input) => {
    let div = 10000000;
    let pointToSearch = [0,0,0];
    let area = 15;
    
    //Narrow down based on different zoom levels
    while (div >= 1){
        let list = getList(input);
        list = list.map(node => node.map(v => v/div));
                
        let highestRange = 0;
        let smallestDist = Infinity;
        let point;
        for (let x = pointToSearch[0]-area; x < pointToSearch[0]+area; x++){
            for (let y = pointToSearch[1]-area; y < pointToSearch[1]+area; y++){
                for (let z = pointToSearch[2]-area; z < pointToSearch[2]+area; z++){
                    if (dist([x,y,z],pointToSearch) > 35) continue;
                    let range = getInRange(list, [x,y,z,0], true);
                    let distance = dist([x,y,z],[0,0,0]);
                    if (range > highestRange || (range === highestRange && dist([x,y,z],[0,0,0]) < smallestDist)) {
                        highestRange = range;
                        smallestDist = distance;
                        point = [x,y,z];
                    }
                }
            }
        }
        
        if (div === 1){
            console.log('Second Star:', smallestDist);
            break;
        } else {
            div /= 10;
            pointToSearch = point.map(v => v*10);
        }
    }
};

const dist = (a,b) => {
    return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]);
};

const getInRange = (list, node, invert=false) => {
    let inRange = 0;
    let inNodeRange = 0;
    list.forEach(n => {
        let d = dist(n,node);
        if (d <= node[3]) inRange++;
        if (d <= n[3]) inNodeRange++;
    });
    return invert ? inNodeRange : inRange;
};

const getList = (input) => {
    return input.split('\n').map(line => line.match(/[-0-9]+/g).map(Number));
};

readFile('day23Input.txt', runFunctions);