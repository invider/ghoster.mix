const M = 10
const DM = M*2

function GhostView(st) {
    this.x = 100
    this.y = 100
    this.w = 400
    this.h = 400

    this.gx = 0
    this.gy = 0
    this.gw = 0
    this.gh = 0
    this.scale = 64
    this.font = '50px coolville'
    this.font2 = '20px coolville'
    this.font3 = '32px coolville'

    this.dt = 0
    this.mode = 1

    augment(this, st)
}

GhostView.prototype.follow = function(ghost) {
    this.target = ghost

    const view = this
    ghost.onMove = function() {
        if (view.target !== this) return
        view.adjustViewport()
    }
}

GhostView.prototype.centerAt = function(gx, gy) {
    const tx = gx - floor(this.gw/2)
    const ty = gy - floor(this.gh/2)

    this.gx = limit(tx, 0, max(this.space.w - this.gw + 1, 0))
    this.gy = limit(ty, 0, max(this.space.h - this.gh + 1, 0))

    //log(`looking at ${gx}x${gy}`)
    //log(`top left is ${this.gx}x${this.gy}`)
}

GhostView.prototype.adjustViewport = function() {
    const b = 4
    if (this.gx+1 > this.target.x) this.gx = max(this.target.x - 1, 0)
    if (this.gy+1 > this.target.y) this.gy = max(this.target.y - 1, 0)

    if (this.gx + this.gw-b < this.target.x) {
        this.gx = limit(this.target.x - this.gw+b, 0,
            this.space.w - this.gw + 1)
    }
    if (this.gy + this.gh-b < this.target.y) {
        this.gy = limit(this.target.y - this.gh+b, 0,
            this.space.h - this.gh + 1)
    }
}

GhostView.prototype.evo = function(dt) {
    // scheduling
    if (this.mode === 0) return // paused

    switch(this.mode) {

    case 1:
        this.dt += dt
        if (this.dt >= env.tune.period) {
            const tasks = this.space.nextStep()
            this.dt -= env.tune.period
        }
        break;

    case 2:
        const space = this.space
        function step() {
            const tasks = space.nextStep()
            if (space.mode === 2 && asks > 0) setTimeout(step, 0)
        }
        setTimeout(step, 0)

        break;
    }
}

function frameTargetGhost(vx, vy, s) {
    lineWidth(2)
    stroke(.2, .5, .5)

    const l = s/5
    line(vx*s, vy*s, vx*s + l, vy*s)
    line(vx*s, vy*s, vx*s, vy*s + l)

    line(vx*s+s, vy*s, vx*s+s - l, vy*s)
    line(vx*s+s, vy*s, vx*s+s, vy*s + l)

    line(vx*s, vy*s + s, vx*s, vy*s + s - l)
    line(vx*s, vy*s + s, vx*s + l, vy*s + s)

    line(vx*s + s, vy*s + s, vx*s + s -l, vy*s + s)
    line(vx*s + s, vy*s + s, vx*s + s, vy*s + s - l)

    //rect(vx*s, vy*s, s, s) 
}

GhostView.prototype.draw = function() {
    // adjust ghost space width and height
    const s = this.scale
    const hs = s/2
    const M = s * .6
    const M2 = M*2
    const gx = this.gx
    const gy = this.gy
    const gw = floor(this.w / s) + 1
    const gh = floor(this.h / s) + 1
    this.gw = gw
    this.gh = gh

    save()
    translate(this.x, this.y)
    blocky()

    /*
    // border
    stroke(.1, .5, .5)
    lineWidth(2)
    rect(0, 0, this.w, this.h)
    */

    for (let iy = 0; iy < this.gh; iy++) {
        for (let ix = 0; ix < this.gw; ix++) {
            const token = this.space.get(gx + ix, gy + iy)

            if (!token) {
                fill(.05, 0, .2, .6)
                circle(ix*s + s/2, iy*s + s/2, s*0.03)
                continue
            }

            if (token.type === dna.dot.token.OUT) {
                continue
            }

            // show grid
            //stroke(.05, 0, .2, 0.4)
            //rect(ix*s, iy*s, s, s)

            if (token.type === dna.dot.token.NIL) {
                fill(.05, 0, .2, .6)
                circle(ix*s + s/2, iy*s + s/2, s*0.03)
                //rect(ix*s, iy*s, s, s)
            } else if ( token.type === dna.dot.token.DOT ) {
                fill(token.val)
                rect(ix*s+M, iy*s+M, s-M2, s-M2)

            } else if ( token.type === dna.dot.token.SPECIAL) {
                lineWidth(3)
                stroke(.6, .6, .4)
                const b = s/6
                rect(ix*s+b, iy*s+b, s-b*2, s-b*2)

            } else if (token.type === dna.dot.token.NUM ) {
                font(this.font2)
                baseMiddle()
                alignCenter()
                fill(.05, .7, .4)
                text('' + token.val, ix*s+hs, iy*s+hs)


            } else if (token.type === dna.dot.token.CHAR ) {
                font(this.font)
                baseMiddle()
                alignCenter()
                fill(.05, .7, .4)
                text(token.val, ix*s+hs, iy*s+hs)

            } else if (token.type === dna.dot.token.STR ) {
                font(this.font2)
                baseMiddle()
                alignCenter()
                fill(.05, .7, .4)
                text(token.val.substring(0,3), ix*s+hs, iy*s+hs)

            } else {
                font(this.font2)
                baseMiddle()
                alignCenter()
                fill(.05, .7, .4)
                text('?', ix*s+hs, iy*s+hs)
            }
        }
    }

    const target = this.target
    this.space.ghost.forEach(g => {
        let vx = g.x - gx
        let vy = g.y - gy
        if (vx >= 0 && vx < gw && vy >= 0 && vy < gh) {
            let img
            switch(g.lastMove) {
            case 1: img = res.ghost[1]; break;
            case 2: img = res.ghost[4]; break;
            case 3: img = res.ghost[3]; break;
            default: img = res.ghost[2]; break;
            }

            image(img, vx*s, vy*s, s, s)

            if (g === target) {
                frameTargetGhost(vx, vy, s)
            }
        }
    })

    if (env.status) {
        alignLeft()
        baseBottom()
        font(this.font3)
        fill(.15, .4, .4)
        text(env.status, 20, this.h-30)
    }

    restore()

}
