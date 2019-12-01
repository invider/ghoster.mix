// .dot files parser

const SYM = 1
const NUM = 2
const STR = 3
const LOC = 4
const BOOL = 5
const NAME = 6

let TAB = 4

function isSpace(c) {
    return c === ' ' || c === '\t'
}

function isNewLine(c) {
    return c === '\r' || c === '\n'
}

function isSeparator(c) {
    return isSpace(c) || isNewLine(c)
}

function isDigit(c) {
    const code = c.charCodeAt(0)
    return code >= 48 && code < 58
}

function dec(c) {
    const code = c.charCodeAt(0) - 48
    if (code >= 0 && code < 10) return code
    else return -1
}

function hex(c) {
    const code = c.toUpperCase().charCodeAt(0) - 48
    if (code >= 0 && code < 10) return code
    else if (code >= 17 && code < 23) return code - 7
    else return -1
}

function isAlpha(c) {
    return !isSeparator(c) && !isDigit(c)
}

function makeLex(src) {
    const len = src.length
    let cur = 0
    let mark = 0
    let lineNum = 1
    let lineShift = 0
    let tab = 0
    let bos = true // beginning of a string

    const err = function(msg) {
        throw 'lexical error @' + lineNum + ':' + (mark-lineShift) + ' - ' + msg
    }

    const line = function() {
        lineNum ++
        lineShift = cur
        tab = 0
        bos = true
    }

    const next = function() {
        if (cur >= len) return false

        let c = src.charAt(cur++)

        while (isSpace(c)) {
            c = src.charAt(cur++)
            if (bos) {
                if (c === '\t') tab += TAB - ((cur-lineShift)%TAB)
                else tab ++
            }
        }
        bos = false

        if (isNewLine(c)) {
            let n = src.charAt(cur)
            if (c === '\r' && n === '\n') cur ++ // eat line feed in CR LF
            line()
            return next()
        }

        if (c === '#') {
            while (cur < len && !isNewLine(c)) c = src.charAt(cur++)
            line()
            return next()
        }

        // got to an actual token
        mark = cur

        // operators
        switch (c) {
            case '^': return { type: SYM, tab: tab, val: 'up' };
            case '<': return { type: SYM, tab: tab, val: 'left' };
            case '>': return { type: SYM, tab: tab, val: 'right' };
            case 'v': return { type: SYM, tab: tab, val: 'down' };
            case '.': return { type: SYM, tab: tab, val: 'dot' };
            case '-': return { type: SYM, tab: tab, val: 'lick' };
            case '`': return { type: SYM, tab: tab, val: 'eat' };
        }

        if (c === '"') {
            let s = ''
            c = src.charAt(cur++)
            while (cur < len && c !== '"' && !isNewLine(c)) {
                s += c
                c = src.charAt(cur++)
            }

            if (c != '"') err('unexpected end of string')

            return {
                type: STR,
                tab: tab,
                val: s,
            }
        }

        let sign = 1
        if (c === '-') {
            sign = -1
            c = src.charAt(cur++)
        }

        if (isDigit(c)) {
            let n = 0
            if (c === '0' && src.charAt(cur) === 'x') {
                if (sign < 0) err("hex value can't be negative")
                cur ++
                let d = hex(src.charAt(cur++))
                if (d < 0) {
                    err('wrong number format')
                }
                while (d >= 0) {
                    n = n*16 + d
                    d = hex(src.charAt(cur++))
                }
                cur--
                return {
                    type: NUM,
                    tab: tab,
                    val: n
                }

            } else {
                let d = 0
                while ((d = dec(c)) >= 0) {
                    n = n*10 + d
                    c = src.charAt(cur++)
                }
                cur--
                return {
                    type: NUM,
                    tab: tab,
                    val: sign * n,
                }
            }

        } else if (sign < 0) {
            err('wrong number format')
        }

        let sym = ''
        while ( isAlpha(c) || isDigit(c) ) {
            sym += c
            c = src.charAt(cur++)
        }
        cur--
        return {
            type: SYM,
            tab: tab,
            val: sym,
        }
    }

    return {
        next: next
    }
}

function parse(src) {
    const lex = makeLex(src)
    const list = []

    let t
    const tok = dna.dot.token

    while(t = lex.next()) {
        log('#' + t.type + ' @' + t.tab + ' [' + t.val + ']')

        switch (t.type) {
        case SYM:
            if (t.val === 'true'
                    || t.val === 'yes'
                    || t.val === 'ok') {
                list.push( tok(true) );
            } else if (t.val === 'false'
                    || t.val === 'no'
                    || t.val === 'cancel') {
                list.push( tok(false) );
            } else {
                list.push( tok(t.val) );
            }
            break;

        case NUM: list.push( tok(t.val) ); break;
        case STR: list.push( tok(t.val) ); break;
        }
    }
    console.table(list)
    return list
}

function dot(src) {
    return parse(src)
}
