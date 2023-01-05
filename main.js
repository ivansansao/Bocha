

const DEF_BALL_RELEASED = 0
const DEF_BALL_CAPTURED = 1

let balls = []
let compared = []
let logs = [];
let running = true;
let id = 1;
let clickCount = 0
let box = false;

function setup() {

    createCanvas(window.innerWidth, window.innerHeight);

    box = new Box()
    box.putBalls()


}

function draw() {

    logs = [];
    background(255, 255, 255);

    box.show();

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
                ball.throwBall()
            }

        }
    }

    logs.push('Jogo parado: ' + box.stoppedGame())

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
        releaseBall()

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

function releaseBall() {
    for (const ball of balls) {
        if (ball.captured == DEF_BALL_CAPTURED) {
            console.log(ball.v.y)
            // Ig ball is moving to up them it is considered playing
            if (ball.v.y < 0) {
                ball.playing = true
            }
            ball.captured = DEF_BALL_RELEASED
        }
    }
    box.calculatePoints = false
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

    constructor({ m, r, v, p, colr, friction, groupName, groupId }) {

        this.m = m // Mass scalar
        this.r = r // Ray scalar
        this.v = v || { x: 0, y: 0 } // Valocity vector
        this.p = p || { x: 0, y: 0 } // Position vector
        this.friction = friction || 1;
        this.collided = false;
        this.id = id++;
        this.captured = 0;
        this.color = colr
        this.groupName = groupName
        this.groupId = groupId

    }

    show() {

        if (this.collided) {
            fill(255, 0, 0)
        } else {
            const mapId = ceil(map(this.id, 1, id, 50, 240))
            if (this.color) {
                fill(this.color)
            } else {
                const color = 'hsla(' + mapId + ',100%,50%,0.8)';
                fill(color)
            }

        }

        stroke(200)
        circle(this.p.x, this.p.y, this.r * 2)

        stroke(0)
        text(this.groupId, this.p.x - (this.r / 2) + 4, this.p.y + 4)


    }

    collideWalls(box) {

        if (this.p.y - this.r <= box.y) {
            this.p.y = this.r + box.y
            this.v.y = -this.v.y

            this.v.x = this.v.x * 0.3
            this.v.y = this.v.y * 0.3
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

    getFriction_not_used() {

        const mass = this.m; // mass of the object in kg
        const acceleration = 9.81; // gravitational acceleration in m/s^2
        const coefficientOfFriction = 0.5; // coefficient of friction

        // calculate the force of friction
        const forceOfFriction = mass * acceleration;

        // calculate the friction
        const friction = forceOfFriction * coefficientOfFriction;

        // console.log(friction); // output: 49.05
        return friction
    }

    move() {

        if (!this.captured) {
            this.p.x += this.v.x
            this.p.y += this.v.y

            // Apply friction         
            this.v.x *= this.friction
            this.v.y *= this.friction

            if (abs(this.v.x) + abs(this.v.y) < 0.04) {
                this.v.x = 0
                this.v.y = 0
            }

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



class Box {
    constructor() {

        this.width = 400
        this.height = 800

        this.x = (window.innerWidth / 2) - (this.width / 2)
        this.y = 4 || (window.innerHeight / 2) - (this.height / 2)
        this.x1 = this.x + this.width
        this.y1 = this.y + this.height

        this.little = false
        this.nearestBocce = false
        this.calculatePoints = false
        this.scoreboard = new Scoreboard(20, 400)
        // this.scoreboard = {
        //     yellow: [],
        //     blue: []
        // }

        this.risk = { x: this.x, y: this.height - (this.height / 4), x1: this.x + this.width, y1: this.height - (this.height / 4) }

    }
    putBalls() {

        const friction = 0.9992

        let r = 10
        let colr = color(100)
        balls.push(new Bocce({ colr, m: 100, r, p: { x: this.x + (this.width / 2), y: this.y1 - (r * (2 * 4)) - (2 * 4) }, friction, groupName: 'litle', groupId: 0 }))

        this.little = balls[0]

        r = 20
        colr = color(255, 255, 0)
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (r * 1) + 1, y: this.y1 - (r * (2 * 1)) - (2 * 1) }, friction, groupName: 'yellow', groupId: 1 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (r * 1) + 1, y: this.y1 - (r * (2 * 2)) - (2 * 2) }, friction, groupName: 'yellow', groupId: 2 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (r * 1) + 1, y: this.y1 - (r * (2 * 3)) - (2 * 3) }, friction, groupName: 'yellow', groupId: 3 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (r * 1) + 1, y: this.y1 - (r * (2 * 4)) - (2 * 4) }, friction, groupName: 'yellow', groupId: 4 }))

        r = 20
        colr = color(48, 169, 255)

        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + this.width - (r * 1) + 1, y: this.y1 - (r * (2 * 1)) - (2 * 1) }, friction, groupName: 'blue', groupId: 5 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + this.width - (r * 1) + 1, y: this.y1 - (r * (2 * 2)) - (2 * 2) }, friction, groupName: 'blue', groupId: 6 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + this.width - (r * 1) + 1, y: this.y1 - (r * (2 * 3)) - (2 * 3) }, friction, groupName: 'blue', groupId: 7 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + this.width - (r * 1) + 1, y: this.y1 - (r * (2 * 4)) - (2 * 4) }, friction, groupName: 'blue', groupId: 8 }))

    }

    stoppedGame() {
        for (const b of balls) {
            if (b.v.x != 0 || b.v.y != 0) {
                return false
            }
        }
        this.onStoppedGame()
        return true
    }

    show() {

        stroke(0)
        fill(255)
        rect(this.x, this.y, this.width, this.height)

        line(this.risk.x, this.risk.y, this.risk.x1, this.risk.y1)

        this.showScoreboard()
        this.scoreboard.show()


    }

    move() {
        super.move()
    }

    onStoppedGame() {

        if (!this.calculatePoints) {
            this.calculatePoints = true
            this.verifyDistanceLittle()
            console.log("Calculei")
        }

        // Bocces is plauing now change to played.
        for (const bocce of balls) {
            if (bocce.playing) {
                bocce.playing = false
                bocce.played = true
            }
        }

        if (this.isEndRound()) {
            this.setRoundPoints()
            balls = []
            this.putBalls()
            this.resetRound()

        }
    }

    verifyDistanceLittle() {

        let nearestBocce = false
        let nearestD = 999

        for (const b of balls) {
            if (b != this.little) {
                b.distanceLitlle = p5.Vector.dist(createVector(this.little.p.x, this.little.p.y), createVector(b.p.x, b.p.y))

                if (b.distanceLitlle < nearestD) {
                    nearestD = b.distanceLitlle
                    nearestBocce = b
                }
            }
        }

        return nearestBocce

    }

    resetGame() {
    }

    resetRound() {

        this.winner = ''
        for (const bocce of balls) {
        }

    }

    isEndRound() {
        for (const b of balls) {
            if (!b.played) {
                return false
            }
        }
        console.log('End round')
        return true
    }

    setRoundPoints() {

        balls.sort((a, b) => (a.distanceLitlle > b.distanceLitlle ? 1 : -1))
        const winnerGroupName = balls[0].groupName
        let pointsYellow = 0
        let pointsBlue = 0


        console.log('Winner: ', winnerGroupName)

        for (const bocce of balls) {

            if (bocce.groupName == winnerGroupName) {
                console.log(bocce.groupName, bocce.distanceLitlle)
                if (winnerGroupName == 'yellow') {
                    pointsYellow += 2
                } else {
                    pointsBlue += 2
                }
            } else {
                break
            }

        }

        this.scoreboard.yellow.push(pointsYellow)
        this.scoreboard.blue.push(pointsBlue)

        console.log(this.scoreboard)

    }

    showScoreboard() {

        const totalYellow = this.scoreboard.yellow.reduce((a, b) => a + b, 0)
        const totalBlue = this.scoreboard.blue.reduce((a, b) => a + b, 0)

        for (let i = 0; i < 13; i++) {
            const x = 20 + (25 * i)
            stroke(0)
            line(x, 30, x, 130)
            noStroke()
            fill(0)

            if (i * 2 == totalYellow) {
                text(i * 2, x + 4, 55)
            }
            if (i * 2 == totalBlue) {
                text(i * 2, x + 4, 110)
            }

            // text(this.scoreboard.yellow[i], x, 45)
            // text(this.scoreboard.blue[i], x, 70)
        }
        stroke(0)
        noFill()
        rect(20, 30, 324, 100)
        line(20, 80, 344, 80)

    }

}


