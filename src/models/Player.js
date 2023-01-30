class Player {

    /**
     * Proxy: It is a remote player
     * 
     */

    constructor({ login, team, proxy }) {
        this.login = login
        this.team = team
        this.opponentLogin = ''
        this.x = 20
        this.y = 300
        this.rowHeight = 28
        this.proxy = proxy
        this.pointBeforePlay = 0
    }
    show() {

        textAlign(LEFT)
        noStroke()
        fill(0)
        textSize(18)

    }
    clear() {
        this.login = ''
        this.team = ''
        this.opponentLogin = ''
    }

    beforePlay() {
        if (!this.proxy) {
            this.pointBeforePlay = player.team == 'yellow' ? box.scoreboard.runningYellow : box.scoreboard.runningBlue
            console.log("X9 Antes de eu jogar? ", this.pointBeforePlay)
        }
    }

    afterPlay(lastTeam) {

        if (!this.proxy) {
            if (lastTeam == this.team) {

                const played = balls.some(e => e.id > 1 && e.played)
                if (played) {

                    const pointAfter = player.team == 'yellow' ? box.scoreboard.runningYellow : box.scoreboard.runningBlue
                    console.log(' X9 ANTES: ', this.pointBeforePlay, ' DEPOIS: ', pointAfter, ' my tem: ', this.team)

                    if (pointAfter == 0 || (pointAfter < this.pointBeforePlay)) {
                        console.log('X9 Precisa melhorar')

                        if (BotPlayerOn) {
                            BotPlayer.improve()
                        }
                    }

                }
            }
        }


    }
    throwBocce(mx, my, idBocce, px, py) {
        this.beforePlay()

        const bocce = this.getBocceById(idBocce)

        // validOrError(bocce.captured == DEF_BALL_CAPTURED, 'Not possible to throw uncaoug ball')
        // validOrError(bocce.active, 'Not possible to throw inactive ball')
        validOrError(bocce.v.x == 0 && bocce.v.y == 0, 'Not possible to throw non stopped ball')

        bocce.p.x = px
        bocce.p.y = py

        if (this.proxy) {
            bocce.active = true
            bocce.captured = DEF_BALL_CAPTURED
        }

        if (bocce.throw(mx, my)) {

            if (!this.proxy) {

                box.scoreboard.loginPlayedLastBall = player.login

                const data = {
                    from: player.login,
                    to: player.opponentLogin,
                    command: 'threw',
                    login: this.login,
                    bocce: {
                        id: idBocce,
                        px: px,
                        py: py,
                        mx: mx,
                        my: my,
                        active: true
                    }
                }

                client.send(JSON.stringify(data))
            }

        }

    }

    getBocceById(idBocce) {

        const bocce = balls.find((e) => e.id == idBocce)
        validOrError(typeof bocce === 'object', 'Bocce id is not valid (Get bocce by id)')

        return bocce
    }
}
