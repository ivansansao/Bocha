class BotPlayer {
    static throwX = 0
    static throwY = 0
    static ia = new NeuralNetwork({ f1: 'sigmoid', f2: 'sigmoid' })

    static captureBocce() {

        let captured = false

        console.log('BotPlayer.captureBocce()')

        if (box.scoreboard.isMyTimeToPlay()) {

            const bocce = balls.find((e) => e.captured == true)
            if (!bocce) {
                const toPlay = balls.find(bocce => bocce.active && !bocce.played)
                if (toPlay) {
                    captured = captureBall(toPlay.p.x, toPlay.p.y)
                } else {
                    console.log('Bot: Não consegui capturar uma bola!')
                }
            }
        }

        return captured

    }
    static think() {
        const inputs = this.getViewForIA()
        console.log('viewForIA: ', inputs)

        // this.ia.mutate(Number(random(0.01, 0.8).toFixed(15)));
        const out = Array.from(this.ia.think(inputs)).map(e => Number(e.toFixed(3)))

        console.log(out)
        return { start01X: out[0], start01Y: out[1], throw01X: out[2], throw01Y: out[3] }
        // return { start01X: random(0, 1), start01Y: random(0, 1), throw01X: random(0, 1), throw01Y: random(0, 1) }
    }

    static setStartThrow(x, y) {

        const bocce = balls.find((e) => e.captured == true)
        bocce.p.x = map(x, 0, 1, 353, 747)
        bocce.p.y = map(y, 0, 1, 598, 798)
    }

    static throw() {

        setTimeout(() => {

            if (this.captureBocce()) {
                const { start01X, start01Y, throw01X, throw01Y } = this.think()
                const bocce = balls.find((e) => e.captured == true)

                this.setStartThrow(start01X, start01Y)

                this.throwX = map(throw01X, 0, 1, bocce.p.x, bocce.p.x + 250)
                this.throwY = map(throw01Y, 0, 1, bocce.p.y, bocce.p.y + 250)

                setTimeout(() => {
                    setTimeout(() => {
                        this.specialThrow(throw01X, throw01Y)
                    }, 1000)
                }, 1000)
            }
        }, 1000)
    }

    static specialThrow(x, y) {

        const bocce = balls.find((e) => e.captured == true)
        x = map(x, 0, 1, bocce.p.x, bocce.p.x + 250)
        y = map(y, 0, 1, bocce.p.y, bocce.p.y + 250) // Force is from the bocce position.
        // bocce.throw(x, y)
        player.throwBocce(x, y, bocce.id, bocce.p.x, bocce.p.y)

    }

    static update() {
        const bocce = balls.find((e) => e.captured == true)
        if (bocce) {
            bocce.calcThrowForce(this.throwX, this.throwY)
        }
    }

    static getBallsBoxCoords() {

        const toBox = []

        balls.sort((a, b) => (a.id > b.id ? 1 : -1))

        balls.forEach((b) => {
            if (b.active) {
                const conv = convertCoordToBox(b.p.x, b.p.y)
                toBox.push(conv.x)
                toBox.push(conv.y)
            } else {
                toBox.push(-1)
                toBox.push(-1)
            }

        })

        return toBox

    }

    static getViewForIA() {
        const iaView = this.getBallsBoxCoords()
        if (box.scoreboard.timeToPlay == 'yellow') {
            iaView.push(0)
        } else {
            iaView.push(1)
        }
        return iaView
    }

    static improve() {
        console.log('   X9 Nova rede!')
        // this.ia = new NeuralNetwork({ f1: 'sigmoid', f2: 'sigmoid' })
        this.ia.mutate(Number(random(0.01, 0.8).toFixed(15)));
        console.log('  Mutada ' + this.ia.mutatedNeurons)
    }

}