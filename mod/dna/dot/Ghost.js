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
    this.cp = 0
    this.sequence
    this.istack = [] // cp call stack
    this.cstack = [] // command sequence stack
    this.tract = [] // list of eaten stuff

    this.x = st.x
    this.y = st.y
    this.space = st.space
}

Ghost.prototype.evalSequence = function(sequence) {
    // save current exec state
    this.istack.push(this.cp)
    this.cstack.push(this.sequence)

    this.cp = 0
    this.sequence = sequence
}

Ghost.prototype.evalReturn = function() {
    if (this.istack.length === 0) {
        this.cp = 0
        this.sequence = undefined
        return false
    }
    this.cp = this.istack.pop()
    this.sequence = this.cstack.pop()
    this.cp ++

    return true
}

Ghost.prototype.evo = function(t) {
    if (t.type === this.space.token.SYM) {

        // try to bind
        const f = this.dict[t.val]

        if (isFun(f)) {
            log.raw('^ ' + this.space.token.dump(t))
            f(this)

        } else if (f) {
            log.raw('v ' + this.space.token.dump(t))
            this.tract.push(f)

        } else {
            log('unable to find word [' + t.val + '] in ' + this.name + ' dictionary:')
            console.dir(this.dict)
        }

    } else if (t.type === this.space.token.LIST && t.exec) {
        log.raw('~ ' + this.space.token.dump(t))

        this.evalSequence(t)
        /*
        const g = this
        t.val.forEach(t => {
            g.evo(t)
        })
        */

    } else {
        log.raw('v ' + this.space.token.dump(t))
        this.tract.push(t)
    }
}

Ghost.prototype.nextTask = function() {
    if (this.todo.length > 0) {
        this.cp = 0
        this.sequence = this.todo[0]
        this.todo.splice(0, 1)
        return true

    } else {
        this.sequence = undefined
        return false
    }
}

Ghost.prototype.next = function() {

    if (!this.sequence) {
        if (!this.nextTask()) return
    }

    const token = this.sequence.val[this.cp++]
    this.evo(token)

    if (this.cp >= this.sequence.val.length) {
        this.evalReturn()
    }
    /*
    if (this.todo.length > 0) {
        //console.table(this.tract)

        const task = this.todo[0]
        this.todo.splice(0, 1)

        this.evo(task)
    }
    */
}

Ghost.prototype.schedule = function(taskToken) {
    // TODO allow task priorities?
    this.todo.push(taskToken)
    if (taskToken.type === this.space.token.LIST) taskToken.exec = true
}

/*
Ghost.prototype.exec = function(t) {
    t(this)
}
*/
