const twitchJson = require('../../bdd/twitch.json');
const { saveBdd } = require('../../function/bdd');
const { startIntervalEventAndPoint, stopIntervalEventAndPoint } = require('../../function/streamEventAndPoint');

module.exports.run = async (client, channel, user, message, self, args) => {
    if(twitchJson.stream) {
        twitchJson.stream = false;
        twitchJson.doubleMersecoins = false;
        twitchJson.unEvent = false;
        twitchJson.typeEvent = "";
        twitchJson.uneQuestion = {};
        twitchJson.propositionEnable = false;
        twitchJson.listeUser = [];
        saveBdd("twitch", twitchJson);
        stopIntervalEventAndPoint();
        client.action(channel, "✅| Arrêt forcé !")

    } else {
        twitchJson.stream = true;
        twitchJson.listeUser = [];
        saveBdd("twitch", twitchJson);
        startIntervalEventAndPoint();
        client.action(channel, "✅| Lancement forcé !")
    }
}

module.exports.help = {
    name: "forcestream",
    aliases: ['forcestream'],
    cooldown: "1s",
    description: "Permet de forcé le lancement des fonctions",
    permissions: "users",
    users: ["flojucv", "mersedi_"]
}