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
}
console.log("Net.js loaded");