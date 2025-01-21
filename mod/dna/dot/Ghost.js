'use strict'

const ghostNames = [
    'ghost',
    'inky',
    'blinky',
    'pinky',
    'clyde',
]

const EXPLORING = 0
const HUNGRY = 1
const DROPY = 2
const SAMPLE = 3
const LOOPY = 4
const CONFUSED = 5

let instances = 0

function Ghost(st) {
    instances++
    this.name = ghostNames[instances] || ghostNames[0] + instances
    if (st instanceof Ghost) {
        this.source = st
    }

    this.mood = EXPLORING
    this.ink = 100 // ghost mana and energy
    this.dict = {}
    this.todo = [] // list of data and routine tokens
    this.cp = 0
    this.tasks = 0
    this.moves = 0
    this.sequence
    this.istack = [] // cp call stack
    this.cstack = [] // command sequence stack
    this.tract = [] // list of eaten stuff

    this.x = st.x
    this.y = st.y

    if (st.dict) {
        // pass the spells knowledge
        Object.keys(st.dict).forEach(k => {
            if (k === '_' || k === '__' || k.startsWith('_')) return
            this.dict[k] = st.dict[k]
        })
    }
}

Ghost.prototype.nextMood = function() {
    this.mood ++
    if (this.mood > LOOPY) this.mood = 0
}

Ghost.prototype.getMood = function() {
    switch(this.mood) {
        case EXPLORING: return 'exploring';
        case HUNGRY: return 'hungry';
        case DROPY: return 'dropy';
        case SAMPLE: return 'sample';
        case LOOPY: return 'loopy';
        case CONFUSED: return 'confused';
    }
}

Ghost.prototype.peek = function() {
    return this.tract.peekBack()
}

Ghost.prototype.pop = function() {
    return this.tract.pop()
}

Ghost.prototype.popi = function() {
    const t = this.tract.pop()
    if (!t || t.type !== this.space.token.NUM) {
        throw 'number is expected for @' + this.name
    }
    return t.val
}

Ghost.prototype.push = function(t) {
    this.tract.push(t)
}

Ghost.prototype.doSequence = function(sequence) {
    // save current exec state
    this.istack.push(this.cp)
    this.cstack.push(this.sequence)

    this.cp = 0
    this.sequence = sequence
}

Ghost.prototype.doReturn = function() {
    if (this.istack.length === 0) {
        this.cp = 0
        this.sequence = undefined
        return false
    }
    this.cp = this.istack.pop()
    this.sequence = this.cstack.pop()

    return true
}

Ghost.prototype.doToken = function(t) {
    if (!t) return 0

    if (t.type === this.space.token.SYM) {

        // try to bind
        const f = this.dict[t.val]

        if (f) {
            if (isFun(f)) {
                if (env.config.trace) {
                    log.raw(`@${this.name}: ^${this.space.token.dump(t)}`)
                }
                f(this)

            } else if (f.type === this.space.token.LIST
                    && f.exec) {
                if (env.config.trace) {
                    log.raw(`@${this.name}: ~^${this.space.token.dump(t)}`)
                }
                this.doSequence(f)

            } else {
                this.tract.push(f)
                if (env.config.trace) {
                    log.raw(`@${this.name}: v${this.space.token.dump(t)}`)
                }
            }

        } else {
            log('unable to find word [' + t.val + '] in ' + this.name + ' dictionary:')
        }

    } else if (t.type === this.space.token.LIST && t.exec) {
        if (env.config.trace) {
            log.raw(`@${this.name}: ~${this.space.token.dump(t)}`)
        }

        this.doSequence(t)
        /*
        const g = this
        t.val.forEach(t => {
            g.doToken(t)
        })
        */

    } else {
        if (env.config.trace) {
            log.raw(`@${this.name}: v${this.space.token.dump(t)}`)
        }
        this.tract.push(t)
    }

    this.tasks ++
    return 1
}

Ghost.prototype.postMove = function() {
    if (this.mood === 0) return

    const tk = this.space.token
    switch(this.mood) {
        case HUNGRY: this.doToken(tk('eat')); break;
        case DROPY: this.doToken(tk('dot')); break;
        case SAMPLE: this.doToken(tk('lick')); break;
        case LOOPY: break;
        case CONFUSED: break;
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

    // TODO todo should not be only a sequence, but a single spell
    const token = this.sequence.val[this.cp++]
    try {
        const tasks = this.doToken(token)

        if (this.cp >= this.sequence.val.length) {
            this.doReturn()
        }
    } catch (e) {
        this.mood = CONFUSED
        log.err('confused: ' + e)
    }

    if (this.moved) this.postMove()
    return tasks
}

Ghost.prototype.nextStep = function() {

    let tasks = 0

    try {
        do {
            if (!this.sequence) {
                if (!this.nextTask()) {
                    return 0
                }
            }


            if (this.sequence.type === this.space.token.LIST) {
                const token = this.sequence.val[this.cp++]

                tasks += this.doToken(token)

                if (this.cp >= this.sequence.val.length) {
                    this.doReturn()
                }
            } else {
                const sq = this.sequence
                this.sequence = undefined
                tasks += this.doToken(sq)
            }

        } while (this.sequence && !this.moved)

        if (this.moved) this.postMove()

    } catch (e) {
        this.mood = CONFUSED
        log.err('confused: ' + e)
    }
    return tasks
}

Ghost.prototype.schedule = function(taskToken) {
    // TODO allow task priorities?
    this.todo.push(this.space.token(taskToken))
    // TODO looks like a dirty rule, maybe there is a more elegant way to solve this?
    if (taskToken.type === this.space.token.LIST) taskToken.exec = true
}

Ghost.prototype.activate = function(action) {
    log('#action: ' + action.id + ' - ' + action.name)
}

Ghost.prototype.act = function(action) {
    //log('>action: ' + action.id + ' - ' + action.name)
}

Ghost.prototype.deactivate = function(action) {
    log('!action: ' + action.id + ' - ' + action.name)
}

/*
Ghost.prototype.exec = function(t) {
    t(this)
}
*/
