const bddLink = require("../bdd/link.json");
const { saveBdd } = require("../function/bdd.js");
const index = require("../index");

module.exports.run = async(client, channel, user, message, self, args) => {

    if(!args[0]) return client.action(channel, `❌| ${user["display-name"]}, Vous n'avez pas renseignez votre compte discord. [📛 1m]`);
    pseudo = args[0].split("#");
    if(pseudo.length != 2) return client.action(channel, `❌| ${user["display-name"]}, Vous devez renseignez votre pseudo complet. Exemple: flojucv#6188 [📛 1m]`);
    if(isNaN(pseudo[1])) return client.action(channel, `❌| ${user["display-name"]},  Vous devez renseignez votre pseudo complet. Exemple: flojucv#6188 [📛 1m]`);
    if(pseudo[1].length != 4) return client.action(channel, `❌| ${user["display-name"]},  Vous devez renseignez votre pseudo complet. Exemple: flojucv#6188 [📛 1m]`);

    const idUser = await index.researchID(args[0])
    bddLink[idUser] = user["username"];
    saveBdd("link", bddLink);
    return client.action(channel, `✔| ${user["display-name"]}, Liaison effectuez avec succés [📛 1m]`);
}

module.exports.help = {
    name: "link",
    cooldown : "1m",
    description: "Permet de lier son compte twitch et discord pour les points de chaine",
    permissions: false
}