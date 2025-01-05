const OFF = 0

const ctrl = []

let targetMap = []
const targetBuffer = []

// bind the controller to the target
function bind(controller, target) {
    if (!target) return
    target.controller = controller
    const icontroller = controller - 1

    targetMap[icontroller] = target
    if (!ctrl[icontroller]) ctrl[icontroller] = []
}

function deactivateAll(controller) {
    const icontroller = controller? controller - 1 : 0
    const target = targetMap[icontroller]
    if (target && target.deactivate) {
        const triggers = ctrl[icontroller] || []
        for (let a = 0; a < triggers.length; a++) {
            if (triggers[a]) {
                target.deactivate(a + 1)
            }
        }
    }
}

// release the controller
function release(controller) {
    const icontroller = controller? controller - 1 : 0
    const target = targetMap[icontroller]
    if (target) {
        deactivateAll(controller) // need to deactivate all triggered actions before release
        target.controller = 0
        targetMap[icontroller] = false
    }
}

// bind all controllers to selected target
function bindAll(target) {
    for (let i = 0; i < env.bind.MAX_CONTROLLERS; i++) {
        bind(i, target)
    }
}

// release all controllers
function releaseAll() {
    for (let i = 0; i < env.bind.MAX_CONTROLLERS; i++) {
        release(i)
    }
}

// save current target map for future restoration
function saveAll() {
    targetBuffer.push(targetMap)
    targetMap = []
}

// resume controls - try to restore previously stored target map state
function restoreAll() {
    if (targetBuffer.length === 0) {
        log.warn("can't restore controller targets - the buffer is empty!")
        return
    }
    this.releaseAll()
    targetMap = targetBuffer.pop()
}

// find the next free controller
function findNext() {
    for (let icontroller = 0; icontroller < env.bind.MAX_CONTROLLERS; icontroller++) {
        if (!targetMap[icontroller]) return icontroller + 1
    }
    return 0
}

function bindNext(target) {
    const controller = this.findNext()
    if (controller === 0) return false // no free controllers left
    this.bind(controller, target)
    return true
}

function target(controller) {
    const icontroller= controller? controller - 1 : 0
    return targetMap[icontroller]
}

function act(action, controller) {
    const icontroller = controller? controller - 1 : 0
    const iaction = action - 1

    if (ctrl[icontroller]) {
        if (!ctrl[icontroller][iaction]) {
            ctrl[icontroller][iaction] = env.time

            const target = targetMap[icontroller]
            if (target) {
                if (target.activate && !target.disabled) {
                    target.activate(action)
                }
            } else {
                // no target binded, try to capture a controller
                trap('capture', controller)
            }
        }
    }  else {
        trap('capture', controller)
    }

    if (this.__.combo) this.__.combo.register(action, controller)
}

function stop(action, controller) {
    const icontroller = controller? controller - 1 : 0
    const iaction = action? action - 1 : 0

    if (ctrl[icontroller]) {
        const started = ctrl[icontroller][iaction]
        if (started) {
            const target = targetMap[icontroller]
            if (target && target.deactivate && !target.disabled) {
                target.deactivate(action, env.time - started)
            }
        }
        ctrl[icontroller][iaction] = OFF
    }
}

function evo(dt) {
    for (let p = 0; p < ctrl.length; p++) {
        if (ctrl[p]) {
            for (let a = 0; a < ctrl[p].length; a++) {
                if (ctrl[p][a]) {
                    const target = targetMap[p]
                    if (target && target.act && !target.disabled) {
                        target.act(a + 1, dt, env.time - ctrl[p][a])
                    }
                }
            }
        }
    }
}

