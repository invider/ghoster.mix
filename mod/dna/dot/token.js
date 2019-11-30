'use strict'

const NIL = 0
const DOT = 1
const SYM = 2
const BOOL = 3
const NUM = 4
const CHAR = 5
const STR = 6
const LOC = 7
const ROUT = 8
const LIST = 11
const UNKNOWN = 99

function Token() {}

function token(val, type, meta) {
    // TODO lookup in the buffer first

    if (val instanceof Token) return val // value already tokenized

    const t = new Token()
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

            if (t.type === DOT) {
                t.r = meta[0]
                t.g = meta[1]
                t.b = meta[2]
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

token.NIL = NIL
token.DOT = DOT
token.SYM = SYM
token.BOOL = BOOL
token.NUM = NUM
token.CHAR = CHAR
token.STR = STR
token.LOC = LOC
token.ROUT = ROUT
token.LIST = LIST
token.UNKNOWN = UNKNOWN

