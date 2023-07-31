const bddCompte = require("../../bdd/compte.json");
const { EmbedBuilder } = require("discord.js");

function comparer(a, b) {
    if (a.MerseCoins < b.MerseCoins) {
        return 1;
    } else if (a.MerseCoins > b.MerseCoins) {
        return -1;
    }
    return 0;
}

module.exports.run = async (client, message, args) => {

    const tableautrie = bddCompte;
    // Tri du tableau en utilisant la fonction de comparaison
    tableautrie.sort(comparer);

    const embedRiche = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setTitle("TOP 10 DES PLUS RICHES FOLLOWERS")
    .setTimestamp()
    .setColor("Random")
    const emoji = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    for(let i = 0; i < emoji.length; i ++) {
        if(i > tableautrie.length-1)
            break;
        const discordUser = message.guild.members.cache.find(member => member.id === tableautrie[i].idDiscord);
        const coins = tableautrie[i].MerseCoins;
        embedRiche.addFields({ name: `${emoji[i]}| ${discordUser === undefined ? `Utilisateur non trouver` : `${discordUser.user.tag}`} (${tableautrie[i].pseudoTwitch})`, value: `${coins} <:mersecoins:1135490066194645002>`});
    }
    message.channel.send({embeds: [embedRiche]});
}

module.exports.runSlash = async (client, interaction) => {
    const tableautrie = bddCompte;
    // Tri du tableau en utilisant la fonction de comparaison
    tableautrie.sort(comparer);
    
    const embedRiche = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setTitle("TOP 10 DES PLUS RICHES FOLLOWERS")
    .setTimestamp()
    .setColor("Random")
    let compteur = 0;
    const emoji = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    for(let i = 0; i < emoji.length; i ++) {
        if(i > tableautrie.length-1)
            break;
        const discordUser = interaction.guild.members.cache.find(member => member.id === tableautrie[i].idDiscord);
        const coins = tableautrie[i].MerseCoins;
        embedRiche.addFields({ name: `${emoji[i]}| ${discordUser === undefined ? `Utilisateur non trouver` : `${discordUser.user.tag}`} (${tableautrie[i].pseudoTwitch})`, value: `${coins} <:mersecoins:1135490066194645002>`});
    }
    interaction.reply({embeds:[embedRiche]})
}


module.exports.help = {
    name: "top",
    aliases: ['top'],
    category: "mersecoins",
    description: "Qui sont les 10 premiers personne a possédez le plus de MerseCoins ?",
}