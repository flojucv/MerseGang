const bddCompte = require("../../bdd/compte.json");
const { EmbedBuilder } = require("discord.js");
const { trouverCompteViaDiscord } = require("../../function/merseCoinsFunction");

module.exports.run = async(client, message, args) => {
    const position = await trouverCompteViaDiscord(message.author.id);
    if(position === -1) return message.channel.send("❌| Vous n'avez pas lier votre compte discord et twitch.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    
    const compte = bddCompte[position];

    const embedCompte = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter({text: "MerseCoins SYSTEM"})
    .setColor("Purple")
    

    embedCompte.setDescription(`Vous avez **${compte.MerseCoins}** MerseCoins`);

    message.channel.send({ embeds: [embedCompte]})
}

module.exports.runSlash = async(client, interaction) => {
    const position = await trouverCompteViaDiscord(interaction.user.id);
    if(position === -1) return interaction.reply({content: "❌| Vous n'avez pas lier votre compte discord et twitch.", ephemeral: true});
    
    const compte = bddCompte[position];

    const embedCompte = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter({text: "MerseCoins SYSTEM"})
    .setColor("#5B3EBA")
    
    embedCompte.setDescription(`Vous avez **${compte.MerseCoins}** MerseCoins`);

    interaction.reply({ embeds: [embedCompte]})
}

module.exports.help = {
    name: "compte",
    aliases: ['compte'],
    category: "mersecoins",
    description: "Combien de MerseCoins a tu ?",
}