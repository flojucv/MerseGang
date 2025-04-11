const { EmbedBuilder } = require('discord.js');
const db = require('../../../function/db');

module.exports.runSlash = async(client, interaction) => {    
    const sql = "SELECT * FROM anniversaire";
    const response = await db.query(sql);

    if(response.length == 0) {
        return interaction.reply({content: "🎂| Aucun anniversaire enregistré."});
    }

    const listeanniv = [];

    response.forEach(anniv => {
        const tempDate = new Date(anniv.date_anniv)
        listeanniv.push(`<@${anniv.id_discord}> | ${tempDate.toLocaleDateString('fr-FR')}`)
    })

    const embedListe = new EmbedBuilder()
    .setTitle("ANNIVERSAIRE")
    .setColor('Random')
    .setFooter({text: "MERSEDISCORD"})
    .setTimestamp()
    .addFields({name: "LISTE DES ANNIVERSAIRES :", value: listeanniv.join("\n")});
    return interaction.reply({ embeds:[ embedListe]})
}

module.exports.help = {
    name: "listeanniv",
    aliases: ['la'],
    category: "membre",
    description: "Commande permettant d'avoir la liste des anniversaires.",
}