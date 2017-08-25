let Util = {
    randomFrom: function (array) {
        let r = Math.floor(Math.random() * array.length)
        return array[r]
    }
}

let Statistics = function (name, games, wins, bestRecord, worstRecord) {
    this.name = name
    this.games = games || 0
    this.wins = wins || 0
    this.bestRecord = bestRecord || Number.MAX_SAFE_INTEGER
    this.worstRecord = worstRecord || Number.MIN_SAFE_INTEGER
}
Statistics.prototype.toDetails = function () {
    let outer = document.createElement('details')
    let summ = document.createElement('summary')
    summ.innerText = this.name
    let rest = document.createElement('dl')
    outer.appendChild(summ)
    outer.appendChild(rest)

    function doDLItem(label, func) {
        let dt = document.createElement('dt')
        let dd = document.createElement('dd')
        dt.innerText = label
        dd.innerText = func()
        rest.appendChild(dt)
        rest.appendChild(dd)
    }

    doDLItem('Name', () => this.name)
    doDLItem('Games', () => this.games)
    doDLItem('Wins', () => this.wins)
    doDLItem('Losses', () => this.getLosses())
    doDLItem('Win %', () => this.winPercent() + '%')
    let br = this.bestRecord == Number.MAX_SAFE_INTEGER ? 'N/A' : this.bestRecord + ' guesses'
    let wr = this.worstRecord == Number.MIN_SAFE_INTEGER ? 'N/A' : this.worstRecord + ' guesses'
    doDLItem('Fastest game', () => br)
    doDLItem('Slowest game', () => wr)
    return outer
}

Statistics.prototype.winPercent = function () {
    if (this.games == 0)
        return 0
    return (this.wins / this.games) * 100
}

Statistics.prototype.getLosses = function () {
    return this.games - this.wins
}

let loadStatistics = function () {
    let loaded = localStorage.getItem('stats')
    if (loaded !== null) {
        let parsed = JSON.parse(loaded)
        if (Array.isArray(parsed)) {
            let ret = {}

            parsed.forEach(function (element) {
                ret[element.name] = new Statistics(element.name, element.games, element.wins,
                    element.bestRecord, element.worstRecord)
            }, this);

            return ret
        }
    }
    return []
}

let saveStatistics = function (stats) {
    let tmp = []
    for (var key in stats) {
        if (stats.hasOwnProperty(key)) {
            tmp.push(stats[key])
        }
    }
    localStorage.setItem('stats', JSON.stringify(tmp))
    this.fireEvent('stats', this.statistics)
}


class Hangman {
    constructor() {
        this.events = ['stats', 'started', 'loaded', 'guess', 'game_win', 'game_lose']
        this.callbacks = []
        this.dictionary = []
        this.currentStatistics = {}
        this.word = ''
        this.statistics = loadStatistics.call(this)

        this.events.forEach(function (element) {
            this.callbacks[element] = []
        }, this)

        this.registerHandler = function (ev, cb) {
            this.callbacks[ev].push(cb)
        }

        this.fireEvent = function (ev, ...data) {
            this.callbacks[ev].forEach((element) => {
                element(this, ...data)
            }, this)
        }

        this.startGame = function (player) {
            this.currentStatistics = this.statistics[player] || new Statistics(player)
            this.statistics[player] = this.currentStatistics
            this.currentStatistics.games++;
            this.guessCount = 0
            this.structure = `___________ 
  |       | 
  |       0 
  |      /|\\
  |      / \\
__|____      `
            this.failPath = [
                [1, 10],
                [2, 10],
                [3, 9],
                [3, 10],
                [3, 11],
                [4, 9],
                [4, 11],
            ]
            this.failCount = 0
            this.guesses = new Set()
            this.playing = false
            this.word = this.randomWord()

            this.word = this.word.toLowerCase()
            this.playing = true

            this.fireEvent('started')

            saveStatistics.call(this, this.statistics)
        }

        this.loadWords = function (words) {
            if (this.playing) return
            this.dictionary = this.dictionary.concat(words.map(e => e.trim()))
            this.fireEvent('loaded')
            saveStatistics.call(this, this.statistics)
        }

        this.loadWordsAjax = function (uri) {
            if (this.playing) return
            fetch(uri).then(e => {
                e.text().then(data => {
                    this.loadWords(data.split(/\n/))
                })
            })
        }

        this.getCurrentBoard = function () {
            let fails = this.failPath
            let path = this.structure.split('\n').map(e => {
                return e.split('')
            })

            fails.forEach(function (element, i) {
                if (i >= this.failCount)
                    path[element[0]][element[1]] = ' '
            }, this);

            return path.map(e => e.join('')).join('\n')
        }

        this.getPlayingWord = function () {
            return this.word.split('').map(e => {
                if (this.guesses.has(e))
                    return e
                return '_'
            }).join('')
        }

        this.randomWord = function () {
            return Util.randomFrom(this.dictionary)
        }

        let validLetterGuess = function (guess) {
            return this.guesses.has(guess) == false && this.word.includes(guess)
        }

        let tryWin = function () {
            let hasWon = true
            let hasLost = false

            this.word.split('').forEach(function (element) {
                if (!this.guesses.has(element))
                    hasWon = false
            }, this);
            if (this.failCount >= this.failPath.length)
                hasLost = true

            if (hasWon || hasLost) {
                this.playing = false
            }

            if (hasLost)
                this.fireEvent('game_lose')
            else if (hasWon) {
                this.fireEvent('game_win')
                this.currentStatistics.bestRecord = Math.min(
                    this.currentStatistics.bestRecord,
                    this.guessCount
                )
                this.currentStatistics.worstRecord = Math.max(
                    this.currentStatistics.worstRecord,
                    this.guessCount
                )
                this.currentStatistics.wins++
            }
        }
        this.makeGuess = function (guess) {
            this.guessCount++;
            guess = guess.toLowerCase().replace(/[^a-z]/g, '')
            if (!this.playing)
                return
            let hit = false;
            if (!guess || guess.length == 0) {
                return
            } else if (guess.length == 1) {
                hit = validLetterGuess.call(this, guess)
            } else {
                if (guess === this.word) {
                    hit = true
                    this.word.split('').forEach(function (element) {
                        this.guesses.add(element)
                    }, this);
                } else {
                    let wrongLetters = 0
                    guess.split('').forEach(e => {
                        if (!this.word.includes(e))
                            wrongLetters++;
                    })

                    this.failCount += wrongLetters
                }
            }

            this.guesses.add(guess)

            if (!hit) {
                this.failCount++;
            }

            this.fireEvent('guess', guess, hit)
            tryWin.call(this)

            saveStatistics.call(this, this.statistics)
        }
    }
}