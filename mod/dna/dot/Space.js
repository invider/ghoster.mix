'use strict'

function Space(st) {
    this.steps = 0
    this.grid = []
    this.ghost = []

    this.name = st.name
    this.w = st.width
    this.h = st.height
}

Space.prototype.replot = function(w, h, copy) {
    const newGrid = []

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let token
            if (copy && x < this.w && y < this.h) token = this.get(x, y)

            if (!token) token = this.token() // nil
            newGrid[y*w + x] = token
        }
    }

    this.w = w
    this.h = h
    this.grid = newGrid
    if (this.onReplot) this.onReplot()
}

/*
Space.prototype.populate = function() {
    this.touchArea(0, 0, this.w, this.height, () => this.token())
}
*/

Space.prototype.get = function(x, y) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return this.token.TOKEN_OUT
    return this.grid[y*this.w + x]
}

Space.prototype.set = function(x, y, v, t) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return false
    this.grid[y*this.w + x] = this.token(v, t)
    return true
}

Space.prototype.put = function(x, y, v, t) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return -1
    const p = this.grid[y*this.w + x]
    this.grid[y*this.w + x] = this.token(v, t)
    return p
}

Space.prototype.touch = function(x, y, fn) {
    if (!fn) return
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return
    this.grid[y*this.w + x] = fn(this.grid[y*this.w + x])
}

Space.prototype.touchArea = function(x, y, w, h, fn) {
    if (!fn) return
    // normalize
    if (x < 0) x = 0
    if (x >= this.w) x = this.w - 1
    if (y < 0) y = 0
    if (y >= this.h) y = this.h - 1
    if (w < 0) w = 0
    if (x+w >= this.w) w = this.w - x
    if (h < 0) h = 0
    if (y+h >= this.h) h = this.h - y

    for (let iy = 0; iy < h; iy++) {
        for (let ix = 0; ix < w; ix++) {
            const i = (y+iy)*this.w + (x+ix)
            this.grid[i] = fn(this.grid[i])
        }
    }
}

Space.prototype.next = function() {
    this.ghost.forEach(g => {
        g.moved = false
        g.next()
        if (g.moved && g.onMove) {
            g.onMove()
        }
    })
}
