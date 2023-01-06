function setup() {

    client = new Client()
    box = new Box()
    box.putBalls()

    createCanvas(window.innerWidth, window.innerHeight);

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

    if (mouseIsPressed) {
        box.throwBall()
    }

    logs.push('Jogo parado: ' + box.stoppedGame())

    showInfo();

}



