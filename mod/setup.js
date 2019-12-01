const palette = {
    red: '#ff0000',
    green: '#00ff00', 
    blue: '#0000ff', 
    yellow: '#ffff00',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    white: '#ffffff',
    black: '#000000',
    gray: '#808080',

    // solarized
    base03: '#002b36',
    base02: '#073642',
    base01: '#586e75',
    base00: '#647b83',
    base0:  '#839496',
    base1:  '#93a1a1',
    base2:  '#eee8d5',
    base3:  '#fdf6e3',
    byellow: '#b58900',
    borange: '#cb4b16',
    bred:    '#dc322f',
    bmagenta: '#d33682',
    bviolet: '#6c71c4',
    bblue: '#268bd2',
    bcyan: '#2aa198',
    bgreen: '#859900',
}
function generatePalette(d) {
    const tok = lab.space.token

    Object.keys(palette).forEach(k => {
        d[k] = tok(palette[k], tok.DOT)
    })
}

module.exports = function setup() {
    // ghost space construction
    const space = lab.spawn(dna.dot.Space, {
        name: 'space',
        width: 16,
        height: 16,
    })
    space.token = dna.dot.token
    space.populate()

    const inky = new dna.dot.Ghost({
        x: 0,
        y: 0,
        space: space,
    })
    space.ghost.push(inky)

    generatePalette(lib.dict)

    // teach inky everything
    Object.keys(lib.dict).forEach(k => {
        if (k === '_' || k === '__') return
        inky.dict[k] = lib.dict[k]
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

        period: 0.2,
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
