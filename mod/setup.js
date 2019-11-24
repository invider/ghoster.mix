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

    // ghost space construction
    const space = lab.spawn(dna.dot.Space, {
        name: 'space',
        width: 4,
        height: 4,
    })
    space.token = dna.dot.token

    const inky = new dna.dot.Ghost({
        x: 0,
        y: 0,
    })
    space.ghost.push(inky)

    // teach inky everything
    Object.values(lib.dict).forEach(f => {
        inky.dict[f.name] = f
    })
    inky.route = $.dot.sys

    // construct the view
    lab.spawn(dna.hud.GhostView, {
        space: space
    })
}
