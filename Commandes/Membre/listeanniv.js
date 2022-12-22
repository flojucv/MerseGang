const { prefix } = require('../../bdd/config.json');
const listeanniv = require('../../bdd/listeanniv.json');
const { EmbedBuilder } = require('discord.js');

module.exports.run = async(client, message, args) => {
    message.delete();
    console.log(`[LOG][PREFIX] Commande listeanniv executer par ${message.author.username}`);

    if(listeanniv.length <= 0) return message.channel.send({content: "Aucune date d'anniversaire n'a été rentrer"}).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    listeid = []
    datenaissance = []
    for(let i = 0; listeanniv.length > i; i++) {
        listeid.push(listeanniv[i].id);
        datenaissance.push(listeanniv[i].jour+"/"+listeanniv[i].mois+"/"+listeanniv[i].annee);
    }
    listefinal = []
    for(let i = 0; listeid.length > i; i++) {
        listefinal.push(`<@${listeid[i]}> | ${datenaissance[i]}`);
    }
    let i = 0;
    const embedListe = new EmbedBuilder()
    .setTitle("ANNIVERSAIRE")
    .setColor('Random')
    .setFooter({text: "MERSEDISCORD"})
    .setTimestamp()
    .addFields({name: "LISTE DES ANNIVERSAIRES :", value: listefinal.join("\n")})
    message.channel.send({ embeds:[ embedListe]})
}

module.exports.runSlash = async(client, interaction) => {
    console.log(`[LOG][SLASH] Commande listeanniv executer par ${interaction.user.username}`);
    if(listeanniv.length <= 0) return interaction.reply({content: "Aucune date d'anniversaire n'a été rentrer", ephemeral: true})
    listeid = []
    datenaissance = []
    for(let i = 0; listeanniv.length > i; i++) {
        listeid.push(listeanniv[i].id);
        datenaissance.push(listeanniv[i].jour+"/"+listeanniv[i].mois+"/"+listeanniv[i].annee);
    }
    listefinal = []
    for(let i = 0; listeid.length > i; i++) {
        listefinal.push(`<@${listeid[i]}> | ${datenaissance[i]}`);
    }
    let i = 0;
    const embedListe = new EmbedBuilder()
    .setTitle("ANNIVERSAIRE")
    .setColor('Random')
    .setFooter({text: "MERSEDISCORD"})
    .setTimestamp()
    .addFields({name: "LISTE DES ANNIVERSAIRES :", value: listefinal.join("\n")})
    interaction.reply({ embeds:[ embedListe]})
}

module.exports.help = {
    name: "listeanniv",
    aliases: ['la'],
    category: "membre",
    description: "Commande permettant d'avoir la liste des anniversaires.",
}