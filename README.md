# Bocha

Javascript 2d elastic collision

To run? It is not necessary a server, just clone and run index.html on your computer.

Each ball has
- Mass
- Velocity
- Friction
- Radius
- Position on screen

See, there is a solution to handle ball inside to ball!

![Gif](src/assets/collisions.gif)

Take a look at "Two-dimensional collision with two moving objects" on: https://en.wikipedia.org/wiki/Elastic_collision

This formula can be wrote as a pseudo code below.
![Formula](./src/assets/formula.png?raw=true "")

See this pseudo code that I adapted:

~~~javascript

// Just move balls not collideds

if not collided {
    ball1.move()
    ball2.move()
    return
}

// Discovery new velocities

theta1 = atan2(ball1.dy, ball1.dx) // Angle
theta2 = atan2(ball2.dy, ball2.dx) // Angle
phi = atan2(ball2.y - ball1.y, ball2.x - ball1.x) // Contact angle
m1 = ball1.mass
m2 = ball2.mass
v1 = sqrt(ball1.dx * ball1.dx + ball1.dy * ball1.dy) // Velocity
v2 = sqrt(ball2.dx * ball2.dx + ball2.dy * ball2.dy) // Velocity

dx1F = (v1 * cos(theta1 - phi) * (m1-m2) + 2*m2*v2*cos(theta2 - phi)) / (m1+m2) * cos(phi) + v1*sin(theta1-phi) * cos(phi+PI/2)
dy1F = (v1 * cos(theta1 - phi) * (m1-m2) + 2*m2*v2*cos(theta2 - phi)) / (m1+m2) * sin(phi) + v1*sin(theta1-phi) * sin(phi+PI/2)
dx2F = (v2 * cos(theta2 - phi) * (m2-m1) + 2*m1*v1*cos(theta1 - phi)) / (m1+m2) * cos(phi) + v2*sin(theta2-phi) * cos(phi+PI/2)
dy2F = (v2 * cos(theta2 - phi) * (m2-m1) + 2*m1*v1*cos(theta1 - phi)) / (m1+m2) * sin(phi) + v2*sin(theta2-phi) * sin(phi+PI/2)

// Apply new valocities

ball1.dx = dx1F
ball1.dy = dy1F                
ball2.dx = dx2F                
ball2.dy = dy2F

// If they are still collideds, throw ball to out

for (i = 0; i < 999; i++) {
    ball1.move()
    ball2.move()
    if !isCollided(ball1, ball2) break
}
~~~  
