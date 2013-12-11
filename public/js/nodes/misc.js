nodeLoader.registerNode("Delay", {
    "title": "Delay",
    "controls": {
        time: {
            type: "label"
        }
    },
    settings: {
        time: 1
    },
    nodes: {
        "out": null
    },
    controller: {
        init: function () {
            var Out = this.context.createDelay();
            Out.delayTime.value = this.settings.time;
            this.nodes.out = Out;

        },
        onInputChange: function (setting, value) {
            this.nodes.out.delayTime.value = value;
        },
        onConnect: function (target, node) {
            //node.noteOn(0);
            node.connect(this.nodes[target]);

        },
        onDisconnect: function (target, node) {
            node.disconnect(this.nodes[target]);
        }
    },
    inputs: [
        {type: "node", title: "In", nodeName: "out"},
        {type: "value", title: "Time", setting: "time"}
    ],
    outputs: [
        {type: "node", title: "Out", nodeName: "out"}
    ]
});
nodeLoader.registerNode("Gain", {
    "title": "Gain",
    "type": "misc",
    "controls": {
        volume: {
            type: "label"
        }
    },
    settings: {
        volume: 1
    },
    nodes: {
        "gain": null
    },
    controller: {
        init: function () {
            var Out = this.context.createGain();
            Out.gain.value = this.settings.volume;
            this.nodes.gain = Out;

        },
        onInputChange: function (setting, value) {
            this.nodes.gain.gain.value = value;
        },
        onConnect: function (target, node) {
            //node.noteOn(0);
            node.connect(this.nodes[target]);

        },
        onDisconnect: function (target, node) {
            node.disconnect(this.nodes[target]);
        }
    },
    inputs: [
        {type: "node", title: "In", nodeName: "gain"},
        {type: "value", title: "Volume", setting: "volume"}
    ],
    outputs: [
        {type: "node", title: "Out", nodeName: "gain"}
    ]
});
nodeLoader.registerNode("MergeChannels", {
    "title": "MergeChannels",
    "type": "misc",
    "controls": {

    },
    settings: {

    },
    nodes: {
        "ch1": null,
        "ch2": null
    },
    controller: {
        init: function () {
            var Out = this.context.createGain();
            Out.gain=0.1;
            this.nodes.out = Out;


        },
        onInputChange: function (setting, value) {
        },
        onConnect: function (target, node) {
            node.connect(this.nodes[target]);

        },
        onDisconnect: function (target, node) {
            node.disconnect(this.nodes[target]);
        }
    },
    inputs: [
        {type: "node", title: "Ch 1", nodeName: "out"},
        {type: "node", title: "Ch 2", nodeName: "out"}
    ],
    outputs: [
        {type: "node", title: "Out", nodeName: "out"}
    ]
});
nodeLoader.registerNode("Analyser", {
    "title": "Analyser",
    "controls": {
        canvas: {
            type: "canvas",
            width: 300,
            height: 100
        }
    },
    settings: {
        connected: false
    },
    nodes: {
        "out": null
    },
    controller: {
        init: function () {
            function findPhase(data, phases) {
                var start = 0;
                var end = data.length;
                var last = data[0];
                var direction = 0;
                var inPhase = false;
                for (var i = 1; i < data.length; i++) {
                    if (direction == 0) {
                        var change = Math.abs(data[i] - last);
                        if (change > 20)change = data[i] < last ? -1 : 1;
                        if (change) {
                            direction = -1;
                        } else {
                            direction = 1;
                        }
                    } else {
                        var change = Math.abs(data[i] - last);
                        var currentDirection = direction;
                        if (change > 20) {
                            currentDirection = data[i] < last ? -1 : 1;
                        }
                        if (currentDirection != direction) {
                            if (inPhase) {
                                end = i - 1;
                                break;
                            }
                            if (currentDirection == 1) {
                                start = i;
                                inPhase = true;
                            }
                        }
                        direction = currentDirection;
                    }
                    last = data[i];
                }
                end = start + (end - start) * phases;

                if (end > data.length)end = data.length;

                return data.subarray(start, end);
            }

            function paintWave(data) {
                var canvas = $("#" + that.id + " canvas").get(0);
                var ctx = canvas.getContext("2d");
                //data = findPhase(data, 10);
                //data = data.subarray(0, data.length / 8);
                var length = data.length;
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var step = canvas.width / length;
                var min = Math.min.apply(null, data),
                    max = Math.max.apply(null, data);
                var maxPaintHeight = Math.max(Math.abs(min), Math.abs(max));
                var yScale = (canvas.height - 20) / maxPaintHeight / 2;
                ctx.beginPath();
                ctx.moveTo(0, 10 + (canvas.height - 20) / 2 + (data[0] * yScale));
                for (var i = 1, x = step; i < length; i++, x += step) {
                    ctx.lineTo(x, 10 + (canvas.height - 20) / 2 + (data[i] * yScale));
                }
                ctx.stroke();
            }

            var Out = this.context.createAnalyser();
            Out.smoothingTimeConstant = 0.0;
            Out.fftSize = 2048;
            this.nodes.out = Out;
            var that = this;
            this.$interval(function () {
                if (that.settings.connected) {
                    var data = new Uint8Array(Out.frequencyBinCount);
                    Out.getByteTimeDomainData(data);

                    paintWave(data);
                }
            }, 50);
        },
        onInputChange: function (setting, value) {

        },
        onConnect: function (target, node) {
            node.connect(this.nodes[target]);
            this.settings.connected = true;

        },
        onDisconnect: function (target, node) {
            node.disconnect(this.nodes[target]);
            this.settings.connected = false;
        }
    },
    inputs: [
        {type: "node", title: "In", nodeName: "out"}
    ],
    outputs: [
        {type: "node", title: "Out", nodeName: "out"}
    ]
});
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
nodeLoader.registerNode("SpectrumAnalyser", {
    "title": "SpectrumAnalyser",
    "controls": {
        canvas: {
            type: "canvas",
            width: 300,
            height: 100
        }
    },
    settings: {
        connected: false
    },
    nodes: {
        "out": null
    },
    controller: {
        init: function () {


            var Out = this.context.createAnalyser();
            Out.smoothingTimeConstant = 0.0;
            Out.fftSize = 2048;
            this.nodes.out = Out;
            var that = this;
            this.$interval(function () {
                if (that.settings.connected) {
                    var canvas = $("#" + that.id + " canvas").get(0);
                    var ctx = canvas.getContext("2d");
                    var freqDomain = new Uint8Array(Out.frequencyBinCount);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    Out.getByteFrequencyData(freqDomain);
                    for (var i = 0; i < Out.frequencyBinCount; i++) {
                        var value = freqDomain[i];
                        var percent = value / 256;
                        var height = 100 * percent;
                        var offset = 100 - height - 1;
                        var barWidth = 300 / Out.frequencyBinCount;
                        var hue = i / Out.frequencyBinCount * 360;
                        ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
                        ctx.fillRect(i * barWidth, offset, barWidth, height);
                    }
                    (function (analyser,drawContext) {
                        var timeDomain = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteTimeDomainData(timeDomain);
                        for (var i = 0; i < analyser.frequencyBinCount; i++) {
                            var value = timeDomain[i];
                            var percent = value / 256;
                            var height = 100 * percent;
                            var offset = 100 - height - 1;
                            var barWidth = 300 / analyser.frequencyBinCount;
                            drawContext.fillStyle = 'black';
                            drawContext.fillRect(i * barWidth, offset, 1, 1);
                        }
                    })(Out,ctx);
                }
            }, 50);
        },
        onInputChange: function (setting, value) {

        },
        onConnect: function (target, node) {
            node.connect(this.nodes[target]);
            this.settings.connected = true;

        },
        onDisconnect: function (target, node) {
            node.disconnect(this.nodes[target]);
            this.settings.connected = false;
        }
    },
    inputs: [
        {type: "node", title: "In", nodeName: "out"}
    ],
    outputs: [
        {type: "node", title: "Out", nodeName: "out"}
    ]
});
nodeLoader.registerNode("DoubleAnalyser",
    {
        "title": "DoubleAnalyser",
        "controls": {
            canvas: {
                type: "canvas",
                width: 300,
                height: 100
            }
        },
        settings: {
        },
        nodes: {
            "out1": null,
            "out2": null
        },
        controller: {
            init: function () {
                function paintWave(data1, data2) {
                    var canvas = $("#" + that.id + " canvas").get(0);
                    var ctx = canvas.getContext("2d");
                    //data = findPhase(data, 20);
                    /*data1 = data1.subarray(0, data1.length / 8);
                     data2 = data2.subarray(0, data2.length / 8);*/
                    var length = data1.length;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    var step = canvas.width / length;
                    var min1 = Math.min.apply(null, data1),
                        max1 = Math.max.apply(null, data1);
                    var min2 = Math.min.apply(null, data2),
                        max2 = Math.max.apply(null, data2);
                    var min = Math.min(min1, min2);
                    var max = Math.max(max1, max2);
                    var maxPaintHeight = Math.max(Math.abs(min), Math.abs(max));
                    var yScale = (canvas.height - 20) / maxPaintHeight / 2;
                    ctx.strokeStyle = 'green';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, 10 + (canvas.height - 20) / 2 + (data1[0] * yScale));
                    for (var i = 1, x = step; i < length; i++, x += step) {
                        ctx.lineTo(x, 10 + (canvas.height - 20) / 2 + (data1[i] * yScale));
                    }
                    ctx.stroke();
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, 10 + (canvas.height - 20) / 2 + (data2[0] * yScale));
                    for (var i = 1, x = step; i < length; i++, x += step) {
                        ctx.lineTo(x, 10 + (canvas.height - 20) / 2 + (data2[i] * yScale));
                    }
                    ctx.stroke();
                }

                var Out1 = this.context.createAnalyser();
                Out1.smoothingTimeConstant = 0.0;
                Out1.fftSize = 2048;
                this.nodes.out1 = Out1;
                var Out2 = this.context.createAnalyser();
                Out2.smoothingTimeConstant = 0.0;
                Out2.fftSize = 2048;
                this.nodes.out2 = Out2;
                var that = this;
                this.$interval(function () {
                    var data1 = new Uint8Array(Out1.frequencyBinCount);
                    var data2 = new Uint8Array(Out2.frequencyBinCount);
                    Out1.getByteTimeDomainData(data1);
                    Out2.getByteTimeDomainData(data2);

                    paintWave(data1, data2);
                }, 50);
            },
            onInputChange: function (setting, value) {

            },
            onConnect: function (target, node) {
                node.connect(this.nodes[target]);
                //this.settings.connected = true;

            },
            onDisconnect: function (target, node) {
                node.disconnect(this.nodes[target]);
                //this.settings.connected = false;
            }
        },
        inputs: [
            {type: "node", title: "In1", nodeName: "out1"},
            {type: "node", title: "In2", nodeName: "out2"}
        ],
        outputs: [
            {type: "node", title: "Out1", nodeName: "out1"},
            {type: "node", title: "Out2", nodeName: "out2"}
        ]
    });
