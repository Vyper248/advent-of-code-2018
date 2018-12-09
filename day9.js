const readFile = require('./readFile').readFile;

const runFunctions = () => {
    input = {players: 468, marbles: 71010};
    both(input, 'First Star: ');
    input = {players: 468, marbles: 7101000};
    both(input, 'Second Star: ');
}

const both = (input, star) => {
    let currentPlayer = 0;
    let currentNode = {n:0, prev:null, next:null};
    currentNode.prev = currentNode;
    currentNode.next = currentNode;
    let {marbles, players} = input;
    let scores = [];
    
    for (let i = 1; i <= marbles; i++){
        if (i % 23 === 0){
            scores[currentPlayer] ? scores[currentPlayer] += i : scores[currentPlayer] = i;
            currentNode = goBack(currentNode, 7);
            scores[currentPlayer] += currentNode.n;
            currentNode = remove(currentNode);
        } else {
            let nextNode = currentNode.next;
            currentNode = insertAfter(nextNode, i);
        }
        currentPlayer = (currentPlayer+1) % players;
    }
    
    let highScore = scores.reduce((a,c) => {
        if (c > a) a = c;
        return a;
    }, 0);
    
    console.log(star, highScore);
};

const insertAfter = (node, marble) => {
    let newNode = {n:marble, prev:node, next:node.next};
    node.next.prev = newNode;
    node.next = newNode;
    return newNode;
}

const remove =(node) => {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    return node.next;
}

const goBack = (node, n) => {
    for (let i = 0; i < n; i++){
        node = node.prev;
    }
    return node;
}

runFunctions();