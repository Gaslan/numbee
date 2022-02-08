function GameUI() {
    this.numPadButtons = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['Enter', '0', '←']
    ]

}

GameUI.prototype.init = function init() {
    const darkTheme = localStorage.getItem('dark-theme')
    if (darkTheme && darkTheme == 'true') {
        document.body.classList.add('dark')
    }

    document.querySelector('#settings').addEventListener('click', function() {
        document.querySelector('#modal-panel-settings').classList.toggle('open')
    })

    document.querySelector('#settings-close').addEventListener('click', function() {
        document.querySelector('#modal-panel-settings').classList.add('closing')
        setTimeout(function() {
            document.querySelector('#modal-panel-settings').classList.remove('closing')
        }, 150)
        setTimeout(function() {
            document.querySelector('#modal-panel-settings').classList.toggle('open')
        }, 150)
    })

    const darkModeBtn = document.querySelector('#settings-btn-dark-mode')
    darkModeBtn.addEventListener('click', function() {
        document.querySelector('body').classList.toggle('dark')
        const darkTheme = document.querySelector('body').classList.contains('dark')

        localStorage.setItem('dark-theme', darkTheme)
    })
    

    const checks = document.querySelectorAll('.check')
    for (let i = 0; i < checks.length; i++) {
        const check = checks[i];
        check.addEventListener('click', function() {
            check.classList.toggle('checked')
        })
    }

    
}

GameUI.prototype.mainPanel = function mainPanel() {
    return document.querySelector('section.main')
}

GameUI.prototype.numPad = function numPad() {
    return document.querySelector('section.num-pad')
}

GameUI.prototype.createNotifyItem = function createNotifyItem(message) {
    const notify = document.querySelector('.notify')
    const notifyItem = document.createElement('div')
    notifyItem.classList.add('notify-item')
    notifyItem.innerText = message
    notify.insertAdjacentElement('afterbegin', notifyItem)
    // notify.appendChild(notifyItem)
    setTimeout(function() {
        notify.removeChild(notifyItem)
    }, 1100)
}

GameUI.prototype.specifySameChars = function specifySameChars(currentRow, charIndexes) {
    const row = this.mainPanel().querySelector(`div[data-row="${currentRow}"]`)
    charIndexes.forEach(x => {
        row.querySelector(`div[data-col="${x}"] .num`).classList.add('same')
    })
}

GameUI.prototype.specifyRowStatus = function specifyRowStatus(currentRow, guessStatusArr, guess) {
    const row = this.mainPanel().querySelector(`div[data-row="${currentRow}"]`)
    const numPad = this.numPad()
    guessStatusArr.forEach((x, i) => {
        const col = row.querySelector(`div[data-col="${i}"] .num`)
        if (x == '0') {
            col.classList.add('not-exist')
        }
        if (x == 'w') {
            col.classList.add('wrong-place')
        }
        if (x == 's') {
            col.classList.add('same')
        }
    })

    guessStatusArr.forEach((x, i) => {
        const num = numPad.querySelector(`button[data-val="${guess[i]}"]`)
        
        if (num.classList.contains('same')) {
            return
        }

        if (num.classList.contains('wrong-place')) {
            if (x == 's') {
                num.classList.remove('wrong-place')
                num.classList.add('same')
            }
            return
        }
        
        if (num.classList.contains('not-exist')) {
            if (x == 's') {
                num.classList.remove('not-exist')
                num.classList.add('same')
            }
            if (x == 'w') {
                num.classList.remove('not-exist')
                num.classList.add('wrong-place')
            }
            return
        }

        if (x == '0') {
            num.classList.add('not-exist')
        }
        if (x == 'w') {
            num.classList.add('wrong-place')
        }
        if (x == 's') {
            num.classList.add('same')
        }
    })
}



function GameBase(ui) {
    this.ui = ui
    this.mainPanel = ui.mainPanel()
    this.numPad = ui.numPad()
    this.activeCol = {
        row: 0,
        col: 0
    }
    this.rowCount = 6
    this.colCount = 5
    this.targetNumber = getRandomInt(Math.pow(10, this.colCount)) + ''
    console.log(this.targetNumber)

    this.targetNumberObj = this.createNumberObj(this.targetNumber)
    console.log('targetNumberObj: ', this.targetNumberObj)

    this.gameStatus = 'started'
}

GameBase.prototype.createNumberObj = function createNumberObj(num) {
    return num.split('').reduce((o, c) => {
        if (!o[c]) {
            o[c] = 0
        }
        o[c]++ 
        return o
    }, {})
}

