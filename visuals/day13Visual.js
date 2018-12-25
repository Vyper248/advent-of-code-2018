let c = document.getElementById("track");
let ctx = c.getContext("2d");
ctx.fillStyle = "#000000";

let c2 = document.getElementById("carts");
let ctx2 = c2.getContext("2d");
ctx2.fillStyle = "#000000";

const SIZE = 6;
const SPEED_MULT = 10;
let WIDTH = 900;
let HEIGHT = 900;

const second = (input) => {
    let [carts, grid] = getCartsAndGrid(input);
    
    setGridSize(grid);

    displayGrid(grid);
    ctx2.fillStyle = '#000000';
    ctx.fillStyle = '#FF0000';
    showCarts(carts);
    
    let timer = setInterval(() => {
        if (carts.length <= 1){
            clearInterval(timer);
            return;
        }
        
        for (cart of carts) {
            checkDirectionAndMove(cart, grid);
            checkCollisions(carts, grid);
        }
        carts = removeCollided(carts);
        carts = sortCarts(carts);
        showCarts(carts);
    });
};

const setGridSize = (grid) => {
    WIDTH = grid[0].length * SIZE;
    HEIGHT = grid.length * SIZE;
    
    c.width = WIDTH;
    c.height = HEIGHT;
    c.fillStyle = '#000000';
    
    c2.width = WIDTH;
    c2.height = HEIGHT;
    c2.fillStyle = '#000000';
};

const displayGrid = (grid, carts) => {
    grid.forEach((row,y) => {
        row.forEach((point, x) => {
            addPoint(grid,x,y,point);
        });
    });
};

const showCarts = (carts) => {
    ctx2.clearRect(0,0,WIDTH,HEIGHT);
    carts.forEach(cart => {
        addCart(cart.x, cart.y);
    });
};

const addCollision = (x,y) => {
    ctx.fillRect((x*SIZE), (y*SIZE), SIZE, SIZE);
};

const addCart = (x,y) => {
    ctx2.fillRect((x*SIZE), (y*SIZE), SIZE, SIZE);
};

const addPoint = (grid,x,y,type) => {
    if (type === '-') ctx.fillRect((x*SIZE), (y*SIZE)+(SIZE/2), SIZE, 1);
    else if (type === '|') ctx.fillRect((x*SIZE)+(SIZE/2), (y*SIZE), 1, SIZE);
    else if (type === '\\') {
        if (grid[y-1] && (grid[y-1][x] === '|' || grid[y-1][x] === '+')){
            ctx.fillRect((x*SIZE)+(SIZE/2), (y*SIZE)+(SIZE/2), SIZE/2, 1);
            ctx.fillRect((x*SIZE)+(SIZE/2), (y*SIZE), 1, SIZE/2);
        } else {
            ctx.fillRect((x*SIZE), (y*SIZE)+(SIZE/2), SIZE/2, 1);
            ctx.fillRect((x*SIZE)+(SIZE/2), (y*SIZE)+(SIZE/2), 1, SIZE/2);
        }
    }
    else if (type === '/') {
        if (grid[y-1] && (grid[y-1][x] === '|' || grid[y-1][x] === '+')){
            ctx.fillRect((x*SIZE), (y*SIZE)+(SIZE/2), SIZE/2, 1);
            ctx.fillRect((x*SIZE)+(SIZE/2), (y*SIZE), 1, SIZE/2);
        } else {
            ctx.fillRect((x*SIZE)+(SIZE/2), (y*SIZE)+(SIZE/2), SIZE, 1);
            ctx.fillRect((x*SIZE)+(SIZE/2), (y*SIZE)+(SIZE/2), 1, SIZE/2);
        }
    } else if (type === '+') {
        ctx.fillRect((x*SIZE), (y*SIZE)+(SIZE/2), SIZE, 1);
        ctx.fillRect((x*SIZE)+(SIZE/2), (y*SIZE), 1, SIZE);
    }
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
                addCollision(cartA.x, cartA.y);
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

fetch('../day13Input.txt').then(resp => resp.text()).then(data => {
    second(data);
});