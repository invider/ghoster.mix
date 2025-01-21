// @require(/lab/control/moveFlow
const UP = 1
const LEFT = 2
const DOWN = 3
const RIGHT = 4

const Y = 5
const X = 6
const A = 7
const B = 8

const MODE = 9
const NEXT = 10

const active = []

function init() {
    this.flow = lab.control.moveFlow
}

function touch(id, player) {
    if (!id) return
    active[id] = true
}

function stop(id, player) {
    if (!id) return
    active[id] = false
}

let lastMove = 0
function evo(dt) {
    lastMove -= dt


    if (lastMove < 0) {

        if (lab.hud.gspace.target) {
            //&& lab.hud.gspace.target.todo.length === 0) {
            
            //const flow = lab.control.flow
            const ghost = lab.hud.gspace.target

            if (active[UP]) {
                this.flow.up()
                lastMove = env.tune.period
            } else if (active[LEFT]) {
                this.flow.left()
                lastMove = env.tune.period
            } else if (active[DOWN]) {
                this.flow.down()
                lastMove = env.tune.period
            } else if (active[RIGHT]) {
                this.flow.right()
                lastMove = env.tune.period
            }

            if (active[Y]) {
                this.flow.y()
                lastMove = env.tune.period
            } else if (active[X]) {
                this.flow.x()
                lastMove = env.tune.period
            } else if (active[A]) {
                this.flow.a()
                lastMove = env.tune.period
            } else if (active[B]) {
                this.flow.b()
                lastMove = env.tune.period
            }

            if (active[MODE]) {
                this.flow.mode()
                lastMove = env.tune.period
            } else if (active[NEXT]) {
                this.flow.next()
                lastMove = env.tune.period
            }

        } else {
            if (active[NEXT]) {
                this.flow.next()
                lastMove = env.tune.period
            }
        }
    }
}

