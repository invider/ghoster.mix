'use strict'

const defaults = {
    x: 10,
    y: 10,
    w: 100,
    h: 100,
    mode: 1,
    selected: 0,
    step: 25,
    font: '24px coolville',
    fontB: '32px coolville',
}

function DictView(st) {
    augment(this, defaults)
    augment(this, st)
}

// TODO keep dict size in cache
DictView.prototype.up = function() {
    this.selected --
    if (this.selected < 0) {
        this.selected = Object.keys(this.ghost.dict).length - 1
    }
}

DictView.prototype.down = function() {
    this.selected ++
    if (this.selected >= Object.keys(this.ghost.dict).length) {
        this.selected = 0
    }
}

DictView.prototype.pickAt = function(keys, i) {
    while(i < 0) {
        i += keys.length
    }
    while(i >= keys.length) i -= keys.length
    return keys[i]
    //return '#' + i
}

DictView.prototype.cast = function() {
    if (!this.ghost || !this.ghost.dict) return
    const name = Object.keys(this.ghost.dict)[this.selected]
    const token = this.ghost.dict[name]

    if (token) {
        this.ghost.schedule(dna.dot.token(name))
    }
}

DictView.prototype.push = function() {
    if (!this.ghost || !this.ghost.dict) return
    const name = Object.keys(this.ghost.dict)[this.selected]
    const token = this.ghost.dict[name]
    if (token) {
        this.ghost.schedule(dna.dot.token(name))
    }
}

DictView.prototype.draw = function() {
    save()
    translate(this.x, this.y)
    clip(0, 0, this.w, this.h)

    if (this.ghost && this.ghost.dict) {
        let x = 10
        const step = this.step

        baseMiddle()
        alignLeft()

        const ls = Object.keys(this.ghost.dict)

        let my = this.h/2

        font(this.fontB)
        const selectedName = this.pickAt(ls, this.selected)
        fill(.2, .7, .4)
        text(selectedName, x, my)

        font(this.font)
        let i = this.selected
        let y = my - this.step * 1.2
        while (y > -this.step) {
            const name = this.pickAt(ls, --i)
            fill(.05, .7, .4)
            text(name, x, y)

            y -= this.step
        }

        i = this.selected
        y = my + this.step * 1.2
        while (y < this.h + this.step) {
            const name = this.pickAt(ls, ++i)
            fill(.05, .7, .4)
            text(name, x, y)

            y += this.step
        }
    }

    lineWidth(3)
    if (this.focus) stroke(.3, .7, .7)
    else stroke(.75, .4, .4)
    rect(0, 0, this.w, this.h)

    restore()
}

