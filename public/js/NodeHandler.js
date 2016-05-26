var nodeLoader = (function () {
    var nodes = {};
    return{
        registerNode: function (name, node) {
            if (nodes.hasOwnProperty(name))throw "Double Node Name: " + name;
            nodes[name] = node;
        },
        getNodes: function () {
            return nodes;
        }
    };
})();
var NodeHandler = function ($scope, $interval) {
    function BEAT() {
        for (var name in nodes) {
            if (nodes.hasOwnProperty(name) && nodes[name].controller.hasOwnProperty("onBeat")) {
                nodes[name].controller.onBeat.apply(nodes[name]);
            }
        }
    }

    var beatINT = null;
    var context = new AudioContext();
    var moduleTypes = nodeLoader.getNodes();
    var nodeLinks = [];
    var destination = {
        "title": "Output",
        "controls": {
        },
        hidden: true,
        settings: {
        },
        controller: {
            init: function () {
            },
            onInputChange: function (setting) {
            },
            onConnect: function (target, node) {
                //node.noteOn(0);
                node.connect(this.nodes[target]);

            },
            onDisconnect: function (target, node) {
                node.disconnect(this.nodes[target]);
            }
        },
        nodes: {
            "L": context.destination,
            "R": context.destination
        },
        inputs: [
            {type: "node", title: "L", nodeName: "L"},
            {type: "node", title: "R", nodeName: "R"}
        ],
        outputs: [

        ]
    };
    var nodes = {
        "destination": destination
    };

    function findLink(type, selector) {
        var out = null;
        nodeLinks.forEach(function (elem) {
            if (out != null)return;
            if (type == "input") {
                if (elem.end[0] == selector[0] && elem.end[1] == selector[1])out = elem;

            } else {
                if (elem.start[0] == selector[0] && elem.start[1] == selector[1])out = elem;
            }
        });
        return out;
    }

    var public = {
        getLinks: function () {
            return nodeLinks;
        },
        setBPM: function (bpm) {
            if (beatINT != null) {
                beatINT.stop();
            }
            beatINT = $interval(BEAT, 6000 / bpm);
        },
        getNodes: function () {
            return nodes;
        },
        addNode: function (type, name) {
            if (moduleTypes.hasOwnProperty(type)) {
                var node = angular.copy(moduleTypes[type]);
                var nodeIdentifier = "node_" + new Date().getTime();
                if (name != undefined)nodeIdentifier = name;
                node.types = type;
                node.id = nodeIdentifier;
                node.context = context;
                node.$interval = $interval;
                node.$scope = $scope;
                if (node.controller.hasOwnProperty("onSettingChange")) {
                    for (var sname in node.settings) {
                        if (!node.settings.hasOwnProperty(sname))continue;
                        $scope.$watch((function (name) {
                            return function () {
                                return node.settings[name]
                            }
                        })(sname), (function (name) {
                            return function (newVal) {
                                node.controller.onSettingChange.apply(node, [name, newVal]);
                            }
                        })(sname));
                    }
                }
                node.outputs.forEach(
                    function (output, nr) {
                        if (output.type == "value") {
                            $scope.$watch(function () {
                                return node.settings[output.setting];
                            }, function (newVal) {

                                var link = findLink("output", [nodeIdentifier, nr]);

                                if (link != null) {
                                    var input = nodes[link.end[0]].inputs[link.end[1]];
                                    nodes[link.end[0]].settings[input.setting] = newVal;
                                    nodes[link.end[0]].controller.onInputChange.apply(nodes[link.end[0]], [input.setting, newVal]);
                                }
                            });
                        }
                    }
                );

                nodes[nodeIdentifier] = node;
                node.controller.init.apply(node);
            }
        },
        getNodeTypes: function () {
            var out = [];
            for (var name in moduleTypes) {
                if (!moduleTypes.hasOwnProperty(name))continue;
                out.push(name);
            }
            return out;
        },
        connect: function (start, end) {
            var input = nodes[end[0]].inputs[end[1]];
            if (input.type == "value") {
                var newVal = nodes[start[0]].settings[nodes[start[0]].outputs[start[1]].setting];
                nodes[end[0]].settings[input.setting] = newVal;
                nodes[end[0]].controller.onInputChange.apply(nodes[end[0]], [input.setting, newVal]);
            } else {
                var newNode = nodes[start[0]].nodes[nodes[start[0]].outputs[start[1]].nodeName];
                //nodes[end[0]].nodes[input.nodeName] = newNode;
                nodes[end[0]].controller.onConnect.apply(nodes[end[0]], [input.nodeName, newNode]);
            }
            nodeLinks.push({start: start, end: end});
        },
        disconnect: function (elem) {
            if (nodes[elem.start[0]].outputs[elem.start[1]].type == "node") {
                var newNode = nodes[elem.start[0]].nodes[nodes[elem.start[0]].outputs[elem.start[1]].nodeName];
                nodes[elem.end[0]].controller.onDisconnect.apply(nodes[elem.end[0]], [nodes[elem.end[0]].inputs[elem.end[1]].nodeName, newNode]);
            }
            nodeLinks.splice(nodeLinks.indexOf(elem), 1);
        },
        export: function () {
            var out = {"nodes": {}, links: nodeLinks};
            for (var name in nodes) {
                if (!nodes.hasOwnProperty(name))continue;
                if (name == "destination")continue;
                out.nodes[name] = {
                    settings: nodes[name].settings,
                    type: nodes[name].types,
                    minimized: nodes[name].minimized,
                    offset: $("#" + name).offset()
                };
            }
            return JSON.stringify(out);
        },
        removeNode: function (node) {
            console.group(node);
            console.log(nodeLinks);
            nodeLinks.forEach(function (elem) {
                if (elem.end[0] == node || elem.start[0] == node) {
                    public.disconnect(elem);
                }
            });
            console.log(nodeLinks);
            console.groupEnd(node);
            if (nodes[node].controller.hasOwnProperty("destroy"))nodes[node].controller.destroy.apply(nodes[node]);
            delete nodes[node];
        },
        import: function (data) {
            var out = {};
            nodeLinks.forEach(function (link) {
                public.disconnect(link);
            });
            for (var name in nodes) {
                if (!nodes.hasOwnProperty(name))continue;
                if (nodes[name].controller.hasOwnProperty("destroy"))nodes[name].controller.destroy.apply(nodes[name]);

            }
            nodes = {"destination": destination};
            for (var name in data.nodes) {
                if (!data.nodes.hasOwnProperty(name))continue;
                public.addNode(data.nodes[name].type, name);
                nodes[name].settings = data.nodes[name].settings;
                nodes[name].minimized = data.nodes[name].minimized;
                out["#" + name] = data.nodes[name].offset;

            }
            nodeLinks = []

            data.links.forEach(function (link) {
                public.connect(link.start, link.end);
            });
            return out;
        }

    };
    return public;
};