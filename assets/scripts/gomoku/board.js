import {buildBoard} from "./build/board.js"
import {buildOverlays} from "./build/overlay.js"

export class Board
{

    /**
     *
     * @param parentId
     * @param {Number} side
     */
    constructor(parentId, side)
    {
        this.parentId = parentId
        this.side = side

        this.parent = document.getElementById(this.parentId)
        this.currentPlayer = -1
        this.currentPiece = 0

        this.online = false
        this.localPLayer = null
        this.room = null
        this.socket = null

        this.hasEverPlayed = false

        this.board = null
        this.overlays = null

        this.resetBoard()

        document.getElementById('theme-button')
            .addEventListener('change', () => this.updateTheme())
    }

    resetBoard()
    {
        while (this.parent.firstChild) this.parent.firstChild.remove()

        this.board = buildBoard(this.side)
        this.overlays = buildOverlays()

        this.parent.append(
            this.board.element,
            this.overlays.initial,
            this.overlays.gameMode,
            this.overlays.name,
            this.overlays.hold,
            this.overlays.final,
            this.overlays.left)

        this.setBehavior()

        this.currentPlayer = -1
        this.currentPiece = 0

        if (!this.hasEverPlayed) {
            this.showOverlay('initial')

            this.hasEverPlayed = true
        } else {
            this.showOverlay('gameMode')
        }
    }

    setBehavior()
    {
        document.getElementById('play-button')
            .addEventListener('click', () => this.showOverlay('gameMode'))
        document.getElementById('offline-button')
            .addEventListener('click', () => this.hideOverlays(true))
        document.getElementById('online-button')
            .addEventListener('click', () => this.showOverlay('name'))
        document.getElementById('name-form')
            .addEventListener('submit', event => {
                event.preventDefault()
                this.registerPlayer()
            })
        document.getElementById('name-button')
            .addEventListener('click', () => this.registerPlayer())
        document.getElementById('win-button')
            .addEventListener('click', () => this.resetBoard())
        document.getElementById('again-button')
            .addEventListener('click', () => this.resetBoard())

        Array.from(document.getElementsByClassName('gomoku-board-check')).forEach(button => {
            button.addEventListener('click', event => this.checkPlace(event))
        })
    }

    updateTheme() {
        let themeStylesheets = document.getElementsByClassName("theme-stylesheet")
        let boardStylesheets = document.getElementsByClassName("board-stylesheet")
        let isDark = document.getElementById("theme-button").checked ? "-night" : ""

        let newThemeStylesheet = `assets/style/bootstrap-5.1.1${isDark}.min.css`
        let newBoardStylesheet = `assets/style/board${isDark}.css`
        let newLogoImage = `assets/images/gomoku-logo${isDark}.png`
        let newGitHubImage = `assets/images/github-logo${isDark}.png`

        document.getElementById("logo-image").setAttribute("src", newLogoImage)
        document.getElementById("github-image").setAttribute("src", newGitHubImage)

        for (let i = 0; i < themeStylesheets.length; i++) themeStylesheets.item(i)
            .setAttribute("href", newThemeStylesheet)

        for (let i = 0; i < boardStylesheets.length; i++) boardStylesheets.item(i)
            .setAttribute("href", newBoardStylesheet)
    }

    showOverlay(overlayName)
    {
        this.hideOverlays()

        this.overlays[`${overlayName}`].style.cssText = `
            display: flex;
            visibility: visible;
        `
    }

    hideOverlays(isBeginningMatch = false)
    {
        for (let overlay in this.overlays) this.overlays[overlay].style.cssText = `
            display: none;
            visibility: hidden;
        `

        if (isBeginningMatch) this.overlays.final.style.display = 'flex'
    }

