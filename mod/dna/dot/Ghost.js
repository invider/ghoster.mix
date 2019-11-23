'use strict'

const ghostNames = [
    'ghost',
    'inky',
    'blinky',
    'pinky',
    'clyde',
]

let instances = 0

function Ghost(st) {
    instances++
    this.name = ghostNames[instances] || ghostNames[0] + instances

    this.mood = 0
    this.dict = {}
    this.tract = [] // list of eaten stuff
    this.route = [] // list of routines to do
    this.track = [] // call stack

    this.x = st.x
    this.y = st.y
}

Ghost.prototype.step = function() {
    if (this.route.length > 0) {
        const t = this.route[0]
        this.route.splice(0, 1)

        // try to bind
        const f = this.dict[t.val]
        if (f) {
            log('doing ' + t.val)
            f(this)
        }
    }
}

Ghost.prototype.exec = function(t) {
    t(this)
}

Ghost.prototype.eat = function(token) {
}

Ghost.prototype.spew = function() {
}

Ghost.prototype.spawn = function(token) {
    this.space.set(this.x, this.y, token)
}

