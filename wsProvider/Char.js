exports.run = function () {
    //"a[\p]"
    console.log("Hallo");
    return {
        regex: "/test/(\\d)",
        name:"Midi",
        connect: function (port) {
            this.port=port;
            this.connection.sendjson("HI");
        },
        message: function (message) {
            this.connection.sendjson(this.port+": "+message);
        },
        close: function () {

        }
    };
}