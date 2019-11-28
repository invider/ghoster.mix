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
    this.ink = 100 // ghost mana and energy
    this.dict = {}
    this.todo = [] // list of data and routine tokens
    this.stack = [] // call stack
    this.tract = [] // list of eaten stuff

    this.x = st.x
    this.y = st.y
    this.space = st.space
}

Ghost.prototype.step = function() {
    if (this.todo.length > 0) {
        const t = this.todo[0]
        this.todo.splice(0, 1)

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
