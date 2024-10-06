const quizz = require("../../bdd/quizz.json");
const { saveBdd } = require("../../function/bdd");

module.exports.run = async (client, channel, user, message, self, args) => {
    if (!args[0]) return client.action(channel, "❌| Vous n'avez pas précisez de numero de question");
    if (isNaN(args[0])) return client.action(channel, "❌| Le numero de question doit être un nombre.");
    if (isNaN(args[1])) return client.action(channel, "❌| Vous n'avez pas mit d'alias");

    const tableauAlias = args;
    delete tableauAlias[0];
    for (let i = 0; i < quizz.length; i++) {
        if (quizz[i].id === parseInt(args[0])) {
            quizz[i].alias.push(tableauAlias.join(" "));
        }
    }
    saveBdd("quizz", quizz);
}

module.exports.help = {
    name: "addAlias",
    aliases: ['addAlias'],
    cooldown: "1m",
    description: "Permet d'ajouter des alias a une question.",
    permissions: "users",
    users: ["flojucv", "mersedi_"]
}