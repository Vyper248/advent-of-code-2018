const readFile = require('./readFile').readFile;

const first = (input) => {   
    let coords = input.split('\n').map(line => line.split(',').map(Number));
    let constellations = [];
    
    coords.forEach(coord => {
        let connected = [];
        for (constellation of constellations){
            for (coordb of constellation){
                if (d(coord, coordb) <= 3){
                    constellation.push(coord);
                    connected.push(constellation);
                    break;
                }
            }
        }
        if (connected.length === 0){
            constellations.push([coord]);
        } else if (connected.length >= 2){
            let merged = [];
            for (constellation of connected) {
                merged.push(...constellation);
                let index = constellations.indexOf(constellation);
                constellations.splice(index, 1);
            }
            constellations.push(merged);
        }
    });
    
    console.log('First Star: ', constellations.length);
};

const d = (a,b) => {
    return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]) + Math.abs(a[3]-b[3]);
};

readFile('day25Input.txt', first);