class Board{

    /**
     * 
     * @param {Number} side 
     */
    constructor(side)
    {
        this.side = side

        this.currentPlayer = -1;

        // Board
        this.boardElement = document.createElement('div')
        this.boardElement.className = 'gomoku-board'
        this.boardElement.id = 'gomoku-board'
        this.boardElement.style.gridTemplateColumns = 'auto '.repeat(side);

        // Overlay after a win
        this.overlay = document.createElement('div')
        this.overlay.className = 'overlay'
        this.overlay.style.visibility = 'hidden'

        // Container for overlay objects
        let overlayContainer = document.createElement('div')
        overlayContainer.className = 'overlay-container'
        this.overlay.appendChild(overlayContainer)

        // Overlay object: text informing the winner
        this.winnerText = document.createElement('p')
        this.winnerText.id = 'winner-text'
        overlayContainer.appendChild(this.winnerText)

        // Overlay object: play again button
        let playAgainButton = document.createElement('button')
        playAgainButton.className = 'btn btn-danger'
        playAgainButton.id = 'play-again-button'
        playAgainButton.type = 'button'
        playAgainButton.innerHTML = 'Play Again'
        playAgainButton.onclick = () => this.resetBoard();
        overlayContainer.appendChild(playAgainButton)

        this.checks = []
        this.gamestate = []

        this.fillBoard()
    }

    fillBoard()
    {
        for (let i = 0; i < this.side; i++) {

            this.gamestate.push([])
            
            for (let j = 0; j < this.side; j++) {
                
                let check = document.createElement('div')
                check.className = 'gomoku-board-check'
                check.id = i + ' ' + j
                check.onclick = event => this.checked(event)

                this.gamestate[i].push(0)
                this.checks.push(check)
                this.boardElement.appendChild(check)
                
            }
            
        }
    }

    resetBoard()    
    {
        this.overlay.style.visibility = 'hidden'
        this.overlay.style.zIndex = ''
        this.winnerText.innerHTML = ''
        
        this.checks = [];

        for (let i = 0; i < this.side; i++) {

            for (let j = 0; j < this.side; j++) {

                this.gamestate[i][j] = 0             
                let check = document.getElementById(i + ' ' + j)
                check.className = 'gomoku-board-check'
                this.checks.push(check)
                
            }
            
        }
    }

    showWinner()
    {
        this.overlay.style.opacity = '0.9'
        this.overlay.style.zIndex = 1
        this.overlay.style.visibility = 'visible'
        this.winnerText.innerHTML = (this.currentPlayer == -1 ? "Blue" : "Red") + " player won!"
    }


    draw(parentId)
    {
        let parent = document.getElementById(parentId)
        parent.appendChild(this.boardElement)
        parent.appendChild(this.overlay)
    }

    /**
     * 
     * @param {Event} event 
     */
    checked(event)
    {
        let check = event.target
        
        let [x, y] = check.id.split(' ').map(value => parseInt(value))
        if(this.gamestate[x][y]) return

        this.gamestate[x][y] = this.currentPlayer
        event.target.className += this.currentPlayer < 0 ? ' blue' : ' red'

        if (this.didGameEnd([x, y])) {
           this.showWinner()
        } 

        this.currentPlayer = -this.currentPlayer;
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

                while (this.gamestate[x][y] == this.currentPlayer) {
                    ++stone_counter;

                    [x, y] = side(x, y)

                    console.log("Contador horizontal: " + stone_counter)
                }
            }

            if (stone_counter == 5) return true;

            stone_counter = 1

            // Checking vertical sides (top and bottom)
            for (let side of Object.values(vertical_sides)) {
                [x, y] = side(current_x, current_y)

                while (this.gamestate[x][y] == this.currentPlayer) {
                    ++stone_counter;

                    [x, y] = side(x, y)

                    console.log("Contador horizontal: " + stone_counter)
                }
            }

            if (stone_counter == 5) return true;

            stone_counter = 1

            // Checking main diagonal sides 
            for (let side of Object.values(main_diagonal)) {
                [x, y] = side(current_x, current_y)

                while (this.gamestate[x][y] == this.currentPlayer) {
                    ++stone_counter;
                    
                    [x, y] = side(x, y)

                    console.log("Contador da diagonal : " + stone_counter)

                }
            }

            if (stone_counter == 5) return true;

            stone_counter = 1

            // Checking secondary diagonal sides 
            for (let side of Object.values(secondary_diagonal)) {
                [x, y] = side(current_x, current_y)

                while (this.gamestate[x][y] == this.currentPlayer) {
                    ++stone_counter;

                    [x, y] = side(x, y)

                    console.log("Contador da diagonal secundária: " + stone_counter)
                }
            }

            if (stone_counter == 5) return true;

        } catch(e) {
        }

    } 

}