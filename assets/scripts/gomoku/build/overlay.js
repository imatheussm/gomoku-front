export const buildOverlays = _ => ({
    initial: buildResetButtonOverlay('Play', 'play', 'Are you ready?'),
    gameMode: buildGameModeOverlay(),
    name: buildNameOverlay(),
    hold: buildHoldOverlay(),
    final: buildResetButtonOverlay('Play again', 'win', 'Someone won!'),
    left: buildResetButtonOverlay('Play again', 'again', 'Your friend has disconnected!')
})

function buildResetButtonOverlay(buttonText, id, overlayTextContent)
{
    let overlayText = buildOverlayText('', id, overlayTextContent)
    let resetButtonOverlay = buildOverlay()
    let resetButton = buildButton('btn btn-danger', id, buttonText)

    resetButtonOverlay.append(overlayText, resetButton)

    return resetButtonOverlay.parentElement
}

function buildHoldOverlay()
{
    let gameModeOverlay = buildOverlay()

    let overlayText = buildOverlayText('', 'game-mode', `Waiting for other player to join`)

    // multiPlayerButton.disabled = true

    gameModeOverlay.append(overlayText)

    return gameModeOverlay.parentElement
}

function buildGameModeOverlay()
{
    let gameModeOverlay = buildOverlay()

    let overlayText = buildOverlayText('', 'game-mode', 'How do you want to play?')
    let singlePlayerButton = buildButton('btn-danger me-2', 'offline', 'Offline')
    let multiPlayerButton = buildButton('btn-danger ms-2', 'online', 'Online')

    // multiPlayerButton.disabled = true

    gameModeOverlay.append(overlayText, singlePlayerButton, multiPlayerButton)

    return gameModeOverlay.parentElement
}

function buildNameOverlay()
{
    let gameModeOverlay = buildOverlay()

    let nameForm = document.createElement('form')
    let nameInput = document.createElement('input')
    let submitButton = buildButton('btn-danger', 'name', 'Submit')

    nameForm.id = 'name-form'

    nameInput.type = 'text'
    nameInput.className = 'form-control mb-3'
    nameInput.id = 'name-input'
    nameInput.placeholder = "What's the room name?"

    nameForm.append(nameInput, submitButton)

    gameModeOverlay.appendChild(nameForm)

    return gameModeOverlay.parentElement
}

function buildOverlay()
{
    let overlay = document.createElement('div')
    let overlayContainer = document.createElement('div')

    overlay.className = 'overlay'
    overlay.style.visibility = 'hidden'
    overlay.style.display = 'none'
    overlay.style.zIndex = '1'
    overlayContainer.className = 'overlay-container'

    overlay.appendChild(overlayContainer)

    return overlayContainer
}

function buildButton(classes, id, text)
{
    let button = document.createElement('button')

    button.className = `btn ${classes}`
    button.id = `${id}-button`
    button.type = 'button'
    button.innerHTML = text

    button.style.visibility = 'inherit'

    return button
}

function buildOverlayText(classes, id, text)
{
    let overlayText = document.createElement('p')

    overlayText.className = `position-relative ${classes}`
    overlayText.id = `${id}-text`
    overlayText.innerHTML = text

    return overlayText
}
