const bddLink = require("../../bdd/link.json");
const bddCoins = require("../../bdd/coins.json");
const { EmbedBuilder } = require("discord.js");

module.exports.run = async(client, message, args) => {
    if(bddLink[message.author.tag] === undefined) return message.channel.send("❌| Vous n'avez pas lier votre compte discord et twitch.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    
    const pseudo = bddLink[message.author.id];

    const embedCompte = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter({text: "MerseCoins SYSTEM"})
    .setColor("Purple")
    
    if(bddCoins[pseudo] === undefined)
        embedCompte.setDescription(`Vous avez **0** MerseCoins`);
    else 
        embedCompte.setDescription(`Vous avez **${bddCoins[pseudo]}** MerseCoins`);

    message.channel.send({ embeds: [embedCompte]})
}

module.exports.runSlash = async(client, interaction) => {
    if(bddLink[interaction.user.tag] === undefined) return interaction.reply({content: "❌| Vous n'avez pas lier votre compte discord et twitch.", ephemeral: true});
    
    const pseudo = bddLink[interaction.user.id];

    const embedCompte = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter({text: "MerseCoins SYSTEM"})
    .setColor("#5B3EBA")
    
    if(bddCoins[pseudo] === undefined)
        embedCompte.setDescription(`Vous avez **0** MerseCoins`);
    else 
        embedCompte.setDescription(`Vous avez **${bddCoins[pseudo]}** MerseCoins`);

    interaction.reply({ embeds: [embedCompte]})
}

module.exports.help = {
    name: "compte",
    aliases: ['compte'],
    category: "mersecoins",
    description: "Combien de MerseCoins a tu ?",
}