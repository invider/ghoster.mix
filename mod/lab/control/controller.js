//
// The *controller* ghost is used to route input actions to the matching targets
//

const OFF = 0

// error messages
const WRONG_CONTROLLER = '[controller] controller is supposed to be a positive integer'
const WRONG_TARGET = '[controller] target is supposed to be an object'
const WRONG_ACTION = '[controller] action is supposed to be an integer'

// holds actions control array for each controller
const ctrl = []

// targets are recepients of action events
let targetMap = []
// a buffer used to temporary store existing target maps (e.g when switching the state)
const targetMapStack = []

// bind the controller to the target
// @param {number/1+} controller - controller id
// @param {object} target - a target object to bind to the controller
function bind(controller, target) {
    if (!controller || !isNumber(controller) || controller < 1) throw WRONG_CONTROLLER 
    if (!target || !isObj(target)) throw WRONG_TARGET

    target._controller = controller
    const icontroller = controller - 1

    targetMap[icontroller] = target
    if (!ctrl[icontroller]) ctrl[icontroller] = [] // initialize actions control array if missing
}

// deactivate all actions for the provided controller
//
// @param {number/1+} controller - controller id
function deactivateAllActions(controller) {
    if (!controller || !isNumber(controller) || controller < 1) throw WRONG_CONTROLLER 

    const icontroller = controller - 1
    const target = targetMap[icontroller]
    if (target && target.deactivate) {
        const triggers = ctrl[icontroller] || []
        for (let action = 0; action < triggers.length; action++) {
            if (triggers[action]) {
                target.deactivate(action)
            }
        }
    }
}

// release the controller
//
// @param {number/1+} controller - controller id
// @returns {boolean} - true if the target was found, false otherwise
function release(controller) {
    if (!controller || !isNumber(controller) || controller < 1) throw WRONG_CONTROLLER 
    if (!isNumber(action)) throw WRONG_CONTROLLER 

    const icontroller = controller - 1
    const target = targetMap[icontroller]
    if (target) {
        deactivateAll(controller) // need to deactivate all triggered actions before release
        target._controller = 0
        targetMap[icontroller] = false
        return true
    } else {
        return false
    }
}

// bind all controllers to the selected target
//
// @param {object} target - the object listening to actions on all controllers
function bindAll(target) {
    if (!target || !isObj(target)) throw WRONG_TARGET

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
function saveTargetMap() {
    targetMapStack.push(targetMap)
    targetMap = []
}

// resume controls - try to restore previously stored target map state
function restoreTargetMap() {
    if (targetMapStack.length === 0) {
        log.warn("can't restore controller targets - the buffer is empty!")
        return false
    }
    this.releaseAll()
    targetMap = targetMapStack.pop()
    return true
}

// find the next free controller
//
// @returns {number} - controller id, 0 if none were found
function findNext() {
    for (let icontroller = 0; icontroller < env.bind.MAX_CONTROLLERS; icontroller++) {
        if (!targetMap[icontroller]) return icontroller + 1
    }
    return 0
}

// bind the target to the next free controller
//
// @param {object} target
// @returns {number} - id of the binded controller, 0 if none were found
function bindNext(target) {
    const controller = this.findNext()
    if (controller === 0) return 0 // no free controllers left
    this.bind(controller, target)
    return controller
}

// get the target for the specified controller
//
// @param {number/1+} controller - controller id
function target(controller) {
    if (!controller || !isNumber(controller) || controller < 1) throw WRONG_CONTROLLER 

    const icontroller = controller - 1
    return targetMap[icontroller]
}

// start the controller action
//
// @param {number} action
// @param {number/1+} controller
function act(action, controller) {
    if (this.disabled) return
    if (!isNumber(action)) throw WRONG_ACTION
    if (!controller || !isNumber(controller) || controller < 1) throw WRONG_CONTROLLER 

    const icontroller = controller - 1

    if (ctrl[icontroller]) {
        if (!ctrl[icontroller][action]) {
            ctrl[icontroller][action] = env.time

            const target = targetMap[icontroller]
            if (target) {
                if (target.activate && !target.disabled) {
                    target.activate(action)
                }
            } else {
                // no target binded, try to capture the controller
                trap('capture', controller)
            }
        }
    }  else {
        trap('capture', controller)
    }

    if (this.__.combo) this.__.combo.register(action, controller)
}

// stop the controller action
//
// @param {number} action
// @param {number/1+} controller
function stop(action, controller) {
    if (this.disabled) return
    if (!isNumber(action)) throw WRONG_ACTION
    if (!controller || !isNumber(controller) || controller < 1) throw WRONG_CONTROLLER 

    const icontroller = controller - 1

    if (ctrl[icontroller]) {
        const started = ctrl[icontroller][action]
        if (started) {
            const target = targetMap[icontroller]
            if (target && target.deactivate && !target.disabled) {
                target.deactivate(action, env.time - started)
            }
        }
        ctrl[icontroller][action] = OFF
    }
}

function evo(dt) {
    for (let controller = 0; controller < ctrl.length; controller++) {
        if (ctrl[controller]) {
            for (let action = 0; action < ctrl[controller].length; action++) {
                if (ctrl[controller][action]) {
                    const target = targetMap[controller]
                    if (target && target.act && !target.disabled) {
                        target.act(action, dt, env.time - ctrl[p][action])
                    }
                }
            }
        }
    }
}

