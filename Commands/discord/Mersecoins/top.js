const { EmbedBuilder } = require("discord.js");
const db = require('../../../function/db');



module.exports.runSlash = async (client, interaction) => {
    const sql = "SELECT * FROM compte ORDER BY mersecoins DESC";
    const comptes = await db.query(sql);
    const embedRiche = new EmbedBuilder()
    .setURL('https://mersegang.flojucvcreator.fr/top')
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setTitle("TOP 10 DES PLUS RICHES FOLLOWERS")
    .setTimestamp()
    .setColor("Random")

    const emoji = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

    for(let i = 0; i < emoji.length; i ++) {
        if(i > comptes.length-1)
            break;
        const compte = comptes[i]
        const discordUser = interaction.guild.members.cache.find(member => member.id == compte.discord);
        const coins = compte.mersecoins;
        embedRiche.addFields({ name: `${emoji[i]}| ${discordUser === undefined ? `Utilisateur non trouver` : `${discordUser.user.tag}`} (${compte.twitch})`, value: `${coins} <:mersecoins:1135490066194645002>`});
    }
    
    return interaction.reply({embeds:[embedRiche]})
}


module.exports.help = {
    name: "top",
    aliases: ['top'],
    category: "mersecoins",
    description: "Qui sont les 10 premières personnes à posséder le plus de MerseCoins ?",
}