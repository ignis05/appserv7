var net = new Net()
var ui;
var session = {
    username: null,
}
$(document).ready(() => {
    console.log("ready");

    ui = new UI(document.getElementById("status"), net, session)
    // ui.displayLoginPanel()
    ui.displayGame()
    var game = new Game("#root")
})

window.addEventListener('beforeunload', async function (e) {
    if (session.username) {
        await net.logout(session.username)
    }
});