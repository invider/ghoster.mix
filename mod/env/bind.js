const MAX_CONTROLLERS           = 8
const GAMEPAD_CONTROLLERS_BASE  = 1 // gamepad controllers usually indexed from 1..4
const KEYBOARD_CONTROLLERS_BASE = 5 // keyboard controllers are indexed from 5..

const UP     = 1    // movement
const LEFT   = 2
const DOWN   = 3
const RIGHT  = 4
const A      = 5    // actions
const B      = 6
const X      = 7
const Y      = 8
const L1     = 9    // triggers
const R1     = 10
const L2     = 11
const R2     = 12
const MENU   = 13   // menu
const SELECT = 14

// list of action names
const actions = [
    'UP',
    'LEFT',
    'DOWN',
    'RIGHT',
    'A',
    'B',
    'X',
    'Y',
    'L1',
    'R1',
    'L2',
    'R2',
    'MENU',
    'SELECT',
]

// globally fixed keys with no remap
const fixed = {
    enter:          'Enter',
    escape:         'Escape',
    backspace:      'Backspace',
    startCheating:  'Backslash',

    pause:          'KeyP',
    //releaseAll:     'End',
    menu:           'Escape',
    zoomIn:         'Equal',
    zoomOut:        'Minus',
    autoZoom:       'Digit0',
    speedUp:        'BracketRight',
    slowDown:       'BracketLeft',
    speedNormal:    'Quote',
    rewind:         'Comma',
}

// keyboard controllers mapping
//
// Each subarray defines the next controller starting from ```KEYBOARD_CONTROLLERS_BASE```
// (e.g. with ```KEYBOARD_CONTROLLERS_BASE = 5```, these will be mapped to controllers 5, 6, 7...).
//
// Each entry maps an action #N to a particular key event code.
// A missing entry or an empty string means there is no key mapping for this particular action.
//
// ```indexKeyActions``` *MUST* be run every time this table changes to consolidate the mapping.
//
const keyboardControllersMapping = [
    // quaker
    [ 'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'Space', 'AltLeft', 'KeyE', 'KeyQ',
        'KeyR', 'KeyF', 'KeyT', 'KeyG',
    ],
    // arrower
    [ 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
        'ControlRight', 'ShiftRight', 'End', 'Home',
        'PageUp', 'PageDown', 'Insert', 'Delete',
    ],
    // vimer
    [ 'KeyK', 'KeyH', 'KeyJ', 'KeyL',
        'KeyN', 'KeyB', 'KeyY', 'KeyU',
        '', '', '', '',
    ],
    // numpader
    [
        'Numpad8', 'Numpad4', 'Numpad2', 'Numpad6',
        'Numpad0', 'NumpadSubtract', 'NumpadAdd', 'NumpadDivide',
        'Numpad9', 'Numpad3', 'NumpadDecimal', 'NumpadEnter'
    ],
]

const keyMap = {}

const padMap = [
    [12, 14, 13, 15, 0, 1, 2, 3, 8],
    [12, 14, 13, 15, 0, 1, 2, 3, 8],
    [12, 14, 13, 15, 0, 1, 2, 3, 8],
    [12, 14, 13, 15, 0, 1, 2, 3, 8],
]

// cheating combos
const combos = {
    test:  [UP, UP, DOWN, DOWN],
    debug: [UP, DOWN, UP, DOWN, A],
}

function init() {
    indexKeyActions()
}

function indexKeyActions() {
    for (let keyboardController = 0; keyboardController < keyboardControllersMapping.length; keyboardController++) {
        const keyActions = keyboardControllersMapping[keyboardController]
        for (let actionId = 0; actionId < keyActions.length; actionId++) {
            const key = keyActions[actionId]
            if (key) {
                keyMap[key] = Object.freeze({
                    id:           actionId,
                    name:         actionName(actionId),
                    controllerId: KEYBOARD_CONTROLLERS_BASE + keyboardController,
                })
            }
        }
    }
}

function actionName(action) {
    return actions[action] || ''
}

function actionId(name) {
    return actions.indexOf(name)
}

// *MUST* be run every time ```keyboardControllersMapping``` table changes
function onRemap() {
    indexKeyActions()
}

