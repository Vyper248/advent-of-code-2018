const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    const numbers = input.split(' ').map(Number); 
    const tree = buildTree(numbers);
    let sum = Object.values(tree)
        .map(obj => obj.metaData.reduce((a,c) => a+=c, 0))
        .reduce((a,c) => a+=c, 0);
    
    console.log('First Star: ', sum);
};

const second = (input) => {
    const numbers = input.split(' ').map(Number);
    const tree = buildTree(numbers);
    const values = [];
    getValue(tree, 0, values);
    const value = values.reduce((a,c) => a+=c, 0);
    
    console.log('Second Star: ', value);
};

const getValue = (tree, position, values) => {
    let value = 0;
    const node = tree[position];
    if (node.qty === 0){
        value += node.metaData.reduce((a,c) => a+=c, 0);
    } else {
        node.metaData.forEach(pos => {
            let childPos = node.children[pos-1];
            if (childPos) getValue(tree, childPos, values);
        });
    }
    values.push(value);
}

const buildTree = (arr) => {
    const tree = {};
    addDataToTree(arr, 0, tree);
    return tree;
}

const addDataToTree = (arr, position, tree) => {
    let qty = arr[position];
    let meta = arr[position+1];
    let obj = {qty, meta, metaData: [], lengths: [], children: []};
    
    let currentPos = position+2;
    
    //add children and lengths to obj
    for (let i = 0; i < qty; i++){
        obj.children.push(currentPos);
        let length = addDataToTree(arr, currentPos, tree);
        obj.lengths.push(length);
        currentPos += length;
    }
    
    //add metadata to object
    for (let i = 0; i < meta; i++){
        obj.metaData.push(arr[currentPos+i]);
    }
    
    currentPos += meta;
    tree[position] = obj;

    return currentPos - position;
}

readFile('day8Input.txt', runFunctions);