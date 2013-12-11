nodeLoader.registerNode("Midi", {
    "title": "Midi",
    "controls": {

    },
    settings: {
        press: 1,
        force: 1,
        freq: 0,
        key: 0
    },
    controller: {
        init: function () {
            var that = this;
            var ws = new WebSocket("ws://localhost:3000/midi/1", ["midi-protocol"]);
            ws.onopen = function () {
                console.log("WS OPEN");
            };
            ws.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                switch (data[0]) {
                    case 144:
                        if (that.settings.force == 0 && that.settings.key == data[1]) {
                            that.settings.press = 0;
                        }else{
                            that.settings.press = 1;
                        }
                        that.settings.key = data[1];
                        that.settings.freq = (440 * Math.pow(2, (data[1] - 69) / 12));
                        that.settings.force = parseFloat(data[2]) / 127;

                        break;
                    case 128:
                        if (that.settings.key == data[1]) {
                            that.settings.press = 0;
                            that.settings.force = 0;
                        }
                        break;
                }
            };
            ws.onclose = function () {
            };
        },
        onInputChange: function (setting, value) {

        },
        onConnect: function (target, node) {

        },
        onDisconnect: function (target, node) {

        }
    },
    inputs: [
    ],
    outputs: [
        {type: "value", title: "Freq", setting: "freq"},
        {type: "value", title: "Key", setting: "key"},
        {type: "value", title: "Force", setting: "force"},
        {type: "value", title: "Press", setting: "press"}
    ]
});
nodeLoader.registerNode("MidiCC", {
    "title": "MidiCC",
    "controls": {
        cc:{
            type:"text"
        },
        lbl:{
            type:"label"
        }
    },
    settings: {
        cc: 0,
        val: 0,
        lbl:0
    },
    controller: {
        init: function () {
            var that = this;
            var ws = new WebSocket("ws://localhost:3000/midi/1", ["midi-protocol"]);
            ws.onopen = function () {
                console.log("WS OPEN");
            };
            ws.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                switch (data[0]) {
                    case 176:
                        that.settings.lbl=data[1];
                        if (that.settings.cc ==data[1]) {
                            that.settings.val=parseFloat(data[2]) / 127
                        }
                        break;
                }
            };
            ws.onclose = function () {
            };
        },
        onInputChange: function (setting, value) {

        },
        onConnect: function (target, node) {

        },
        onDisconnect: function (target, node) {

        }
    },
    inputs: [
    ],
    outputs: [
        {type: "value", title: "Val", setting: "val"}
    ]
});
nodeLoader.registerNode("Midi to Freq", {
    "title": "Midi to Freq",
    "controls": {

    },
    settings: {
        in: 0,
        out: 0
    },

    controller: {
        init: function () {

        },
        onInputChange: function (setting, value) {
            this.settings.out = (440 * Math.pow(2, (value - 69) / 12));
        },
        onConnect: function (nr) {
        },
        onDisconnect: function (nr) {
        }
    },
    inputs: [
        {type: "value", title: "in", setting: "in"}
    ],
    outputs: [
        {type: "value", title: "Out", setting: "out"}
    ]
});