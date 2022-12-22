const { PermissionsBitField } = require('discord.js');
const bddShop = require("../../bdd/shop.json");
const { saveBdd } = require("../../function/bdd");

module.exports.run = async(client, message, args) => {
    message.delete()
    if(!message.guild.members.cache.get(message.author.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("❌| Vous n'avez pas la permissions d'utilisez cette commande.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    if(!args[0] || isNaN(args[0])) return message.channel.send("❌| Vous n'avez pas rentrer de numero.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    if(args[0] < 1 || args[0] > bddShop.length) return message.channel.send(`❌| Votre numéro doit être compris entre 1 et ${bddShop.length}`).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    bddShop.splice(args[0], 1);
    saveBdd("shop", bddShop);
    message.channel.send("✅| L'article a été supprimer").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
}

module.exports.runSlash = async(client, interaction) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const article = interaction.options.getNumber("numero");
    if(article > bddShop.length) return interaction.reply({content: `❌| Votre numéro doit être compris entre 1 et ${bddShop.length}`, ephemeral: true});

    bddShop.splice(article, 1);
    saveBdd("shop", bddShop);
    interaction.reply({content: "✅| L'article a été supprimer", ephemeral: true});
}

module.exports.help = {
    name: "removeshop",
    aliases: ['removeshop'],
    category: "administrateur",
    description: "Permet de retirer un article dans le shop.",
    usage: "<numero>",
    options: [
        {
            name: "numero",
            description: "Le numero de l'article a supprimer.",
            type: 10,
            required: true,
            minValue: 1,
            maxValue: bddShop.length
        }
    ]
}