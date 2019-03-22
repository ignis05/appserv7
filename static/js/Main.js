var net = new Net()
var ui;
var session;
$(document).ready(async () => {
    console.log("ready");

    ui = new UI(document.getElementById("status"), net, session)
    ui.displayGame()
    var game = new Game("#root")
    session = await ui.displayLoginPanel()
    console.log("logged in");
    if (session.color == 2) game.flipCamera()
})

window.addEventListener('beforeunload', async () => {
    if (session.username) {
        await net.logout(session.username)
    }
});