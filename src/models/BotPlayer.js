class BotPlayer {
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
        return { start01X: random(0, 1), start01Y: random(0, 1), throw01X: random(0, 1), throw01Y: random(0, 1) }
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
                if (bocce) {
                    this.setStartThrow(start01X, start01Y)
                    setTimeout(() => {
                        this.specialThrow(throw01X, throw01Y)
                    }, 1000)
                }
            }
        }, 1000)
    }

    static specialThrow(x, y) {

        const bocce = balls.find((e) => e.captured == true)
        x = map(x, 0, 1, 353, 747)
        y = map(y, 0, 1, 598, 798)
        // bocce.throw(x, y)
        player.throwBocce(x, y, bocce.id, bocce.p.x, bocce.p.y)

    }

}