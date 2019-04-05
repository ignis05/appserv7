var ui;
var session;
$(document).ready(async () => {
    console.log("ready");
    // click on status bar opens new window with game
    $("#status").on("click", () => {
        window.open(window.location.href);
    })

    ui = new UI(document.getElementById("status"))
    ui.displayGame()
    var game = new Game("#root") // creates 3d display in #root div

    session = await ui.displayLoginPanel() // stops code execution untill promise is resolved, resumes when username and player nr. is received
    console.log("logged in");
    if (session.color == 2) game.flipCamera() // if playing with black pieces rotate board
    ui.displayWait()
    let data = await Net.wait(session.username, "enemy")
    console.log("resolved wait");
    session.enemy = data.enemy
    let status_temp = $(ui.status).html()
    $(ui.status).html(status_temp + `, przeciwko graczowi <span style='color:violet'>${session.enemy}</span>`)
    ui.hideWait()
    game.addPieces()
})

window.addEventListener('beforeunload', async () => { // triggers on tab close, page refreash, etc.
    if (session.username) { // if logged in send logout request
        await Net.logout(session.username)
    }
});