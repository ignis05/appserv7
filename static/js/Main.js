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
    let enemy = await wait("enemy")
    console.log("resolved wait");
    console.log(enemy);
})

function wait(request) {
    return new Promise(resolve => {
        var interval = setInterval(async () => {
            let resp = await Net.request(session.username, request)
            console.log(resp);
            if (resp.msg == "DATA") {
                clearInterval(interval)
                resolve(resp)
            }
        }, 500)
    })
}

window.addEventListener('beforeunload', async () => { // triggers on tab close, page refreash, etc.
    if (session.username) { // if logged in send logout request
        await Net.logout(session.username)
    }
});