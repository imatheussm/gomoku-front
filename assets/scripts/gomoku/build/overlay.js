export const buildOverlays = _ => ({
    initial: buildPlayButtonOverlay("Play", "play", "Are you ready?"),
    gameMode: buildGameModeOverlay(),
    name: buildNameOverlay(),
    hold: buildHoldOverlay(),
    final: buildResetButtonOverlay()
})

function buildPlayButtonOverlay(buttonText, id, overlayTextContent)
{
    let overlayText = buildOverlayText("", id, overlayTextContent)
    let resetButtonOverlay = buildOverlay()
    let resetButton = buildButton("btn btn-danger", id, buttonText)

    resetButtonOverlay.append(overlayText, resetButton)

    return resetButtonOverlay.parentElement
}

function buildResetButtonOverlay()
{
    let overlayText = buildOverlayText("", "final", "Something happened!")
    let resetButtonOverlay = buildOverlay()
    let resetButton = buildButton("btn btn-danger me-2", "reset", "Play again")
    let toggleModeButton = buildButton("btn btn-primary ms-2", "toggle", "Change mode")

    resetButtonOverlay.append(overlayText, resetButton, toggleModeButton)

    return resetButtonOverlay.parentElement
}

function buildHoldOverlay()
{
    let gameModeOverlay = buildOverlay()

    let overlayText = buildOverlayText("", "game-mode", `Waiting for other player to join`)
    let cancelButton = buildButton("btn btn-primary", "cancel", "Go offline")

    gameModeOverlay.append(overlayText, cancelButton)

    return gameModeOverlay.parentElement
}

function buildGameModeOverlay()
{
    let gameModeOverlay = buildOverlay()

    let overlayText = buildOverlayText("", "game-mode", "How do you want to play?")
    let singlePlayerButton = buildButton("btn-danger me-2", "offline", "Offline")
    let multiPlayerButton = buildButton("btn-danger ms-2", "online", "Online")

    gameModeOverlay.append(overlayText, singlePlayerButton, multiPlayerButton)

    return gameModeOverlay.parentElement
}

function buildNameOverlay()
{
    let gameModeOverlay = buildOverlay()

    let nameForm = document.createElement("form")
    let nameInput = document.createElement("input")
    let submitButton = buildButton("btn-danger", "name", "Submit")

    nameForm.id = "name-form"

    nameInput.type = "text"
    nameInput.className = "form-control mb-3"
    nameInput.id = "name-input"
    nameInput.placeholder = "What's the room name?"

    nameForm.setAttribute("autocomplete", "off")
    nameInput.setAttribute("autofill", "off")

    nameForm.append(nameInput, submitButton)

    gameModeOverlay.appendChild(nameForm)

    return gameModeOverlay.parentElement
}

function buildOverlay()
{
    let overlay = document.createElement("div")
    let overlayContainer = document.createElement("div")

    overlay.className = "overlay position-relative justify-content-center align-items-center d-none invisible"
    overlay.style.zIndex = "1"
    overlayContainer.className = "position-relative text-center"

    overlay.appendChild(overlayContainer)

    return overlayContainer
}

function buildButton(classes, id, text)
{
    let button = document.createElement("button")

    button.className = `btn ${classes}`
    button.id = `${id}-button`
    button.type = "button"
    button.innerHTML = text

    button.style.visibility = "inherit"

    return button
}

function buildOverlayText(classes, id, text)
{
    let overlayText = document.createElement("p")

    overlayText.className = `position-relative ${classes}`
    overlayText.id = `${id}-text`
    overlayText.innerHTML = text

    return overlayText
}
