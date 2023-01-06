class Scoreboard {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.roundWinner = ''
        this.yellow = []
        this.blue = []
        this.runningWinner = ''
        this.runningYellow = 0
        this.runningBlue = 0
        this.msg = 'Vamos lá'
    }

    getTotalYellow() {
        return this.yellow.reduce((a, b) => a + b, 0)
    }
    getTotalBlue() {
        return this.blue.reduce((a, b) => a + b, 0)
    }

    update() {

        // Round points
        console.log('score update: ', this.roundWinner)

        let pointsYellow = this.yellow[this.yellow.length - 1]
        let pointsBlue = this.blue[this.blue.length - 1]

        const points = pointsYellow > 0 ? pointsYellow : pointsBlue

        if (this.roundWinner != "") {
            this.msg = points + ' ' + toPT(this.roundWinner)
        }

    }

    show() {

        const { x, y } = this
        const w = 324
        const h = 50
        const hTitle = 40
        const y2 = y + hTitle
        const y3 = y2 + h
        const yellow = this.getTotalYellow()
        const blue = this.getTotalBlue()
        const wB = w / 12

        textAlign(CENTER);
        textStyle(BOLD);
        textSize(22)

        noStroke()
        fill(0)
        text('PLACAR', x + (w / 2), y + (hTitle / 2) + 8)
        stroke(0)
        noFill()
        rect(x, y, w, hTitle)

        fill(255, 255, 0)
        rect(x, y2, w, h) // Yellow

        fill(48, 169, 255)
        rect(x, y3, w, h) // Blue

        let sumYellow = 0
        let sumBlue = 0

        for (let i = 0; i < 12; i++) {

            stroke(0)
            fill(0)
            textSize(22)
            line(x + (i * wB), y2, x + (i * wB), y2 + h)
            line(x + (i * wB), y3, x + (i * wB), y3 + h)




            if (i * 2 == yellow) {
                noStroke()
                fill(255)
                rect(x + (i * wB) + 1, y2 + 1, wB - 2, h - 2)
                fill(0)
                text(i * 2, x + (i * wB) + 13, y2 + (h / 2) + 7.5)
                stroke(0)

            } else {
                fill(100)
                stroke(100)
                circle(x + (i * wB) + (wB / 2), y2 + (h / 2), 10)
            }


            if (i * 2 == blue) {
                noStroke()
                fill(255)
                rect(x + (i * wB) + 1, y3 + 1, wB - 2, h - 2)
                fill(0)
                text(i * 2, x + (i * wB) + 13, y3 + (h / 2) + 7.5)
                stroke(0)
            } else {
                fill(100)
                stroke(100)
                circle(x + (i * wB) + (wB / 2), y3 + (h / 2), 10)

            }

        }

        for (let i = 0; i < 12; i++) {
            sumYellow += this.yellow[i]
            if (sumYellow < 24 && sumYellow > 0 && sumYellow != yellow) {
                noStroke()
                fill(255)
                textSize(8)
                text(sumYellow, x + (wB * (sumYellow / 2)) + (wB / 2), y2 + (h / 2) + 2.5)
            }
            sumBlue += this.blue[i]
            if (sumBlue < 24 && sumBlue > 0 && sumBlue != blue) {
                noStroke()
                fill(255)
                textSize(8)
                text(sumBlue, x + (wB * (sumBlue / 2)) + (wB / 2), y3 + (h / 2) + 2.5)
            }
        }

        // Bottom area

        const y4 = y3 + h

        stroke(0)
        fill(255)
        rect(x, y4, w, h)
        noStroke()
        fill(0)
        textSize(22)
        text(this.msg, x + (w / 2), y4 + (h / 2) + 8)

    }

}