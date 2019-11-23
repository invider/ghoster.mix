// .dot files parser

function Lex(src) {
    this.cur = 0
    this.src = src
    this.list = src.split(/\s+/).filter(t => t.length > 0)
}

Lex.prototype.next = function() {
    return this.list[this.cur++]
}

function parse(src) {
    const lex = new Lex(src)
    const list = []

    let token
    while(token = lex.next()) {
        switch (token) {
        case '<': list.push(new dna.dot.Token('left')); break;
        case '>': list.push(new dna.dot.Token('right')); break;
        case '^': list.push(new dna.dot.Token('up')); break;
        case 'V': list.push(new dna.dot.Token('down')); break;
        case '.': list.push(new dna.dot.Token('dot')); break;
        }
    }

    return list
}

function dot(src) {
    const code = src
        .split('\n')
        .filter(l => !l.trim().startsWith('#'))
        .join('\n')

    return parse(code)
}
