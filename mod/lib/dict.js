
// #system spells
function replot(g) {
    const h = g.popi()
    const w = g.popi()

    g.space.replot(w, h, true)
}

// #core spells
function up(g) {
    if (!g.space.isSolid(g.x, g.y-1)) {
        g.y--
        g.lastMove = 1
        g.moves ++
        g.moved = true

    } else {
        log('unable to move up')
    }
}

function down(g) {
    if (!g.space.isSolid(g.x, g.y+1)) {
        g.y++
        g.lastMove = 3
        g.moves ++
        g.moved = true

    } else {
        log('unable to move down')
    }
}

function left(g) {
    if (!g.space.isSolid(g.x-1, g.y)) {
        g.x--
        g.lastMove = 2
        g.moves ++
        g.moved = true

    } else {
        log('unable to move left')
    }
}

function right(g) {
    if (!g.space.isSolid(g.x+1, g.y)) {
        g.x++
        g.lastMove = 4
        g.moves ++
        g.moved = true

    } else {
        log('unable to move right')
    }
}

function dot(g) {
    if (g.tract.length > 0) {
        const t = g.pop()
        g.space.set(g.x, g.y, t)

    } else {
        log('tract is empty!')
    }
}

function lick(g) {
    g.push( g.space.get(g.x, g.y) )
}

function eat(g) {
    const token = g.space.put(g.x, g.y, undefined)
    if (token && token.type) {
        g.push(token)
    }
}

// #math spells
function add(g) {
    const a = g.pop()
    const b = g.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to add values ' + a.val + ' and ' + b.val)
    } else {
        g.push( g.space.token(a.val + b.val) )
    }
}

function sub(g) {
    const a = g.pop()
    const b = g.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to sub values ' + a.val + ' and ' + b.val)
    } else {
        g.push( g.space.token(a.val - b.val) )
    }
}

function mul(g) {
    const a = g.pop()
    const b = g.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to add values ' + a.val + ' and ' + b.val)
    } else {
        g.push( g.space.token(a.val * b.val) )
    }
}

function div(g) {
    const a = g.pop()
    const b = g.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to divide values ' + a.val + ' and ' + b.val)
    } else {
        g.push( g.space.token(round(a.val / b.val)) )
    }
}

function mod(g) {
    const a = g.pop()
    const b = g.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to get reminder for values ' + a.val + ' and ' + b.val)
    } else {
        g.push( g.space.token(round(a.val % b.val)) )
    }
}

function __pow__(g) {
    const a = g.pop()
    const b = g.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to exponentiate ' + a.val + ' to ' + b.val)
    } else {
        g.push( g.space.token(pow(a.val, b.val)) )
    }
}

function __do__(g) {
    const target = g.pop()
    g.doSequence(target)
}

function learn(g) {
    const f = g.pop()
    if (f && f.name) {

        if (f.type === g.space.token.LIST) {
            const f2 = g.space.token(f.val, f.type, f.name)
            f2.exec = true
            g.dict[f2.name] = f2

        } else {
            g.dict[f.name] = f
        }
    } else {
        log('unable to learn')
        log.dump(f)
    }
}

function spawn(g) {
    log('spawning...')
    const bootSpell = g.pop()
    g.space.spawn(g, bootSpell)
}

// TODO eval control should be relative and not absolute!
function stop(g) {
    log('pause')
    lab.hud.gspace.mode = lab.hud.gspace.PAUSED
}

function slow(g) {
    log('moving slow')
    lab.hud.gspace.mode = lab.hud.gspace.SLOW
}

function fast(g) {
    log('moving fast')
    lab.hud.gspace.mode = lab.hud.gspace.FAST
}

