//
// pad controllers monitor
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
        if (d.index >= 4) return

        const id = d.index
        if (!bind[id]) {
            bind[id] = {}
            log('registering gamepad:')
            console.dir(d)
        }

        const p = lab.control.player
        const b = lab.control.mapping.pad[id].button

        // directional controls
        let x = d.axes[0] || d.axes[2] || d.axes[4]
        let y = d.axes[1] || d.axes[3] || d.axes[5]

        if (d.buttons[b[1]] && d.buttons[b[1]].pressed) y = -1
        if (d.buttons[b[2]] && d.buttons[b[2]].pressed) x = -1
        if (d.buttons[b[3]] && d.buttons[b[3]].pressed) y = 1
        if (d.buttons[b[4]] && d.buttons[b[4]].pressed) x = 1

        if (x < -sens) {
            activate(id)
            p.touch(p.LEFT, id)
        } else if (x > sens) {
            activate(id)
            p.touch(p.RIGHT, id)
        } else if (isActive(id)) {
            p.stop(p.LEFT, id)
            p.stop(p.RIGHT, id)
        }

        if (y < -sens) {
            activate(id)
            p.touch(p.UP, id)
        } else if (y > sens) {
            activate(id)
            p.touch(p.DOWN, id)
        } else if (isActive(id)) {
            p.stop(p.UP, id)
            p.stop(p.DOWN, id)
        }

        if (d.buttons[b[5]] && d.buttons[b[5]].pressed) {
            activate(id)
            p.touch(p.Y, id)
        } else {
            p.stop(p.Y, id)
        }
        if (d.buttons[b[6]] && d.buttons[b[6]].pressed) {
            activate(id)
            p.touch(p.X, id)
        } else {
            p.stop(p.X, id)
        }
        if (d.buttons[b[7]] && d.buttons[b[7]].pressed) {
            activate(id)
            p.touch(p.A, id)
        } else {
            p.stop(p.A, id)
        }
        if (d.buttons[b[8]] && d.buttons[b[8]].pressed) {
            activate(id)
            p.touch(p.B, id)
        } else {
            p.stop(p.B, id)
        }
        if (d.buttons[b[9]] && d.buttons[b[9]].pressed) {
            activate(id)
            p.touch(p.MODE, id)
        } else {
            p.stop(p.MODE, id)
        }
        if (d.buttons[b[10]] && d.buttons[b[10]].pressed) {
            activate(id)
            p.touch(p.NEXT, id)
        } else {
            p.stop(p.NEXT, id)
        }
    })
}
