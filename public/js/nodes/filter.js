!function () {
    var filterScaffold = {
        "controls": {
            freq: {
                type: "label"
            }
        },
        settings: {
            freq: 1,
            type: 0
        },
        nodes: {
            "filter": null
        },
        controller: {
            init: function () {
                var Out = this.context.createBiquadFilter();
                Out.type = this.settings.type;
                Out.frequency.value = this.settings.frequency;
                this.nodes.filter = Out;

            },
            onInputChange: function (setting, value) {
                this.nodes.filter.frequency.value = value;
            },
            onConnect: function (target, node) {
                node.connect(this.nodes[target]);

            },
            onDisconnect: function (target, node) {
                node.disconnect(this.nodes[target]);
            }
        },
        inputs: [
            {type: "node", title: "In", nodeName: "filter"},
            {type: "value", title: "Freq", setting: "freq"}
        ],
        outputs: [
            {type: "node", title: "Out", nodeName: "filter"}
        ]
    };

    $.each({
        "Lowpass": 0,
        "Highpass": 1,
        "Bandpass": 2,
        "Lowshelf": 3,
        "Highshelf": 4,
        "Peaking": 5,
        "Notch": 6,
        "Allpass": 7

    }, function (name, type) {
        nodeLoader.registerNode(name, jQuery.extend(true, {},
            filterScaffold,
            {
                "title": name+" Filter",
                settings: {
                    type: type
                }
            }
        ));
    });

}();
