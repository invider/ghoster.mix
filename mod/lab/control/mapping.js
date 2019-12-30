
const MAX_PADS = 4

const mapping = {

    defaultKeys: [
        [
        'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'ShiftLeft', 'KeyQ', 'KeyX', 'KeyQ',
        'KeyZ',
        ],
        [
        'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
        'ShiftRight', 'Backspace', 'Space', 'Enter',
        'Slash',
        ],
    ],

    defaultPad: {
        button: [
            0,
            12,
            14,
            13,
            15,
            3,
            2,
            0,
            1,
            8,
        ],
    },

    keys: {},

    pad: [],

    index: function() {
        this.defaultKeys.forEach(m => {
            m.forEach((e, i) => {
                this.keys[e] = i+1
            })
        })

        for (let i = 0; i < MAX_PADS; i++) {
            this.pad[i] = {
                button: this.defaultPad.button.slice(),
            }
        }
    },

    init: function() {
        this.index()
    },
}

