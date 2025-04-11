const db = require("../../function/db");

module.exports.run = async (client, channel, user, message, self, args) => {
    if (!args[0]) return client.action(channel, "❌| Vous n'avez pas précisez de numero de question");
    if (isNaN(args[0])) return client.action(channel, "❌| Le numero de question doit être un nombre.");
    if (!args[1]) return client.action(channel, "❌| Vous n'avez pas mit d'alias");

    const prmQuestion = args[0];
    const prmAlias = args[1];

    const sql = `SELECT id, question, propositions, response, alias FROM quizz WHERE id = ?`;
    const result = await db.query(sql, [prmQuestion]);
    if (result.length === 0) return client.action(channel, "❌| Cette question n'existe pas.");

    let alias = [];
    if (result[0].alias != null) {
        alias = result[0].alias;
    }

    alias.push(prmAlias);

    const sql2 = `UPDATE quizz SET alias = ? WHERE id = ?`;
    const result2 = await db.query(sql2, [JSON.stringify(alias), prmQuestion]);
    if (result2.affectedRows === 0) return client.action(channel, "❌| Une erreur s'est produite lors de l'ajout de l'alias.");
    
    client.action(channel, `✅| Alias ajouté.`);
}

module.exports.help = {
    name: "addAlias",
    aliases: ['addAlias'],
    cooldown: "1m",
    description: "Permet d'ajouter des alias a une question.",
    permissions: "users",
    users: ["flojucv", "mersedi_"]
}