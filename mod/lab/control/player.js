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

function touch(id) {
    if (!id) return
    active[id] = true
}

function stop(id) {
    if (!id) return
    active[id] = false
}

let lastMove = 0
function evo(dt) {
    lastMove -= dt

    if (lastMove < 0
            && lab.hud.gspace.target
            && lab.hud.gspace.target.todo.length === 0) {

        const ghost = lab.hud.gspace.target
        const tk = dna.dot.token


        if (active[A]) {
            ghost.todo.push(tk('dot'))
            lastMove = env.tune.period
        } else if (active[B]) {
            ghost.todo.push(tk('eat'))
            lastMove = env.tune.period
        } else if (active[MODE]) {
            ghost.nextMood()
            lastMove = env.tune.period
        }

        if (active[UP]) {
            ghost.todo.push(tk('up'))
            lastMove = env.tune.period
        } else if (active[LEFT]) {
            ghost.todo.push(tk('left'))
            lastMove = env.tune.period
        } else if (active[DOWN]) {
            ghost.todo.push(tk('down'))
            lastMove = env.tune.period
        } else if (active[RIGHT]) {
            ghost.todo.push(tk('right'))
            lastMove = env.tune.period
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
    }
}
