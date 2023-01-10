function mousePressed(event) {

    if (clickCount % 2 == 0) {
        captureBall()
    }
    clickCount++;
}

function mouseReleased() {
    if (clickCount % 2 == 0) {

        // Online
        const bocce = balls.find((e) => e.captured == true)
        if (bocce) {

            console.log('id ', bocce.id)
            const data = {
                command: 'threw',
                login,
                bocce: {
                    id: bocce.id,
                    px: bocce.p.x,
                    py: bocce.p.y,
                    mx: mouseX,
                    my: mouseY
                }
            }
            client.send(JSON.stringify(data))
        }
        // 

        releaseBall()

    }
}

function mouseMoved() {

    for (const ball of balls) {
        if (ball.captured) {
            ball.p.x = mouseX;
            ball.p.y = mouseY;
        }
    }
}