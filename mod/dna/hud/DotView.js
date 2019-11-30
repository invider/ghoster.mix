function DotView(st) {
    this.x = 0
    this.y = 0
    this.w = 200
    this.h = 200

    augment(this, st)

    this.bufCanvas = document.createElement('canvas')
    this.bufCanvas.width = 100
    this.bufCanvas.height = 100
    this.bufContext = this.bufCanvas.getContext('2d')

    this.bufContext.fillStyle = '#204050'
    this.bufContext.fillRect(0, 0, this.bufContext.width, this.bufContext.height)
}

DotView.prototype.evo = function(dt) {}

DotView.prototype.draw = function() {
    save()
    translate(this.x, this.y)

    stroke(.1, .5, .5)
    lineWidth(2)
    rect(0, 0, this.w, this.h)

    image(this.bufCanvas, 0, 0, 100, 100)

    restore()
}
