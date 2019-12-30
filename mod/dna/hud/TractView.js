
function TractView(st) {
    this.step = 30
    this.font = '24px coolville'
    augment(this, st)
}

TractView.prototype.draw = function() {

    let y = this.y
    let x = this.x
    const step = this.step

    font(this.font)
    baseTop()
    alignLeft()
    fill(.05, .7, .4)

    text(this.ghost.name + ' - ' + this.ghost.getMood(), x, y)
    y += step

    this.ghost.tract.forEach(e => {
        const txt = e? e.val : 'undef'
        text(txt, x, y)
        y += step
    })
}

