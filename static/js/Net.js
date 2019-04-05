class Net {
    static login(username) {
        console.log(`logging in ${username}`);
        return new Promise((resolve, reject) => {
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
                    reject(new Error(xhr))
                },
            });
        })
    }

    static logout(username) {
        console.log(`logging out ${username}`);
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/logout",
                data: { username: username },
                type: "POST",
                success: data => {
                    console.log("success");
                    var obj = JSON.parse(data)
                    resolve(obj)
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    reject(new Error(xhr))
                },
            });
        })
    }

    static request(username, request) {
        // console.log(`reqiesting ${request} for ${username}`);
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/request",
                data: {
                    username: username,
                    request: request
                },
                type: "POST",
                success: data => {
                    // console.log("success");
                    var obj = JSON.parse(data)
                    resolve(obj)
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    reject(new Error(xhr))
                },
            });
        })
    }

    static wait(username, request) {
        return new Promise(resolve => {
            var interval = setInterval(async () => {
                let resp = await Net.request(username, request)
                // console.log(resp);
                if (resp.msg == "DATA") {
                    clearInterval(interval)
                    resolve(resp)
                }
            }, 500)
        })
    }

    static detectEnd(username) {
        return new Promise(resolve => {
            var interval = setInterval(async () => {
                let resp = await Net.request(username, "detectEnd")
                // console.log(resp);
                if (resp.msg == "END") {
                    clearInterval(interval)
                    resolve(resp)
                }
            }, 500)
        })
    }
}
console.log("Net.js loaded");