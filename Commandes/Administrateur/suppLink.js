const { PermissionsBitField } = require('discord.js');
const bddLink = require("../../bdd/link.json");
const { saveBdd } = require('../../function/bdd');

module.exports.run = async(client, message, args) => {
    message.delete()
    if(!message.guild.members.cache.get(message.author.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("❌| Vous n'avez pas la permissions d'utilisez cette commande.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    const target = message.mentions.members.first();
    if(!target) return message.channel.send("❌| Vous n'avez pas mentionner d'utilisateur.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    if(bddLink[target.id] === undefined) return message.channel.send("❌| Se compte discord n'ai lier a aucun compte twitch.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    delete bddLink[target.id];
    saveBdd("link", bddLink);
    message.channel.send("✅| Liaison supprimé.");
}

module.exports.runSlash = async(client, interaction) => {
    const target = interaction.options.getUser("user");

    if(bddLink[target.id] === undefined) return interaction.reply({content: "❌| Se compte discord n'ai lier a aucun compte twitch.", ephemeral: true});
    delete bddLink[target.id];
    saveBdd("link", bddLink);
    interaction.reply({content: "✅| Liaison supprimé.", ephemeral: true});
}

module.exports.help = {
    name: "removelink",
    aliases: ['removeLink'],
    category: "administrateur",
    description: "Permet de supprimer un lien entre un compte twitch et discord.",
    usage: "<@user>",
    options: [
        {
            name: "user",
            description: "L'utilisateur a supprimer.",
            type: 6,
            required: true
        }
    ],
    default_member_permissions: PermissionsBitField.Flags.Administrator
}