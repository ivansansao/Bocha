function setup() {

    client = new Client()

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



