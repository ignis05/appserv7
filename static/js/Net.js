class Net {
    constructor() {
        console.log("Net constructed");
    }
    login(username) {
        console.log(`logging in ${username}`);
        return new Promise(resolve => {
            $.ajax({
                url: "/login",
                data: { username: username },
                type: "POST",
                success: data => {
                    console.log("success");
                    var obj = JSON.parse(data)
                    resolve(obj)
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    throw "error"
                },
            });
        })
    }
}
console.log("Net.js loaded");