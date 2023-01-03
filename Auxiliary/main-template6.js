// Declara as variáveis das duas partículas
let particleA = {
    mass: 10,
    r: 30,
    velocity: {
        x: 2,
        y: 3
    },
    position: {
        x: 200,
        y: 200
    }
}

let particleB = {
    mass: 200,
    r: 60,
    velocity: {
        x: 0,
        y: 0
    },
    position: {
        x: 295,
        y: 190
    }
}
// position: {
//     x: 190,
//     y: 295
// }

function setup() {

    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(1)

}

function draw() {
    console.log('--- New loop ---')

    logs = [];
    // background(255);

    let collided = false;
    const dx = particleA.position.x - particleB.position.x;
    const dy = particleA.position.y - particleB.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const raysSum = particleA.r + particleB.r
    console.log('Distances = ', distance, ' Rays sum = ', raysSum)

    if (distance <= raysSum) {
        collided = true
    }

    if (collided) {

        console.log('Collided')
        let angle = Math.atan2(dy, dx);
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);


        // Calcula as novas velocidades das partículas usando a lei da conservação da energia cinética
        let finalVelocityA = {
            x: ((((particleA.velocity.x * Math.cos(angle)) * (particleA.mass - particleB.mass)) + (2 * particleB.mass * particleB.velocity.x * Math.cos(angle))) / (particleA.mass + particleB.mass)) * Math.cos(angle) + particleA.velocity.x * Math.sin(angle) * (Math.cos(angle * HALF_PI)),
            y: ((((particleA.velocity.x * Math.cos(angle)) * (particleA.mass - particleB.mass)) + (2 * particleB.mass * particleB.velocity.x * Math.cos(angle))) / (particleA.mass + particleB.mass)) * Math.sin(angle) + particleA.velocity.x * Math.sin(angle) * (Math.sin(angle * HALF_PI))
            // x: ((particleA.mass - particleB.mass) + (2 * particleB.mass * particleB.velocity.x)) / (particleA.mass + particleB.mass),
            // y: ((particleA.mass - particleB.mass) + (2 * particleB.mass * particleB.velocity.y)) / (particleA.mass + particleB.mass)
        }

        let finalVelocityB = {
            x: ((((particleB.velocity.x * Math.cos(angle)) * (particleB.mass - particleA.mass)) + (2 * particleA.mass * particleA.velocity.x * Math.cos(angle))) / (particleB.mass + particleA.mass)) * Math.cos(angle) + particleB.velocity.x * Math.sin(angle) * (Math.cos(angle * HALF_PI)),
            y: ((((particleB.velocity.x * Math.cos(angle)) * (particleB.mass - particleA.mass)) + (2 * particleA.mass * particleA.velocity.x * Math.cos(angle))) / (particleB.mass + particleA.mass)) * Math.sin(angle) + particleB.velocity.x * Math.sin(angle) * (Math.sin(angle * HALF_PI))
            // x: ((particleB.mass - particleA.mass) + (2 * particleA.mass * particleA.velocity.x)) / (particleA.mass + particleB.mass),
            // y: ((particleB.mass - particleA.mass) + (2 * particleA.mass * particleA.velocity.y)) / (particleA.mass + particleB.mass)
        }
        // Atualiza as velocidades das partículas
        particleA.velocity = finalVelocityA;
        particleB.velocity = finalVelocityB;
    }


    circle(particleA.position.x, particleA.position.y, particleA.r * 2)
    circle(particleB.position.x, particleB.position.y, particleB.r * 2)

    console.log(particleA.velocity); // {x: 1.6, y: 2.6}
    console.log(particleB.velocity); // {x: -2.4, y: 0.6}

    particleA.position.x += particleA.velocity.x
    particleA.position.y += particleA.velocity.y

    particleB.position.x += particleB.velocity.x
    particleB.position.y += particleB.velocity.y

    showInfo();
    if (frameCount >= 10) {
        noLoop()

    }
}


function showInfo() {

    for (let i = 0; i < logs.length; i++) {
        const element = logs[i];
        text(element, 10, (i + 1) * 20);
    }

}