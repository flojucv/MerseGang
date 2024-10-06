const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../../function/db');



module.exports.runSlash = async(client, interaction) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const article = interaction.options.getNumber("numero");
    if(parseInt(article) < 0) return interaction.reply({content: `❌| Votre numéro doit être être supérieur à 1.`, ephemeral: true });
    
    const sql = "DELETE FROM shop WHERE id_shop = ?";
    const response = await db.query(sql, [parseInt(article)]);

    if(response.affectedRows >= 1) {
        return interaction.reply({content: "✅| L'article a été supprimer", ephemeral: true});
    } else {
        return interaction.reply({content: "❌| L'article n'existe pas.", ephemeral: true });
    }
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
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1
        }
    ],
    default_member_permissions: PermissionsBitField.Flags.Administrator
}