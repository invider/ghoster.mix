function DotView(st) {
    this.x = 0
    this.y = 0
    this.w = 200
    this.h = 200
    this.gx = 0
    this.gy = 0
    this.showPort = true

    augment(this, st)

    const view = this
    this.space.onReplot = chain(this.space.onReplot, function() {
        view.gx = 0
        view.gy = 0
        view.gw = this.w
        view.gh = this.h
        view.createBuffer()
    })

    this.createBuffer()

    /*
    this.bufContext.fillStyle = '#209050'
    this.bufContext.fillRect(0, 0, 10, 10)

    this.bufContext.strokeStyle = '#814050'
    this.bufContext.beginPath()
    this.bufContext.moveTo(0, 0)
    this.bufContext.lineTo(48, 48)
    this.bufContext.stroke()
    */
}

DotView.prototype.createBuffer = function() {
    if (!this.gw) this.gw = this.space.w
    if (!this.gh) this.gh = this.space.h

    this.bufCanvas = document.createElement('canvas')
    this.bufCanvas.width = this.gw
    this.bufCanvas.height = this.gh
    this.bufContext = this.bufCanvas.getContext('2d', {
        willReadFrequently: true,
    })
}

DotView.prototype.ghostX = function(x) {
    return this.gx + floor(x/this.dotSize)
}

DotView.prototype.ghostY = function(y) {
    return this.gy + floor(y/this.dotSize)
}

DotView.prototype.viewX = function(gx) {
    return (gx - this.gx) * this.dotSize
}

DotView.prototype.viewY = function(gy) {
    return (gy - this.gy) * this.dotSize
}

DotView.prototype.evo = function(dt) {}

DotView.prototype.draw = function() {
    save()
    translate(this.x, this.y)


    // render grid data
    const idata = this.bufContext.getImageData(0, 0, this.gw, this.gh)

    for (let gy = 0; gy < this.gh; gy++) {
        for (let gx = 0; gx < this.gw; gx++) {
            const t = this.space.get(this.gx + gx, this.gy + gy)

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

    if (this.showPort) {
        // highlight the port to the ghost view
        const ds = this.w / this.gw
        const vpx = this.ghostView.gx - this.gx
        const vpy = this.ghostView.gy - this.gy
        this.dotSize = ds

        stroke(.1, 1, 1)
        lineWidth(2)

        const x = max(vpx*ds, 2)
        const y = max(vpy*ds, 2)
        const w = min(this.ghostView.gw * ds, this.w-x-2)
        const h = min(this.ghostView.gh * ds, this.h-y-2)
        rect(x, y, w, h)
    }

    stroke(.1, .5, .5)
    lineWidth(2)
    rect(0, 0, this.w, this.h)

    restore()
}

DotView.prototype.onClick = function(x, y, e) {
    const gx = this.ghostX(x)
    const gy = this.ghostY(y)
    this.ghostView.centerAt(gx, gy)
}
