var net = new Net()
var ui;
var session = {
    username: null,
}
$(document).ready(() => {
    console.log("ready");

    ui = new UI(document.getElementById("status"), document.getElementById("overlay"), net, session)
    ui.displayLoginPanel()
})

window.addEventListener('beforeunload', async function (e) {
    if (session.username) {
        await net.logout(session.username)
    }
});