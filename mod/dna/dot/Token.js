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

function Token(val, type) {
    this.val = val

    if (val === undefined || val === null) {
        this.type = NIL
        this.val = null
    } else if (typeof val === 'boolean') {
        this.type = BOOL
    } else if (typeof val === 'number') {
        this.type = NUM
    } else if (typeof val === 'string') {
        if (type) {
            this.type = type
        } else if (val.length === 1) {
            this.type = CHAR
        } else if (val.length > 1 && !/\s/.test(val)) {
            this.type = SYM
        } else {
            this.type = STR
        }
    } else if (Array.isArray(val)) {
        this.type = LIST
    } else if (typeof val === 'object') {
        this.type = LOC
        this.x = val.x
        this.y = val.y
    }
}

Token.prototype.NIL = NIL
Token.prototype.SYM = SYM
Token.prototype.BOOL = BOOL
Token.prototype.NUM = NUM
Token.prototype.CHAR = CHAR
Token.prototype.STR = STR
Token.prototype.LOC = LOC
Token.prototype.ROUT = ROUT
Token.prototype.LIST = LIST

