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
    }
    show() {

        textAlign(LEFT)
        noStroke()
        fill(0)
        textSize(18)

    }
    throwBocce(mx, my, idBocce, px, py) {

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
