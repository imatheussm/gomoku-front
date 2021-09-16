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

        this.currentPlayer = -this.currentPlayer;

        this.didGameEnd()

    }

    didGameEnd()
    {
        return false;
    }


}