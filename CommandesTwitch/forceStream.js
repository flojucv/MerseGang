const indexFile = require("../index");

module.exports.run = async(client, channel, user, message, self, args) => {
    indexFile.forceStream();
    client.action(channel, "✅| Lancement forcé !")
}

module.exports.help = {
    name: "forcestream",
    cooldown : "1m",
    description: "Permet de forcé le lancement des fonctions",
    permissions: "users",
    users: ["flojucv", "mersedi_"]
}