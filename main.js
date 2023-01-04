
const box = { x: 0, y: 0, x1: window.innerWidth, y1: window.innerHeight }
const DEF_BALL_RELEASED = 0
const DEF_BALL_CAPTURED = 1

let balls = []
let compared = []
let logs = [];
let running = true;
let id = 1;
let clickCount = 0

function setup() {

    createCanvas(window.innerWidth, window.innerHeight);
    balls.push(new Ball({ m: 8, r: 20, v: { x: 0.5, y: 0.3 }, p: { x: 600, y: 200 } }))
    balls.push(new Ball({ m: 100, r: 60, v: { x: -0.1, y: -0.1 }, p: { x: 190, y: 295 } }))
    balls.push(new Ball({ m: 100, r: 60, v: { x: 0, y: 1.7 }, p: { x: 250, y: 100 } }))
    balls.push(new Ball({ m: 200, r: 30, v: { x: 0.0, y: 0.0 }, p: { x: 700, y: 100 } }))
    balls.push(new Ball({ m: 200, r: 30, v: { x: -1.0, y: 0.0 }, p: { x: 1000, y: 100 } }))
    balls.push(new Ball({ m: 800, r: 30, v: { x: 0.0, y: 0.01 }, p: { x: 500, y: 400 } }))
    balls.push(new Ball({ m: 8000, r: 100, v: { x: 0.0, y: 0.0 }, p: { x: 320, y: 400 } }))

    let ib = 0
    while (ib < 0) {

        const ball = new Ball({ m: floor(random(0, 500)), r: random(10, 70), v: { x: 0.0, y: 0.0 }, p: { x: random(0, innerWidth), y: random(0, innerHeight) } })

        for (const other of balls) {
            if (!ball.isCollided(ball, other).res) {
                balls.push(ball)
                ib++
                break
            }
        }

    }

    for (const ball of balls) {
        ball.friction = 0.9995
    }


}

function draw() {

    logs = [];
    background(255, 255, 255);

    compared = []
    for (const ball of balls) {
        ball.collide();
        ball.collideWalls(box);
        ball.show();
    }

    // logs.push("Framecount: " + frameCount);

    if (mouseIsPressed) {
        for (const ball of balls) {
            if (ball.captured == DEF_BALL_CAPTURED) {
                throwBall(ball)
            }

        }
    }

    showInfo();

}

function throwBall(ball) {

    // Discovery veocity

    const distMouse = min(200, p5.Vector.dist(createVector(mouseX, mouseY), createVector(ball.p.x, ball.p.y)))

    logs.push('distMouse ' + distMouse)
    line(mouseX, mouseY, ball.p.x, ball.p.y)

    const x = mouseX;
    const y = mouseY;

    // Calcula a direção da bola com base na posição atual da bola e na posição do mouse
    const direction = Math.atan2(y - ball.p.y, x - ball.p.x);

    const force = map(distMouse, 0, 200, 0, 2)

    // Apply velocity
    // Atualiza a posição da bola com base na direção
    const VxF = -Math.cos(direction) * force
    const VyF = -Math.sin(direction) * force

    logs.push('direction ' + direction)
    logs.push('Math.cos(direction) ' + Math.cos(direction))
    logs.push('Math.sin(direction) ' + Math.sin(direction))

    ball.v.x = VxF;
    ball.v.y = VyF;
    showInfo();


}

function keyPressed() {
    if (key == 'p') {
        console.log('Parado!');
        if (running) {
            noLoop();
        } else {
            loop();
        }
        running = !running;
    }
}
function mousePressed(event) {
    console.log("mousePressed")
    if (clickCount % 2 == 0) {
        captureBall()
    }
    clickCount++;
}

function mouseReleased() {
    if (clickCount % 2 == 0) {
        releaseBalls()
    }
}

function mouseMoved() {

    for (const ball of balls) {
        if (ball.captured) {
            ball.p.x = mouseX;
            ball.p.y = mouseY;
        }
    }
}

function releaseBalls() {
    for (const ball of balls) {
        ball.captured = DEF_BALL_RELEASED
    }
}
function captureBall() {

    for (const ball of balls) {

        const dx = ball.p.x - mouseX;
        const dy = ball.p.y - mouseY;
        const distance = floor(Math.sqrt(dx * dx + dy * dy));
        const raysSum = ball.r + 1
        const collided = distance < raysSum

        if (collided) {
            ball.captured = DEF_BALL_CAPTURED
        }
    }

}

