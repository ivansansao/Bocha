
// Declare variables for ball 1
let ball1X = 100; // Initial x position
let ball1Y = 200; // Initial y position
let ball1Vx = 10; // Initial x velocity
let ball1Vy = 5; // Initial y velocity
let ball1Mass = 1; // Mass of ball 1

// Declare variables for ball 2
let ball2X = 300; // Initial x position
let ball2Y = 200; // Initial y position
let ball2Vx = -10; // Initial x velocity
let ball2Vy = 5; // Initial y velocity
let ball2Mass = 2; // Mass of ball 2

// Declare variables for simulation
let timeStep = 0.01; // Time step for simulation
let numSteps = 1000; // Number of steps to run simulation


function setup() {

    createCanvas(windowWidth, windowHeight);


}

function draw() {

    background(255);

    text('Working!', 100, 100)

    // Loop through simulation steps
    for (let i = 0; i < numSteps; i++) {
        // Calculate distance between balls
        let dx = ball2X - ball1X;
        let dy = ball2Y - ball1Y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Check if balls are colliding
        if (distance < 50) {
            // Calculate unit vector in direction of collision
            let unitVector = { x: dx / distance, y: dy / distance };

            // Calculate scalar velocities of balls along unit vector
            let scalar1 = ball1Vx * unitVector.x + ball1Vy * unitVector.y;
            let scalar2 = ball2Vx * unitVector.x + ball2Vy * unitVector.y;

            // Calculate new scalar velocities after collision using elastic collision formula
            let newScalar1 = (scalar1 * (ball1Mass - ball2Mass) + 2 * ball2Mass * scalar2) / (ball1Mass + ball2Mass);
            let newScalar2 = (scalar2 * (ball2Mass - ball1Mass) + 2 * ball1Mass * scalar1) / (ball1Mass + ball2Mass);

            // Calculate new x and y velocities of balls using unit vector and new scalar velocities
            ball1Vx = newScalar1 * unitVector.x;
            ball1Vy = newScalar1 * unitVector.y;
            ball2Vx = newScalar2 * unitVector.x;
            ball2Vy = newScalar2 * unitVector.y;
        }

        // Update positions of balls using velocities
        ball1X += ball1Vx * timeStep;
        ball1Y += ball1Vy * timeStep;
        ball2X += ball2Vx * timeStep;
        ball2Y += ball2Vy * timeStep;
    }

    console.log("Ball 1 final position: (" + ball1X + ", " + ball1Y + ")");
    console.log("Ball 2 final position: (" + ball2X + ", " + ball2Y + ")");


    noLoop()

}

// Create script javascript that simulate elastic collision 2d circle 

