'use strict'

const NIL = 0
const SYM = 1
const BOOL = 2
const NUM = 3
const CHAR = 4
const STR = 5
const LOC = 6
const ROUT = 7
const LIST = 11

function token(val, type) {
    // TODO lookup in the buffer first
    const t = {}
    t.val = val

    if (val === undefined || val === null) {
        t.type = NIL
        t.val = null
    } else if (typeof val === 'boolean') {
        t.type = BOOL
    } else if (typeof val === 'number') {
        t.type = NUM
    } else if (typeof val === 'string') {
        if (type) {
            t.type = type
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
    }

    return t
}

token.NIL = NIL
token.SYM = SYM
token.BOOL = BOOL
token.NUM = NUM
token.CHAR = CHAR
token.STR = STR
token.LOC = LOC
token.ROUT = ROUT
token.LIST = LIST

