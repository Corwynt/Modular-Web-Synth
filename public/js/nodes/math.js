nodeLoader.registerNode("Sum", {
    "title": "Sum",
    "controls": {
        value1: {
            type: "label"
        },
        value2: {
            type: "label"
        },
        value3: {
            type: "label"
        },
        sum: {
            type: "label"
        }
    },
    settings: {
        sum: 1,
        value1: 0,
        value2: 0,
        value3: 0
    },
    nodes: {
    },
    controller: {
        init: function () {

        },
        onInputChange: function (setting, value) {
            this.settings[setting] = parseFloat(value);
            var out = 0;
            for (var key in this.settings) {
                if (this.settings.hasOwnProperty(key) && key != "sum") {
                    out += this.settings[key];
                }
            }
            this.settings.sum = out;
        },
        onConnect: function (target, node) {
            //node.noteOn(0);

        },
        onDisconnect: function (target, node) {
        }
    },
    inputs: [
        {type: "value", title: "Val1", setting: "value1"},
        {type: "value", title: "Val2", setting: "value2"},
        {type: "value", title: "Val3", setting: "value3"}
    ],
    outputs: [
        {type: "value", title: "Sum", setting: "sum"}
    ]
});nodeLoader.registerNode("Multiply", {
    "title": "Multiply",
    "controls": {

    },
    settings: {
        out: 1,
        in1: 1,
        in2: 1
    },
    nodes: {
    },
    controller: {
        init: function () {

        },
        onInputChange: function (setting, value) {
            this.settings[setting] = parseFloat(value);

            this.settings.out = this.settings.in1*this.settings.in2;
        },
        onConnect: function (target, node) {
            //node.noteOn(0);

        },
        onDisconnect: function (target, node) {
        }
    },
    inputs: [
        {type: "value", title: "In1", setting: "in1"},
        {type: "value", title: "In2", setting: "in2"}
    ],
    outputs: [
        {type: "value", title: "Mul", setting: "out"}
    ]
});
nodeLoader.registerNode("Percent", {
    "title": "Percent",
    "controls": {
        value1: {
            type: "label"
        },
        value2: {
            type: "label"
        },
        value3: {
            type: "label"
        },
        sum: {
            type: "label"
        }
    },
    settings: {
        out: 1,
        in: 0,
        min: 0,
        max: 1
    },
    nodes: {
    },
    controller: {
        init: function () {

        },
        onInputChange: function (setting, value) {
            this.settings[setting] = parseFloat(value);
            this.settings.out = (function (min, max, cur) {
                if(max==min)return 0;
                var current = cur + Math.abs(min);
                return Math.min(1, Math.max(current / (max - min), 0));
            })(this.settings.min, this.settings.max, this.settings.in);
        },
        onConnect: function (target, node) {
            //node.noteOn(0);

        },
        onDisconnect: function (target, node) {
        }
    },
    inputs: [
        {type: "value", title: "In", setting: "in"},
        {type: "value", title: "Min", setting: "min"},
        {type: "value", title: "Max", setting: "max"}
    ],
    outputs: [
        {type: "value", title: "Out", setting: "out"}
    ]
});
nodeLoader.registerNode("SplitValue", {
    "title": "SplitValue",
    "controls": {
        in: {
            type: "label"
        }
    },
    settings: {
        in: 1,
        out1: 0,
        out2: 0,
        out3: 0
    },
    nodes: {
    },
    controller: {
        init: function () {

        },
        onInputChange: function (setting, value) {
            this.settings.in = value;
            for (var key in this.settings) {
                if (this.settings.hasOwnProperty(key) && key != "in") {
                    this.settings[key] = value;
                }
            }
        },
        onConnect: function (target, node) {
            //node.noteOn(0);

        },
        onDisconnect: function (target, node) {
        }
    },
    inputs: [
        {type: "value", title: "In", nodeName: "in"}
    ],
    outputs: [
        {type: "value", title: "Out1", setting: "out1"},
        {type: "value", title: "Out2", setting: "out2"},
        {type: "value", title: "Out3", setting: "out3"}
    ]
});
nodeLoader.registerNode("CrossFade", {
    "title": "CrossFade",
    "controls": {
        in: {
            type: "label"
        }
    },
    settings: {
        in: 1,
        out1: 0,
        out2: 0
    },
    nodes: {
    },
    controller: {
        init: function () {

        },
        onInputChange: function (setting, value) {
            this.settings.in = value;
            this.settings.out1 = value;
            this.settings.out2 = 1-value;
        },
        onConnect: function (target, node) {
            //node.noteOn(0);

        },
        onDisconnect: function (target, node) {
        }
    },
    inputs: [
        {type: "value", title: "In", nodeName: "in"}
    ],
    outputs: [
        {type: "value", title: "Out1", setting: "out1"},
        {type: "value", title: "Out2", setting: "out2"},
    ]
});