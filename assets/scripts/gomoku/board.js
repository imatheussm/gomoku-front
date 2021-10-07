import {buildBoard, buildVisitedMatrix} from "./build/board.js"
import {buildOverlays} from "./build/overlay.js"

const DIRECTIONS = {
    "UPPER LEFT": [-1, -1],
    "UP": [0, -1],
    "UPPER RIGHT": [1, -1],
    "LEFT": [-1, 0],
    "RIGHT": [1, 0],
    "LOWER LEFT": [-1, 1],
    "DOWN": [0, 1],
    "LOWER RIGHT": [1, 1]
}

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
        this.visited = null

        this.resetBoard(false, false)
        this.initializeThemeSwitch()
    }

    resetBoard(beginMatchAfterwards, resetScore)
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
            this.overlays.final)
        this.updateTheme()

        if (resetScore) this.resetScore()

        this.setBehavior()

        this.currentPlayer = -1
        this.currentPiece = 0

        if (beginMatchAfterwards) {
            this.hideOverlays(true)
        } else if (!this.hasEverPlayed) {
            this.showOverlay("initial")

            this.hasEverPlayed = true
        } else {
            this.showOverlay("gameMode")
        }
    }

    resetScore()
    {
        document.getElementById("blue-score-text").innerHTML = "0"
        document.getElementById("red-score-text").innerHTML = "0"
    }

    setBehavior()
    {
        document.getElementById("play-button")
            .addEventListener("click", () => this.showOverlay("gameMode"))
        document.getElementById("offline-button")
            .addEventListener("click", () => this.hideOverlays(true))
        document.getElementById("online-button")
            .addEventListener("click", () => this.showOverlay("name"))
        document.getElementById("name-form")
            .addEventListener("submit", event => {
                event.preventDefault()
                this.registerPlayer()
            })
        document.getElementById("name-button")
            .addEventListener("click", () => this.registerPlayer())
        document.getElementById("reset-button")
            .addEventListener("click", () => this.resetBoard(true, false))
        document.getElementById("toggle-button")
            .addEventListener("click", () => this.toggleMode())

        Array.from(document.getElementsByClassName("gomoku-board-check")).forEach(button => {
            button.addEventListener("click", event => this.checkPlace(event))
        })
    }

    toggleMode()
    {
        document.getElementById("score-text").classList.add("invisible")
        this.resetBoard(false, true)

        if (this.online) {
            this.unregisterPlayer()
            this.hideOverlays(true)
        } else {
            this.showOverlay("name")
        }
    }

    initializeThemeSwitch()
    {
        let themeSwitch = document.getElementById("theme-switch")
        themeSwitch.disabled = false

        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            themeSwitch.checked = true
        }

        document.getElementById("theme-switch")
            .addEventListener("change", () => this.updateTheme())

        this.updateTheme()
    }

    updateTheme()
    {
        let themeStylesheets = document.getElementsByClassName("theme-stylesheet")
        let overlays = document.getElementsByClassName("overlay")
        let isDark = document.getElementById("theme-switch").checked ? "-night" : ""

        let newThemeStylesheet = `assets/style/bootstrap-5.1.1${isDark}.min.css`
        let newLogoImage = `assets/images/gomoku-logo${isDark}.png`
        let newGitHubImage = `assets/images/github-logo${isDark}.png`

        document.getElementById("logo-image").setAttribute("src", newLogoImage)
        document.getElementById("github-image").setAttribute("src", newGitHubImage)

        for (let i = 0; i < overlays.length; i++) {
            let overlay = overlays.item(i)

            isDark ? overlay.classList.add("overlay-night") : overlay.classList.remove("overlay-night")
        }

        for (let i = 0; i < themeStylesheets.length; i++) themeStylesheets.item(i)
            .setAttribute("href", newThemeStylesheet)
    }

    showOverlay(overlayName)
    {
        this.hideOverlays()

        this.overlays[overlayName].classList.add("d-flex", "visible")
        this.overlays[overlayName].classList.remove("d-none", "invisible")
    }

    hideOverlays(isBeginningMatch = false)
    {
        for (let overlay in this.overlays) {
            this.overlays[overlay].classList.add("d-none", "invisible")
            this.overlays[overlay].classList.remove("d-flex", "visible")
        }

        if (isBeginningMatch) {
            this.overlays.final.classList.add("d-flex")
            this.overlays.final.classList.remove("d-none")

            document.getElementById("score-text").classList.remove("invisible")
        }
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

            let k = check.id.split(" ").map(value => parseInt(value))
            x = k[0]
            y = k[1]
        }
        
        if(this.online) {
            if (!fromSocket) {
                this.socket.emit("play", {player: this.localPLayer, room: this.room, checks: [x, y]})
                return
            } else if (event.player !== this.currentPlayer) return
            else {
                [x, y] = [event.checks[0], event.checks[1]]
                let checkId = event.checks.join(" ")
                check = document.getElementById(checkId)
            }
        }

        if (this.board.gameState[x][y]) return

        this.board.gameState[x][y] = this.currentPlayer

        check.classList.add(this.currentPlayer === -1 ? "bg-primary" : "bg-danger")
        check.setAttribute("check-number",
            ++this.currentPiece < 10 ? "0" + this.currentPiece : this.currentPiece);

        if (this.didGameEnd([x, y])) {
            let winnerScoreText =
                document.getElementById(`${this.currentPlayer < 0 ? "blue" : "red"}-score-text`)
            winnerScoreText.innerHTML = `${parseInt(winnerScoreText.innerHTML) + 1}`

            this.showFinalOverlay(`Player ${this.currentPlayer < 0 ? "blue" : "red"} won!`)
        }

        this.currentPlayer = -this.currentPlayer
    }

    registerPlayer()
    {
        this.room = document.getElementById("name-input").value
        this.socket = io("https://gomokuws.ygarasab.com")
        this.socket
            .on("play", data => this.checkPlace(data, true))
            .on("joined", ({player}) => {
                this.online = true
                this.localPLayer = player

                if(this.localPLayer === -1) this.showOverlay("hold")
                else this.hideOverlays(true)
            })
            .on("ready", () => this.hideOverlays(true))
            .on("full", () => {
                alert("The room is full. Please try another room or play offline.")
                this.unregisterPlayer()
                this.showOverlay("gameMode")
            })
            .on("connect", () => {
                if(!this.online) this.socket.emit("join", this.room)
            })
            .on("left", () => {
                this.showFinalOverlay(
                    `Player ${this.currentPlayer < 0 ? "red" : "blue"} has disconnected!`, true)
            })
    }

    unregisterPlayer()
    {
        this.online = false
        this.localPLayer = null
        this.room = null
        this.socket.close()
        this.socket = null
    }

    showFinalOverlay(message, hidePlayButton = false)
    {
        let resetButton = document.getElementById("reset-button")

        document.getElementById("final-text").innerHTML = message
        document.getElementById("toggle-button").innerHTML =
            this.online ? "Go offline" : "Go online"

        if (hidePlayButton) resetButton.classList.add("d-none")
        else resetButton.classList.remove("d-none")

        this.showOverlay("final")
    }

    didGameEnd(position, count = 0, direction = null)
    {
        if (count === 0) {
            let [x, y] = position

            this.visited = buildVisitedMatrix(this.side)
            this.visited[x][y] = true

            let scores = [
                // Main diagonal
                this.didGameEnd(position, count + 1, "UPPER LEFT")
                    + this.didGameEnd(position, count + 1, "LOWER RIGHT"),
                // Secondary diagonal
                this.didGameEnd(position, count + 1, "LOWER LEFT")
                    + this.didGameEnd(position, count + 1, "UPPER RIGHT"),
                // Horizontal axis
                this.didGameEnd(position, count + 1, "LEFT")
                    + this.didGameEnd(position, count + 1, "RIGHT"),
                // Vertical axis
                this.didGameEnd(position, count + 1, "UP")
                    + this.didGameEnd(position, count + 1, "DOWN")
            ]

            for (const score of scores) if (score + 1 === 5) return true

            return false
        }
        else {
            let delta = DIRECTIONS[direction]
            let [x, y] = [position[0] + delta[0], position[1] + delta[1]]

            if (x < 0 || x === this.side
                || y < 0 || y === this.side
                || this.visited[x][y]
                || this.board.gameState[x][y] !== this.currentPlayer) return count - 1

            this.visited[x][y] = true

            return this.didGameEnd([x, y], count + 1,  direction)
        }
    }
}