GameBase.prototype.init = function init() {
    this.ui.init()
    this.createMainPanel()
    this.createNumPad()
    _this = this

    document.querySelector('#delete-btn').addEventListener('click', function() {
        if (!_this.isGameActive()) {
            return
        }
        if (_this.activeCol.col == 0) {
            return
        }
        var active = _this.mainPanel.querySelector(`div[data-row="${_this.activeCol.row}"] div[data-col="${_this.activeCol.col - 1}"] .num`)
        active.innerText = ''
        active.classList.remove('filled')
        _this.activeCol.col--
    })

    function shakeRow(rowIndex) {
        const row = document.querySelector(`.main .row[data-row="${rowIndex}"]`)
        row.classList.add('row-error')
        setTimeout(function() {
            row.classList.remove('row-error')
        }, 1000)
    }

    document.querySelector('#enter-btn').addEventListener('click', function() {
        if (!_this.isGameActive()) {
            return
        }
        if (_this.activeCol.col < _this.colCount) {
            _this.ui.createNotifyItem('Az sayı var')
            shakeRow(_this.activeCol.row)
            return
        }
        var activeCols = _this.mainPanel.querySelectorAll(`div[data-row="${_this.activeCol.row}"] .col`)
        
        var num = ''
        for (let i = 0; i < activeCols.length; i++) {
            num += activeCols[i].innerText
        }

        for (let i = 0; i < activeCols.length; i++) {
            activeCols[i].querySelector('.num').classList.add('controlling')
        }

        _this.controlNumber(num, function() {
            for (let i = 0; i < activeCols.length; i++) {
                activeCols[i].querySelector('.num').classList.add('controlling')
            }
        })

        
        _this.activeCol.row++
        _this.activeCol.col = 0

        
        if (_this.activeCol.row == this.rowCount) {
            this.gameStatus = 'finished'
        }
    })
}

GameBase.prototype.isGameActive = function isGameActive() {
    return this.gameStatus == 'started'
}

GameBase.prototype.createMainPanel = function createMainPanel() {

    var row = document.createElement('div')
    row.classList.add('row')

    var col = document.createElement('div')
    col.classList.add('col')

    var num = document.createElement('div')
    num.classList.add('num')

    col.appendChild(num)

    for (let i = 0; i < this.colCount; i++) {
        let colCloned = col.cloneNode(true)
        colCloned.setAttribute('data-col', i)
        row.appendChild(colCloned)
    }

    for (let i = 0; i < this.rowCount; i++) {
        let rowCloned = row.cloneNode(true)
        rowCloned.setAttribute('data-row', i)
        this.mainPanel.appendChild(rowCloned)
    }
}

GameBase.prototype.createNumPad = function createNumPad() {
    var _this = this
    var row = document.createElement('div')
    row.classList.add('row')

    var col = document.createElement('div')
    col.classList.add('col')

    this.ui.numPadButtons.forEach(r => {
        let rowCloned = row.cloneNode(true)
        r.forEach(val => {
            const button = document.createElement('button')
            if (!isNaN(val)) {
                button.setAttribute('data-val', val)
                button.innerText = val
                button.addEventListener('click', function() {
                    if (!_this.isGameActive()) {
                        return
                    }
                    if (_this.activeCol.col == _this.colCount) {
                        return
                    }
                    var active = _this.mainPanel.querySelector(`div[data-row="${_this.activeCol.row}"] div[data-col="${_this.activeCol.col}"] .num`)
                    active.innerText = this.getAttribute('data-val')
                    active.classList.add('filled')
                    if (_this.activeCol.col < _this.colCount) {
                        _this.activeCol.col++
                    }
                })
            } else if (val == 'Enter') {
                button.innerText = val
                button.setAttribute('id', 'enter-btn')
            } else if (val == '←') {
                button.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>'
                button.setAttribute('id', 'delete-btn')
            }

            const colCloned = col.cloneNode(true)
            colCloned.appendChild(button)
            rowCloned.appendChild(colCloned)
        })
        this.numPad.appendChild(rowCloned)
    })
}



GameBase.prototype.controlNumber = function controlNumber(guess, callback) {

    const guessStatusArr = Array(this.colCount).fill('0')
    const targetNumberChars = this.targetNumber.split('')
    const guessChars = guess.split('')

    guessChars.forEach((c, i) => {
        if (c == targetNumberChars[i]) {
            targetNumberChars[i] = ''
            guessChars[i] = ''
        }
    })

    const sameCharsIndexes = guessChars.reduce((acc, cur, i) => {
        if (cur == '') {
            acc.push(i)
        }
        return acc
    }, [])

    const wrongPlaceCharsIndexes = []
    guessChars.forEach((c, i) => {
        if (c == '') {
            return
        }
        const targetIndex = targetNumberChars.indexOf(c)
        if (targetIndex >= 0) {
            guessChars[i] = ''
            targetNumberChars[targetIndex] = ''
            wrongPlaceCharsIndexes.push(i)
        }
    })

    sameCharsIndexes.forEach(c => guessStatusArr[c] = 's')
    wrongPlaceCharsIndexes.forEach(c => guessStatusArr[c] = 'w')

    this.ui.specifyRowStatus(this.activeCol.row, guessStatusArr, guess)



    if (sameCharsIndexes.length == this.colCount) {
        this.gameStatus = 'finished'
        setTimeout(() => {
            this.ui.createNotifyItem('Kazandın...')
        }, 3000)
    }

    callback()
}

window.onload = function() {
    var UI = new GameUI()
    var game = new GameBase(UI)
    game.init()
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
