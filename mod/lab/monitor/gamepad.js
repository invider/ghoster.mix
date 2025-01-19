//
// gamepad controllers monitor
//
const USAGE_TIMEOUT = 15 * 1000

let sens = 0.3 // analog sticks sensitivity

const bind = []
const lastUsage = []

function activate(id, control) {
    lastUsage[id] = Date.now()
}

function isActive(id) {
    return (lastUsage[id] && Date.now()
        -lastUsage[id] < USAGE_TIMEOUT);
}

function evo(dt) {
    pad().forEach(d => {
        const id = d.index + 1

        if (id > 4) return
        if (!bind[id]) {
            bind[id] = {}
            log(`registering gamepad #${id}:`)
            console.dir(d)
        }

        const p = lab.control.controller
        const b = env.bind.padMap[id]

        // directional controls
        let x = d.axes[0] || d.axes[2]
        let y = d.axes[1] || d.axes[3]

        if (d.buttons[b[0]] && d.buttons[b[0]].pressed) y = -1
        if (d.buttons[b[1]] && d.buttons[b[1]].pressed) x = -1
        if (d.buttons[b[2]] && d.buttons[b[2]].pressed) y = 1
        if (d.buttons[b[3]] && d.buttons[b[3]].pressed) x = 1

        if (x < -sens) {
            activate(id)
            p.act(env.bind.LEFT, id)
        } else if (x > sens) {
            activate(id)
            p.act(env.bind.RIGHT, id)
        } else if (isActive(id)) {
            p.stop(env.bind.LEFT, id)
            p.stop(env.bind.RIGHT, id)
        }

        if (y < -sens) {
            activate(id)
            p.act(env.bind.UP, id)
        } else if (y > sens) {
            activate(id)
            p.act(env.bind.DOWN, id)
        } else if (isActive(id)) {
            p.stop(env.bind.UP, id)
            p.stop(env.bind.DOWN, id)
        }

        if (d.buttons[b[4]] && d.buttons[b[4]].pressed) {
            activate(id)
            p.act(env.bind.A, id)
        } else {
            p.stop(env.bind.A, id)
        }
        if (d.buttons[b[5]] && d.buttons[b[5]].pressed) {
            activate(id)
            p.act(env.bind.B, id)
        } else {
            p.stop(env.bind.B, id)
        }
        if (d.buttons[b[6]] && d.buttons[b[6]].pressed) {
            p.act(env.bind.X, id)
        } else {
            p.stop(env.bind.X, id)
        }
        if (d.buttons[b[7]] && d.buttons[b[7]].pressed) {
            p.act(env.bind.Y, id)
        } else {
            p.stop(env.bind.Y, id)
        }
        if (d.buttons[b[8]] && d.buttons[b[8]].pressed) {
            p.act(env.bind.MENU, id)
        } else {
            p.stop(env.bind.MENU, id)
        }
        if (d.buttons[b[9]] && d.buttons[b[9]].pressed) {
            p.act(env.bind.SELECT, id)
        } else {
            p.stop(env.bind.SELECT, id)
        }
    })
}

