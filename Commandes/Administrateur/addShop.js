const { PermissionsBitField } = require('discord.js');
const bddShop = require("../../bdd/shop.json");
const { saveBdd } = require("../../function/bdd");

module.exports.run = async(client, message, args) => {
    message.delete()
    if(!message.guild.members.cache.get(message.author.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("❌| Vous n'avez pas la permissions d'utilisez cette commande.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    message.channel.send("Utilisée la slash commande.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
}

module.exports.runSlash = async(client, interaction) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const articleNom = interaction.options.getString("article");
    const articleDescription = interaction.options.getString("description");
    const articlePrix = interaction.options.getNumber("prix");

    bddShop.push({
        name: articleNom,
        description: articleDescription,
        prix: articlePrix
    });
    saveBdd("shop", bddShop);
    interaction.reply({content: `✅| Article ajoutée au shop\n\`\`\`\nName: ${articleNom}\nDescription: ${articleDescription}\nPrix: ${articlePrix}\`\`\``, ephemeral: true});
}

module.exports.help = {
    name: "addshop",
    aliases: ['addShop'],
    category: "administrateur",
    description: "Permet d'ajouter un article dans le shop.",
    usage: "<name> <prix> <description>",
    options: [
        {
            name: "article",
            description: "Le nom de l'article que vous souhaitez ajouter.",
            type: 3,
            required: true
        },
        {
            name: "description",
            description: "La description de l'article que vous souhaitez ajouter.",
            type: 3,
            required: true
        },
        {
            name: "prix",
            description: "Le prix de l'article que vous souhaitez ajouter.",
            type: 10,
            required: true,
            minValue: 1
        }
        
    ]
}