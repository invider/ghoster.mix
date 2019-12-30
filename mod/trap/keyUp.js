function keyUp(e) {
    const i = lab.control.mapping.keys[e.code]
    lab.control.player.stop(i)
}
