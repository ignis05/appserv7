class UI {
    constructor(status) {
        this.status = status
    }
    displayLoginPanel() {
        return new Promise(resolve => {
            $(this.status).text("STATUS") //text in status bar

            this.overlay = document.createElement("div")
            this.overlay.id = "overlay"
            document.body.appendChild(this.overlay)

            var loginPopup = $("<div id='loginPopup'>")
            $(this.overlay).append(loginPopup)

            var title = $("<div id='title'>")
            title.text("LOGIN")

            var nickname = $("<input id='nickname' autocomplete='off'>")

            var login = $("<div id='login'>")
            login.text("Enter game")

            var reset = $("<div id='reset'>")
            reset.text("Reset")

            $(loginPopup)
                .append(title)
                .append(nickname)
                .append(login)
                .append(reset)

            nickname.focus()

            login.on("click", async () => {
                let username = $("#nickname").val()
                if (username == "") return
                let response = await Net.login(username)
                switch (response.msg) {
                    case "OK": // if login successfull
                        $(this.overlay).remove()
                        let which = (response.queue == 1 ? "czerwonymi" : "czarnymi")
                        let color = (response.queue == 1 ? "red" : "black")
                        $(this.status).html(`Witaj <span style='color:blue'>${username}</span>, grasz <span style='color:${color}'>${which}</span>`)
                        resolve({ username: username, color: response.queue, }) // resume code execution in main.js
                        break;
                    case "FULL": // if already 2 logged in users
                        this.alert("server full", "there are already 2 players connected to server")
                        break;
                    case "LOGGED": // if user with same nickname is logged in
                        this.alert("username taken", "there is someone using this nickname right now")
                        break;
                }
            })

            $(nickname).on("keyup", event => { // triggers click on login button on enter
                // console.log(event.key);
                if (event.key == "Enter") {
                    login.click()
                }
            })
        })
    }
    displayGame() { // creates DOMElement for tree.js
        let root = document.createElement("div")
        root.id = "root"
        document.body.appendChild(root)
    }
    alert(title, msg) {
        console.log("showing alert");
        let alertOverlay = $("<div id=alertOverlay>")
        alertOverlay.appendTo("body")
        let alert = $("<div id=alert>")
        alert.appendTo(alertOverlay)
        let close = $("<div id=close>")
        close.appendTo(alert)
        let x = $("<div>")
        x.text("X")
        x.css("font-weight", "bold")
        x.appendTo(close)
        let tl = $("<div id=title>")
        tl.text(title)
        tl.appendTo(alert)
        let bd = $("<div id=body>")
        bd.text(msg)
        bd.appendTo(alert)
        close.on("click", () => {
            alertOverlay.remove()
        })
    }
    displayWait() {
        let overlay = $("<div id=overlayWait>")
        overlay.appendTo("body")
        let msg = $("<div id=msg>")
        msg.text("Czekaj na drugiego gracza...")
        msg.appendTo(overlay)
        let img = new Image()
        img.src = "/static/img/loading.gif"
        overlay.append(img)
    }
    hideWait() {
        $("#overlayWait").remove()
    }
}