class Bocce extends Ball {
    constructor(args) {
        super(args)
        this.distanceLitlle = Infinity
        this.nearest = false
        this.played = false
        this.playing = false
        this.passedRisk = false
    }
    show() {
        if (this.captured) {
            stroke(255, 0, 0)
            noFill()
            circle(this.p.x, this.p.y, (this.r * 2) + 10)
        }

        fill(this.color)

        stroke(200)
        circle(this.p.x, this.p.y, this.r * 2)

        if (this.distanceLitlle < Infinity) {
            noStroke()
            fill(0)
            text(floor(this.distanceLitlle), this.p.x - (this.r / 2) + 4, this.p.y + 4)
        }



    }

    throwBall() {

        const ball = this

        // Discovery veocity

        const maxDist = 200

        const distMouse = min(maxDist, p5.Vector.dist(createVector(mouseX, mouseY), createVector(ball.p.x, ball.p.y)))

        logs.push('distMouse ' + distMouse)
        stroke(0)
        line(mouseX, mouseY, ball.p.x, ball.p.y)

        const x = mouseX;
        const y = mouseY;

        // Calcula a direção da bola com base na posição atual da bola e na posição do mouse
        const direction = Math.atan2(y - ball.p.y, x - ball.p.x);

        const force = map(distMouse, 0, maxDist, 0, 0.9)

        // Apply velocity
        // Atualiza a posição da bola com base na direção
        const VxF = -Math.cos(direction) * force
        const VyF = -Math.sin(direction) * force

        logs.push('direction ' + direction)
        logs.push('force ' + force)
        logs.push('Math.cos(direction) ' + Math.cos(direction))
        logs.push('Math.sin(direction) ' + Math.sin(direction))

        ball.v.x = VxF;
        ball.v.y = VyF;

        showInfo();

        return force

    }


