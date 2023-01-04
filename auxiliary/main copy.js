let running = true;
let balls = []
const box = { x: 0, y: 0, x1: window.innerWidth, y1: window.innerHeight }
let compared = []
let stillCollideds = []
let id = 1;
let clickCount = 0
const DEF_BALL_RELEASED = 0
const DEF_BALL_CAPTURED = 1
let logs = [];

function setup() {

    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(60)
    balls.push(new Ball({ m: 8, r: 20, v: { x: 0.5, y: 0.3 }, p: { x: 600, y: 200 } }))
    balls.push(new Ball({ m: 100, r: 60, v: { x: -0.1, y: -0.1 }, p: { x: 190, y: 295 } }))
    // balls.push(new Ball({ m: 5, r: 60, v: { x: -0.01, y: -0.01 }, p: { x: 400, y: 120 } }))
    // balls.push(new Ball({ m: 100, r: 60, v: { x: 1.8, y: 1.7 }, p: { x: 190, y: 100 } }))
    balls.push(new Ball({ m: 100, r: 60, v: { x: 0, y: 1.7 }, p: { x: 250, y: 100 } }))

    balls.push(new Ball({ m: 200, r: 30, v: { x: 0.0, y: 0.0 }, p: { x: 700, y: 100 } }))
    balls.push(new Ball({ m: 200, r: 30, v: { x: -1.0, y: 0.0 }, p: { x: 1000, y: 100 } }))
    balls.push(new Ball({ m: 800, r: 30, v: { x: 0.0, y: 0.01 }, p: { x: 500, y: 400 } }))
    balls.push(new Ball({ m: 8000, r: 100, v: { x: 0.0, y: 0.0 }, p: { x: 320, y: 400 } }))

    balls[0].friction = 0.9995



}

function draw() {

    logs = [];
    background(255, 255, 255, 255);

    compared = []
    for (const ball of balls) {
        ball.collide();
        ball.collideWalls(box);
        ball.move();
        ball.show();
    }

    logs.push("Framecount: " + frameCount);

    if (mouseIsPressed) {
        for (const ball of balls) {
            if (ball.captured == DEF_BALL_CAPTURED) {
                const distMouse = p5.Vector.dist(createVector(mouseX, mouseY), createVector(ball.p.x, ball.p.y))

                logs.push('distMouse ' + distMouse)
                line(mouseX, mouseY, ball.p.x, ball.p.y)
            }

        }
    }

    showInfo();
    // if (frameCount >= 200) {
    //     noLoop()
    // }
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
    console.log('movendo o mouse')
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
        fill(255)
        rect(10, 4, 200, (i + 1) * 20);
        fill(0)
        text(element, 10, (i + 1) * 20);
    }

}

class Ball {

    constructor({ m, r, v, p, color }) {

        this.m = m // Mass scalar
        this.r = r // Ray scalar
        this.v = v // Valocity vector
        this.p = p // Position vector
        this.friction = 1;
        this.collided = false;
        this.id = id++;
        this.captured = 0;
        this.color = color

    }

    show() {
        if (this.collided) {
            fill(255, 0, 0)
        } else {
            const mapId = ceil(map(this.id, 1, id, 50, 240))
            if (this.color) {
                fill(color)
            } else {
                const color = 'hsla(' + mapId + ',100%,50%,0.8)';
            }

            fill(color)
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
                const { diference, distance, raysSum, dx, dy } = collided

                let alreadyCompared = false
                let wasCollided = false

                this.collided = collided.res
                other.collided = collided.res

                const cp = compared.find(e => e.id1 == this.id && e.id2 == other.id || e.id1 == other.id && e.id2 == this.id)

                if (cp) {
                    wasCollided = cp.wasCollided
                    alreadyCompared = true
                }

                const still = stillCollideds.find(e => ((e.id1 == this.id && e.id2 == other.id) || (e.id1 == other.id && e.id2 == this.id)))

                // if (collided.res && !alreadyCompared && !wasCollided) {
                // if (collided.res && !alreadyCompared && still == undefined) {
                if (collided.res && !alreadyCompared && still == undefined) {

                    console.log('Collided!!!!  :', this.id, ' with ', other.id, ' wasCollided: ', wasCollided, ' FC: ', frameCount)
                    console.log(compared)
                    console.log(`Distances masses ${this.m} and ${other.m}: ${distance}  Rays sum: ${raysSum} FC: ${frameCount} DIF: ${diference}`)
                    console.log('this.m: ', this.m, ' v: ', this.v); // {x: 1.6, y: 2.6}
                    console.log('other.m: ', other.m, ' v: ', other.v); // {x: -2.4, y: 0.6}

                    let angle = Math.atan2(dy, dx);
                    let sin = Math.sin(angle);
                    let cos = Math.cos(angle);

                    var c1Pos = {
                        x: 0,
                        y: 0
                    };
                    var c2Pos = {
                        x: 0,
                        y: 0
                    };

                    c1Pos.x += (cos * this.v.x) + (sin * this.v.y);
                    c1Pos.y += (cos * this.v.y) - (sin * this.v.x);
                    c2Pos.x += (cos * other.v.x) + (sin * other.v.y);
                    c2Pos.y += (cos * other.v.y) - (sin * other.v.x);

                    var c1Vel = {
                        x: (c1Pos.x * (this.m - other.m) + 2 * other.m * c2Pos.x) / (this.m + other.m),
                        y: c1Pos.y
                    }
                    var c2Vel = {
                        x: (c2Pos.x * (other.m - this.m) + 2 * this.m * c1Pos.x) / (this.m + other.m),
                        y: c2Pos.y
                    }

                    this.v.x = (cos * c1Vel.x) - (sin * c1Vel.y);
                    this.v.y = (cos * c1Vel.y) + (sin * c1Vel.x);
                    other.v.x = (cos * c2Vel.x) - (sin * c2Vel.y);
                    other.v.y = (cos * c2Vel.y) + (sin * c2Vel.x);

                    console.log('this.m: ', this.m, ' v: ', this.v); // {x: 1.6, y: 2.6}
                    console.log('other.m: ', other.m, ' v: ', other.v); // {x: -2.4, y: 0.6}

                }

                if (!alreadyCompared) {
                    compared.push({ id1: this.id, id2: other.id, wasCollided: collided.res })
                    compared.push({ id1: other.id, id2: this.id, wasCollided: collided.res })
                }


            }

            this.move()
            other.move()

            if (this.id != other.id) {

                // Remove collision

                stillCollideds = stillCollideds.filter(e => !((e.id1 == this.id && e.id2 == other.id) || (e.id1 == other.id && e.id2 == this.id)))

                // Add again still collided

                const stillCollided = this.isCollided(this, other)
                if (stillCollided.diference > 10) {
                    stillCollideds.push({ id1: this.id, id2: other.id, wasCollided: stillCollided.res })
                    stillCollideds.push({ id1: other.id, id2: this.id, wasCollided: stillCollided.res })
                    console.log('still: ', this.id, other.id)
                }


            }

            // if (frameCount == 553) noLoop()

        }
    }
}