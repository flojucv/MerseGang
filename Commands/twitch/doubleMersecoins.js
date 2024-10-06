const twitchJson = require('../../bdd/twitch.json');
const { saveBdd } = require('../../function/bdd');

module.exports.run = async (client, channel, user, message, self, args) => {
    twitchJson.doubleMersecoins = true;
    saveBdd("twitch", twitchJson);
    client.action(channel, "Les MerseCoins reçus tout les minutes sont doublés !!");
}

module.exports.help = {
    name: "doubleMersecoins",
    aliases: ['doubleMersecoins'],
    cooldown: "1m",
    description: "Permet de doubler les mersecoins.",
    permissions: "users",
    users: ["flojucv", "mersedi_"]
}