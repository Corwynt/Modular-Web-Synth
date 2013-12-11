var _websocket;
var cluster = require('cluster');
var endpoints = {};
var connections = {};
var conID = 0;
exports.run = function (server) {
    runMaster();
    var WebSocketServer = require('ws').Server;
    _websocket = new WebSocketServer({server: server});
    _websocket.on('connection', function (ws) {
        var url = ws.upgradeReq.url;
        if (url.indexOf("?") != -1)url = url.substr(0, url.indexOf("?"));
        var found = false;
        for (var k in endpoints) {
            if (!endpoints.hasOwnProperty(k))continue;
            console.log(endpoints[k].regex);
            var match = (endpoints[k].regex.exec(url));
            if (match != null) {
                var endpoint = endpoints[k];
                conID++;
                connections[conID] = ws;
                found = true;
                console.log("New " + endpoint.name + " connection!");
                var args = [];

                match.forEach(function (arg) {
                    args.push(arg);
                });
                args.splice(0, 1);
                ws.on('message', function (message) {
                    cluster.workers[k].send({type: "message", connection: conID, data: message});
                });
                ws.on("close", function () {
                    cluster.workers[k].send({type: "close", connection: conID, args: args});
                    delete connections[conID];
                });
                ws.on("timeout", function () {
                    cluster.workers[k].send({type: "close", connection: conID, args: args});
                    delete connections[conID];
                });
                cluster.workers[k].send({type: "connect", connection: conID,args:args});
            }
        }
        if (!found) {
            console.log("No Module for WS-Path " + url);
            ws.close();
        }
    });

}
if (cluster.isMaster) {

} else {
    runModule();
}
function runModule() {

    var child = process.env.ws_module;
    console.log("Hi from " + child);
    var endpoint = require("./" + child).run();
    process.send({type: "init", regex: endpoint.regex, name: endpoint.name});
    process.on("message", function (msg) {
        var local = {
            connection: {
                send: function (message) {
                    process.send({
                        type: "message",
                        data: message,
                        connection: msg.connection
                    });
                },
                sendjson: function (data) {
                    this.send(unescape(encodeURIComponent(JSON.stringify(data))));
                },
                close: function () {
                    this.send({
                        type: "close",
                        connection: msg.connection
                    });
                }
            }
        };
        switch (msg.type) {
            case "connect":
                endpoint.connect.apply(local, msg.args);
                break;
            case "close":
                endpoint.close.apply(local, msg.args);
                break;
            case "message":
                endpoint.message.apply(local, [msg.data]);
                break;
        }
    });

}
function runMaster(server) {
    cluster.setupMaster({
        exec: "./wsProvider/index.js"
    });
    var providers = {};
    cluster.on('exit', function (worker, code, signal) {
        if (code == 0)return;
        delete endpoints[worker.workerID];
        var file = providers[worker.workerID];
        delete providers[worker.workerID];
        console.log("Childprocess " + file + " died. " + code + " Restarting...");
        var childProcess = cluster.fork({"ws_module": file});
        providers[childProcess.workerID] = file;
        childProcess.on("message", function (msg) {
            if (msg.type == "init") {
                endpoints[childProcess.workerID] = {"regex": new RegExp(msg.regex), name: msg.name};
                console.log("New listening Path(" + msg.name + "): " + msg.regex);
            } else {
                connections[msg.connection].send(msg.data);
            }
        });
    });
    require("fs").readdirSync("./wsProvider").forEach(function (file) {
        if (file == "index.js")return;
        var childProcess = cluster.fork({"ws_module": file});
        providers[childProcess.workerID] = file;
        childProcess.on("message", function (msg) {
            if (msg.type == "init") {
                endpoints[childProcess.workerID] = {"regex": new RegExp(msg.regex), name: msg.name};
                console.log("New listening Path(" + msg.name + "): " + msg.regex);
            } else if (msg.type == "close") {
                if(!connections.hasOwnProperty(msg.connection))return;
                connections[msg.connection].close();
                delete connections[msg.connection];
            } else {
                if(!connections.hasOwnProperty(msg.connection))return;
                try {
                    connections[msg.connection].send(msg.data);
                }
                catch (e) {
                    // handle error
                }

            }
        });
    });

}