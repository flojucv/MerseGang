const { PermissionsBitField } = require('discord.js');
const bddLink = require("../../bdd/link.json");
const { saveBdd } = require('../../function/bdd');

module.exports.run = async(client, message, args) => {
    message.delete()
    if(!message.guild.members.cache.get(message.author.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("❌| Vous n'avez pas la permissions d'utilisez cette commande.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    const target = args[0];
    if(!target) return message.channel.send("❌| Vous n'avez pas mentionner d'utilisateur twitch.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    const value = Object.values(bddLink)
    if(value.indexOf(target) === -1) return message.channel.send("❌| Se compte twitch n'ai lier a aucun compte discord.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    for (let key in bddLink) {
        if (bddLink[key] === target) {
            delete bddLink[key];
            break; // Quitter la boucle après la première suppression
        }
    }
    saveBdd("link", bddLink);
    message.channel.send("✅| Liaison supprimé.");
}

module.exports.runSlash = async(client, interaction) => {
    const target = interaction.options.getString("user");

    const value = Object.values(bddLink)
    if(value.indexOf(target) === -1) return interaction.reply({content: "❌| Se compte twitch n'ai lier a aucun compte discord.", ephemeral: true});
    for (let key in bddLink) {
        if (bddLink[key] === target) {
            delete bddLink[key];
            break; // Quitter la boucle après la première suppression
        }
    }
    saveBdd("link", bddLink);
    interaction.reply({content: "✅| Liaison supprimé.", ephemeral: true});
}

module.exports.help = {
    name: "removelinktwitch",
    aliases: ['removeLinkTwitch'],
    category: "administrateur",
    description: "Permet de supprimer un lien entre un compte twitch et discord.",
    usage: "<@user>",
    options: [
        {
            name: "user",
            description: "L'utilisateur a supprimer.",
            type: 3,
            required: true
        }
    ],
    default_member_permissions: PermissionsBitField.Flags.Administrator
}