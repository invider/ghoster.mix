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
    let pos = 0
    let buf = false
    let bufc

    function cur() {
        if (buf) return pos-1
        else return pos
    }

    function getc() {
        if (buf) buf = false
        else bufc = src.charAt(pos++)
        return bufc
    }

    function retc() {
        if (buf) throw "stream buffer overflow"
        buf = true
    }

    function aheadc() {
        const c = getc()
        retc()
        return c
    }

    function expectc(c) {
        if (getc() !== c) throw `${c} is expected`
    }

    function notc(c) {
        if (getc() === c) throw `${c} is not expected`
    }

    return {
        cur: cur,
        getc: getc,
        retc: retc,
        aheadc: aheadc,
        expectc: expectc,
        notc: notc,
    }
}

function makeLex(getc, retc, aheadc, expectc, notc, cur) {
    let mark = 0
    let lineNum = 1
    let lineShift = 0
    let tab = 0
    let lead = true // beginning of a string

    function err (msg) {
        throw 'lexical error @' + lineNum + ':' + (mark-lineShift) + ' - ' + msg
    }

    function markLine () {
        lineNum ++
        lineShift = cur()
        tab = 0
        lead = true
    }

    function skipLine() {
        let c = getc()
        while (c && !isNewLine(c)) c = getc()
        if (isNewLine(c)) markLine()
    }

    function afterLineComment() {
        skipLine()
        log('skipping')
        return parseNext()
    }

    function afterMultiComment(cc) {
        skipLine()

        let c = getc()
        while (isSpace(c)) c = getc()

        if (c === cc) {
            if (getc() === cc) {
                if (getc() === cc) {
                    if (getc() === cc) {
                        // end of multiline
                        skipLine()
                        return parseNext()
                    }
                }
            }
        }
        return afterMultiComment(cc)
    }

    function parseNext() {

        let c = getc()
        if (!c) return false

        while (isSpace(c)) {
            c = getc()
            if (lead) {
                if (c === '\t') tab += TAB - ((cur()-lineShift)%TAB)
                else tab ++
            }
        }
        lead = false

        if (isNewLine(c)) {
            const n = getc()
            if (c === '\n' && n !== '\r') {
                retc()
            }
            markLine()
            return parseNext()
        }

        if (c === '#') return afterLineComment()

        // skip -- and multiline ---- comments
        if (c === '-' || c === '=') {
            const cc = c
            if (aheadc() === cc) {
                getc()

                if (aheadc() === cc) {
                    expectc(cc)
                    expectc(cc)
                    return afterMultiComment(cc)

                } else {
                    return afterLineComment()
                }
            }
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
    const lex = makeLex(
                    stream.getc,
                    stream.retc,
                    stream.aheadc,
                    stream.expectc,
                    stream.notc,
                    stream.cur)

    function doCommand(tab, label) {
        const t = lex.next()
        if (!t) return

        log('#' + t.type + ' @' + t.tab + ' [' + t.val + ']')

        if (t.tab < tab) return // no more commands in this block

        if (t.tab > tab) {
            // looks like a new block
            lex.ret() // this one is from within the new block
            return doBlock(t.tab, label)
        }

        switch (t.type) {

        case LABEL: return doCommand(tab, t.val)

        case SYM:
            if (t.val === 'true'
                    || t.val === 'yes'
                    || t.val === 'ok') {
                return tok(true, undefined, label)
            } else if (t.val === 'false'
                    || t.val === 'no'
                    || t.val === 'cancel') {
                return tok(false, undefined, label)
            } else {
                return tok(t.val, undefined, label)
            }

        case NUM: return tok(t.val, undefined, label)

        case DOT: return tok(t.val, tok.DOT, label)

        case STR: return tok(t.val, undefined, label)
        }

        throw "syntax error: unrecognized lexem #" + t.type + ': ' + t.val
    }

    function doBlock(tab) {
        const list = []

        let token
        while(token = doCommand(tab)) {
            list.push(token)
        }

        return tok(list)
    }

    const sq = doBlock(0)
    //console.table(sq)
    return sq
}

function dot(src) {
    return parse(src)
}
