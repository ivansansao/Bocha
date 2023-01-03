
let model, reverb;
let notes, radiusFactor, maxVelocity;
let logs = [];

function setup() {

    createCanvas(window.innerWidth - 20, window.innerHeight - 20);
    frameRate(30);
    colorMode(HSB, 360, 170, 100);
    ellipseMode(RADIUS);
    let shortestSide = (height < width ? height : width)
    radiusFactor = shortestSide / 40
    maxVelocity = shortestSide / 80
    model = new Model();
    model.addBall();
    model.addBall();
    model.addBall();
    model.addBall();
    model.addBall();
    model.addBall();
}

function draw() {

    logs = [];
    background(255);
    model.update();
    showInfo();
}


class Model {

    constructor() {
        this.balls = [];
        this.minPopulation = 5;
        this.maxPopulation = 10;
        this.lastBallAddedTime = 0;
        this.ballAddInterval = 1000;
        this.frame = 0;
    }
    addBall(x, y, dx, dy) {
        if (this.balls.length < this.maxPopulation) {
            this.balls.push(new Ball(x, y, this.balls));
            this.lastBallAddedTime = Date.now();
        }
    }

    update() {

        // calculate movements
        for (let b = 0; b < this.balls.length; b++) {
            let ball = this.balls[b];
            ball.update();
            ball.draw();
        }

    }
}

class Ball {

    constructor(x, y, balls, mass) {

        this.balls = balls;
        this.note = Math.floor(random(0, 11));
        this.octave = Math.floor(random(0, 3));
        this.radius = (4 - this.octave) * radiusFactor;
        this.radius = floor(random(30, 60))
        this.mass = ceil(this.radius);
        this.position = this.newPosition(x, y);
        this.velocity = createVector(random(0 - maxVelocity, maxVelocity), random(0 - maxVelocity, maxVelocity))
        this.nextVelocity = createVector(this.velocity.x, this.velocity.y);

    }

    newPosition(x, y) {

        let r = this.radius
        if (x != null && y != null) {
            return createVector(constrain(x, r + 1, width - r - 1), constrain(y, r + 1, height - r - 1))
        }
        let xPos, yPos
        let collision = false
        // keep getting random position until we have one that isn't too close to any other balls
        do {
            xPos = constrain(random(width), r + 1, width - r - 1)
            yPos = constrain(random(height), r + 1, height - r - 1)
            for (let b = 0; b < this.balls.length; b++) {
                let ball = this.balls[b];
                if (ball === this) {
                    continue;
                }
                let position = createVector(xPos, yPos)
                if (ball.position.dist(position) < this.radius + ball.radius) {
                    collision = true;
                    break
                }
                else {
                    collision = false;
                }

            }
        } while (collision === true);

        return createVector(xPos, yPos)

    }

    update() {

        this.checkWalls()

        let allStopped = true;

        // check for collisions with other balls
        for (let b = 0; b < this.balls.length; b++) {
            let ball = this.balls[b];
            this.collision(ball);

            if (p5.Vector.dist(ball.velocity, createVector(0, 0)) != 0) {
                allStopped = false
            }

        }

        let vel = p5.Vector.dist(this.velocity, createVector(0, 0));
        logs.push('Dot: ' + this.mass + ': ' + vel + '  Velocity: ' + this.velocity)
        if (vel > 1) {
            this.position.add(this.velocity);
        }
        if (vel < 0.1) {
            this.velocity = createVector(0, 0)
        } else {
            this.velocity.mult(0.97)
        }

        allStopped = allStopped && vel == 0

        if (allStopped) {
            logs.push('Parado!')
        }

    }

    checkWalls() {

        if (this.position.x + this.radius >= width ||
            this.position.x <= this.radius) {
            this.velocity.x = this.velocity.x * -1;
        }
        if (this.position.y + this.radius >= height ||
            this.position.y <= this.radius) {
            this.velocity.y = this.velocity.y * -1;
        }
    }



    collision(ball) {

        let distance = this.position.dist(ball.position)
        let minDistance = this.radius + ball.radius

        if (ball == this || distance > minDistance) {
            // collided
            return
        }
        // balls colliding. First, move them apart.
        let angle = p5.Vector.sub(this.position, ball.position).heading() // Heading returns angle of ratation for a given coordenates
        let distanceVector = p5.Vector.sub(this.position, ball.position)
        let newDistance = createVector(minDistance * cos(angle), minDistance * sin(angle))
        let xNudge = distanceVector.x - newDistance.x
        let yNudge = distanceVector.y - newDistance.y
        this.position.sub(xNudge / 2, yNudge / 2)
        ball.position.add(xNudge / 2, yNudge / 2)

        let normalVector = distanceVector.normalize()
        let tangentVector = createVector(normalVector.y * -1, normalVector.x)

        // resolve velocity vectors into normal and tangential
        // ball scalar normal direction
        let thisScalarNormal = normalVector.dot(this.velocity)
        let ballScalarNormal = normalVector.dot(ball.velocity)
        // scalar velocities in tangential direction
        let thisScalarTangential = tangentVector.dot(this.velocity)
        let ballScalarTangential = tangentVector.dot(ball.velocity)

        // Find new velocities
        let thisScalarNormalAfter = (thisScalarNormal * (this.mass - ball.mass) + 2 * ball.mass * ballScalarNormal) / (this.mass + ball.mass);
        let ballScalarNormalAfter = (ballScalarNormal * (ball.mass - this.mass) + 2 * this.mass * thisScalarNormal) / (this.mass + ball.mass);

        // convert to vectors
        let thisScalarNormalAfterVector = p5.Vector.mult(normalVector, thisScalarNormalAfter);
        let ballScalarNormalAfterVector = p5.Vector.mult(normalVector, ballScalarNormalAfter);
        let thisScalarNormalVector = p5.Vector.mult(tangentVector, thisScalarTangential);
        let ballScalarNormalVector = p5.Vector.mult(tangentVector, ballScalarTangential);

        // add normal and tangentials for each ball
        this.velocity = p5.Vector.add(thisScalarNormalVector, thisScalarNormalAfterVector);
        ball.velocity = p5.Vector.add(ballScalarNormalVector, ballScalarNormalAfterVector);


    }

    draw() {

        let hue = this.note * 360 / 12
        fill(hue, 100, 100)
        noStroke()
        ellipse(this.position.x, this.position.y, this.radius, this.radius);
        fill(0)
        text(this.mass, this.position.x, this.position.y)
    }


}

function showInfo() {

    for (let i = 0; i < logs.length; i++) {
        const element = logs[i];
        text(element, 10, (i + 1) * 20);
    }

}