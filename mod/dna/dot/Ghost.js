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

Ghost.prototype.evo = function(t) {
    if (t.type === this.space.token.SYM) {
        // try to bind
        const f = this.dict[t.val]
        if (isFun(f)) {
            f(this)
        } else if (f) {
            this.tract.push(f)
        } else {
            log('unable to find [' + t.val + ']')
            console.dir(this.dict)
        }

    } else if (t.type === this.space.token.LIST) {
        const g = this
        t.val.forEach(t => {
            g.evo(t)
        })

    } else {
        log('pushing #' + t.type + ' [' + t.val + ']')
        this.tract.push(t)
    }
}

Ghost.prototype.step = function() {
    if (this.todo.length > 0) {
        //console.table(this.tract)

        const t = this.todo[0]
        this.todo.splice(0, 1)

        this.evo(t)
    }
}

Ghost.prototype.exec = function(t) {
    t(this)
}
