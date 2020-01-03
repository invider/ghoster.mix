'use strict'

const OUT = -1
const NIL = 0
const DOT = 1
const SYM = 2
const BOOL = 3
const NUM = 4
const CHAR = 5
const STR = 6
const LOC = 7
const ROUT = 8 // TODO ??? do we actually need this type?
const SYS = 9
const LIST = 11
const SPECIAL = 13
const UNKNOWN = 99

const TOKEN_OUT = new Token(OUT, '--out--')
const TOKEN_NIL = new Token(NIL)

const stat = {
    tokens: 0,
}

function Token(t, v) {
    this.type = t
    this.val = v
}

function ihex(c) {
    const code = c.toUpperCase().charCodeAt(0) - 48
    if (code >= 0 && code < 10) return code
    else if (code >= 17 && code < 23) return code - 7
    else return -1
}

function hex(str) {
    let d = 0
    for (let i = 0; i < str.length; i++) {
        const n = ihex(str.charAt(i))
        if (n < 0) d = 0
        else d = d*16 + n
    }
    return d
}

function token(val, type, name) {
    // TODO lookup in the buffer first
    if (val instanceof Token || val.type) return val // value already tokenized

    if (!name && (val === undefined || val === null)) {
        return TOKEN_NIL
    }

    const t = new Token()
    stat.tokens++
    if (val) t.val = val
    if (name) t.name = name

    if (val === undefined || val === null) {
        // looks like named nil!
        t.type = NIL

    } else if (typeof val === 'boolean') {
        t.type = BOOL
    } else if (typeof val === 'number') {
        t.type = NUM
    } else if (typeof val === 'string') {
        if (type) {
            t.type = type

            if (t.type === DOT) {
                const s = t.val.substring(1)
                t.r = hex(s.substring(0, 2))
                t.g = hex(s.substring(2, 4))
                t.b = hex(s.substring(4, 6))
            }

        } else if (val.length === 1) {
            t.type = CHAR
        } else if (val.length > 1 && !/\s/.test(val)) {
            t.type = SYM
        } else {
            t.type = STR
        }

    } else if (Array.isArray(val)) {
        t.type = LIST

    } else if (typeof val === 'object') {
        t.type = LOC
        t.x = val.x
        t.y = val.y

    } else {
        t.type = UNKNOWN
    }

    return t
}

token.dump = function(t) {
    if (!t) return 'undefined'
    let d = t.name? t.name + ': ' : ''

    let v = ''
    switch(t.type) {
        case NIL: v = 'nil'; break;
        case DOT: v = t.val; break;
        case SYM: v = t.val; break;
        case BOOL: v = t.val? 'true' : 'false'; break;
        case NUM: v = '' + t.val; break;
        case CHAR: v = `'${t.val}'`; break;
        case STR: v = `'${t.val}'`; break;
        case LIST:
            v = '[\n'
            t.val.forEach(e => {
                v += '    ' + token.dump(e) + '\n'
            })
            v += ']\n'
            break;

        default: v = 'unknown'; break;
    }
    return d + v
}

token.stat = stat

token.OUT = OUT
token.NIL = NIL
token.DOT = DOT
token.SYM = SYM
token.BOOL = BOOL
token.NUM = NUM
token.CHAR = CHAR
token.STR = STR
token.LOC = LOC
token.ROUT = ROUT
token.SYS = SYS
token.LIST = LIST
token.SPECIAL = SPECIAL
token.UNKNOWN = UNKNOWN

token.TOKEN_OUT = TOKEN_OUT
token.TOKEN_NIL = TOKEN_NIL

