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

window.addEventListener('beforeunload', function (e) {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = '';
});