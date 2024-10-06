const twitchJson = require('../../bdd/twitch.json');
const { saveBdd } = require('../../function/bdd');
const { startIntervalEventAndPoint } = require('../../function/streamEventAndPoint');

module.exports.run = async (client, channel, user, message, self, args) => {
    twitchJson.stream = true;
    saveBdd("twitch", twitchJson);
    startIntervalEventAndPoint();
    client.action(channel, "La collecte de point a démarer.");
    client.action(channel, "✅| Lancement forcé !")
}

module.exports.help = {
    name: "forcestream",
    aliases: ['forcestream'],
    cooldown: "1m",
    description: "Permet de forcé le lancement des fonctions",
    permissions: "users",
    users: ["flojucv", "mersedi_"]
}