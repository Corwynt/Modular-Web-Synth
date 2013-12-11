/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path');
var app = express();
var express = require('express'),
    httpProxy = require('http-proxy'),
    app = express();

var proxy = new httpProxy.RoutingProxy();

function apiProxy() {
    return function (req, res, next) {
        var match = req.url.match(new RegExp('^\/proxy\/(.*)'));
        if (match) {
            console.log(decodeURIComponent(match[1]));
            var url=require("url");
            url=url.parse(decodeURIComponent(match[1]));
            console.log(url);
            req.url=url.path;
            req.headers.host=url.host;
            req.headers.referer=decodeURIComponent(match[1]);
            console.log(req.headers);
            proxy.proxyRequest(req, res, {host: url.hostname, port:url.port?url.port:80});
        } else {
            next();
        }
    }
}
app.engine('html', require('hogan-express'));
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(apiProxy());
    app.use(express.static(path.join(__dirname, 'public')));
});
//http://rob1.j92.free.fr/Musique/Skrillex/The best hits from DjmcBiT/05 - Get Up (ft. Korn).mp3
app.configure('development', function () {
    app.use(express.errorHandler());
});
app.get('/', function (req, res) {
    var data = [];
    require("fs").readdirSync(path.join(__dirname, "public", "js", "nodes")).forEach(function (elem) {
        data.push({src: elem});
    });
    res.render('index', { jsFiles: require("fs").readdirSync(path.join(__dirname, "public", "js", "nodes"))});
});
app.get('/devices', function (req, res) {
    var out = [];
    for (var i = 0; i < input.getPortCount(); i++) {
        out.push(input.getPortName(i));
    }
    res.send('200', JSON.stringify(out));
});
app.get('/saves', function (req, res) {
    res.send('200', JSON.stringify(require("fs").readdirSync(path.join(__dirname, "public", "saves"))));
});
app.post('/saves', function (req, res) {
    console.log(req.body);
    require("fs").writeFile(path.join(__dirname, "public", "saves", req.body.name), req.body.data);
    res.send('200', JSON.stringify(require("fs").readdirSync(path.join(__dirname, "public", "saves"))));
});


var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
    //midi = require("midi");
    //input = new midi.input();
    //output = new midi.output();
});
var test = require("./wsProvider");
test.run(server);
/*var midi;
 var input;
 var output;
 var WebSocketServer = require('ws').Server;
 var wss = new WebSocketServer({server: server});
 */
var endpoints = [
    {
        regex: /\/midi\/(\d)/,
        connect: function (port) {
            port = parseInt(port);
            this.input = new midi.input();
            this.output = new midi.output();
            if (this.input.getPortCount() > port) {

                var that = this;
                this.input.on('message', function (deltaTime, message) {
                    that.output.sendMessage(message);
                    that.connection.sendjson(message);
                });
                this.input.openPort(port);
                this.output.openPort(port);
            } else {
                this.connection.close();
            }
        },
        message: function () {

        },
        close: function () {
            console.log(this, "CLOSE");
            if (this.input != undefined) {
                this.input.closePort();
                this.output.closePort();
                delete this.output;
                delete this.input;
            }
        }
    },
    {
        regex: /\/mudi\/(\d)/,
        connect: function () {
        },
        message: function () {
        },
        close: function () {
        }
    }
];

/*wss.on('connection', function (ws) {
 console.log(ws);
 var found = false;
 for (var key in endpoints) {
 if (!endpoints.hasOwnProperty(key))continue;
 var match = (endpoints[key].regex.exec(ws.upgradeReq.url));
 if (match != null) {
 found = true;
 var args = [];

 match.forEach(function (arg) {
 args.push(arg);
 });
 args.splice(0, 1);
 ws.sendjson = function (data) {
 ws.send(unescape(encodeURIComponent(JSON.stringify(data))));
 };
 var locals = {
 connection: ws
 };
 ws.on('message', function (message) {
 endpoints[key].message.apply(locals, message);
 });
 ws.on("close", function () {
 endpoints[key].close.apply(locals);
 });
 ws.on("timeout", function () {
 endpoints[key].close.apply(locals);
 });
 endpoints[key].connect.apply(locals, args);
 break;
 }
 }
 if (!found)ws.close();

 });*/
