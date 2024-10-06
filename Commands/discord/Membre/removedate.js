const db = require('../../../function/db');

module.exports.runSlash = async(client, interaction) => {
    const sql = "DELETE INTO anniversaire WHERE id_discord = ?";
    const response = await db.query(sql, [interaction.user.id]);

    if(response.affectedRows == 0) {
        return interaction.reply({content: "❌| Vous n'avez pas rentré de date d'anniversaire.", ephemeral: true});
    } else {
        return interaction.reply({ content: "✅| Votre date d'anniversaire a bien été supprimée.", ephemeral: true});
    }
}

module.exports.help = {
    name: "removeanniversaire",
    aliases: ['removeAnniversaire', 'supprimerAnniversaire', 'supprimeranniversaire', 'removedate'],
    category: "membre",
    description: "Commande permettant de retirer sa date d'anniversaire.",
    cooldown : 1
}