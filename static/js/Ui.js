class UI {
    constructor(status, net) {
        this.status = status
        this.net = net
    }
    displayLoginPanel() {
        return new Promise(resolve => {
            this.overlay = document.createElement("div")
            this.overlay.id = "overlay"
            document.body.appendChild(this.overlay)
            $(this.status).text("STATUS")
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
                console.log("click");
                let username = $("#nickname").val()
                let response = await this.net.login(username)
                switch (response.msg) {
                    case "OK":
                        $(this.overlay).remove()
                        let which = (response.queue == 1 ? "białymi" : "czarnymi")
                        $(this.status).html(`USER_ADDED<br>Witaj <span style='color:red'>${username}</span>, grasz ${which}`)
                        resolve(
                            {
                                username: username,
                                color: response.queue,
                            }
                        )
                        break;
                    case "FULL":
                        window.alert("server is full")
                        break;
                    case "LOGGED":
                        window.alert("this user is already logged in")
                        break;
                }
            })
            $(nickname).on("keyup", event => {
                console.log(event.key);
                if (event.key == "Enter") {
                    login.click()
                }
            })
        })
    }
    displayGame() {
        let root = document.createElement("div")
        root.id = "root"
        document.body.appendChild(root)
    }
}