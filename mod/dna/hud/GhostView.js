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
    this.scale = 32
    this.space = st.space

    this.dt = 0
    this.period = 1
}

GhostView.prototype.evo = function(dt) {
    this.dt += dt
    if (this.dt >= this.period) {
        this.space.step()
        this.dt -= this.period
    }
}

GhostView.prototype.draw = function() {
    // adjust ghost space width and height
    const s = this.scale
    const hs = s/2
    const gx = this.gx
    const gy = this.gy
    const gw = floor(this.w / s)
    const gh = floor(this.h / s)
    this.gw = gw
    this.gh = gh

    save()
    translate(this.x, this.y)

    stroke(.1, .5, .5)
    lineWidth(2)
    rect(0, 0, this.w, this.h)

    for (let iy = 0; iy < this.gh; iy++) {
        for (let ix = 0; ix < this.gw; ix++) {
            const token = this.space.get(gx + ix, gy + iy)
            if (token.type === dna.dot.token.NIL) {
                //fill(.05, 0, .2, 0.4)
                //rect(ix*s, iy*s, s, s)
            } else if (token.type === dna.dot.token.CHAR) {
                font('30px coolville')
                baseMiddle()
                alignCenter()
                fill(.05, .7, .4)
                text(token.val, ix*s+hs, iy*s+hs)
            } else {
            }
        }
    }

    this.space.ghost.forEach(g => {
        let vx = g.x - gx
        let vy = g.y - gy
        if (vx >= 0 && vx < gw && vy >= 0 && vy < gh) {
            lineWidth(2)
            stroke(.02, .5, .5)
            circle(vx*s+hs, vy*s+hs, hs-4) 
        }
    })

    restore()
}
