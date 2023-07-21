const { PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const bddQuizz = require("../../bdd/quizz.json");
const { saveBdd } = require('../../function/bdd');

module.exports.run = async (client, message, args) => {
    message.delete();
    message.channel.send("Merci d'utiliser la /commande => /addquestion").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

}

module.exports.runSlash = async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const prmQuestion = interaction.options.getString("question");
    const prmProposition = [interaction.options.getString("proposition_1"), interaction.options.getString("proposition_2"), interaction.options.getString("proposition_3"), interaction.options.getString("proposition_4")];
    const prmReponse = interaction.options.getString("reponse");
    const prmAnecdote = interaction.options.getString("anecdote");

    bddQuizz.push({id: bddQuizz.length+1, question: prmQuestion, propositions: prmProposition, reponse: prmReponse, anecdote: prmAnecdote, alias: []});
    saveBdd("quizz", bddQuizz);
    interaction.reply({content: "✅| question ajouté.", ephemeral: true});
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
            type: 3,
            required: true
        },
        {
            name: "proposition_1",
            description: "La premier des 4 propositions",
            type: 3,
            required: true,
        },
        {
            name: "proposition_2",
            description: "La deuxième des 4 propositions",
            type: 3,
            required: true,
        },
        {
            name: "proposition_3",
            description: "La troisième des 4 propositions",
            type: 3,
            required: true,
        },
        {
            name: "proposition_4",
            description: "La quatrième des 4 propositions",
            type: 3,
            required: true,
        },
        {
            name: "reponse",
            description: "La réponse a la question",
            type: 3,
            required: true,
        },
        {
            name: "anecdote",
            description: "Une anecdote par rapport a la question",
            type: 3,
            required: true,
        }

    ]
}