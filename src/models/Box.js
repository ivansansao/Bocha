class Box {
    constructor() {

        this.width = 400
        this.height = 800

        this.x = max(350, (window.innerWidth / 2) - (this.width / 2))
        this.y = 4 || (window.innerHeight / 2) - (this.height / 2)
        this.x1 = this.x + this.width
        this.y1 = this.y + this.height

        this.little = false
        this.nearestBocce = false
        this.scoreboard = new Scoreboard(20, 4)
        this.isStoppedGame = true

        this.risk = { x: this.x, y: this.height - (this.height / 4), x1: this.x + this.width, y1: this.height - (this.height / 4) }

    }
    putBalls() {

        let friction = 0.999

        let r = 10
        let colr = color(100)
        balls.push(new Bocce({ colr, m: 100, r, p: { x: this.x + (this.width / 2), y: this.y1 - (r * (2 * 4)) - (2 * 4) }, friction, groupName: 'litle', groupId: 0 }))

        friction = 0.9992

        this.little = balls[0]

        r = 20
        colr = color(255, 255, 0)
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (r * 1) + 1, y: this.y1 - (r * (2 * 1)) - (2 * 1) }, friction, groupName: 'yellow', groupId: 1 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (r * 1) + 1, y: this.y1 - (r * (2 * 2)) - (2 * 2) }, friction, groupName: 'yellow', groupId: 2 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (r * 1) + 1, y: this.y1 - (r * (2 * 3)) - (2 * 3) }, friction, groupName: 'yellow', groupId: 3 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (r * 1) + 1, y: this.y1 - (r * (2 * 4)) - (2 * 4) }, friction, groupName: 'yellow', groupId: 4 }))

        r = 20
        colr = color(48, 169, 255)

        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + this.width - (r * 1) + 1, y: this.y1 - (r * (2 * 1)) - (2 * 1) }, friction, groupName: 'blue', groupId: 5 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + this.width - (r * 1) + 1, y: this.y1 - (r * (2 * 2)) - (2 * 2) }, friction, groupName: 'blue', groupId: 6 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + this.width - (r * 1) + 1, y: this.y1 - (r * (2 * 3)) - (2 * 3) }, friction, groupName: 'blue', groupId: 7 }))
        balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + this.width - (r * 1) + 1, y: this.y1 - (r * (2 * 4)) - (2 * 4) }, friction, groupName: 'blue', groupId: 8 }))

    }

    stoppedGame() {
        for (const b of balls) {
            if (b.v.x != 0 || b.v.y != 0) {
                if (!b.captured) {
                    this.isStoppedGame = false
                    return false
                }
            }
        }
        this.onStoppedGame()
        return true
    }

    show() {

        stroke(0)
        fill(255)
        rect(this.x, this.y, this.width, this.height)

        stroke(200)
        line(this.risk.x, this.risk.y, this.risk.x1, this.risk.y1)

        this.scoreboard.show()

    }

    move() {
        super.move()
    }

    onStoppedGame() {

        if (this.isStoppedGame) {
            return
        }
        this.isStoppedGame = true

        console.log("Stopped game")

        this.verifyDistanceLittle()
        console.log("Calculei")

        // Bocces is plauing now change to played.
        for (const bocce of balls) {
            if (bocce.playing) {
                bocce.playing = false
                bocce.played = true
            }
        }

        this.setRunningPoints()

        if (this.isEndRound()) {

            setTimeout(() => {
                this.setRoundPoints()
                this.scoreboard.update()
            }, 3000)

            setTimeout(() => {
                balls = []
                this.putBalls()
                this.resetRound()

            }, 6000)

        }
    }

    /**
     * Calculate point while round not finish
     */

    setRunningPoints() {

        balls.sort((a, b) => (a.distanceLitlle > b.distanceLitlle ? 1 : -1))
        this.scoreboard.runningWinner = balls[0].groupName

        let pointsYellow = 0
        let pointsBlue = 0

        console.log('Running Winner: ', this.scoreboard.runningWinner)

        for (const bocce of balls) {
            bocce.runningPoints = 0
        }

        for (const bocce of balls) {

            if (bocce.played) {

                if (bocce.groupName == this.scoreboard.runningWinner) {
                    console.log(bocce.groupName, bocce.distanceLitlle)
                    if (this.scoreboard.runningWinner == 'yellow') {
                        pointsYellow += 2
                        bocce.runningPoints = pointsYellow
                    } else {
                        pointsBlue += 2
                        bocce.runningPoints = pointsBlue
                    }
                } else {
                    break
                }

            }
        }

        this.scoreboard.runningYellow = pointsYellow
        this.scoreboard.runningYblue = pointsBlue

    }

    verifyDistanceLittle() {

        let nearestBocce = false
        let nearestD = 999

        for (const b of balls) {
            if (b != this.little) {
                b.distanceLitlle = p5.Vector.dist(createVector(this.little.p.x, this.little.p.y), createVector(b.p.x, b.p.y))

                if (b.distanceLitlle < nearestD) {
                    nearestD = b.distanceLitlle
                    nearestBocce = b
                }
            }
        }

        return nearestBocce

    }

    resetGame() {
    }

    resetRound() {
        this.winner = ''
        this.isStoppedGame = true
    }

    isEndRound() {
        for (const b of balls) {
            if (!b.played) {
                return false
            }
        }
        console.log('End round')
        return true
    }

    setRoundPoints() {

        console.log("tem balls: ", balls)
        balls.sort((a, b) => (a.distanceLitlle > b.distanceLitlle ? 1 : -1))
        this.scoreboard.roundWinner = balls[0].groupName

        let pointsYellow = 0
        let pointsBlue = 0

        console.log('Winner: ', this.scoreboard.roundWinner)

        for (const bocce of balls) {

            if (bocce.groupName == this.scoreboard.roundWinner) {
                console.log(bocce.groupName, bocce.distanceLitlle)
                if (this.scoreboard.roundWinner == 'yellow') {
                    pointsYellow += 2
                } else {
                    pointsBlue += 2
                }
            } else {
                break
            }

        }

        this.scoreboard.yellow.push(pointsYellow)
        this.scoreboard.blue.push(pointsBlue)

        console.log(this.scoreboard)

    }
    throwBall() {

        for (const bocce of balls) {
            if (bocce.captured == DEF_BALL_CAPTURED) {
                bocce.throwBall()

            }

        }
    }

}

function releaseBall() {

    for (const bocce of balls) {

        if (bocce.captured == DEF_BALL_CAPTURED) {

            console.log(bocce.v.y)
            // Ig ball is moving to up them it is considered playing
            if (bocce.v.y < 0) {
                bocce.playing = true
                client.send(`Jogou a bola ${bocce.groupName} número ${bocce.groupId}`)
            }
            bocce.captured = DEF_BALL_RELEASED

        }

    }
}
function captureBall() {

    for (const bocce of balls) {

        if (!bocce.playing && !bocce.played) {

            const dx = bocce.p.x - mouseX;
            const dy = bocce.p.y - mouseY;
            const distance = floor(Math.sqrt(dx * dx + dy * dy));
            const raysSum = bocce.r + 1
            const collided = distance < raysSum

            if (collided) {
                bocce.captured = DEF_BALL_CAPTURED
            }
        }
    }

}