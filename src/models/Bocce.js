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

        if (this.distanceLitlle <= Infinity) {
            noStroke()
            fill(0)
            textSize(14)
            // text(ceil(this.p.x) + ',' + ceil(this.p.y) + ' - ' + (this.runningPoints > 0 ? this.runningPoints : ''), this.p.x - (this.r / 2) + 8, this.p.y + 4)
            text(this.runningPoints > 0 ? this.runningPoints : '', this.p.x - (this.r / 2) + 8, this.p.y + 4)
        }

    }

    throwBall(mx, my) {

        const ball = this

        // Discovery veocity

        const maxDist = 200

        const distMouse = min(maxDist, p5.Vector.dist(createVector(mx, my), createVector(ball.p.x, ball.p.y)))

        logs.push('distMouse ' + distMouse)
        stroke(0)
        line(mouseX, mouseY, ball.p.x, ball.p.y)

        const x = mx;
        const y = my;

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
            if (this.p.y - this.r <= box.y) {
                // Top
                this.p.y = this.r + box.y
                this.v.y = -this.v.y
                this.v.y = this.v.y * 0.3
            }
        } else {
            if (this.p.y - this.r <= box.risk.y) {
                // Top
                this.p.y = this.r + box.risk.y
                this.v.y = -this.v.y
            }
        }

        if (this.p.x - this.r <= box.x) {
            // Left
            this.p.x = this.r + box.x
            this.v.x = -this.v.x
        }
        if (this.p.y + this.r >= box.y1) {
            // bottom
            this.p.y = box.y1 - this.r
            this.v.y = -this.v.y
        }
        if (this.p.x + this.r >= box.x1) {
            // Right
            this.p.x = box.x1 - this.r
            this.v.x = -this.v.x
        }

    }

    onAfterNewCollide(a, b) {
        super.onAfterNewCollide(a, b)
    }
}
