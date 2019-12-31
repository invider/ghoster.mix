
function empty() {
    log('no action')
}

function init() {

    this.up = empty
    this.left = empty
    this.down = empty
    this.right = empty

    this.y = empty
    this.x = empty
    this.a = function() {
        log('done')
        lab.hud.panel.dict.focus = false
        lab.control.player.flow = lab.control.moveFlow
    }
    this.b = empty

    this.mode = empty
    this.select = empty
}

