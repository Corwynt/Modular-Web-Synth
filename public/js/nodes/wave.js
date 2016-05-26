nodeLoader.registerNode(
    "Sine Wave Generator", {
        "title": "Sine",
        type:"wave",
        "controls": {
            freq: {
                type: "label"
            }
        },
        settings: {
            freq: 0
        },
        nodes: {
            "Out": null
        },
        controller: {
            init: function () {
                var Out = this.context.createOscillator();
                Out.type = "sine";
                Out.frequency.value = 40;
                Out.start(0);
                this.nodes.Out = Out;
            },
            onInputChange: function (setting, value) {
                this.nodes.Out.frequency.value = value;
            },
            onConnect: function (nr) {
            },
            onDisconnect: function (nr) {
            }
        },
        inputs: [
            {type: "value", title: "Freq", setting: "freq"}
        ],
        outputs: [
            {type: "node", title: "Out", nodeName: "Out"}
        ]
    }
);
nodeLoader.registerNode(
    "Square Wave Generator", {
        "title": "Square",
        type:"wave",
        "controls": {
            freq: {
                type: "label"
            }
        },
        settings: {
            freq: 0
        },
        nodes: {
            "Out": null
        },
        controller: {
            init: function () {
                var Out = this.context.createOscillator();
                Out.type = "square";
                Out.frequency.value = 40;
                Out.start(0);
                this.nodes.Out = Out;
            },
            onInputChange: function (setting, value) {
                this.nodes.Out.frequency.value = parseFloat(value);
            },
            onConnect: function (nr) {
            },
            onDisconnect: function (nr) {
            }
        },
        inputs: [
            {type: "value", title: "Freq", setting: "freq"}
        ],
        outputs: [
            {type: "node", title: "Out", nodeName: "Out"}
        ]
    }
);
nodeLoader.registerNode(
    "Saw Wave Generator", {
        "title": "Saw",
        type:"wave",
        "controls": {
            freq: {
                type: "label"
            }
        },
        settings: {
            freq: 0
        },
        nodes: {
            "Out": null
        },
        controller: {
            init: function () {
                var Out = this.context.createOscillator();
                Out.type = "sawtooth"    ;
                Out.frequency.value = 40;
                Out.start(0);
                this.nodes.Out = Out;
            },
            onInputChange: function (setting, value) {
                this.nodes.Out.frequency.value = value;
            },
            onConnect: function (nr) {
            },
            onDisconnect: function (nr) {
            }
        },
        inputs: [
            {type: "value", title: "Freq", setting: "freq"}
        ],
        outputs: [
            {type: "node", title: "Out", nodeName: "Out"}
        ]
    }
);
nodeLoader.registerNode(
    "Triangle Wave Generator", {
        "title": "Triangle",
        type:"wave",
        "controls": {
            freq: {
                type: "label"
            }
        },
        settings: {
            freq: 0
        },
        nodes: {
            "Out": null
        },
        controller: {
            init: function () {
                var Out = this.context.createOscillator();
                Out.type = "triangle";
                Out.frequency.value = 40;
                Out.start(0);
                this.nodes.Out = Out;
            },
            onInputChange: function (setting, value) {
                this.nodes.Out.frequency.value = value;
            },
            onConnect: function (nr) {
            },
            onDisconnect: function (nr) {
            }
        },
        inputs: [
            {type: "value", title: "Freq", setting: "freq"}
        ],
        outputs: [
            {type: "node", title: "Out", nodeName: "Out"}
        ]
    }
);