function mousePressed(event) {

    if (!isLooping()) {
        return
    }

    if (box.scoreboard.isMyTimeToPlay()) {
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

        if (clickCount % 2 == 0) {

            const bocce = balls.find((e) => e.captured == true)
            if (bocce) {
                player.throwBocce(mouseX, mouseY, bocce.id, bocce.p.x, bocce.p.y)
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