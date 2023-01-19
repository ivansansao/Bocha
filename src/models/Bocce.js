class Bocce extends Ball {

    constructor(args) {

        super(args)
        this.distanceLitlle = Infinity
        this.nearest = false
        this.played = false
        // this.playing = false // old idea
        this.passedRisk = false
        this.pointed = false
        this.runningPoints = 0
        this.threwMx = 0
        this.threwMy = 0

    }

    update(box) {

        if (mouseIsPressed) {
            if (this.captured == DEF_BALL_CAPTURED) {
                this.calcThrowForce(mouseX, mouseY)
            }
        }

        if (this.p.y < box.risk.y) {
            if (!this.passedRisk) {
                console.log("Passou do risco")
            }
            this.passedRisk = true
        }

    }

    show() {

        if (!this.active) {
            return
        }

        if (this.active) {
            stroke(0, 255, 0)
            circle(this.p.x - 25, this.p.y, this.r / 2)
        }

        if (this.captured) {
            stroke(255, 0, 0)
            noFill()
            circle(this.p.x, this.p.y, (this.r * 2) + 10)
        }

        if (this.groupName != 'little') {
            if (this.groupName != player.team) {
                // if (!this.playing && !this.played) {
                if (this.isStopped() && !this.played) {
                    return
                }
            }
        }

        fill(this.color)

        stroke(0)
        circle(this.p.x, this.p.y, this.r * 2)

        if (this.distanceLitlle <= Infinity) {
            noStroke()
            fill(0)
            textSize(14)
            // text(ceil(this.p.x) + ',' + ceil(this.p.y) + ' - ' + (this.runningPoints > 0 ? this.runningPoints : ''), this.p.x - (this.r / 2) + 8, this.p.y + 4)
            text(this.runningPoints > 0 ? this.runningPoints : '', this.p.x - (this.r / 2) + 8, this.p.y + 4)

            // debug
            if (true) {
                textAlign(LEFT)
                const px = this.p.x - (this.r / 2) + 8
                const py = this.p.y + 4
                const txt = `id: ${this.id} px: ${this.p.x.toFixed(2)} py: ${this.p.y.toFixed(2)}`
                text(txt, px + 25, py)

                if (this.active) {
                    stroke(255)
                    fill(255, 0, 0)
                    circle(this.p.x + 8, this.p.y, 10)
                }
            }

        }

    }

    calcThrowForce(mx, my) {

        this.threwMx = mx
        this.threwMy = my

        // Discovery veocity

        const maxDist = 200

        const distMouse = min(maxDist, p5.Vector.dist(createVector(mx, my), createVector(this.p.x, this.p.y)))

        stroke(0, 200, 40)
        line(mx, my, this.p.x, this.p.y)

        // Calcula a direção da bola com base na posição atual da bola e na posição do mouse
        const direction = Math.atan2(my - this.p.y, mx - this.p.x);

        const force = map(distMouse, 0, maxDist, 0, 0.9)

        // Caculate final velocity
        const VxF = -Math.cos(direction) * force
        const VyF = -Math.sin(direction) * force

        // validOrError(!(VxF == 0 && VyF == 0), `Problems calculating launch force! VxF: ${VxF} VyF: ${VyF}`)

        return { VxF, VyF }

    }

    throw(mx, my) {

        validOrError(this.captured == DEF_BALL_CAPTURED, 'Attempting to throw uncaught ball!')

        const finalVel = this.calcThrowForce(mx, my)

        if (finalVel.VxF != 0 && finalVel.VyF != 0) {

            this.v.x = finalVel.VxF
            this.v.y = finalVel.VyF

            this.captured = DEF_BALL_RELEASED
            // this.playing = true // old idea

            return true

        }

        return false

    }


    collideWalls(box) {

        if (this.isRolling()) {

            if (this.p.y - this.r <= box.y) {
                // Top
                this.p.y = this.r + box.y
                this.v.y = -this.v.y
                this.v.y = this.v.y * 0.3
                game.playSound('lateral-wall')
            }
        } else {
            if (!this.passedRisk) {
                if (this.p.y - this.r <= box.risk.y) {
                    // Top
                    this.p.y = this.r + box.risk.y
                    this.v.y = -this.v.y
                }
            }
        }

        if (this.p.x - this.r <= box.x) {
            // Left
            this.p.x = this.r + box.x
            this.v.x = -this.v.x
            game.playSound('lateral-wall')
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
            game.playSound('lateral-wall')
        }

    }

    onAfterNewCollide(a, b) {
        game.playSound('ball')
        super.onAfterNewCollide(a, b)

    }

    isStopped() {
        return this.v.x == 0 && this.v.y == 0
    }

    isRolling() {
        return this.v.x != 0 || this.v.y != 0
    }
}
