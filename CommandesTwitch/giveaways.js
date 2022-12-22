const bddGiveaways = require("../bdd/giveaways.json");
const { saveBdd } = require("../function/bdd.js");

module.exports.run = async(client, channel, user, message, self, args) => {
    if(bddGiveaways.participants.indexOf(user["username"]) != -1) {
        client.action(channel, `❌| ${user["display-name"]}, Vous êtes déjà inscrit au giveaways.`);
    }
    else {
        bddGiveaways.participants.push(user['username']);
        saveBdd("giveaways", bddGiveaways);
        client.action(channel, `✅| ${user["display-name"]}, Vous êtes inscrit pour le giveaways.`);
    }
}

module.exports.help = {
    name: "giveaways",
    cooldown : "1m",
    description: "Permet de participez au giveaways pour tentez de gagnez 2 gros cadeau paladins",
    permissions: false
}