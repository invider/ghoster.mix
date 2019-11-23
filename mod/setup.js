module.exports = function setup() {
    /*
    // create top container
    // it is the central points for event handling to all components
    const hud = sys.spawn('hud/Hud', {
        Z: 1,
        name: 'hud',
    })

    const l1 = sys.spawn('hud/gadget/Label', {
        name: 'label1',
        x: 30,
        y: 40,
        text: 'dotter',
    }, 'hud')
    sys.augment(l1, dna.hud.trait.Draggable)
    l1.setStyle('title')

    const eyes = sys.augment(sys.spawn('hud/gadget/Eyes', {
        name: 'eyes',
        x: ctx.width - 100,
        y: 20
    }, 'hud'), dna.hud.trait.Draggable)
    sys.after(trap, 'mouseDown', function(e) {
        eyes.pupilR = 8
    })
    sys.after(trap, 'mouseUp', function(e) {
        eyes.pupilR = 6
    })
    */

    lab.spawn(dna.dot.Space, {
        name: 'space',
        width: 4,
        height: 4,
    })

    const inky = new dna.dot.Ghost({
        x: 0,
        y: 0,
    })
    lab.space.ghost.push(inky)

    lab.spawn(dna.hud.GhostView, {
        space: lab.space
    })

    Object.values(lib.dict).forEach(f => {
        inky.dict[f.name] = f
    })

    inky.route = $.dot.sys

    //setTimeout(() => inky.exec(lib.dict.right), 4000)
    //setTimeout(() => inky.exec(lib.dict.down), 5000)
}
