const readFile = require('./readFile').readFile;

const runFunctions = (input) => {
    first(input);
    second(input);
}

const first = (input) => {   
    let [carts, grid] = getCartsAndGrid(input);

    let collided = false;
    while (collided === false) {
        carts = sortCarts(carts);
        for (cart of carts) {
            checkDirectionAndMove(cart, grid);
            collided = checkCollisions(carts, grid);
            if (collided) {
                console.log('First Star: ', cart.x+','+cart.y); 
                break;
            }
        }
    }
};

const second = (input) => {
    let [carts, grid] = getCartsAndGrid(input);
    
    while (carts.length > 1) {
        for (cart of carts) {
            checkDirectionAndMove(cart, grid);
            checkCollisions(carts, grid);
        }
        carts = removeCollided(carts);
        carts = sortCarts(carts);
    }
    
    console.log('Second Star: ', carts[0].x+','+carts[0].y);
};

const removeCollided = (carts) => {
    carts = carts.filter(cart => cart.collided === false);
    return carts;
};

const getCartsAndGrid = (input) => {
    let carts = [];
    
    let grid = input.split('\n').map((row,y) => row.split('').map((section,x) => {
        let newCart = {x, y, direction:'', next:'l', collided:false};
        if (section === 'v') {newCart.direction = 'd'; carts.push(newCart); return '|'}
        if (section === '^') {newCart.direction = 'u'; carts.push(newCart); return '|'}
        if (section === '<') {newCart.direction = 'l'; carts.push(newCart); return '-'}
        if (section === '>') {newCart.direction = 'r'; carts.push(newCart); return '-'}
        return section;
    }));
    return [carts, grid];
};

const sortCarts = (carts) => {
    carts = carts.sort((a,b) => {
        if (a.y < b.y) return -1;
        if (a.y === b.y) return a.x - b.x;
        if (a.y > b.y) return 1;
    });
    return carts;
};

const checkCollisions = (carts, grid) => {
    let hasCollided = false;
    
    carts.forEach(cartA => {
        if (cartA.collided) return;
        carts.forEach(cartB => {
            if (cartB.collided) return;
            if (cartA === cartB) return;
            if (cartA.x === cartB.x && cartA.y === cartB.y){
                cartA.collided = true;
                cartB.collided = true;
                hasCollided = true;
            }
        });
    });
    
    return hasCollided;
}

const checkDirectionAndMove = (cart, grid) => {
    if (cart.collided) return;
    
    if (cart.direction === 'r'){
        let nextGrid = grid[cart.y][cart.x+1];
        cart.x++;
        setDirection(cart, nextGrid, 'd', 'u', 'u', 'd');
    }
    else if (cart.direction === 'l'){
        let nextGrid = grid[cart.y][cart.x-1];
        cart.x--;
        setDirection(cart, nextGrid, 'u', 'd', 'd', 'u');
    }
    else if (cart.direction === 'u'){
        let nextGrid = grid[cart.y-1][cart.x];
        cart.y--;
        setDirection(cart, nextGrid, 'l', 'r', 'l', 'r');
    }
    else if (cart.direction === 'd'){
        let nextGrid = grid[cart.y+1][cart.x];
        cart.y++;
        setDirection(cart, nextGrid, 'r', 'l', 'r', 'l');
    }
}

const setDirection = (cart, nextGrid, a, b, c, d) => {
    if (nextGrid === '\\') cart.direction = a;
    else if (nextGrid === '/') cart.direction = b;
    else if (nextGrid === '+') {
        if (cart.next === 'l') cart.direction = c;
        else if (cart.next === 'r') cart.direction = d;
        setNext(cart);
    }
}

const setNext = (cart) => {
    if (cart.next === 'l') cart.next = 's';
    else if (cart.next === 'r') cart.next = 'l';
    else if (cart.next === 's') cart.next = 'r';
}

readFile('day13Input.txt', runFunctions);