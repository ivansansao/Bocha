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
    mass: 100,
    r: 60,
    velocity: {
        x: 0,
        y: 0
    },
    // position: { x: 295, y: 190 }
    position: { x: 190, y: 295 }
}


function setup() {

    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(10)

}

function draw() {
    console.log('--- New loop ---')

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

        var c1Pos = {
            x: 0,
            y: 0
        };
        var c2Pos = {
            x: 0,
            y: 0
        };

        c1Pos.x += (cos * particleA.velocity.x) + (sin * particleA.velocity.y);
        c1Pos.y += (cos * particleA.velocity.y) - (sin * particleA.velocity.x);
        c2Pos.x += (cos * particleB.velocity.x) + (sin * particleB.velocity.y);
        c2Pos.y += (cos * particleB.velocity.y) - (sin * particleB.velocity.x);


        var c1Vel = {
            x: (c1Pos.x * (particleA.mass - particleB.mass) + 2 * particleB.mass * c2Pos.x) / (particleA.mass + particleB.mass),
            y: c1Pos.y
        }
        var c2Vel = {
            x: (c2Pos.x * (particleB.mass - particleA.mass) + 2 * particleA.mass * c1Pos.x) / (particleA.mass + particleB.mass),
            y: c2Pos.y
        }

        particleA.velocity.x = (cos * c1Vel.x) - (sin * c1Vel.y);
        particleA.velocity.y = (cos * c1Vel.y) + (sin * c1Vel.x);
        particleB.velocity.x = (cos * c2Vel.x) - (sin * c2Vel.y);
        particleB.velocity.y = (cos * c2Vel.y) + (sin * c2Vel.x);


    }

    circle(particleA.position.x, particleA.position.y, particleA.r * 2)
    circle(particleB.position.x, particleB.position.y, particleB.r * 2)

    console.log(particleA.velocity); // {x: 1.6, y: 2.6}
    console.log(particleB.velocity); // {x: -2.4, y: 0.6}

    particleA.position.x += particleA.velocity.x
    particleA.position.y += particleA.velocity.y

    particleB.position.x += particleB.velocity.x
    particleB.position.y += particleB.velocity.y

    if (frameCount >= 40) {
        noLoop()
    }
}


