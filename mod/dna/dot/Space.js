'use strict'

function Space(st) {
    this.arena = []
    this.ghost = []

    this.name = st.name
    this.width = st.width
    this.height = st.height
}

Space.prototype.populate = function() {
    this.touchArea(0, 0, this.width, this.height, () => this.token())
    this.arena[2] = this.token('x')
    this.arena[5] = this.token('v')
}

Space.prototype.get = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1
    return this.arena[y*this.width + x]
}

Space.prototype.set = function(x, y, v, t) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false
    this.arena[y*this.width + x] = this.token(v, t)
    return true
}

Space.prototype.put = function(x, y, v, t) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1
    const p = this.arena[y*this.width + x]
    this.arena[y*this.width + x] = this.token(v, t)
    return p
}

Space.prototype.touch = function(x, y, fn) {
    if (!fn) return
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return
    this.arena[y*this.width + x] = fn(this.arena[y*this.width + x])
}

Space.prototype.touchArea = function(x, y, w, h, fn) {
    if (!fn) return
    // normalize
    if (x < 0) x = 0
    if (x >= this.width) x = this.width - 1
    if (y < 0) y = 0
    if (y >= this.height) y = this.height - 1
    if (w < 0) w = 0
    if (x+w >= this.width) w = this.width - x
    if (h < 0) h = 0
    if (y+h >= this.height) h = this.height - y

    for (let iy = 0; iy < h; iy++) {
        for (let ix = 0; ix < w; ix++) {
            const i = (y+iy)*this.width + (x+ix)
            this.arena[i] = fn(this.arena[i])
        }
    }
}

Space.prototype.step = function() {
    this.ghost.forEach(g => g.step())
}

