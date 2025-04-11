const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const db = require("../../../function/db");


module.exports.runSlash = async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const prmQuestion = interaction.options.getNumber('id');
    const prmAlias = interaction.options.getString('alias');

    const sql = `SELECT id, question, propositions, response, alias FROM quizz WHERE id = ?`;
    const result = await db.query(sql, [prmQuestion]);
    if (result.length === 0) return interaction.reply({ content: "❌| Cette question n'existe pas.", ephemeral: true });
    
    let alias = [];
    if(result[0].alias != null) {
        alias = result[0].alias;
    }

    alias.push(prmAlias);

    const sql2 = `UPDATE quizz SET alias = ? WHERE id = ?`;
    const result2 = await db.query(sql2, [JSON.stringify(alias), prmQuestion]);
    if (result2.affectedRows === 0) return interaction.reply({ content: "❌| Une erreur s'est produite lors de l'ajout de l'alias.", ephemeral: true });

    const sql3 = `SELECT id, question, propositions, response, alias FROM quizz WHERE id = ?`;
    const result3 = await db.query(sql3, [prmQuestion]);

    return interaction.reply({ content: `✅| Alias ajouté. \nQuestion: ${result3[0].question}\nProposition: ${result3[0].propositions.join(", ")}\nReponse: ${result3[0].response}\nAlias: ${(result3[0].alias == null) ? '' : result3[0].alias.join(", ")}`, ephemeral: true });
}

module.exports.help = {
    name: "addquestionalias",
    aliases: ['addQuestionAlias'],
    category: "administrateur",
    description: "Permet d'ajouter un alias a une question du quizz",
    usage: "<question> <id> <alias>",
    options: [
        {
            name: "id",
            description: "L'id de la question que vous souhaitez modifier.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1
        },
        {
            name: "alias",
            description: "L'alias que vous souhaitez ajouter.",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    default_member_permissions: PermissionsBitField.Flags.Administrator
}