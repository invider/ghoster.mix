function DotView(st) {
    this.x = 0
    this.y = 0
    this.w = 200
    this.h = 200

    augment(this, st)

    this.gw = this.space.width
    this.gh = this.space.height
    this.bufCanvas = document.createElement('canvas')
    this.bufCanvas.width = this.gw
    this.bufCanvas.height = this.gh
    this.bufContext = this.bufCanvas.getContext('2d')

    this.bufContext.fillStyle = '#209050'
    this.bufContext.fillRect(0, 0, 10, 10)

    this.bufContext.strokeStyle = '#814050'
    this.bufContext.beginPath()
    this.bufContext.moveTo(0, 0)
    this.bufContext.lineTo(48, 48)
    this.bufContext.stroke()
}

DotView.prototype.evo = function(dt) {}

DotView.prototype.draw = function() {
    save()
    translate(this.x, this.y)

    stroke(.1, .5, .5)
    lineWidth(2)
    rect(0, 0, this.w, this.h)

    // render grid data
    const idata = this.bufContext.getImageData(0, 0, this.gw, this.gh)

    for (let gy = 0; gy < this.gh; gy++) {
        for (let gx = 0; gx < this.gw; gx++) {
            const t = this.space.get(gx, gy)

            let sh = (gy*this.gw + gx) * 4
            if (!t || t.type === this.space.token.NIL) {
                idata.data[sh++] = 0
                idata.data[sh++] = 0
                idata.data[sh++] = 0
                idata.data[sh] = 255
            } else if (t.type === this.space.token.DOT) {
                idata.data[sh++] = t.r
                idata.data[sh++] = t.g
                idata.data[sh++] = t.b
                idata.data[sh] = 255

            } else {
                idata.data[sh++] = 255
                idata.data[sh++] = 255
                idata.data[sh++] = 255
                idata.data[sh] = 255

            }
        }
    }
    this.bufContext.putImageData(idata, 0, 0)

    blocky()
    image(this.bufCanvas, 0, 0, this.w, this.h)

    restore()
}
