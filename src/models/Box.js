class Box {
    constructor() {

        this.width = 400
        this.height = 800

        // this.x = max(350, (window.innerWidth / 2) - (this.width / 2))
        // this.y = 4 || (window.innerHeight / 2) - (this.height / 2)
        this.x = 350
        this.y = 4
        this.x1 = this.x + this.width
        this.y1 = this.y + this.height

        this.little = false
        this.nearestBocce = false
        this.scoreboard = new Scoreboard(20, 4)
        this.isStoppedGame = true

        this.risk = { x: this.x, y: this.height - (this.height / 4), x1: this.x + this.width, y1: this.height - (this.height / 4) }

    }
    putBalls() {

        balls = []

        this.addBall('little', 0)
        this.addBall('yellow', 1)
        this.addBall('yellow', 2)
        this.addBall('yellow', 3)
        this.addBall('yellow', 4)
        this.addBall('blue', 1)
        this.addBall('blue', 2)
        this.addBall('blue', 3)
        this.addBall('blue', 4)

    }

    addBall(groupName, groupId) {

        let friction = 0.999
        let r = 0
        let colr

        if (groupName == 'little') {

            friction = 0.999
            r = 10
            colr = color(100)
            balls.push(new Bocce({ colr, m: 100, r, p: { x: this.x + (this.width / 2), y: this.y1 - (r * (2 * 4)) - (2 * 4) }, friction, groupName: 'little', groupId }))

            this.little = balls[0]

        } else if (groupName == 'yellow') {

            friction = 0.9992
            r = 20
            colr = color(255, 255, 0)
            balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (r * 1) + 1, y: this.y1 - (r * (2 * groupId)) - (2 * groupId) }, friction, groupName: 'yellow', groupId }))

        } else if (groupName == 'blue') {

            friction = 0.9992
            r = 20
            colr = color(48, 169, 255)
            balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + this.width - (r * 1) + 1, y: this.y1 - (r * (2 * groupId)) - (2 * groupId) }, friction, groupName: 'blue', groupId }))

        }




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
        this.sendPositionToEnimy()

        this.verifyDistanceLittle()
        console.log("Calculei")


        // Bocces is plauing now change to played.
        for (const bocce of balls) {
            if (bocce.playing) {

                bocce.playing = false

                if (bocce.p.y < this.risk.y) {
                    bocce.passedRisk = true
                }

                if (bocce.passedRisk) {
                    bocce.played = true
                }

            }
        }

        this.setRunningPoints()

        this.setTimeToPlay()


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

    sendPositionToEnimy() {
        const bocces = []
        const scoreboard = {
            x: this.scoreboard.x,
            y: this.scoreboard.y,
            roundWinner: this.scoreboard.roundWinner,
            yellow: this.scoreboard.yellow,
            blue: this.scoreboard.blue,
            runningWinner: this.scoreboard.runningWinner,
            runningYellow: this.scoreboard.runningYellow,
            runningBlue: this.scoreboard.runningBlue,
            msg: this.scoreboard.msg,
        }
        balls.forEach(b => {
            bocces.push({ id: b.id, p: { x: b.p.x, y: b.p.y } })
        });
        client.send(JSON.stringify({ command: 'allposition', login, bocces, scoreboard }))
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
    throwBall(mx, my) {

        for (const bocce of balls) {
            if (bocce.captured == DEF_BALL_CAPTURED) {
                bocce.throwBall(mx, my)
            }

        }
    }
    getQtdPlayed(team = '') {

        let qtd = 0
        team = team.trim()

        for (const b of balls) {
            if (b.played) {
                if (b.groupName == 'little' && team == 'little') qtd++
                if (b.groupName == 'yellow' && team == 'yellow') qtd++
                if (b.groupName == 'blue' && team == 'blue') qtd++
                if (team == '') qtd++
            }
        }

        return qtd

    }
    setTimeToPlay() {

        if (this.getQtdPlayed() <= 1 && this.scoreboard.yellow == 0 && this.scoreboard.blue == 0) {
            this.scoreboard.timeToPlay = 'yellow'
        } else {

            if (this.scoreboard.runningWinner == 'yellow') {
                if (this.getQtdPlayed('blue') < 4) {
                    this.scoreboard.timeToPlay = 'blue'
                } else {
                    this.scoreboard.timeToPlay = 'yellow'
                }
            } else if (this.scoreboard.runningWinner == 'blue') {

                if (this.getQtdPlayed('yellow') < 4) {
                    this.scoreboard.timeToPlay = 'yellow'
                } else {
                    this.scoreboard.timeToPlay = 'blue'
                }

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
                //     const data = {
                //         command: 'threw',
                //         login,
                //         bocce: {
                //             id: bocce.id,
                //             px: bocce.p.x,
                //             py: bocce.p.y,
                //             mx: mouseX,
                //             my: mouseY
                //         }

                //     }
                bocce.playing = true
                //     client.send(JSON.stringify(data))
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