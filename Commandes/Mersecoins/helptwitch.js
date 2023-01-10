const fs = require('fs');
const { EmbedBuilder } = require('discord.js');

module.exports.run = async(client, message, args) => {

    const embedHelpTwitch = new EmbedBuilder()
    .setTitle("HELP TWITCH")
    .setDescription("Panneau d'aide pour les commandes du live\nLe prefix du bot est : `&`")
    .setTimestamp()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter({text: "TWITCH SYSTEM", iconURL: "https://cdn.discordapp.com/emojis/1062276384413724702.webp?size=56&quality=lossless"})
    .setColor("#5B3EBA")

    fs.readdir("./CommandesTwitch/", async (error, f) => {
        if(error) return console.log(error);
    
        let commandes = f.filter(f => f.split(".").pop() === "js");
        if(commandes.length <= 0) 
            return message.channel.send("💠| Il n'y a pas de commandes.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

        await commandes.forEach((f) => {
            let commande = require(`../../CommandesTwitch/${f}`);
            embedHelpTwitch.addFields(
                { name: `\`${commande.help.name}\` :`, value: `${commande.help.description}` },
            )
        })
        
        message.channel.send({embeds: [embedHelpTwitch]});
    })
}

module.exports.runSlash = async(client, interaction) => {

    const embedHelpTwitch = new EmbedBuilder()
    .setTitle("HELP TWITCH")
    .setDescription("Panneau d'aide pour les commandes du live\nLe prefix du bot est : `&`")
    .setTimestamp()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter({text: "TWITCH SYSTEM", iconURL: "https://cdn.discordapp.com/emojis/1062276384413724702.webp?size=56&quality=lossless"})
    .setColor("#5B3EBA")

    fs.readdir("./CommandesTwitch/", async (error, f) => {
        if(error) return console.log(error);
    
        let commandes = f.filter(f => f.split(".").pop() === "js");
        if(commandes.length <= 0) 
            return interaction.reply({content: "💠| Il n'y a pas de commandes.", ephemeral: true});

        await commandes.forEach((f) => {
            let commande = require(`../../CommandesTwitch/${f}`);
            embedHelpTwitch.addFields(
                { name: `\`${commande.help.name}\` :`, value: `${commande.help.description}` },
            )
        })
        
        interaction.reply({embeds: [embedHelpTwitch]});
    })
}

module.exports.help = {
    name: "helptwitch",
    aliases: ['helptwitch'],
    description: "Commande permettant d'avoir la liste des commandes du chat twitch",
    category: "mersecoins",
}