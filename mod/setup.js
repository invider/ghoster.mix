/*
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
}

function generatePalette(d) {
    const tok = lab.space.token

    Object.keys(palette).forEach(k => {
        d[k] = tok(palette[k], tok.DOT)
    })
}
*/

module.exports = function setup() {

    // ghost space construction
    const space = lab.spawn(dna.dot.Space, {
        name: 'space',
        width: 32,
        height: 32,
    })
    space.token = dna.dot.token

    const inky = new dna.dot.Ghost({
        x: 0,
        y: 0,
        player: 1,
        space: space,
    })
    space.ghost.push(inky)

    // fix dictionary
    //generatePalette(lib.dict)
    
    // rename escaped functions like do and pow
    Object.keys(lib.dict)
        .filter(k => k.startsWith('__') && k.endsWith('__') && k.length > 4)
        .forEach(k => {
            const nk = k.substring(2, k.length - 2)

            log('renaming ' + k + ' -> ' + nk)
            lib.dict[nk] = lib.dict[k]
            delete lib.dict[k]
        })


    // teach inky everything
    Object.keys(lib.dict).forEach(k => {
        if (k === '_' || k === '__') return
        inky.dict[k] = lib.dict[k]
    })

    // boot
    if (env.config.boot) {
        const routines = env.config.boot.split(',')
        routines.forEach(name => {
            const seq = $.dot.selectOne(name)
            if (seq) {
                inky.schedule(seq)
            } else {
                log.warn(`can't find boot routine ${name}`)
            }
        })
    } else {
        inky.schedule($.dot.sys)
    }

    // construct the view
    const hud = lab.spawn('hud/Hud', {
        Z: 2,
        name: 'hud',
    })

    const ghostView = hud.spawn(dna.hud.GhostView, {
        Z: 1,
        name: 'gspace',
        space: space,
        x: rx(.05),
        y: ry(.05),
        w: rx(.6),
        h: ry(.7),

        period: 0.2,

        adjust: function() {
            this.x = 0
            this.y = 0
            this.w = rx(0.7)
            this.h = ry(1)
        },
    })
    ghostView.follow(inky)

    const panel = hud.spawn('hud/Container', {
        Z: 10,
        name: 'panel',

        drawBackground: function() {
            fill('#202322')
            rect(0, 0, this.w, this.h)
        },

        adjust: function() {
            this.x = rx(.7)
            this.y = 0
            this.w = rx(.3)
            this.h = ry(1)

            this.border = this.w/20

            dna.hud.Container.prototype.adjust.apply(this)
        },
    })

    panel.spawn(dna.hud.DotView, {
        Z: 5,
        name: 'dspace',
        space: space,
        ghostView: ghostView,

        adjust: function() {
            const b = this.__.border
            this.x = b
            this.y = b
            this.w = this.__.w - 2*b
            this.h = this.w
        }
    })

    panel.spawn('hud/gadget/Button', {
        name: 'step',
        text: 'step',

        onClick: function() {
            log('stepping in...')
        },

        adjust: function() {
            if (!this.__) return
            this.x = this.__.border
            this.y = this.__.dspace.y + this.__.dspace.h + this.__.border
            this.w = this.__.dspace.w/4
            this.h = 100
        },
    })

    panel.spawn(dna.hud.DictView, {
        Z: 2,
        name: 'dict',
        ghost: inky,
        x: rx(.05),
        y: ry(.7),

        adjust: function() {
            if (!this.__) return
            this.x = this.__.border
            this.y = this.__.step.y + this.__.step.h + this.__.border
            this.w = this.__.dspace.w
            this.h = 200
        },
    })

    panel.spawn(dna.hud.TractView, {
        Z: 2,
        name: 'inkyTract',
        ghost: inky,
        x: rx(.05),
        y: ry(.5),

        adjust: function() {
            if (!this.__) return
            this.x = this.__.border
            this.y = this.__.dict.y + this.__.dict.h + this.__.border
            this.w = this.__.dspace.w/4
            this.h = 200
        },
    })

    ghostView.gx = 4
    ghostView.gy = 1
}
