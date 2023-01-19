function mousePressed(event) {

    if (!isLooping()) {
        return
    }


    if (box.scoreboard.isMyTimeToPlay()) {
        console.log('Pressionou no mouse')
        if (clickCount % 2 == 0) {
            captureBall()
        }
        clickCount++;
    }


}

function mouseReleased() {

    if (!isLooping()) {
        return
    }

    if (box.scoreboard.isMyTimeToPlay()) {

        console.log('Soltou no mouse')

        if (clickCount % 2 == 0) {

            const bocce = balls.find((e) => e.captured == true)
            if (bocce) {
                player.throwBocce(mouseX, mouseY, bocce.id, bocce.p.x, bocce.p.y)
            }

            // old idea
            if (false) {
                // Online
                const bocce = balls.find((e) => e.captured == true)
                if (bocce) {
                    console.log('threw mx: ', bocce.threwMx, ' my: ', bocce.threwMy)
                    console.log('mouse mx: ', mouseX, ' my: ', mouseY)
                    const data = {
                        command: 'threw',
                        login: player.login,
                        bocce: {
                            id: bocce.id,
                            px: bocce.p.x,
                            py: bocce.p.y,
                            mx: bocce.threwMx,
                            my: bocce.threwMy,
                            active: bocce.active,
                        }
                    }
                    box.scoreboard.loginPlayedLastBall = player.login
                    client.send(JSON.stringify(data))
                }

                releaseBall()
            }
        }
    }
}

function mouseMoved() {

    if (!isLooping()) {
        return
    }

    if (box.scoreboard.isMyTimeToPlay()) {
        for (const ball of balls) {
            if (ball.captured) {
                ball.p.x = mouseX;
                ball.p.y = mouseY;
            }
        }
    }
}