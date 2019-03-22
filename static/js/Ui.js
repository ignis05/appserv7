class UI {
    constructor(status, overlay, net, session) {
        this.status = status
        this.overlay = overlay
        this.net = net
        this.session = session
    }
    displayLoginPanel() {
        $(this.status).text("STATUS")
        var loginPopup = $("<div id='loginPopup'>")
        $(this.overlay).append(loginPopup)
        var title = $("<div id='title'>")
        title.text("LOGIN")
        var nickname = $("<input id='nickname'>")
        var login = $("<div id='login'>")
        login.text("Login")
        var reset = $("<div id='reset'>")
        reset.text("Reset")
        $(loginPopup)
            .append(title)
            .append(nickname)
            .append(login)
            .append(reset)
        login.on("click", async () => {
            console.log("click");
            let username = $("#nickname").val()
            let response = await this.net.login(username)
            switch (response.msg) {
                case "OK":
                    $(this.overlay).remove()
                    let which = (response.queue == 1 ? "białymi" : "czarnymi")
                    $(this.status).html(`USER_ADDED<br>Witaj <span style='color:red'>${username}</span>, grasz ${which}`)
                    this.session.username = username
                    this.session.queue = response.queue
                    break;
                case "FULL":
                    window.alert("server is full")
                    break;
                case "LOGGED":
                    window.alert("this user is already logged in")
                    break;
            }
        })
    }
}