class Board{

    /**
     * 
     * @param {Number} side 
     */
    constructor(side)
    {
        this.side = side

        this.currentPlayer = -1;

        this.boardElement = document.createElement('div')
        this.boardElement.className = 'gomoku-board'
        this.boardElement.style.gridTemplateColumns = 'auto '.repeat(side);

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


    draw(parentId)
    {
        let parent = document.getElementById(parentId)
        parent.appendChild(this.boardElement)
    }

    /**
     * 
     * @param {Event} event 
     */
    checked(event)
    {
        let check = event.target
        
        console.log("Checked", check.id)
        
        let [x, y] = check.id.split(' ').map(value => parseInt(value))
        if(this.gamestate[x][y]) return

        this.gamestate[x][y] = this.currentPlayer
        event.target.className += this.currentPlayer < 0 ? ' blue' : ' red'

        if (this.didGameEnd([x, y])) {
            alert("Fim de jogo!")
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

        //console.log("Posição atual:" + [x, y])

        let stone_counter = 1
        let [current_x, current_y] = [x, y]
        
        try {
            // Checking horizontal sides (left and right)
            for (let side of Object.values(horizontal_sides)) {
                [x, y] = side(current_x, current_y)

                while (this.gamestate[x][y] == this.currentPlayer) {
                    stone_counter++;

                    [x, y] = side(x, y)

                    //console.log("Contador horizontal: " + stone_counter)

                    if (stone_counter == 5) break;

                }
            }

            if (this.checkCounter(stone_counter)) return true;

            stone_counter = 1

            // Checking vertical sides (top and bottom)
            for (let side of Object.values(vertical_sides)) {
                [x, y] = side(current_x, current_y)

                while (this.gamestate[x][y] == this.currentPlayer) {
                    stone_counter++;

                    [x, y] = side(x, y)

                    //console.log("Contador horizontal: " + stone_counter)

                    if (stone_counter == 5) break;

                }
            }

            if (this.checkCounter(stone_counter)) return true;

            stone_counter = 1

            // Checking main diagonal sides 
            for (let side of Object.values(main_diagonal)) {
                [x, y] = side(current_x, current_y)

                while (this.gamestate[x][y] == this.currentPlayer) {
                    stone_counter++;

                    [x, y] = side(x, y)

                    console.log("Contador da diagonal : " + stone_counter)

                    if (stone_counter == 5) break;

                }
            }

            if (this.checkCounter(stone_counter)) return true;

            stone_counter = 1

            // Checking secondary diagonal sides 
            for (let side of Object.values(secondary_diagonal)) {
                [x, y] = side(current_x, current_y)

                while (this.gamestate[x][y] == this.currentPlayer) {
                    stone_counter++;

                    [x, y] = side(x, y)

                    console.log("Contador da diagonal secundária: " + stone_counter)

                    if (stone_counter == 5) break;

                }
            }

            if (this.checkCounter(stone_counter)) return true;

        } catch(e) {
            console.log(e)
        }
    } 

    checkCounter(counter) {
        return (counter == 5)
    }


}