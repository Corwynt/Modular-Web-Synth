nodeLoader.registerNode("LeapMotion",
    {
        "controls": {
            xy: {
                type: "label"
            }
        },
        settings: {
            x: 0,
            xy: "(0,0)",
            y: 0
        },
        nodes: {
            "filter": null
        },
        controller: {
            init: function () {
                var that=this;
                Leap.loop(function (frame) {
                    if (frame.hands.length == 0) {
                        return;
                    }
                    var hand = {};
                    var x = 0;
                    var y = 0;
                    var z = 0;
                    for (var i = 0; i < frame.hands.length; i++) {
                        hand = frame.hands[i];

                        x = hand.palmPosition.x;
                        y = hand.palmPosition.y;
                        z = hand.palmPosition.z;
                    }
                    //y>50-400
                    //x-200
                    y=(Math.max(50,Math.min(400,y))-50)/350;
                    x=(Math.max(-200,Math.min(200,x))+200)/400;
                    that.settings.y=y;
                    that.settings.x=x;
                    /*that.settings.y = Math.abs(2 - y * 0.01);
                    that.settings.x = Math.abs(2 - x * 0.01);*/
                    that.settings.xy = that.settings.x+"x"+that.settings.y;
                });
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
            {type: "value", title: "X", setting:"x"},
            {type: "value", title: "Y", setting:"y"}
        ],
        "title": "LeapMotion"

    }
);
var filterScaffold = {

};
