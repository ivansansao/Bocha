var circle1 = {
    x: 300,
    y: 50,
    radius: 20,
    vx: 5,
    vy: 3,
    mass: 30
}

var circle2 = {
    x: 600,
    y: 100,
    radius: 10,
    vx: -3,
    vy: 2,
    mass: 60
}

function elasticCollision(c1, c2) {
    var dx = c1.x - c2.x;
    var dy = c1.y - c2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    var c1Pos = {
        x: 0,
        y: 0
    };
    var c2Pos = {
        x: dx,
        y: dy
    };

    c1Pos.x += (cos * c1.vx) + (sin * c1.vy);
    c1Pos.y += (cos * c1.vy) - (sin * c1.vx);
    c2Pos.x += (cos * c2.vx) + (sin * c2.vy);
    c2Pos.y += (cos * c2.vy) - (sin * c2.vx);

    var c1Vel = {
        x: (c1Pos.x * (c1.mass - c2.mass) + 2 * c2.mass * c2Pos.x) / (c1.mass + c2.mass),
        y: c1Pos.y
    }
    var c2Vel = {
        x: (c2Pos.x * (c2.mass - c1.mass) + 2 * c1.mass * c1Pos.x) / (c1.mass + c2.mass),
        y: c2Pos.y
    }

    c1.vx = (cos * c1Vel.x) - (sin * c1Vel.y);
    c1.vy = (cos * c1Vel.y) + (sin * c1Vel.x);
    c2.vx = (cos * c2Vel.x) - (sin * c2Vel.y);
    c2.vy = (cos * c2Vel.y) + (sin * c2Vel.x);
}



let logs = [];
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(1)
}

function draw() {

    background(255);
    logs = [];


    elasticCollision(circle1, circle2);


    // Draw
    circle(circle1.vx, circle1.vy, circle1.mass)
    circle(circle2.vx, circle2.vy, circle2.mass)

    line(0, 200, 800, 200)

    logs.push("Circle 2 velocity: (" + circle2.vx + ", " + circle2.vy + ")");
    logs.push("Circle 1 velocity: (" + circle1.vx + ", " + circle1.vy + ")");
    showInfo();

}

// Create script javascript that simulate elastic collision 2d circle 

function showInfo() {

    for (let i = 0; i < logs.length; i++) {
        const element = logs[i];
        text(element, 10, (i + 1) * 20);
    }

}