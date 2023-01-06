class Bocce extends Ball {
    constructor(args) {
        super(args)
        this.distanceLitlle = Infinity
        this.nearest = false
        this.played = false
        this.playing = false
        this.passedRisk = false
        this.pointed = false
        this.runningPoints = 0
    }
    show() {
        if (this.captured) {
            stroke(255, 0, 0)
            noFill()
            circle(this.p.x, this.p.y, (this.r * 2) + 10)
        }

        fill(this.color)

        stroke(200)
        circle(this.p.x, this.p.y, this.r * 2)

        if (this.distanceLitlle < Infinity) {
            noStroke()
            fill(0)
            textSize(14)
            text(this.runningPoints > 0 ? this.runningPoints : '', this.p.x - (this.r / 2) + 8, this.p.y + 4)
            // text(floor(this.distanceLitlle) + ' ' + (this.runningPoints), this.p.x - (this.r / 2) + 8, this.p.y + 4)
        }

    }

    throwBall() {

        const ball = this

        // Discovery veocity

        const maxDist = 200

        const distMouse = min(maxDist, p5.Vector.dist(createVector(mouseX, mouseY), createVector(ball.p.x, ball.p.y)))

        logs.push('distMouse ' + distMouse)
        stroke(0)
        line(mouseX, mouseY, ball.p.x, ball.p.y)

        const x = mouseX;
        const y = mouseY;

        // Calcula a direção da bola com base na posição atual da bola e na posição do mouse
        const direction = Math.atan2(y - ball.p.y, x - ball.p.x);

        const force = map(distMouse, 0, maxDist, 0, 0.9)

        // Apply velocity
        // Atualiza a posição da bola com base na direção
        const VxF = -Math.cos(direction) * force
        const VyF = -Math.sin(direction) * force

        logs.push('direction ' + direction)
        logs.push('force ' + force)
        logs.push('Math.cos(direction) ' + Math.cos(direction))
        logs.push('Math.sin(direction) ' + Math.sin(direction))

        ball.v.x = VxF;
        ball.v.y = VyF;

        showInfo();

        return force

    }


    collideWalls(box) {

        if (this.played || this.playing) {
            super.collideWalls(box)
        } else {

            const condBox = { ...box }
            condBox.y = box.risk.y
            // condBox.y1 = box.risk.y1
            super.collideWalls(condBox)
        }

    }
}
