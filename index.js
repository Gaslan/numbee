function NumPad() {
    this.numPadButtons = {}
    this.numPad = document.querySelector('section.num-pad')
}

NumPad.prototype.editNumPadButtonColor = function editNumPadButtonColor(numPadBtn, result) {
    if (numPadBtn.classList.contains('same')) {
        return
    }

    if (numPadBtn.classList.contains('wrong-place')) {
        if (result == 's') {
            numPadBtn.classList.remove('wrong-place')
            numPadBtn.classList.add('same')
        }
        return
    }
    
    if (numPadBtn.classList.contains('not-exist')) {
        if (result == 's') {
            numPadBtn.classList.remove('not-exist')
            numPadBtn.classList.add('same')
        }
        if (result == 'w') {
            numPadBtn.classList.remove('not-exist')
            numPadBtn.classList.add('wrong-place')
        }
        return
    }

    if (result == '0') {
        numPadBtn.classList.add('not-exist')
        return
    }

    if (result == 'w') {
        numPadBtn.classList.add('wrong-place')
        return
    }

    if (result == 's') {
        numPadBtn.classList.add('same')
        return
    }
}

NumPad.prototype.editNumPadColors = function editNumPadColors(guessStatusArr) {
    var _this = this
    guessStatusArr.forEach(function(x) {
        const num = _this.numPadButtons['btn' + x.char]
        const result = x.result
        _this.editNumPadButtonColor(num, result)
    })
}

NumPad.prototype.createNumPad = function createNumPad(game) {
    const numPadChars = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['Enter', '0', '←']
    ]

    numPadChars.forEach(r => {
        const row = document.createElement('div')
        row.classList.add('row')

        r.forEach(val => {
            const button = document.createElement('button')
            if (!isNaN(val)) {
                button.innerText = val
                button.setAttribute('data-val', val)
                this.numPadButtons['btn' + val] = button
            } else if (val == 'Enter') {
                button.innerText = val
                button.setAttribute('id', 'enter-btn')
                this.numPadButtons['btnEnter'] = button
            } else if (val == '←') {
                button.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>'
                button.setAttribute('id', 'delete-btn')
                this.numPadButtons['btnDelete'] = button
            }

            const col = document.createElement('div')
            col.classList.add('col')
            col.appendChild(button)
            row.appendChild(col)
        })
        this.numPad.appendChild(row)
    })
}

function GameUI() {
    this.settingsBtn = document.querySelector('#settings')
    this.helpBtn = document.querySelector('#help-btn')
    this.subPageSettings = document.querySelector('#sub-page-settings')
    this.subPageHelp = document.querySelector('#sub-page-help')
    this.statisticsBtn = document.querySelector('#statistics-btn')
    this.statisticsModal = document.querySelector('#statistics-modal')
    this.mainPanel = document.querySelector('section.main')
    this.notify = document.querySelector('.notify')

    this.numPad = new NumPad()
    this.numPad.createNumPad()
}

