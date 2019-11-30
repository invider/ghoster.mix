module.exports = function setup() {
    // ghost space construction
    const space = lab.spawn(dna.dot.Space, {
        name: 'space',
        width: 4,
        height: 4,
    })
    space.token = dna.dot.token
    space.populate()

    const inky = new dna.dot.Ghost({
        x: 0,
        y: 0,
        space: space,
    })
    space.ghost.push(inky)

    // teach inky everything
    Object.values(lib.dict).forEach(f => {
        inky.dict[f.name] = f
    })
    inky.todo = $.dot.sys

    // construct the view
    lab.spawn(dna.hud.GhostView, {
        Z: 1,
        name: 'gspace',
        space: space,
        x: rx(.05),
        y: ry(.05),
        w: rx(.6),
        h: ry(.7),
    })

    lab.spawn(dna.hud.TractView, {
        Z: 2,
        name: 'inkyTract',
        ghost: inky,
        x: rx(.7),
        y: ry(.5),
    })

    lab.spawn(dna.hud.DotView, {
        Z: 5,
        name: 'dspace',
        space: space,
        x: rx(.7),
        y: ry(.05),
        w: rx(.25),
        h: rx(.25),
    })
}
