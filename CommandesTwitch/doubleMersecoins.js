const index = require("../index");

module.exports.run = async(client, channel, user, message, self, args) => {
    index.setDoubleMersecoins();
}

module.exports.help = {
    name: "doubleMersecoins",
    aliases: ['doubleMersecoins'],
    cooldown : "1m",
    description: "Permet de doubler les mersecoins.",
    permissions: "users",
    users: ["flojucv", "mersedi_"]
}