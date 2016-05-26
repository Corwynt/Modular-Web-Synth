nodeLoader.registerNode("Piano", {
    "title": "Piano",
    "controls": {
        piano: {
            type: "piano"
        }
    },
    settings: {
        press: 0,
        key: 0,
        freq: 0
    },
    controller: {
        init: function () {
            var that = this;
            var stop = false;
            this.$interval(function () {
                if (stop) {
                    that.settings.press = 0;
                }
                if (that.settings.press == 1) {
                    stop = true;
                }
            }, 500);
        },
        onInputChange: function (setting, value) {

        },
        onSettingChange: function (setting, value) {
            if(setting=="key")this.settings.freq = (440 * Math.pow(2, (value) / 12));
        },
        onConnect: function (target, node) {

        },
        onDisconnect: function (target, node) {

        }
    },
    inputs: [
    ],
    outputs: [
        {type: "value", title: "Key", setting: "key"},
        {type: "value", title: "Freq", setting: "freq"},
        {type: "value", title: "Press", setting: "press"}
    ]
});
nodeLoader.registerNode("Frequency Slider", {
    "title": "Frequency",
    "controls": {
        "freq": {
            type: "range",
            min: 40,
            max: 2000
        }
    },
    controller: {
        init: function () {

        },
        onInputChange: function (setting) {
        },
        onConnect: function (nr) {
        },
        onDisconnect: function (nr) {
        }
    },
    settings: {
        "freq": 40
    },
    inputs: [

    ],
    outputs: [
        {type: "value", title: "Freq", setting: "freq"}
    ]
});
nodeLoader.registerNode("Slider", {
    "title": "Slider",
    "controls": {
        "val": {
            type: "range",
            min: 0,
            max: 100
        },
        "min": {
            type: "text"
        },
        "max": {
            type: "text"
        }
    },
    controller: {
        init: function () {

        },
        onSettingChange: function (setting) {
            var gap=Math.abs(this.settings.max-this.settings.min);
            this.settings.out=this.settings.min+(gap/100*this.settings.val);
        },
        onConnect: function (nr) {
        },
        onDisconnect: function (nr) {
        }
    },
    settings: {
        "val": 20,
        "min": 0,
        "max": 100,
        out:50

    },
    inputs: [

    ],
    outputs: [
        {type: "value", title: "value", setting: "out"}
    ]
});
nodeLoader.registerNode("Volume Slider", {
    "title": "Volume",
    "controls": {
        "volume": {
            type: "range",
            min: 0,
            max: 1,
            step: 0.1
        }
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
    settings: {
        "volume": 1
    },
    inputs: [

    ],
    outputs: [
        {type: "value", title: "Volume", setting: "volume"}
    ]
});
nodeLoader.registerNode("Value", {
    "title": "Value",
    "controls": {
        "out": {
            type: "text"
        }
    },
    controller: {
        init: function () {

        },
        onInputChange: function (setting) {
        },
        onConnect: function (target, node) {

        },
        onDisconnect: function (target, node) {
        }
    },
    settings: {
        "out": 1
    },
    inputs: [

    ],
    outputs: [
        {type: "value", title: "Out", setting: "out"}
    ]
});
nodeLoader.registerNode("Label", {
    "title": "Label",
    "controls": {
        "value1": {
            type: "label"
        },
        "value2": {
            type: "label"
        },
        "value3": {
            type: "label"
        }
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
    settings: {
        "value1": "N/A",
        "value2": "N/A",
        "value3": "N/A"
    },
    inputs: [
        {type: "value", title: "Val1", setting: "value1"},
        {type: "value", title: "Val2", setting: "value2"},
        {type: "value", title: "Val3", setting: "value3"}

    ],
    outputs: [
    ]
});
