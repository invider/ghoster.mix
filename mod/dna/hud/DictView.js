
const defaults = {
    x: 10,
    y: 10,
    w: 100,
    h: 100,
    mode: 1,
    step: 25,
    font: '24px coolville',
}

function DictView(st) {
    augment(this, defaults)
    augment(this, st)
}

DictView.prototype.draw = function() {
    save()
    translate(this.x, this.y)
    clip(0, 0, this.w, this.h)

    if (this.ghost.dict) {
        let x = 10
        let y = 10
        const step = this.step

        font(this.font)
        baseTop()
        alignLeft()
        fill(.05, .7, .4)

        Object.keys(this.ghost.dict).forEach(k => {
            const token = this.ghost.dict[k]

            let txt
            if (!token) txt = 'undef'
            else if (isFun(token)) txt = k + '()'
            else txt = `${k}: ${token.val}`

            text(txt, x, y)
            y += step
        })
    }

    lineWidth(2)
    if (this.focus) stroke(.3, .7, .7)
    else stroke(.75, .4, .4)
    rect(0, 0, this.w, this.h)

    restore()
}

