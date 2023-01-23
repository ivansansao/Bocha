class Box {
    constructor() {

        this.width = 400
        this.height = 800

        // this.x = max(350, (window.innerWidth / 2) - (this.width / 2))
        // this.y = 4 || (window.innerHeight / 2) - (this.height / 2)
        this.x = 360
        this.y = 4
        this.x1 = this.x + this.width
        this.y1 = this.y + this.height

        this.little = false
        this.nearestBocce = false
        this.scoreboard = new Scoreboard(20, 4)
        this.isStoppedGame = true

        this.risk = { x: this.x, y: this.height - (this.height / 4), x1: this.x + this.width, y1: this.height - (this.height / 4) }

        this.yellowColor = color(255, 255, 0)
        this.blueColor = color(48, 169, 255)

    }
    clearBalls() {
        balls = []
        _boccePrimaryKey = 1
    }
    putBalls() {

        this.clearBalls()

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

        let r = 0
        let colr
        let friction = 0

        // bocce.p.x = this.x + (this.width / 2)
        // bocce.p.y = this.risk.y + bocce.r

        if (groupName == 'little') {

            friction = 0.9985
            r = 10
            colr = color(100)
            balls.push(new Bocce({ colr, m: 100, r, p: { x: this.x + (this.width / 2), y: this.risk.y + r + 2 }, friction, groupName: 'little', groupId, active: false }))

            this.little = balls[0]

        } else if (groupName == 'yellow') {

            friction = 0.9992
            r = 20
            colr = color(255, 255, 0)
            balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (this.width / 2), y: this.risk.y + r + 2 }, friction, groupName: 'yellow', groupId, active: false }))

        } else if (groupName == 'blue') {

            friction = 0.9992
            r = 20
            colr = color(48, 169, 255)
            balls.push(new Bocce({ colr, m: 150, r, p: { x: this.x + (this.width / 2), y: this.risk.y + r + 2 }, friction, groupName: 'blue', groupId, active: false }))

        }

    }

    show() {

        stroke(0)
        // fill(218, 198, 171)
        // fill(255, 235, 208)
        fill(250, 248, 245)
        rect(this.x, this.y, this.width, this.height)

        stroke(200)
        line(this.risk.x, this.risk.y, this.risk.x1, this.risk.y1)

        this.scoreboard.show()

        // Show rest bocces
        stroke(0)
        let Yy = 0
        let By = 0

        for (let i = 0; i < balls.length; i++) {
            const bocce = balls[i];

            if (!bocce.active && bocce.groupName != 'little') {

                if (bocce.groupName == 'yellow') {

                    if (player.team == 'yellow') {

                        fill(this.yellowColor)
                        circle(this.x - 20 - 3, this.risk.y + (Yy * 42) + 20, 40)
                        Yy++
                    }
                } else {
                    if (player.team == 'blue') {
                        fill(this.blueColor)
                        circle(this.x + this.width + 20 + 3, this.risk.y + (By * 42) + 20, 40)
                        By++
                    }
                }

            }
        }

        if (!this.scoreboard.isMyTimeToPlay()) {

            if (game.logged) {

                if (player.opponentLogin.trim()) {
                    textSize(18)
                    textAlign(CENTER)
                    noStroke()
                    fill(0)
                    text('Aguarde ' + player.opponentLogin + ' jogar', this.x + (this.width / 2), this.risk.y + (this.height - this.risk.y) / 2)
                }
            }
        }

        this.showPaused()

    }

    showPaused() {

        if (game.paused) {
            stroke(0)
            fill(0)
            textAlign('CENTER')
            textSize(20)
            text('PAUSADO!!!', this.x + ((this.x1 - this.x) / 2), innerHeight * 1 / 2)
        }
    }

    move() {
        super.move()
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
    onStoppedGame() {

        if (this.isStoppedGame) {
            return
        }
        this.isStoppedGame = true
        console.log("Stopped game")


        // Bocces is plauing now change to played.
        for (const bocce of balls) {
            if (bocce.active) {

                if (bocce.p.y < this.risk.y) {
                    bocce.passedRisk = true
                }

                if (bocce.passedRisk) {
                    bocce.played = true
                }
                // console.log('bocce.isStopped(): ', bocce.id, bocce.isStopped(), ' Passou risco: ', bocce.passedRisk, ' played: ', bocce.played, ' Y: ', bocce.p.y, this.risk.y)
            }

        }

        const near = this.verifyDistanceLittle()
        this.scoreboard.runningWinner = near.groupName
        console.log("Calculei")

        console.log("near ==> ", this.scoreboard.runningWinner)

        this.setRunningPoints()

        this.setTimeToPlay()
        this.addBocceToPlayer()

        if (this.isEndRound()) {

            setTimeout(() => {
                this.setRoundPoints()
                this.scoreboard.update()
                this.sendPositionToEnimy()
            }, 3000)

            setTimeout(() => {
                this.clearBalls()
                this.putBalls()
                this.resetRound()
                this.verifyEndGame()

            }, 6000)

        }

        this.sendPositionToEnimy()



    }

    verifyEndGame() {

        if (this.scoreboard.getTotalYellow() > 22) {
            this.onEndGame('yellow')
        } else if (this.scoreboard.getTotalBlue() > 22) {
            this.onEndGame('blue')
        }

    }

    onEndGame(winnerTeam) {

        chat.sendRaw(toPT(winnerTeam) + ' GANHOU!!!')

        this.resetGame()

    }

    sendPositionToEnimy() {

        // Only if it was me to played!
        console.log(' last: ', this.scoreboard.loginPlayedLastBall, ' player.login: ', player.login)
        if (this.scoreboard.loginPlayedLastBall == player.login) {

            console.log("Envio de posições (allposition) para os outros! ")

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
                timeToPlay: this.scoreboard.timeToPlay,
                loginPlayedLastBall: this.scoreboard.loginPlayedLastBall,

            }
            balls.forEach(b => {
                bocces.push({ id: b.id, p: { x: b.p.x, y: b.p.y }, active: b.active })
            });
            client.send(JSON.stringify({ command: 'allposition', login: player.login, bocces, scoreboard }))

        }

    }

    amIWin() {
        return this.scoreboard.runningWinner == player.team
    }

    /**
     * Calculate point while round not finish
     */

    setRunningPoints() {

        balls.sort((a, b) => (a.distanceLitlle > b.distanceLitlle ? 1 : -1))
        // this.scoreboard.runningWinner = balls[0].groupName

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
        let nearestD = Infinity

        for (const b of balls) {

            if (b.id != this.little.id && b.active && b.played) {

                b.distanceLitlle = p5.Vector.dist(createVector(this.little.p.x, this.little.p.y), createVector(b.p.x, b.p.y))

                if (b.distanceLitlle < nearestD) {
                    nearestD = b.distanceLitlle
                    nearestBocce = b
                }
            }
        }

        return nearestBocce

    }
    clearGame() {
        this.scoreboard = new Scoreboard(20, 4)
        this.putBalls()
    }

    startGame() {
        this.clearGame()
        this.addBocceToPlayer()
    }

    resetGame() {
        this.clearGame()
        this.addBocceToPlayer()
    }

    resetRound() {
        console.log("stop reset round")
        this.winner = ''
        this.isStoppedGame = true
        this.yellowRest = 4
        this.blueTest = 4
        this.addBocceToPlayer()
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

        if (!this.amIWin()) {
            game.playSound('laugh-skull')
            // game.playSound('looser')
        }

        console.log(this.scoreboard)

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

        console.log("Bolas jogadas: ", qtd, 'team: ', team)

        return qtd

    }
    setTimeToPlay() {
        this.scoreboard.timeToPlay = this.getTimeToPlay()
    }

    getTimeToPlay() {

        let timeToPlay = ''

        if (player.opponentLogin) {

            if (this.getQtdPlayed() <= 1) {
                if (this.scoreboard.roundWinner == '' || this.scoreboard.roundWinner == 'yellow') {
                    timeToPlay = 'yellow'
                } else {
                    timeToPlay = 'blue'
                }
            } else {

                if (this.scoreboard.runningWinner == 'yellow') {
                    if (this.getQtdPlayed('blue') < 4) {
                        timeToPlay = 'blue'
                    } else {
                        timeToPlay = 'yellow'
                    }
                } else if (this.scoreboard.runningWinner == 'blue') {

                    if (this.getQtdPlayed('yellow') < 4) {
                        timeToPlay = 'yellow'
                    } else {
                        timeToPlay = 'blue'
                    }

                }
            }
        }

        console.log('Quem? ', timeToPlay)
        return timeToPlay

    }

    activeBall(team) {

        for (const bocce of balls) {
            if (bocce.groupName == team) {
                // if (!bocce.played && !bocce.playing) {
                if (!bocce.played) {
                    console.log("Activando a bola ", bocce.groupName)
                    // bocce.p.x = this.x + (this.width / 2)
                    // bocce.p.y = this.risk.y + bocce.r
                    bocce.active = true
                    game.playSound('new-bocce-1')

                    // bocce.captured = DEF_BALL_CAPTURED
                    // clickCount++
                    // console.log('clickCount')
                    break
                }
            }
        }

    }

    getBocceToPlay() {

        const timeToPay = this.getTimeToPlay()

    }

    hasActiveBocceToPlay(team) {

        let has = false
        for (const b of balls) {
            if (b.groupName == team) {
                if (b.played == false && b.active) {
                    has = true
                    break
                }
            }
        }

        return has

    }

    addBocceToPlayer() {

        const timeToPay = this.getTimeToPlay()

        console.log('addBocceToPlayer - timeToPay = ', timeToPay)

        if (player.team == 'yellow') {

            if (timeToPay == 'yellow') {
                if (!this.hasActiveBocceToPlay(timeToPay)) {
                    if (this.getQtdPlayed('little') == 0) {
                        this.activeBall('little')
                    } else {
                        this.activeBall(timeToPay)
                    }
                }
            }

        } else {

            if (timeToPay == 'blue') {
                if (!this.hasActiveBocceToPlay(timeToPay)) {
                    if (this.getQtdPlayed('little') == 0) {
                        this.activeBall('little')
                    } else {
                        this.activeBall(timeToPay)
                    }
                }
            }

        }

    }

}

function captureBall() {

    for (const bocce of balls) {

        if (bocce.isStopped() && !bocce.played) {

            const dx = bocce.p.x - mouseX;
            const dy = bocce.p.y - mouseY;
            const distance = floor(Math.sqrt(dx * dx + dy * dy));
            const collided = distance < bocce.r * 4

            if (collided && bocce.active) {

                if (player.team == bocce.groupName || bocce.groupName == 'little') {

                    if (player.team == box.scoreboard.timeToPlay) {

                        if (bocce.active) {
                            bocce.captured = DEF_BALL_CAPTURED
                            bocce.p.x = mouseX
                            bocce.p.y = mouseY

                            return true

                        } else {
                            console.log("Não pode pegar essa bola agora! (Não está ativa!) id: ", bocce.id)
                        }
                    } else {
                        console.log("Não é a sua vez!")
                    }
                } else {
                    console.log("Você não pode pegar a bola do adversário!")
                }
            }
        }
    }

    return false

}