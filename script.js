
kaplay();

loadSprite("snake", "https://play.kaplayjs.com/sprites/bean.png");
loadSprite("food", "https://play.kaplayjs.com/sprites/apple.png");
loadSprite("background", "https://i.imgur.com/mmrRkMe.jpeg");

add([
    sprite("background"), 
    pos(-40, -200),              
    fixed()              
]);

const vec = (x, y) => ({ x, y, eq: function (v) { return this.x === v.x && this.y === v.y }, clone: function () { return vec(this.x, this.y) }, add: function(v) { return vec(this.x + v.x, this.y + v.y) }, scale: function(n) { return vec(this.x * n, this.y * n) } });
const cellSize = 20;
const gridWidth = 15;
const gridHeight = 15;
let direction = vec2(1, 0); // parte andando a destra
let snake = [];
let food;
let moveTimer = 0;
let moveInterval = 0.2;
let gameOver = false;

// inizializza il serpente
function initSnake() {
    snake.forEach(s => destroy(s));
    snake = [];

    const start = vec2(5, 7);
    const head = add([
        sprite("snake"),
        pos(start.scale(cellSize)),
        area(),
        "snakePart",
        { dir: direction, gridPos: start.clone() }
    ]);
    snake.push(head);
}
initSnake();

function spawnFood() {
    if (food) destroy(food);

    const posX = Math.floor(rand(0, gridWidth));
    const posY = Math.floor(rand(0, gridHeight));
    
    // evita che il cibo appaia sulla testa
    if (snake.some(s => s.gridPos.eq(vec2(posX, posY)))) return spawnFood();

    food = add([
        sprite("food"),
        pos(vec2(posX, posY).scale(cellSize)),
        area(),
        "food",
        { gridPos: vec2(posX, posY) }
    ]);
}
spawnFood();

onKeyPress("up", () => {
    if (direction.y !== 1) direction = vec2(0, -1);
});
onKeyPress("down", () => {
    if (direction.y !== -1) direction = vec2(0, 1);
});
onKeyPress("left", () => {
    if (direction.x !== 1) direction = vec2(-1, 0);
});
onKeyPress("right", () => {
    if (direction.x !== -1) direction = vec2(1, 0);
});

function moveSnake() {
    const head = snake[0];
    const newHeadPos = head.gridPos.add(direction);

    // check collisione muri o se stesso
    if (
        newHeadPos.x < 0 || newHeadPos.x >= gridWidth ||
        newHeadPos.y < 0 || newHeadPos.y >= gridHeight ||
        snake.some(s => s.gridPos.eq(newHeadPos))
    ) {
        return gameOverScreen();
    }

    const newHead = add([
        sprite("snake"),
        pos(newHeadPos.scale(cellSize)),
        area(),
        "snakePart",
        { dir: direction, gridPos: newHeadPos.clone() }
    ]);

    snake.unshift(newHead);

    if (food && newHeadPos.eq(food.gridPos)) {
        destroy(food);
        spawnFood();
    } else {
        const tail = snake.pop();
        destroy(tail);
    }
}

function gameOverScreen() {
    gameOver = true;

    add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0, 0.7),
        fixed()
    ]);

    add([
        text("Game Over\nPremi R per riprovare", { size: 24 }),
        pos(center()),
        anchor("center"),
        fixed()
    ]);
}

onKeyPress("r", () => {
    if (gameOver) {
        gameOver = false;
        initSnake();
        spawnFood();
    }
});

onUpdate((dt) => {
    if (gameOver) return;

    moveTimer += dt;
    if (moveTimer >= moveInterval) {
        moveTimer = 0;
        moveSnake(); // This function already handles movement
    }
});