GameUI.prototype.init = function init() {
    const _this = this
    const darkTheme = localStorage.getItem('dark-theme')
    if (darkTheme && darkTheme == 'true') {
        document.body.classList.add('dark')
    }

    this.settingsBtn.addEventListener('click', function() {
        _this.subPageSettings.classList.toggle('open')
    })

    document.querySelector('#settings-close').addEventListener('click', function() {
        _this.subPageSettings.classList.add('closing')
        setTimeout(function() {
            _this.subPageSettings.classList.remove('closing')
        }, 150)
        setTimeout(function() {
            _this.subPageSettings.classList.toggle('open')
        }, 150)
    })

    this.helpBtn.addEventListener('click', function() {
        _this.subPageHelp.classList.toggle('open')
    })

    document.querySelector('#help-close').addEventListener('click', function() {
        _this.subPageHelp.classList.add('closing')
        setTimeout(function() {
            _this.subPageHelp.classList.remove('closing')
        }, 150)
        setTimeout(function() {
            _this.subPageHelp.classList.toggle('open')
        }, 150)
    })

    this.statisticsBtn.addEventListener('click', function() {
        let stats = localStorage.getItem('statistics')
        stats = JSON.parse(stats)
        _this.createGuessDistribution(stats)
        _this.createStatsPanels(stats)
        _this.statisticsModal.classList.toggle('open')
    })

    document.querySelector('#statistics-modal .close-btn').addEventListener('click', function(e) {
        _this.statisticsModal.classList.remove('open')
    })

    this.statisticsModal.addEventListener('click', function(e) {
        if (this != e.target) {
            return
        }
        
        _this.statisticsModal.classList.remove('open')
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

GameUI.prototype.createNotifyItem = function createNotifyItem(message) {
    const _this = this
    const notifyItem = document.createElement('div')
    notifyItem.classList.add('notify-item')
    notifyItem.innerText = message
    this.notify.insertAdjacentElement('afterbegin', notifyItem)
    setTimeout(function() {
        _this.notify.removeChild(notifyItem)
    }, 1100)
}

GameUI.prototype.specifyRowStatus = function specifyRowStatus(currentRow, guessStatusArr) {
    const row = this.mainPanel.querySelector(`div[data-row="${currentRow}"]`)
    guessStatusArr.forEach((x, i) => {
        const col = row.querySelector(`div[data-col="${i}"] .num`)
        if (x.result == '0') {
            col.classList.add('not-exist')
        }
        if (x.result == 'w') {
            col.classList.add('wrong-place')
        }
        if (x.result == 's') {
            col.classList.add('same')
        }
    })

    this.numPad.editNumPadColors(guessStatusArr)  
}


GameUI.prototype.createMainPanel = function createMainPanel(rowCount, colCount) {

    var mainPanelInner = document.createElement('div')
    mainPanelInner.classList.add('main-inner')

    var row = document.createElement('div')
    row.classList.add('row')

    var col = document.createElement('div')
    col.classList.add('col')

    var num = document.createElement('div')
    num.classList.add('num')

    col.appendChild(num)

    for (let i = 0; i < colCount; i++) {
        let colCloned = col.cloneNode(true)
        colCloned.setAttribute('data-col', i)
        row.appendChild(colCloned)
    }

    for (let i = 0; i < rowCount; i++) {
        let rowCloned = row.cloneNode(true)
        rowCloned.setAttribute('data-row', i)
        mainPanelInner.appendChild(rowCloned)
    }
    this.mainPanel.appendChild(mainPanelInner)
}

GameUI.prototype.createGuessDistribution = function createGuessDistribution(stats) {
    const container = document.createElement('div')
    container.classList.add('guess-distribution-container')

    for (const key in stats.guesses) {

        if (key == 'fail') {
            continue
        }

        const count = stats.guesses[key]
        const countPersentage = Math.round(count / stats.played * 100)
        let width = 7
        if (countPersentage > 7) {
            width = countPersentage
        }

        const row = document.createElement('div')
        row.classList.add('guess-distribution-row')

        const guessCount = document.createElement('div')
        guessCount.classList.add('guess-distribution-guess-count')
        guessCount.innerText = key

        const graph = document.createElement('div')
        graph.classList.add('guess-distribution-graph')

        const graphBar = document.createElement('div')
        graphBar.classList.add('guess-distribution-graph-bar')
        graphBar.style.width = width + '%'

        const graphBarValue = document.createElement('div')
        graphBarValue.classList.add('guess-distribution-graph-bar-value')
        graphBarValue.innerText = count

        graphBar.appendChild(graphBarValue)
        graph.appendChild(graphBar)
        row.appendChild(guessCount)
        row.appendChild(graph)
        container.appendChild(row)
    }
    document.querySelector('#guess-distribution').innerHTML = ''
    document.querySelector('#guess-distribution').appendChild(container)
}

GameUI.prototype.createStatsPanels = function createStatsPanels(stats) {
    
    const container = document.createElement('div')
    container.classList.add('stats-panel-container')

    const panels = {
        played: 'Played',
        winPersentage: 'Win %',
        streak: 'Current Streak',
        maxStreak: 'Max Streak'
    }

    for (const key in panels) {
        const panel = panels[key]

        let item = document.createElement('div')
        item.classList.add('stats-panel-item')
        item.id = 'stats-' + key
        
        let itemValue = document.createElement('div')
        itemValue.classList.add('stats-panel-item-value')
        itemValue.innerText = stats[key]
        
        let itemDetail = document.createElement('div')
        itemDetail.classList.add('stats-panel-item-detail')
        itemDetail.innerText = panel

        item.appendChild(itemValue)
        item.appendChild(itemDetail)
        container.appendChild(item)
    }
    document.querySelector('#stats-panel').innerHTML = ''
    document.querySelector('#stats-panel').appendChild(container)
}



function Game(ui) {
    this.ui = ui
    this.mainPanel = ui.mainPanel
    this.numPad = ui.numPad.numPad
    this.activeCol = {
        row: 0,
        col: 0
    }
    this.rowCount = 6
    this.colCount = 5

    const min = Math.pow(10, this.colCount - 1)
    const max = Math.pow(10, this.colCount) - 1
    this.targetNumber = getRandomInt(min, max) + ''
    console.log(this.targetNumber)

    this.targetNumberObj = this.createNumberObj(this.targetNumber)
    console.log('targetNumberObj: ', this.targetNumberObj)

    this.gameStatus = 'started'
}

Game.prototype.createNumberObj = function createNumberObj(num) {
    return num.split('').reduce((o, c) => {
        if (!o[c]) {
            o[c] = 0
        }
        o[c]++ 
        return o
    }, {})
}

Game.prototype.init = function init() {
    this.ui.init()
    this.ui.createMainPanel(this.rowCount, this.colCount)
    _this = this

    function handleNumPadButtonClicked() {
        if (!_this.isGameActive()) {
            return
        }
        if (_this.activeCol.col == _this.colCount) {
            return
        }
        var active = document.querySelector(`section.main div[data-row="${_this.activeCol.row}"] div[data-col="${_this.activeCol.col}"] .num`)
        active.innerText = this.getAttribute('data-val')
        active.classList.add('filled')
        if (_this.activeCol.col < _this.colCount) {
            _this.activeCol.col++
        }
    }

    for (let i = 0; i <= 9; i++) {
        this.ui.numPad.numPadButtons['btn' + i].addEventListener('click', handleNumPadButtonClicked)
    }

    function shakeRow(rowIndex) {
        const row = document.querySelector(`.main .row[data-row="${rowIndex}"]`)
        row.classList.add('row-error')
        setTimeout(function() {
            row.classList.remove('row-error')
        }, 1000)
    }

    this.ui.numPad.numPadButtons['btnEnter'].addEventListener('click', function() {
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

    this.ui.numPad.numPadButtons['btnDelete'].addEventListener('click', function() {
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

    
    if (!localStorage.getItem('statistics')) {
        localStorage.setItem('statistics', JSON.stringify({
            played: 0,
            won: 0,
            streak: 0,
            maxStreak: 0,
            winPersentage: 0,
            guesses:{
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0,
                "6": 0,
                "fail": 0
            }
        }))
    }
}

Game.prototype.updateGameStatus = function updateGameStatus(status, rowCount) {
    let stats = localStorage.getItem('statistics')
    stats = JSON.parse(stats)

    if (status == 'win') {
        stats.played++
        stats.won++
        stats.streak++
        if (stats.streak > stats.maxStreak) {
            stats.maxStreak = stats.streak
        }
        stats.winPersentage = Math.round(stats.won / stats.played * 100)
        stats.guesses[rowCount + 1]++
    }

    if (status == 'fail') {
        stats.played++
        stats.streak = 0
        stats.winPersentage = Math.round(stats.won / stats.played * 100)
        stats.guesses['fail']++
    }

    this.ui.createGuessDistribution(stats)
    this.ui.createStatsPanels(stats)

    localStorage.setItem('statistics', JSON.stringify(stats))
}

Game.prototype.isGameActive = function isGameActive() {
    return this.gameStatus == 'started'
}

Game.prototype.controlNumber = function controlNumber(guess, callback) {

    const targetNumberChars = this.targetNumber.split('')
    const guessChars = guess.split('')

    const guessStatusArr = guessChars.map(c => {
        return {
            char: c,
            result: '0'
        }
    })

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

    sameCharsIndexes.forEach(c => guessStatusArr[c].result = 's')
    wrongPlaceCharsIndexes.forEach(c => guessStatusArr[c].result = 'w')

    this.ui.specifyRowStatus(this.activeCol.row, guessStatusArr)

    if (sameCharsIndexes.length == this.colCount) {
        this.gameStatus = 'finished'
        this.updateGameStatus('win', this.activeCol.row)
        setTimeout(() => {
            this.ui.createNotifyItem('Kazandın...')
        }, 3000)
        setTimeout(() => {
            document.querySelector('#statistics-modal').classList.toggle('open')
        }, 4000)
        
        callback()
        return
    }

    if (this.activeCol.row + 1 == this.rowCount) {
        this.gameStatus = 'finished'
        this.updateGameStatus('fail', this.activeCol.row)
        setTimeout(() => {
            this.ui.createNotifyItem('Kaybettin...' + ' ' + this.targetNumber)
        }, 3000)
        setTimeout(() => {
            document.querySelector('#statistics-modal').classList.toggle('open')
        }, 4000)
    }

    callback()
}

window.onload = function() {
    var UI = new GameUI()
    var game = new Game(UI)
    game.init()
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
