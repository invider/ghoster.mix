
function empty() {
    log('no action')
}

function init() {

    this.up = function() {
        lab.hud.panel.dict.up()
    }
    this.left = empty
    this.down = function() {
        lab.hud.panel.dict.down()
    }
    this.right = empty

    this.y = empty
    this.x = function() {
        lab.hud.panel.dict.focus = false
        lab.control.player.flow = lab.control.moveFlow
    }
    this.a = function() {
        lab.hud.panel.dict.focus = false
        lab.control.player.flow = lab.control.moveFlow
        lab.hud.panel.dict.cast()
    }
    this.b = empty

    this.mode = empty
    this.select = empty
}