    collideWalls(box) {

        if (this.played || this.playing) {
            super.collideWalls(box)
        } else {

            const condBox = { ...box }
            condBox.y = box.risk.y
            // condBox.y1 = box.risk.y1
            super.collideWalls(condBox)
        }

    }
}

class Scoreboard {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.yellow = []
        this.blue = []
    }

    getTotalYellow() {
        return this.yellow.reduce((a, b) => a + b, 0)
    }
    getTotalBlue() {
        return this.blue.reduce((a, b) => a + b, 0)
    }

    show() {
        const { x, y } = this
        const y2 = y + 67
        const w = 324
        const h = 50
        const yellow = this.getTotalYellow()
        const blue = this.getTotalBlue()
        const wB = w / 12

        fill(255, 255, 0)
        rect(x, y, w, h)

        fill(48, 169, 255)
        rect(x, y2, w, h)

        stroke(0)
        textAlign(CENTER);
        for (let i = 0; i < 12; i++) {

            if (i * 2 == yellow) {
                noStroke()
                fill(0)
                text(i * 2, x + (i * wB) + 14, y + (h / 2) + 4)
                stroke(0)
            }
            if (i * 2 == blue) {
                noStroke()
                fill(0)
                text(i * 2, x + (i * wB) + 14, y2 + (h / 2) + 4)
                stroke(0)
            }
            line(x + (i * wB), y, x + (i * wB), y + h)
            line(x + (i * wB), y2, x + (i * wB), y2 + h)
        }


    }
}