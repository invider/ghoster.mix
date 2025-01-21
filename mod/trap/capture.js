function capture(action) {
    // the controller is activated without any binded target
    // TODO try to capture the controller
    log(`trying to capture free controller #${action.controllerId}`)
    console.dir(action)
    const ghost = lab.hud.gspace.target
    if (ghost) {
        lab.monitor.controller.bind(action.controllerId, ghost)
        log('captured: ' + ghost.name)
        lab.monitor.controller.act(action)
    }
}
