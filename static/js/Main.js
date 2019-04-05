var ui;
var session;
var game;
$(document).ready(async () => {
    console.log("ready");
    // click on status bar opens new window with game
    $("#status").on("click", () => {
        window.open(window.location.href);
    })

    ui = new UI(document.getElementById("status"))
    ui.displayGame()
    game = new Game("#root") // creates 3d display in #root div

    session = await ui.displayLoginPanel() // stops code execution untill promise is resolved, resumes when username and player nr. is received
    console.log("logged in");
    if (session.color == 2) game.flipCamera() // if playing with black pieces rotate board
    ui.displayWait("Wait for another player...")
    let data = await Net.wait(session.username, "enemy")
    console.log("resolved enemy");
    session.enemy = data.enemy
    enableGame()
})

function enableGame() {
    let color = (session.color == 1 ? "red" : "black")
    $(ui.status).html(`Welcome <span style='color:blue'>${session.username}</span>, you are playing with <span style='color:${color}'>${color} checkers</span> against player <span style='color:violet'>${session.enemy}</span>`)
    ui.hideWait()
    game.renderPieces()
    if (session.color == 1) {
        game.startFirst()
    }
    else {
        game.startSecond()
    }
    listenForDisconnect()
}

async function listenForDisconnect() {
    await Net.detectEnd(session.username)
    ui.displayWait("Your opponent has disconnected...")
    let data = await Net.wait(session.username, "enemy")
    console.log("resolved enemy");
    session.enemy = data.enemy
    game.piecesTab = game.generatePiecesTab()
    await Net.sendBoard(session.color, game.piecesTab)
    enableGame()
}

window.addEventListener('beforeunload', async () => { // triggers on tab close, page refreash, etc.
    if (session.username) { // if logged in send logout request
        await Net.logout(session.username)
    }
});