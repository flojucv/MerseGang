const { PermissionsBitField } = require('discord.js');
const bddCompte = require("../../bdd/compte.json");
const bddGrade = require("../../bdd/grade.json");
const { saveBdd } = require("../../function/bdd");
const { trouverCompteViaDiscord } = require('../../function/merseCoinsFunction');

module.exports.run = async (client, message, args) => {
    message.delete();
    if (!message.guild.members.cache.get(message.author.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("❌| Vous n'avez pas la permissions d'utilisez cette commande.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    const target = message.mentions.members.first();
    if (!target) return message.channel.send("❌| Vous n'avez pas mentionner d'utilisateur.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    if (!args[1]) return message.channel.send("❌| Vous n'avez pas renseignez de grade.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    const position = await trouverCompteViaDiscord(target.user.id);
    if (position === -1)
        return message.channel.send("❌| L'utilisateur n'a pas de compte.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    let trouver = false;
    await bddGrade.forEach(grade => {
        if (grade.nomGrade === args[1].toLowerCase()) {
            bddCompte[position].grade = grade.nomGrade;
            saveBdd("compte", bddCompte);
            trouver = true;
        }
    })

    if (trouver) {
        return message.channel.send(`✅| Le grade ${args[1]} a été donner à ${target.user.username}`).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    } else {
        return message.channel.send(`❌| Le grade n'existe pas.`).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    }

}

module.exports.runSlash = async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const target = interaction.options.getUser("user");
    const gradeString = interaction.options.getString("grade");

    const position = await trouverCompteViaDiscord(target.id);

    if (position === -1)
        return interaction.reply({ content: "❌| L'utilisateur n'a pas de compte.", ephemeral: true });

    let trouver = false;
    await bddGrade.forEach(grade => {
        if (grade.nomGrade === gradeString.toLowerCase()) {
            bddCompte[position].grade = grade.nomGrade;
            saveBdd("compte", bddCompte);
            trouver = true;
        }
    })

    if (trouver) {
        return interaction.reply({content: `✅| Le grade ${gradeString} a été donner à ${target.username}`, ephemeral: true});
    } else {
        return interaction.reply({content: `❌| Le grade n'existe pas.`, ephemeral: true});
    }
}

module.exports.help = {
    name: "givegrade",
    aliases: ['giveGrade'],
    category: "administrateur",
    description: "Permet de changer le grade d'un utilisateur.",
    usage: "<@user> <grade>",
    options: [
        {
            name: "user",
            description: "L'utilisateur a qui vous souhaitez donner un grade.",
            type: 6,
            required: true
        },
        {
            name: "grade",
            description: "Le grade que vous souhaitez donner a l'utilisateur.",
            type: 3,
            required: true,
        }

    ]
}