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
    let which = (session.color == 1 ? "czerwonymi" : "czarnymi")
    let color = (session.color == 1 ? "red" : "black")
    $(ui.status).html(`Witaj <span style='color:blue'>${session.username}</span>, grasz <span style='color:${color}'>${which}</span> przeciwko graczowi <span style='color:violet'>${session.enemy}</span>`)
    ui.hideWait()
    game.renderPieces()
    listenForDisconnect()
}

async function listenForDisconnect() {
    await Net.detectEnd(session.username)
    ui.displayWait("Your opponent has disconnected...")
    let data = await Net.wait(session.username, "enemy")
    console.log("resolved enemy");
    session.enemy = data.enemy
    enableGame()
}

window.addEventListener('beforeunload', async () => { // triggers on tab close, page refreash, etc.
    if (session.username) { // if logged in send logout request
        await Net.logout(session.username)
    }
});