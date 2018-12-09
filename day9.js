const readFile = require('./readFile').readFile;

const runFunctions = () => {
    input = {players: 468, marbles: 71010};
    both(input, 'First Star: ');
    input = {players: 468, marbles: 7101000};
    both(input, 'Second Star: ');
}

const both = (input, star) => {
    let currentPlayer = 0;
    let board = [{n:0, prev:0, next:0, i:0}];
    let currentNode = board[0];
    let {marbles, players} = input;
    let scores = [];
    
    for (let i = 1; i <= marbles; i++){
        if (i % 23 === 0){
            scores[currentPlayer] ? scores[currentPlayer] += i : scores[currentPlayer] = i;
            currentNode = goBack(currentNode, board, 7);
            scores[currentPlayer] += currentNode.n;
            currentNode = remove(board, currentNode);
        } else {
            let nextNode = next(currentNode, board);
            currentNode = insertAfter(board, nextNode, i);
        }
        currentPlayer = (currentPlayer+1) % players;
    }
    
    let highScore = scores.reduce((a,c) => {
        if (c > a) a = c;
        return a;
    }, 0);
    
    console.log(star, highScore);
};

const insertAfter = (board, node, marble) => {
    let index = board.length;
    let newNode = {n:marble, prev:node.i, next:node.next, i:index};
    board.push(newNode);
    board[node.next].prev = index;
    node.next = index;
    return newNode;
}

const remove =(board, node) => {
    board[node.prev].next = board[node.next].i;
    board[node.next].prev = board[node.prev].i;
    return board[node.next];
}

const next = (node, board) => {
    return board[node.next];
}

const prev = (node, board) => {
    return board[node.prev];
}

const goBack = (node, board, n) => {
    for (let i = 0; i < n; i++){
        node = prev(node, board);
    }
    return node;
}

runFunctions();