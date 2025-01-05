function init() {
    // register keyboard events
    const keyboard = this
    trap.on('keyDown', (e) => {
        if (e.repeat) return
        keyboard.keyDown(e)
    })
    trap.on('keyUp', (e) => {
        if (e.repeat) return
        keyboard.keyUp(e)
    })
}

function keyDown(e) {
    const controllerAction = env.bind.keyMap[e.code]
    if (controllerAction) {
        lab.control.controller.act(controllerAction.action.id + 1, controllerAction.controller)
    }
}

function keyUp(e) {
    const controllerAction = env.bind.keyMap[e.code]
    if (controllerAction) {
        lab.control.controller.stop(controllerAction.action.id + 1, controllerAction.controller)
    }
}

