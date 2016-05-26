nodeLoader.registerNode(
    "Drummachine", {
        "title": "Drummachine",
        type: "wave",
        "controls": {
            bd: {
                type: "text"
            },
            sn: {
                type: "text"
            },
            hh: {
                type: "text"
            },
            cl: {
                type: "text"
            },
            active: {
                type: "label"
            }
        },
        settings: {
            bd: "00000000",
            sn: "00000000",
            hh: "00000000",
            cl: "00000000",
            active: 0
        },
        nodes: {
            "bd": null,
            "sn": null,
            "hh": null,
            "cl": null,
            "Out": null
        },
        controller: {
            init: function () {
                this.nodes.Out = this.context.createGainNode();
                var that = this;

                function loadFile(name) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', "/drums/" + name + ".wav", true);
                    xhr.responseType = 'arraybuffer';
                    xhr.onload = function (e) {
                        console.log(arguments);
                        var arrayBuffer = this.response;
                        var context = new window.webkitAudioContext();
                        context.decodeAudioData(arrayBuffer, function (buffer) {
                            // audioBuffer is global to reuse the decoded audio later.
                            that.nodes[name] = that.context.createBufferSource();
                            that.nodes[name].buffer = buffer;
                            that.nodes[name].onended = function(){
                                this.stop();
                            };
                            that.nodes[name].connect(that.nodes.Out);
                        }, function (e) {
                            console.log('Error decoding file', e);
                        });
                    };
                    xhr.send();
                }

                for (var name in this.settings) {
                    if (name!="active"&&!this.settings.hasOwnProperty(name))continue;
                    loadFile(name);
                }

            },
            onInputChange: function (setting, value) {

            },
            onConnect: function (nr) {
            },
            onDisconnect: function (nr) {
            },
            onBeat: function () {
                this.settings.active++;
                if(this.settings.active>=8)this.settings.active=0;
                var active = this.settings.active;
                for (var name in this.settings) {
                    if (!this.settings.hasOwnProperty(name))continue;
                    if (this.settings[name].length >= active
                        && this.settings[name][active] == "1") {
                        this.nodes[name].start(0);
                    }
                }

            }
        },
        inputs: [

        ],
        outputs: [
            {type: "node", title: "Out", nodeName: "Out"}
        ]
    }
);
