// .dot files parser

const SYM = 1
const NUM = 2
const STR = 3
const LOC = 4
const BOOL = 5
const NAME = 6
const LABEL = 7
const DOT = 8

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

function isSpecial(c) {
    return c === ':' || c === '/' || c === '?' || c === '!'
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
    return !isSeparator(c) && !isDigit(c) && !isSpecial(c)
}

function isAlphaNum(c) {
    return !isSeparator(c) && !isSpecial(c)
}

function isHex(c) {
    const code = c.toUpperCase().charCodeAt(0) - 48
    return (code >= 0 && code < 10) || (code >= 17 && code < 23)
}

function makeStream(src) {
    let cur = 0
    let buf = false
    let cbuf

    return {
        cur: function() {
            if (buf) return cur-1
            else return cur
        },
        getc: function() {
            if (buf) buf = false
            else cbuf = src.charAt(cur++)
            return cbuf
        },
        retc: function () {
            if (buf) throw "stream buffer overflow"
            buf = true
        },
    }
}

function makeLex(getc, retc, cur) {
    let mark = 0
    let lineNum = 1
    let lineShift = 0
    let tab = 0
    let bos = true // beginning of a string

    function err (msg) {
        throw 'lexical error @' + lineNum + ':' + (mark-lineShift) + ' - ' + msg
    }

    function markLine () {
        lineNum ++
        lineShift = cur()
        tab = 0
        bos = true
    }


    function parseNext() {

        let c = getc()
        if (!c) return false

        while (isSpace(c)) {
            c = getc()
            if (bos) {
                if (c === '\t') tab += TAB - ((cur()-lineShift)%TAB)
                else tab ++
            }
        }
        bos = false

        if (isNewLine(c)) {
            const n = getc()
            if (c === '\n' && n !== '\r') {
                retc()
            }
            markLine()
            return parseNext()
        }

        if (c === '#') {
            while (c && !isNewLine(c)) c = getc()
            markLine()
            return parseNext()
        }

        // got to an actual token
        mark = cur()

        // action shortcuts and operators
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
            c = getc()
            while (c && c !== '"' && !isNewLine(c)) {
                s += c
                c = getc()
            }

            if (c != '"') err('unexpected end of string')

            return {
                type: STR,
                tab: tab,
                val: s,
            }
        }

        if (c === '$') {

            let s = '#'
            c = getc()
            while (c && isHex(c)) {
                s += c
                c = getc()
            }
            if (!isSeparator(c)) err('unexpected end of color literal')
            retc()

            return {
                type: DOT,
                tab: tab,
                val: s,
            }
        }

        let sign = 1
        if (c === '-') {
            sign = -1
            c = getc()
        }

        if (isDigit(c)) {
            let n = 0
            if (c === '0' && getc() === 'x') {
                if (sign < 0) err("hex value can't be negative")

                let d = hex(getc())
                if (d < 0) {
                    err('wrong number format')
                }
                while (d >= 0) {
                    n = n*16 + d
                    d = hex(getc())
                }
                retc()

                return {
                    type: NUM,
                    tab: tab,
                    val: n
                }
            } else if (c === '0') {
                retc()
                c = getc()
                if (!isSeparator(c)) err('wrong number format')

                retc()
                return {
                    type: NUM,
                    tab: tab,
                    val: 0,
                }

            } else {
                let d = 0
                while ((d = dec(c)) >= 0) {
                    n = n*10 + d
                    c = getc()
                }
                retc()

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
        while ( isAlphaNum(c) ) {
            sym += c
            c = getc() 
        }

        if (c === ':') {
            return {
                type: LABEL,
                tab: tab,
                val: sym,
            }

        } else {
            retc()
            return {
                type: SYM,
                tab: tab,
                val: sym,
            }
        }
    }

    let lastToken
    let isBuffered = false
    function next() {
        if (isBuffered) isBuffered = false
        else lastToken = parseNext()
        return lastToken
    }

    function ahead() {
        if (!isBuffered) {
            lastToken = parseNext()
            isBuffered = true
        }
        return lastToken
    }

    function ret() {
        if (isBuffered) throw 'token buffer overflow'
        isBuffered = true
    }

    return {
        next: next,
        ahead: ahead,
        ret: ret,
    }
}

function parse(src) {
    const tok = dna.dot.token
    const stream = makeStream(src)
    const lex = makeLex(stream.getc, stream.retc, stream.cur)

    function doStep(name) {
        const t = lex.next()
        if (!t) return

        log('#' + t.type + ' @' + t.tab + ' [' + t.val + ']')

        switch (t.type) {

        case LABEL: return doStep(t.val)

        case SYM:
            if (t.val === 'true'
                    || t.val === 'yes'
                    || t.val === 'ok') {
                return tok(true, undefined, name)
            } else if (t.val === 'false'
                    || t.val === 'no'
                    || t.val === 'cancel') {
                return tok(false, undefined, name)
            } else {
                return tok(t.val, undefined, name)
            }

        case NUM: return tok(t.val, undefined, name)

        case DOT: return tok(t.val, tok.DOT, name)

        case STR: return tok(t.val, undefined, name)
        }

        throw "syntax error: unrecognized lexem #" + t.type + ': ' + t.val
    }

    function doBlock() {
        const list = []

        let token
        while(token = doStep()) {
            list.push(token)
        }

        return list
    }

    const sq = doBlock()
    console.table(sq)
    return sq
}

function dot(src) {
    return parse(src)
}
