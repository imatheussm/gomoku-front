export function buildBoard(side)
{
    let board = document.createElement('div')
    let [checks, gameState] = [[], []]

    board.className = 'gomoku-board'
    board.id = 'gomoku-board'
    board.style.gridTemplateColumns = 'auto '.repeat(side)

    for (let i = 0; i < side; i++) {
        gameState.push([])

        for (let j = 0; j < side; j++) {
            let check = document.createElement('div')
            check.className = 'gomoku-board-check'
            check.id = i + ' ' + j

            gameState[i].push(0)
            checks.push(check)
            board.appendChild(check)
        }
    }

    return {
        "element": board,
        "checks": checks,
        "gameState": gameState
    }
}
