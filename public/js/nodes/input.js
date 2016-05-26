nodeLoader.registerNode("Audio", {
    "title": "Audio",
    "type": "input-type",
    "controls": {
        "file": {
            type: "file"
        }
    },
    settings: {
        in: 0,
        out: 0
    },
    nodes: {
        out: null
    },
    controller: {
        init: function () {
            this.controller.parent = this;//Dirty Hack :(
            var source = this.context.createBufferSource();
            //source.buffer = audioBuffer;
            source.loop = true;
            this.nodes.out = source;
        },
        onInputChange: function (setting, value) {

        },
        onFileLoad: function (data) {
            var that = this;
            this.parent.context.decodeAudioData(data, function (buffer) {
                that.parent.nodes.out.buffer = buffer;
                that.parent.nodes.out.start(0);
            }, function (e) {
                console.log('Error decoding file', e);
            });
        },
        onConnect: function (target, node) {
            node.connect(this.nodes[target]);

        },
        onDisconnect: function (target, node) {
            node.disconnect(this.nodes[target]);
        }
    },
    inputs: [
    ],
    outputs: [
        {type: "node", title: "Out", nodeName: "out"}
    ]
});
nodeLoader.registerNode("AudioUrl", {
    "title": "AudioUrl",
    "type": "input-type",
    "controls": {
        "url": {
            type: "text"
        }, "load": {
            type: "button",
            label: "load"
        }
    },
    settings: {
        in: 0,
        out: 0
    },
    nodes: {
        out: null
    },
    controller: {
        init: function () {
            this.controller.parent = this;//Dirty Hack :(
            var source = this.context.createBufferSource();
            //source.buffer = audioBuffer;
            source.loop = true;
            this.nodes.out = source;
        },
        onInputChange: function (setting, value) {

        },
        onClick: function (data) {

            var xhr = new XMLHttpRequest();
            xhr.open('GET',"/proxy/"+ encodeURIComponent(this.parent.settings.url), true);
            xhr.responseType = 'arraybuffer';
            var that = this;
            xhr.onload = function (e) {
                var arrayBuffer = this.response;
                var context = new window.webkitAudioContext();
                context.decodeAudioData(arrayBuffer, function (buffer) {
                    // audioBuffer is global to reuse the decoded audio later.
                    that.parent.nodes.out.buffer = buffer;
                    that.parent.nodes.out.start(0);
                }, function (e) {
                    console.log('Error decoding file', e);
                });
            };
            xhr.send();
            /*var that = this;
             this.parent.context.decodeAudioData(data, function (buffer) {
             that.parent.nodes.out.buffer = buffer;
             that.parent.nodes.out.noteOn(0);
             }, function (e) {
             console.log('Error decoding file', e);
             });*/
        },
        onConnect: function (target, node) {
            node.connect(this.nodes[target]);

        },
        onDisconnect: function (target, node) {
            node.disconnect(this.nodes[target]);
        }
    },
    inputs: [
    ],
    outputs: [
        {type: "node", title: "Out", nodeName: "out"}
    ]
});
nodeLoader.registerNode("Microphone", {
    "title": "Microphone",
    "type": "input-type",
    "controls": {

    },
    settings: {
        in: 0,
        out: 0
    },
    nodes: {
        out: null
    },
    controller: {
        init: function () {
            var that = this;

            function gotStream(stream) {
                that.nodes.out = that.context.createMediaStreamSource(stream);
                console.log(stream, that.nodes.out);
            }

            navigator.webkitGetUserMedia({audio: true}, gotStream);

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
    ],
    outputs: [
        {type: "node", title: "Out", nodeName: "out"}
    ]
});