nodeLoader.registerNode("NodeToValue",
    {
        "title": "NodeToValue",
        "controls": {

        },
        settings: {
            connected: false
        },
        nodes: {
            "out": null
        },
        controller: {
            init: function () {
                var Out = this.context.createAnalyser();
                Out.smoothingTimeConstant = 0.0;
                Out.fftSize = 2048;
                this.nodes.out = Out;
                var that = this;
                this.$interval(function () {
                    if (that.settings.connected) {
                        //var data = new Float32Array(1);
                        var data = new Uint8Array(1);
                        //Out.getFloatFrequencyData(data);
                        Out.getByteTimeDomainData(data);
                        that.settings.out = data[0];
                    }
                }, 50);
            },
            onInputChange: function (setting, value) {

            },
            onConnect: function (target, node) {
                node.connect(this.nodes[target]);
                this.settings.connected = true;

            },
            onDisconnect: function (target, node) {
                node.disconnect(this.nodes[target]);
                this.settings.connected = false;
            }
        },
        inputs: [
            {type: "node", title: "In", nodeName: "out"}
        ],
        outputs: [
            {type: "value", title: "Out", setting: "out"}
        ]
    });
nodeLoader.registerNode("Fader", {
    "title": "Fader",
    "controls": {
        in: {
            type: "label"
        }
    },
    settings: {
        in: 0,
        running: true,
        out: 0
    },
    controller: {
        init: function () {
            var that = this;
            this.$interval(function () {
                if (!that.settings.running) {
                    that.settings.out = Math.max(that.settings.out - 0.1, 0);
                    if (that.settings.out == 0) {
                        that.settings.running = true;
                    }
                }
            }, 50);
        },
        onInputChange: function (setting, value) {
            if (value == 0) {
                this.settings.running = false;
            } else {
                this.settings.out = value;
            }
        },
        onConnect: function (target, node) {

        },
        onDisconnect: function (target, node) {

        }
    },
    inputs: [
        {type: "value", title: "in", setting: "in"}
    ],
    outputs: [
        {type: "value", title: "out", setting: "out"}
    ]
});
nodeLoader.registerNode("ADSR", {
    "title": "ADSR",
    "controls": {
        phaseName: {
            type: "label"
        },
        out: {
            type: "label"
        }
    },
    settings: {
        phaseName: "idle",
        phase: 0,
        in: 0,
        max: 0,
        out: 0,
        A: 0,
        D: 0,
        S: 0,
        R: 0,
        currentPhaseLength: 0,
        rate: 0
    },
    controller: {
        init: function () {
            var that = this;
            this.$interval(function () {

            }, 1);
        },
        setPhaseName: function (that) {
            that.settings.phaseName = ["idle", "attack", "decay", "sustain", "release"][that.settings.phase];
        },
        switchPhase: function (that, newPhase) {
            switch (newPhase) {
                case 0:
                    that.settings.out = 0;

            }
            this.settings.phase = newPhase;
        },
        onInputChange: function (setting, value) {
            switch (setting) {
                case "in":
                    if (value == 0) {

                    } else {

                    }
                    break;
                default:
                    this.settings[setting] = value
            }
        },
        onConnect: function (target, node) {

        },
        onDisconnect: function (target, node) {

        }
    },
    inputs: [
        {type: "value", title: "in", setting: "in"},
        {type: "value", title: "max", setting: "max"},
        {type: "value", title: "T(A)", setting: "A"},
        {type: "value", title: "T(D)", setting: "D"},
        {type: "value", title: "S", setting: "S"},
        {type: "value", title: "T(R)", setting: "R"}
    ],
    outputs: [
        {type: "value", title: "out", setting: "out"}
    ]
});