
function up(g) {
    if (g.y > 0) {
        g.y--
        g.lastMove = 1
        g.moved = true

    } else {
        log('unable to move up')
    }
}

function down(g) {
    if (g.y < g.space.height-1) {
        g.y++
        g.lastMove = 3
        g.moved = true

    } else {
        log('unable to move down')
    }
}

function left(g) {
    if (g.x > 0) {
        g.x--
        g.lastMove = 2
        g.moved = true

    } else {
        log('unable to move left')
    }
}

function right(g) {
    if (g.x < g.space.width-1) {
        g.x++
        g.lastMove = 4
        g.moved = true

    } else {
        log('unable to move right')
    }
}

function dot(g) {
    if (g.tract.length > 0) {
        const t = g.tract.pop()
        g.space.set(g.x, g.y, t)
    } else {
        log('tract is empty!')
    }
}

function lick(g) {
    g.tract.push( g.space.get(g.x, g.y) )
}

function eat(g) {
    g.tract.push( g.space.put(g.x, g.y, null) )
}

function add(g) {
    const a = g.tract.pop()
    const b = g.tract.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to add values ' + a.val + ' and ' + b.val)
    } else {
        g.tract.push( g.space.token(a.val + b.val) )
    }
}

function sub(g) {
    const a = g.tract.pop()
    const b = g.tract.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to sub values ' + a.val + ' and ' + b.val)
    } else {
        g.tract.push( g.space.token(a.val - b.val) )
    }
}

function mul(g) {
    const a = g.tract.pop()
    const b = g.tract.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to add values ' + a.val + ' and ' + b.val)
    } else {
        g.tract.push( g.space.token(a.val * b.val) )
    }
}

function div(g) {
    const a = g.tract.pop()
    const b = g.tract.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to divide values ' + a.val + ' and ' + b.val)
    } else {
        g.tract.push( g.space.token(round(a.val / b.val)) )
    }
}

function mod(g) {
    const a = g.tract.pop()
    const b = g.tract.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to get reminder for values ' + a.val + ' and ' + b.val)
    } else {
        g.tract.push( g.space.token(round(a.val % b.val)) )
    }
}

function __pow__(g) {
    const a = g.tract.pop()
    const b = g.tract.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to exponentiate ' + a.val + ' to ' + b.val)
    } else {
        g.tract.push( g.space.token(pow(a.val, b.val)) )
    }
}

function __do__(g) {
    const target = g.tract.pop()
    g.evalSequence(target)
}
