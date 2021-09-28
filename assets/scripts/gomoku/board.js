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
        this.hasEverPlayed = false

        this.board = null
        this.overlays = null

        this.resetBoard()
    }

    resetBoard()
    {
        while (this.parent.firstChild) this.parent.firstChild.remove()

        this.board = buildBoard(this.side)
        this.overlays = buildOverlays()

        this.parent.append(
            this.board.element, this.overlays.initial, this.overlays.gameMode, this.overlays.name, this.overlays.final)

        this.setBehavior()

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
            .addEventListener("click", () => this.showOverlay('gameMode'))
        document.getElementById('offline-button')
            .addEventListener("click", () => this.hideOverlays(true))
        document.getElementById('online-button')
            .addEventListener("click", () => this.showOverlay('name'))
        document.getElementById('name-button')
            .addEventListener("click", event => this.registerPlayer(event))
        document.getElementById('win-button')
            .addEventListener("click", () => this.resetBoard())

        Array.from(document.getElementsByClassName('gomoku-board-check')).forEach(button => {
            button.addEventListener("click", event => this.checkPlace(event))
        })
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
     */
    checkPlace(event)
    {
        let check = event.target
        let [x, y] = check.id.split(' ').map(value => parseInt(value))

        if (this.board.gameState[x][y]) return

        this.board.gameState[x][y] = this.currentPlayer
        check.className += this.currentPlayer === -1 ? ' blue' : ' red'

        if (this.didGameEnd([x, y])) this.showWinner(this.currentPlayer < 0 ? ' blue' : ' red')

        this.currentPlayer = -this.currentPlayer
    }

    registerPlayer(event)
    {
        // Do something with the player's name

        this.hideOverlays(true)
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
