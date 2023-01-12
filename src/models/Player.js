class Player {
    constructor({ login, team, opponentName }) {
        this.login = login
        this.team = team
        this.opponentLogin = ''
        this.x = 20
        this.y = 300
        this.rowHeight = 28
    }
    show() {

        textAlign(LEFT)
        noStroke()
        fill(0)
        textSize(18)

        text('Login: ' + this.login, this.x, this.y + (this.rowHeight * 0))
        text('Time: ' + toPT(this.team), this.x, this.y + (this.rowHeight * 1))
        text('Adversário: ' + toPT(this.opponentLogin), this.x, this.y + (this.rowHeight * 2))


    }
}