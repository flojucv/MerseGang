const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../../function/db');

module.exports.runSlash = async(client, interaction) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const articleNom = interaction.options.getString("article");
    const articleDescription = interaction.options.getString("description");
    const articlePrix = interaction.options.getNumber("prix");

    const sql = "INSERT INTO shop (article_name, article_desc, prix) VALUES (?,?,?)";
    await db.query(sql, [articleNom, articleDescription, articlePrix]);
    return interaction.reply({content: `✅| Article ajoutée au shop\n\`\`\`\nName: ${articleNom}\nDescription: ${articleDescription}\nPrix: ${articlePrix}\`\`\``, ephemeral: true});
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
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "description",
            description: "La description de l'article que vous souhaitez ajouter.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "prix",
            description: "Le prix de l'article que vous souhaitez ajouter.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1
        }
        
    ],
    default_member_permissions: PermissionsBitField.Flags.Administrator
}