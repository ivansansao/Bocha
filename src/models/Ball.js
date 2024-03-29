class Ball {

    constructor({ m, r, v, p, colr, friction, groupName, groupId, active }) {

        this.m = m // Mass scalar
        this.r = r // Ray scalar
        this.v = v || { x: 0, y: 0 } // Valocity vector
        this.p = p || { x: 0, y: 0 } // Position vector
        this.friction = friction || 1;
        this.collided = false;
        this.id = _boccePrimaryKey++;
        this.captured = 0;
        this.color = colr
        this.groupName = groupName
        this.groupId = groupId
        this.active = active

    }

    show() {

        if (this.collided) {
            fill(255, 0, 0)
        } else {
            const mapId = ceil(map(this.id, 1, _boccePrimaryKey, 50, 240))
            if (this.color) {
                fill(this.color)
            } else {
                const color = 'hsla(' + mapId + ',100%,50%,0.8)';
                fill(color)
            }

        }

        stroke(200)
        circle(this.p.x, this.p.y, this.r * 2)

        stroke(0)
        text(this.groupId, this.p.x - (this.r / 2) + 4, this.p.y + 4)

    }

    collideWalls(box) {

        if (this.p.y - this.r <= box.y) {
            this.p.y = this.r + box.y
            this.v.y = -this.v.y
        }
        if (this.p.x - this.r <= box.x) {
            this.p.x = this.r + box.x
            this.v.x = -this.v.x
        }
        if (this.p.y + this.r >= box.y1) {
            this.p.y = box.y1 - this.r
            this.v.y = -this.v.y
        }
        if (this.p.x + this.r >= box.x1) {
            this.p.x = box.x1 - this.r
            this.v.x = -this.v.x
        }

    }

    getFriction_not_used() {

        const mass = this.m; // mass of the object in kg
        const acceleration = 9.81; // gravitational acceleration in m/s^2
        const coefficientOfFriction = 0.5; // coefficient of friction

        // calculate the force of friction
        const forceOfFriction = mass * acceleration;

        // calculate the friction
        const friction = forceOfFriction * coefficientOfFriction;

        // console.log(friction); // output: 49.05
        return friction
    }

    move() {

        if (!this.captured) {
            this.p.x += this.v.x
            this.p.y += this.v.y

            // Apply friction         
            this.v.x *= this.friction
            this.v.y *= this.friction

            if (abs(this.v.x) + abs(this.v.y) < 0.02) {
                this.v.x = 0
                this.v.y = 0
            }

        }

    }

    isCollided(a, b) {

        const dx = a.p.x - b.p.x;
        const dy = a.p.y - b.p.y;
        const distance = floor(Math.sqrt(dx * dx + dy * dy));
        const raysSum = a.r + b.r
        const diference = raysSum - distance

        return { res: distance < raysSum, diference, raysSum, dx, dy }

    }
    // x1distanceTo(other) {
    //     const dx = this.p.x - other.p.x;
    //     const dy = this.p.y - other.p.y;
    //     return Math.sqrt(dx * dx + dy * dy);
    // }
    // collide() {
    //     for (const other of balls) {
    //         if (other != this && !(this.captured || other.captured)) {

    //             const dist = this.x1distanceTo(other);
    //             const overlap = this.r + other.r - dist;
    //             if (overlap > 0) {
    //                 const angle = Math.atan2(other.p.y - this.p.y, other.p.x - this.p.x);
    //                 const tx = this.p.x + overlap * Math.cos(angle);
    //                 const ty = this.p.y + overlap * Math.sin(angle);
    //                 const sx = tx - other.p.x;
    //                 const sy = ty - other.p.y;
    //                 const b = 2 * (this.v.x * sx + this.v.y * sy) / (this.r + other.r);
    //                 this.v.x -= b * other.r * sx;
    //                 this.v.y -= b * other.r * sy;
    //                 other.v.x += b * this.r * sx;
    //                 other.v.y += b * this.r * sy;
    //             } else {
    //                 this.move()
    //                 other.move()
    //             }
    //         }
    //     }
    // }
    collide() {

        for (const other of balls) {

            if (other != this && !(this.captured || other.captured)) {

                const collided = this.isCollided(this, other)

                this.collided = collided.res
                other.collided = collided.res

                const alreadyCompared = compared.find(e => (e.id1 == this.id && e.id2 == other.id) || (e.id1 == other.id && e.id2 == this.id))

                if (collided.res && !alreadyCompared && this.active && other.active) {

                    const { dx, dy } = collided
                    let angle = Math.atan2(dy, dx);
                    let sin = Math.sin(angle);
                    let cos = Math.cos(angle);

                    let c1Pos = { x: 0, y: 0 };
                    let c2Pos = { x: 0, y: 0 };

                    c1Pos.x += (cos * this.v.x) + (sin * this.v.y);
                    c1Pos.y += (cos * this.v.y) - (sin * this.v.x);
                    c2Pos.x += (cos * other.v.x) + (sin * other.v.y);
                    c2Pos.y += (cos * other.v.y) - (sin * other.v.x);

                    let c1Vel = {
                        x: (c1Pos.x * (this.m - other.m) + 2 * other.m * c2Pos.x) / (this.m + other.m),
                        y: c1Pos.y
                    }
                    let c2Vel = {
                        x: (c2Pos.x * (other.m - this.m) + 2 * this.m * c1Pos.x) / (this.m + other.m),
                        y: c2Pos.y
                    }


                    this.v.x = (cos * c1Vel.x) - (sin * c1Vel.y);
                    this.v.y = (cos * c1Vel.y) + (sin * c1Vel.x);
                    other.v.x = (cos * c2Vel.x) - (sin * c2Vel.y);
                    other.v.y = (cos * c2Vel.y) + (sin * c2Vel.x);

                    // Add a little bit of non ellastic collision
                    this.v.x = this.v.x * 0.9
                    this.v.y = this.v.y * 0.9
                    other.v.x = other.v.x * 0.9
                    other.v.y = other.v.y * 0.9

                    this.onAfterNewCollide(this, other)

                    // If it is still collided, throw ball to out

                    for (let i = 0; i < 999; i++) {
                        this.move()
                        other.move()
                        if (this.isCollided(this, other).diference <= 0) break
                    }

                } else {
                    this.move()
                    other.move()
                }

                if (!alreadyCompared) {
                    compared.push({ id1: this.id, id2: other.id })
                    compared.push({ id1: other.id, id2: this.id })
                }

            }

        }

    }

    onAfterNewCollide(a, b) {


    }



}