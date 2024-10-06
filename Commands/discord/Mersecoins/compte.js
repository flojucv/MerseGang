const { EmbedBuilder } = require("discord.js");
const db = require('../../../function/db');

module.exports.runSlash = async(client, interaction) => {
    const sql = "SELECT * FROM compte WHERE discord = ?";
    const response = await db.query(sql, [interaction.user.id]);

    if(response.length == 0) return interaction.reply({content: "❌| Vous n'avez pas de compte.", ephemeral: true});

    const embedCompte = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter({text: "MerseCoins SYSTEM", iconURL:"https://cdn.discordapp.com/attachments/1069524271946268672/1135491536126230628/mersecoins.png"})
    .setColor("#5B3EBA")
    .setDescription(`Vous avez **${response[0].mersecoins}** <:mersecoins:1135490066194645002>`);
    return interaction.reply({ embeds: [embedCompte]})
}

module.exports.help = {
    name: "compte",
    aliases: ['compte'],
    category: "mersecoins",
    description: "Combien de MerseCoins a tu ?",
}