function showInfo() {

    noStroke()

    for (let i = 0; i < logs.length; i++) {
        const element = logs[i];
        // fill(255)
        // rect(10, 4, 200, (i + 1) * 20);
        fill(0)
        text(element, 10, (i + 1) * 20);
    }

}

class Ball {

    constructor({ m, r, v, p }) {

        this.m = m // Mass scalar
        this.r = r // Ray scalar
        this.v = v // Valocity vector
        this.p = p // Position vector
        this.friction = 1;
        this.collided = false;
        this.id = id++;
        this.captured = 0;

    }

    show() {

        if (this.collided) {
            fill(255, 0, 0)
        } else {
            fill('hsla(' + ceil(map(this.id, 1, id, 0, 360)) + ',100%,50%,0.8)')
        }

        stroke(200)
        circle(this.p.x, this.p.y, this.r * 2)
        stroke(0)
        text(this.m + " (" + this.id + ")", this.p.x - (this.r / 2), this.p.y + 4)

    }

    collideWalls(box) {

        if (this.p.y - this.r <= box.y) {
            this.p.y = this.r + box.y
            this.v.y = -this.v.y
        }
        if (this.p.x - this.r <= box.x) {
            this.p.x = this.r + box.x
            this.v.x = -this.v.x
        }
        if (this.p.y + this.r >= box.y1) {
            this.p.y = box.y1 - this.r
            this.v.y = -this.v.y
        }
        if (this.p.x + this.r >= box.x1) {
            this.p.x = box.x1 - this.r
            this.v.x = -this.v.x
        }

    }

    move() {

        if (!this.captured) {
            this.p.x += this.v.x
            this.p.y += this.v.y

            // Apply friction
            this.v.x *= this.friction
            this.v.y *= this.friction

        }
    }

    isCollided(a, b) {

        const dx = a.p.x - b.p.x;
        const dy = a.p.y - b.p.y;
        const distance = floor(Math.sqrt(dx * dx + dy * dy));
        const raysSum = a.r + b.r
        const diference = raysSum - distance

        return { res: distance < raysSum, diference, raysSum, dx, dy }

    }
    collide() {

        for (const other of balls) {

            if (other != this && !(this.captured || other.captured)) {

                const collided = this.isCollided(this, other)

                this.collided = collided.res
                other.collided = collided.res

                const alreadyCompared = compared.find(e => (e.id1 == this.id && e.id2 == other.id) || (e.id1 == other.id && e.id2 == this.id))

                if (collided.res && !alreadyCompared) {

                    const { dx, dy } = collided
                    let angle = Math.atan2(dy, dx);
                    let sin = Math.sin(angle);
                    let cos = Math.cos(angle);

                    let c1Pos = { x: 0, y: 0 };
                    let c2Pos = { x: 0, y: 0 };

                    c1Pos.x += (cos * this.v.x) + (sin * this.v.y);
                    c1Pos.y += (cos * this.v.y) - (sin * this.v.x);
                    c2Pos.x += (cos * other.v.x) + (sin * other.v.y);
                    c2Pos.y += (cos * other.v.y) - (sin * other.v.x);

                    let c1Vel = {
                        x: (c1Pos.x * (this.m - other.m) + 2 * other.m * c2Pos.x) / (this.m + other.m),
                        y: c1Pos.y
                    }
                    let c2Vel = {
                        x: (c2Pos.x * (other.m - this.m) + 2 * this.m * c1Pos.x) / (this.m + other.m),
                        y: c2Pos.y
                    }

                    this.v.x = (cos * c1Vel.x) - (sin * c1Vel.y);
                    this.v.y = (cos * c1Vel.y) + (sin * c1Vel.x);
                    other.v.x = (cos * c2Vel.x) - (sin * c2Vel.y);
                    other.v.y = (cos * c2Vel.y) + (sin * c2Vel.x);

                    // If it is still collided, throw ball to out

                    for (let i = 0; i < 999; i++) {
                        this.move()
                        other.move()
                        if (this.isCollided(this, other).diference <= 0) break
                    }

                } else {
                    this.move()
                    other.move()
                }

                if (!alreadyCompared) {
                    compared.push({ id1: this.id, id2: other.id })
                    compared.push({ id1: other.id, id2: this.id })
                }

            }

        }

    }

}