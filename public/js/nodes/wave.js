nodeLoader.registerNode(
    "Sine Wave Generator", {
        "title": "Sine",
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
                Out.type = 0;
                Out.frequency.value = 40;
                Out.noteOn(0);
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
                Out.type = 1;
                Out.frequency.value = 40;
                Out.noteOn(0);
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
                Out.type = 2    ;
                Out.frequency.value = 40;
                Out.noteOn(0);
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
                Out.type = 3;
                Out.frequency.value = 40;
                Out.noteOn(0);
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