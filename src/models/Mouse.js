function mousePressed(event) {

    if (!isLooping()) {
        return
    }

    if (box.scoreboard.isMyTimeToPlay()) {

        const bocce = balls.find((e) => e.captured == true)
        if (!bocce) {
            captureBall()
        }
    }

}

function mouseReleased() {

    if (!isLooping()) {
        return
    }

    if (box.scoreboard.isMyTimeToPlay()) {

        const bocce = balls.find((e) => e.captured == true)
        if (bocce) {
            if (bocce.captureStage == 1) {
                player.throwBocce(mouseX, mouseY, bocce.id, bocce.p.x, bocce.p.y)
            }
            bocce.captureStage++
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