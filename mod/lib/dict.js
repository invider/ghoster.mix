
function up(g) {
    if (g.y > 0) g.y--
    else log('unable to move')
}

function down(g) {
    if (g.y < g.space.height-1) g.y++
    else log('unable to move')
}

function left(g) {
    if (g.x > 0) g.x--
    else log('unable to move')
}

function right(g) {
    if (g.x < g.space.width-1) g.x++
    else log('unable to move')
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

function mul(g) {
    const a = g.tract.pop()
    const b = g.tract.pop()

    if (a.type !== g.space.token.NUM || b.type !== g.space.token.NUM) {
        log('unable to add values ' + a.val + ' and ' + b.val)
    } else {
        g.tract.push( g.space.token(a.val * b.val) )
    }
}

