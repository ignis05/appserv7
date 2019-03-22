class UI {
    constructor(status, net) {
        this.status = status
        this.net = net
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
                let response = await this.net.login(username)
                switch (response.msg) {
                    case "OK": // if login successfull
                        $(this.overlay).remove()
                        let which = (response.queue == 1 ? "czerwonymi" : "czarnymi")
                        $(this.status).html(`USER_ADDED<br>Witaj <span style='color:red'>${username}</span>, grasz ${which}`)
                        resolve({ username: username, color: response.queue, }) // resume code execution in main.js
                        break;
                    case "FULL": // if already 2 logged in users
                        window.alert("server is full")
                        break;
                    case "LOGGED": // if user with same nickname is logged in
                        window.alert("this user is already logged in")
                        break;
                }
            })

            $(nickname).on("keyup", event => { // triggers click on login button on enter
                console.log(event.key);
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
}