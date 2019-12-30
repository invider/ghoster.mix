const UP = 1
const LEFT = 2
const DOWN = 3
const RIGHT = 4

const active = []

function touch(id) {
    active[id] = true
}

function stop(id) {
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
