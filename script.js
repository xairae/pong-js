kaplay({
    width: 800,
    height: 600,
    background: [51, 18, 48],
});

const leftPaddle = add([
    pos(40, 0),
    rect(20, 80),
    outline(4, rgb(255, 255, 255)),
    anchor("center"),
    area(),
    color([0, 0, 0]),
    "paddle",
]);

const rightPaddle = add([
    pos(width() - 40, 0),
    rect(20, 80),
    outline(4),
    anchor("center"),
    area(),
    "paddle",
]);

let speedAI = 4;
const aiAccuracy = 0.80; // 50% chance to move towards the ball

// move paddles with mouse
onUpdate(() => {
    leftPaddle.pos.y = mousePos().y;
});

let score = 0;

add([
    text(score.toString()),
    pos(width() / 2, 40),
    anchor("center"),
    z(0),
    {
        update() {
            this.text = score.toString();
        },
    },
]);

let speed = 480;

const ball = add([
    pos(center()),
    circle(16),
    outline(4),
    area({ shape: new Rect(vec2(-16), 32, 32) }),
    { vel: Vec2.fromAngle(rand(-20, 20)) },
]);

ball.onUpdate(() => {
    ball.move(ball.vel.scale(speed));

    if (ball.pos.x < 0) {
        score = 0;
        ball.pos = center();
        ball.vel = Vec2.fromAngle(rand(-20, 20));
        speed = 320;
    }

    if (ball.pos.x > width()) {
        score++;
        ball.pos = center();
        ball.vel = Vec2.fromAngle(rand(-20, 20));
        speed = 320;
    }

    if (ball.pos.y < 0 || ball.pos.y > height()) {
        ball.vel.y = -ball.vel.y;
    }

    if (Math.random() < aiAccuracy) {
        if (rightPaddle.pos.y < ball.pos.y) {
            rightPaddle.pos.y += speedAI;  // Move down
        }
        if (rightPaddle.pos.y > ball.pos.y) {
            rightPaddle.pos.y -= speedAI;  // Move up
        }
    }
    else {
        const randomMove = Math.random() < 0.5 ? 1 : -1;  // Move randomly up or down
        rightPaddle.pos.y += speedAI * randomMove;
    }

});

ball.onCollide("paddle", (p) => {
    speed += 30;
    speedAI += 0.5;
    ball.vel = Vec2.fromAngle(ball.pos.angle(p.pos));
});
