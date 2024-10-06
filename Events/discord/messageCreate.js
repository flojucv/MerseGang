const candidat = require("../../bdd/candidat.json");
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = async (client, message) => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    /*election*/

    /*if(message.channel.id === "989083078729293835") {
        message.delete()
        if(message.content.length <=0) return message.channel.send(`❌| <@${message.author.id}>, Il manque ton texte pour postuler !`).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
        if(message.content.length > 1024) return message.channel.send(`❌| <@${message.author.id}>, Votre message ne doit pas dépassez 1024 caractères !`).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
        if(candidat[message.author.id] != undefined) return message.channel.send(`❌| <@${message.author.id}>, Vous avez déjà postuler.`).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
        
        const embedVote = new EmbedBuilder()
        .setAuthor( {name: "Bot by flojucv", iconURL: "https://cdn.discordapp.com/attachments/881093953036881940/881094182897324062/logo.png", url: "https://discord.gg/p2QC3NQSmG"} )
        .setColor('RANDOM')
        .setTitle(`CANDIDATURE DE ${message.author.username}`)
        .addFields(
            { name: 'Texte du candidat :', value: `${message.content}` },
            { name: 'Nombre de vote: ', value: `0` }
        )
        

        if(Array.from(message.attachments)[0] != undefined) {
            urlAttachment = Array.from(message.attachments)[0][1].url;
            console.log(urlAttachment.toString());
            embedVote.setImage(`${urlAttachment.toString()}`)
        }

        let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`vote;${message.author.id}`)
                .setEmoji('✔')
                .setLabel('| Voter pour cette personne')
                .setStyle(ButtonStyle.Success)
        )

        message.guild.channels.cache.find(channel => channel.id === "989083104054505562").send({embeds:[embedVote], components: [row]})
        candidat[message.author.id] = 0;
        fs.writeFile("./bdd/candidat.json", JSON.stringify(candidat, null, 4), (err) => {
            if(err) message.channel.send("Une erreur est survenue.");
        })

    }*/
};