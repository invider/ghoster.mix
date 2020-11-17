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

            const flow = lab.control.flow
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

function draw() {
    if (env.config.control) {
        font('24px coolville')
        alignLeft()
        let x = 20
        let y = 20

        fill(.1, 1, 1)
        text(`up: ${active[1]}`, x, y); y += 25;
        text(`left: ${active[2]}`, x, y); y += 25;
        text(`down: ${active[3]}`, x, y); y += 25;
        text(`right: ${active[4]}`, x, y); y += 25;
        text(`Y: ${active[5]}`, x, y); y += 25;
        text(`X: ${active[6]}`, x, y); y += 25;
        text(`A: ${active[7]}`, x, y); y += 25;
        text(`B: ${active[8]}`, x, y); y += 25;
        text(`MODE: ${active[9]}`, x, y); y += 25;
        text(`NEXT: ${active[10]}`, x, y); y += 25;
    }
}