    /**
     *
     * @param {Event} event
     * @param fromSocket
     */
    checkPlace(event, fromSocket = false)
    {
        let x, y, check

        if (!fromSocket) {
            check = event.target

            let k = check.id.split(' ').map(value => parseInt(value))
            x = k[0]
            y = k[1]
        }
        
        
        if(this.online)
        {
            if (!fromSocket) {
                this.socket.emit('play', {player: this.localPLayer, room: this.room, checks: [x,y]})
                return
            }
            else if (event.player !== this.currentPlayer) return
            else {
                [x, y] = [event.checks[0], event.checks[1]]
                let checkId = event.checks.join(' ')
                check = document.getElementById(checkId)
            }
        }
        

        if (this.board.gameState[x][y]) return

        this.board.gameState[x][y] = this.currentPlayer

        check.className += this.currentPlayer === -1 ? ' blue' : ' red'
        check.setAttribute("check-number",
            ++this.currentPiece < 10 ? "0" + this.currentPiece : this.currentPiece);

        if (this.didGameEnd([x, y])) this.showWinner(this.currentPlayer < 0 ? ' blue' : ' red')

        this.currentPlayer = -this.currentPlayer
    }

    registerPlayer()
    {
        this.room = document.getElementById('name-input').value
        this.socket = io("https://gomokuws.ygarasab.com")
        this.socket
            .on('play', data => this.checkPlace(data, true))
            .on('joined', ({player}) => {
                this.online = true
                this.localPLayer = player

                if(this.localPLayer === -1) this.showOverlay('hold')
                else this.hideOverlays(true)
            })
            .on('ready', () => this.hideOverlays(true))
            .on('full', () => {
                alert("The room is full. Please try another room or play offline.")

                this.online = false
                this.localPLayer = null
                this.room = null
                this.socket.close()
                this.socket = null
                this.showOverlay('gameMode')
            })
            .on("connect", () => {
                if(!this.online)
                    this.socket.emit('join', this.room)
            })
            .on("left", ()=> this.showOverlay('left'))
    }

    showWinner(winner)
    {
        document.getElementById("win-text").innerHTML = `Player ${winner} won!`
        this.showOverlay('final')
    }

    didGameEnd(position)
    {
        let [x, y] = position

        const horizontal_sides = {
            right(x, y) {
                return [x, ++y]
            },
            left(x, y) {
                return [x, --y]
            }
        }

        const vertical_sides = {
            top(x, y) {
                return [--x, y]
            },
            bottom(x, y) {
                return [++x, y]
            }
        }

        const main_diagonal = {
            diagonal_left_top(x, y) {
                return [--x, --y]
            },
            diagonal_right_bottom(x, y) {
                return [++x, ++y]
            }

        }

        const secondary_diagonal = {
            diagonal_right_top(x, y) {
                return [--x, ++y]
            },
            diagonal_left_bottom(x, y) {
                return [++x, --y]
            }
        }

        let stone_counter = 1
        let [current_x, current_y] = [x, y]

        try {
            // Checking horizontal sides (left and right)
            for (let side of Object.values(horizontal_sides)) {
                [x, y] = side(current_x, current_y)

                while (this.board.gameState[x][y] === this.currentPlayer) {
                    ++stone_counter;

                    [x, y] = side(x, y)

                    console.log("Contador horizontal: " + stone_counter)
                }
            }

            if (stone_counter === 5) return true

            stone_counter = 1

            // Checking vertical sides (top and bottom)
            for (let side of Object.values(vertical_sides)) {
                [x, y] = side(current_x, current_y)

                while (this.board.gameState[x][y] === this.currentPlayer) {
                    ++stone_counter;

                    [x, y] = side(x, y)

                    console.log("Contador horizontal: " + stone_counter)
                }
            }

            if (stone_counter === 5) return true

            stone_counter = 1

            // Checking main diagonal sides
            for (let side of Object.values(main_diagonal)) {
                [x, y] = side(current_x, current_y)

                while (this.board.gameState[x][y] === this.currentPlayer) {
                    ++stone_counter;

                    [x, y] = side(x, y)

                    console.log("Contador da diagonal : " + stone_counter)

                }
            }

            if (stone_counter === 5) return true

            stone_counter = 1

            // Checking secondary diagonal sides
            for (let side of Object.values(secondary_diagonal)) {
                [x, y] = side(current_x, current_y)

                while (this.board.gameState[x][y] === this.currentPlayer) {
                    ++stone_counter;

                    [x, y] = side(x, y)

                    console.log("Contador da diagonal secundária: " + stone_counter)
                }
            }

            if (stone_counter === 5) return true

        } catch(e) {
        }
    }
}
