export function buildBoard(side)
{
    let board = document.createElement("div")
    let [checks, gameState] = [[], []]

    board.classList.add("d-grid", "position-absolute")
    board.id = "gomoku-board"
    board.style.gridTemplateColumns = `auto `.repeat(side)

    for (let i = 0; i < side; i++) {
        gameState.push([])

        for (let j = 0; j < side; j++) {
            let check = document.createElement("div")
            check.id = i + " " + j

            check.classList.add("gomoku-board-check", "position-relative")
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

export function buildVisitedMatrix(side)
{
    let matrix = []

    for (let i = 0; i < side; i++) {
        matrix.push([])

        for (let j = 0; j < side; j++) matrix[i].push(false)
    }

    return matrix
}