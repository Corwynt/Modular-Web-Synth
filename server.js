/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path');
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
});
var test = require("./wsProvider");
test.run(server);