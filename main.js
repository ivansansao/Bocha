function createName() {
    const consoantes = 'BCDFGJKLMNPRSTVXZ';
    const vogais = 'AEIOU';
    let nome = '';
    let rand;

    for (let i = 0; i < 2; i++) {
        rand = (Math.random() * (consoantes.length - 1)).toFixed(0);
        nome = nome + consoantes[rand];
        rand = (Math.random() * (vogais.length - 1)).toFixed(0);
        nome = nome + vogais[rand];
    }
    return nome;
}

let login = ''

function setup() {

    login = createName()

    client = new Client()
    client.send(JSON.stringify({ command: "login", login }))

    box = new Box()
    box.putBalls()

    player = new Player({ login })



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
        box.throwBall(mouseX, mouseY)
    }

    logs.push('Jogo parado: ' + box.stoppedGame())

    showInfo();
    textAlign(LEFT)
    text(login + ' - ' + toPT(player.team), 10, 400)
    // text('Vez de jogar: ' + toPT(box.scoreboard.timeToPlay), 10, 425)

}



