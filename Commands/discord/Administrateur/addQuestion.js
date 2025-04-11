const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const db = require("../../../function/db");

module.exports.runSlash = async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const prmQuestion = interaction.options.getString("question");
    const prmProposition = [interaction.options.getString("proposition_1"), interaction.options.getString("proposition_2"), interaction.options.getString("proposition_3"), interaction.options.getString("proposition_4")];
    const prmReponse = interaction.options.getString("reponse");
    const prmAnecdote = interaction.options.getString("anecdote");

    const sql = `INSERT INTO quizz (question, propositions, response, anecdote, alias) VALUES (?, ?, ?, ?, ?)`;
    const values = [prmQuestion, JSON.stringify(prmProposition), prmReponse, prmAnecdote, null];
    const result = await db.query(sql, values);
    console.log(result);
    if (result.affectedRows === 0) return interaction.reply({ content: "❌| Une erreur s'est produite lors de l'ajout de la question.", ephemeral: true });
    const sql2 = `SELECT * FROM quizz WHERE id = ?`;
    const result2 = await db.query(sql2, [result.insertId]);
    interaction.reply({content: `✅| Question ajouté. \nQuestion: ${result2[0].question}\nProposition: ${result2[0].propositions.join(", ")}\nReponse: ${result2[0].response}\nAnecdote: ${result2[0].anecdote}`, ephemeral: true});
}

module.exports.help = {
    name: "addquestion",
    aliases: ['addQuestion'],
    category: "administrateur",
    description: "Permet d'ajouter une question a la liste des questions",
    usage: "<question> <proposition 1> <proposition 2> <proposition 3> <proposition 4> <réponse> [anecdote]",
    options: [
        {
            name: "question",
            description: "La question que vous souhaitez poser.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "proposition_1",
            description: "La premier des 4 propositions",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "proposition_2",
            description: "La deuxième des 4 propositions",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "proposition_3",
            description: "La troisième des 4 propositions",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "proposition_4",
            description: "La quatrième des 4 propositions",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "reponse",
            description: "La réponse a la question",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "anecdote",
            description: "Une anecdote par rapport a la question",
            type: ApplicationCommandOptionType.String,
            required: true,
        }

    ],
    default_member_permissions: PermissionsBitField.Flags.Administrator
}