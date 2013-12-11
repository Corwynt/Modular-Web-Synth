var midi=require("midi");
exports.run = function () {
    return {
        regex: "/midi/(\\d)",
        connect: function (port) {

            port = parseInt(port);
            this.input = new midi.input();
            this.output = new midi.output();
            console.log(this.input.getPortCount());
            if (this.input.getPortCount() >= port) {
                var that = this;
                this.input.on('message', function (deltaTime, message) {
                    that.output.sendMessage(message);
                    that.connection.sendjson(message);
                });
                this.input.openPort(port);
                this.output.openPort(port);
            } else {
                this.connection.close();
            }
        },
        message: function () {

        },
        close: function () {
            console.log(this, "CLOSE");
            if (this.input != undefined) {
                this.input.closePort();
                this.output.closePort();
                delete this.output;
                delete this.input;
            }
        }
    };
}