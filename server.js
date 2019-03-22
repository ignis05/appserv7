var http = require("http");
var fs = require("fs");
var qs = require("querystring")

var serverDatabase = {
    clients: []
}

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            console.log(`requested adres: ${decodeURI(req.url)}`)
            var fileEXTEN = req.url.split(".")[req.url.split(".").length - 1]
            if (req.url == "/") {
                fs.readFile(`static/html/index.html`, function (error, data) {
                    if (error) {
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                        res.end();
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'text/html;;charset=utf-8' });
                        res.write(data);
                        res.end();
                        console.log("send index");
                    }
                })
            }
            else {
                fs.readFile(`.${decodeURI(req.url)}`, function (error, data) {
                    if (error) {
                        console.log(`cant find file ${decodeURI(req.url)}`);
                        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                        res.write("<h1>Error 404 - file doesnt exist<h1>");
                        res.end();
                    }
                    else {
                        switch (fileEXTEN) {
                            case "css":
                                res.writeHead(200, { 'Content-Type': 'text/css;charset=utf-8' });
                                break;
                            case "html":
                                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                                break;
                            case "js":
                                res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8' });
                                break;
                            case "png":
                                res.writeHead(200, { 'Content-Type': 'image/png' });
                                break;
                            case "jpg":
                                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                                break;
                            case "mp3":
                                res.writeHead(200, { "Content-type": "audio/mpeg" });
                                break
                            default:
                                res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
                        }
                        res.write(data);
                        res.end();
                        console.log(`send file: ${decodeURI(req.url)}`)
                    }
                });
            }
            break;
        case "POST":
            switch (req.url) {
                case "/login":
                    login(req, res)
                    break
                case "/logout":
                    logout(req, res)
                    break
            }
            break;
    }

})

function login(req, res) {
    var allData = "";
    req.on("data", function (data) {
        allData += data;
    })

    req.on("end", function (data) {
        var finish = qs.parse(allData)
        let username = finish.username
        console.log(username)
        if (serverDatabase.clients.length < 2) {
            if (!serverDatabase.clients.includes(username)) {
                console.log("OK");
                serverDatabase.clients.push(username)
                let resp = {
                    msg: "OK",
                    queue: serverDatabase.clients.length
                }
                res.end(JSON.stringify(resp))
            }
            else {
                console.log("already logged in");
                let resp = {
                    msg: "LOGGED"
                }
                res.end(JSON.stringify(resp))
            }
        }
        else {
            console.log("server full");
            let resp = {
                msg: "FULL"
            }
            res.end(JSON.stringify(resp))
        }
    })
}

function logout(req, res) {
    var allData = "";
    req.on("data", function (data) {
        allData += data;
    })

    req.on("end", function (data) {
        var finish = qs.parse(allData)
        let username = finish.username
        console.log(serverDatabase.clients);
        serverDatabase.clients = serverDatabase.clients.filter(user => user != username)
        console.log(serverDatabase.clients);
        res.end(JSON.stringify({ msg: "ENDED" }))
    })
}

// function servResponse(req, res) {
//     var allData = "";
//     req.on("data", function (data) {
//         console.log("data: " + data)
//         allData += data;
//     })

//     req.on("end", function (data) {
//         var finish = qs.parse(allData)
//         console.log(finish)


//         //res.writeHead(200, { 'Content-Type': 'text/plain;;charset=utf-8' });
//         res.end(JSON.stringify(finish));
//     })

// }

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
