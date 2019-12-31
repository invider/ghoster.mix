function makeCaller(symbol) {
    return function(pid) {
        const ghost = lab.hud.gspace.target
        if (!ghost) return
        ghost.todo.push(dna.dot.token(symbol))
    }
}

function init() {
    this.up = makeCaller('up')
    this.left = makeCaller('left')
    this.down = makeCaller('down')
    this.right = makeCaller('right')

    this.y = function() {
        lab.hud.panel.dict.focus = true
        lab.control.player.flow = lab.control.selectFlow
    }
    this.x = function() {}
    this.a = makeCaller('dot')
    this.b = makeCaller('eat')

    this.mode = function() {
        const ghost = lab.hud.gspace.target
        if (!ghost) return
        ghost.nextMood()
    }
    this.next = function () {
        // select next ghost
    }
}

