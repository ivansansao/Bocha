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

// let login = ''

function setup() {

    // login = createName()

    chat = new Chat()
    game = new Game()
    box = new Box()
    box.putBalls()


    // createCanvas(window.innerWidth, window.innerHeight)
    const myCanvas = createCanvas(830, 820)
    myCanvas.parent("bocha")

}

function draw() {

    logs = [];
    background(255, 255, 255);

    box.show();

    compared = []
    for (const ball of balls) {
        ball.collide();
        ball.collideWalls(box);
        ball.update(box);
        ball.show();
    }

    box.stoppedGame()

    showInfo();

    if (game.logged) {
        player.show()
    }

}



