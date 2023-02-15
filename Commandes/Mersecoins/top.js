const bddCoins = require("../../bdd/coins.json");
const bddLink = require("../../bdd/link.json");
const { EmbedBuilder } = require("discord.js");

function findKeyByValue(obj, value) {
    for (let key in obj) {
      if (obj[key] === value) {
        return key;
      }
    }
    return null;
  }

module.exports.run = async (client, message, args) => {
    const sortedObj = Object.fromEntries(
        Object.entries(bddCoins)
            .sort(([, val1], [, val2]) => val2 - val1)
    );
    
    const embedRiche = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setTitle("TOP 10 DES PLUS RICHES FOLLOWERS")
    .setTimestamp()
    .setColor("Random")
    let compteur = 0;
    const emoji = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    for (const key in sortedObj) {
        if(compteur < 10) {
            const coins = sortedObj[key];
            const discordUser = message.guild.members.cache.find(member => member.id === findKeyByValue(bddLink, key));
            embedRiche.addFields({ name: `${emoji[compteur]}| ${discordUser === undefined ? `Utilisateur non trouver` : `${discordUser.user.tag}`} (${key})`, value: `${coins} MerseCoins`})
            compteur ++;
        }
    }
    message.channel.send({embeds: [embedRiche]});
}

module.exports.runSlash = async (client, interaction) => {
    const sortedObj = Object.fromEntries(
        Object.entries(bddCoins)
            .sort(([, val1], [, val2]) => val2 - val1)
    );
    
    const embedRiche = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setTitle("TOP 10 DES PLUS RICHES FOLLOWERS")
    .setTimestamp()
    .setColor("Random")
    let compteur = 0;
    const emoji = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    for (const key in sortedObj) {
        if(compteur < 10) {
            const coins = sortedObj[key];
            const discordUser = interaction.guild.members.cache.find(member => member.id === findKeyByValue(bddLink, key));
            embedRiche.addFields({ name: `${emoji[compteur]}| ${discordUser === undefined ? `Utilisateur non trouver` : `${discordUser.user.tag}`} (${key})`, value: `${coins} MerseCoins`})
            compteur ++;
        }
    }
    interaction.reply({embeds:[embedRiche]})
}


module.exports.help = {
    name: "top",
    aliases: ['top'],
    category: "mersecoins",
    description: "Qui sont les 10 premieers personne a possédez le plus de MerseCoins ?",
}