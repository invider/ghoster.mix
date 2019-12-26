'use strict'

function Space(st) {
    this.steps = 0
    this.arena = []
    this.ghost = []

    this.name = st.name
    this.w = st.width
    this.h = st.height
}

Space.prototype.populate = function() {
    this.touchArea(0, 0, this.w, this.height, () => this.token())
    
    /*
    this.arena[2] = this.token('x')
    this.arena[5] = this.token('v')
    this.arena[4] = this.token('#ff0000', this.token.DOT, [255, 0, 0] )
    */
}

Space.prototype.get = function(x, y) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.height) return 
    return this.arena[y*this.w + x]
}

Space.prototype.set = function(x, y, v, t) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.height) return false
    this.arena[y*this.w + x] = this.token(v, t)
    return true
}

Space.prototype.put = function(x, y, v, t) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.height) return -1
    const p = this.arena[y*this.w + x]
    this.arena[y*this.w + x] = this.token(v, t)
    return p
}

Space.prototype.touch = function(x, y, fn) {
    if (!fn) return
    if (x < 0 || x >= this.w || y < 0 || y >= this.height) return
    this.arena[y*this.w + x] = fn(this.arena[y*this.w + x])
}

Space.prototype.touchArea = function(x, y, w, h, fn) {
    if (!fn) return
    // normalize
    if (x < 0) x = 0
    if (x >= this.w) x = this.w - 1
    if (y < 0) y = 0
    if (y >= this.height) y = this.height - 1
    if (w < 0) w = 0
    if (x+w >= this.w) w = this.w - x
    if (h < 0) h = 0
    if (y+h >= this.height) h = this.height - y

    for (let iy = 0; iy < h; iy++) {
        for (let ix = 0; ix < w; ix++) {
            const i = (y+iy)*this.w + (x+ix)
            this.arena[i] = fn(this.arena[i])
        }
    }
}

Space.prototype.next = function() {
    this.ghost.forEach(g => {
        g.moved = false
        g.next()
        if (g.moved && g.onMove) {
            g.onMove()
            log(g.name + ' moved')
        }
    })
}

