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
        space: space
    })

    lab.spawn(dna.hud.TractView, {
        name: 'inkyTract',
        ghost: inky,
        x: rx(0.75),
        y: ry(0.1),
    })
}
