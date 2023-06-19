const { saveBdd } = require("../function/bdd.js");
const { trouverCompteViaTwitch } = require("../function/merseCoinsFunction");
const index = require("../index");

module.exports.run = async(client, channel, user, message, self, args) => {

    if(!args[0]) return client.action(channel, `❌| ${user["display-name"]}, Vous n'avez pas renseignez votre compte discord. [📛 1m]`);
    if(await trouverCompteViaTwitch(user.username) != -1) return client.action(channel, `❌| Vous avez déjà un compte. [📛 1m]`);

    index.sendConfirmationLink(args.join(" "), user.username);
}

module.exports.help = {
    name: "link",
    cooldown : "1s",
    description: "Permet de lier son compte twitch et discord pour les points de chaine",
    permissions: false
}