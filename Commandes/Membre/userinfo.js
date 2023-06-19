const { EmbedBuilder } = require('discord.js');
const moment = require("moment");
const bddCompte = require("../../bdd/compte.json");
const { trouverCompteViaDiscord } = require('../../function/merseCoinsFunction');

module.exports.run = async(client, message, args) => {
    message.delete();
    let member = message.member;
    let link, money, grade;
    const target = message.mentions.users.first();
    if(target) member = message.guild.members.cache.find(member => member.id === target.id);
    const positionCompte = await trouverCompteViaDiscord(member.id);
    if( positionCompte === -1) { link = "Non lier"; money = 0; grade = "aucun"} else { link = bddCompte[positionCompte].pseudoTwitch; money = bddCompte[positionCompte].MerseCoins; grade = bddCompte[positionCompte].grade; };
    let user = member.user;

    const embedUserInfo = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setColor('#CCE0B4')
    .setThumbnail(user.displayAvatarURL())
    .setDescription(`Plus d'informations à propos de **${user.username}**`)
    .addFields(
        { name: "Nom", value: `${user.tag}` },
        { name: "Surnom", value: `${member.nickname === null ? 'Pas de surnom' : `${member.nickname}`}` },
        { name: "Bot ?", value: `${user.bot ? 'true' : 'false'}` },
        { name: "Rôles", value: `${member.roles.cache.map(roles => `\`${roles.name}\`` ).join(', ')}` },
        { name: "Crée le", value: `${moment(user.createdAt).format("DD/MM/YYYY | hh:mm") }` },
        { name: "Rejoins le ", value: `${moment(member.joinedAt).format('DD/MM/YYYY | hh:mm')}` },
        { name: "-------------------------------------------------------", value: "ㅤㅤㅤㅤㅤㅤㅤTWITCH PARTIE" },
        { name: "Compte lier : ", value: `${link}`, inline: true },
        { name: "MerseCoins : ", value : `${money}`, inline: true },
        { name: "Grade : ", value : `${bddCompte[positionCompte].grade}`, inline: true },
    )
    .setFooter({text: `Commande executez par ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
    .setTimestamp()

    message.channel.send({embeds: [embedUserInfo]})
}

module.exports.runSlash = async(client, interaction) => {
    let member = interaction.member;
    let link, money, grade;
    const target = interaction.options.getUser('utilisateur');
    if(target) member = interaction.guild.members.cache.find(member => member.id === target.id);
    const positionCompte = await trouverCompteViaDiscord(member.id);
    if( positionCompte === -1) { link = "Non lier"; money = 0; grade = "aucun"} else { link = bddCompte[positionCompte].pseudoTwitch; money = bddCompte[positionCompte].MerseCoins; grade = bddCompte[positionCompte].grade; };
    let user = member.user;
    grade = grade.charAt(0).toUpperCase() + grade.slice(1);

    const embedUserInfo = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setColor('#CCE0B4')
    .setThumbnail(user.displayAvatarURL())
    .setDescription(`Plus d'informations à propos de **${user.username}**`)
    .addFields(
        { name: "Nom", value: `${user.tag}` },
        { name: "Surnom", value: `${member.nickname === null ? 'Pas de surnom' : `${member.nickname}`}` },
        { name: "Bot ?", value: `${user.bot ? 'true' : 'false'}` },
        { name: "Rôles", value: `${member.roles.cache.map(roles => `\`${roles.name}\`` ).join(', ')}` },
        { name: "Crée le", value: `${moment(user.createdAt).format("DD/MM/YYYY | hh:mm") }` },
        { name: "Rejoins le ", value: `${moment(member.joinedAt).format('DD/MM/YYYY | hh:mm')}` },
        { name: "-------------------------------------------------------", value: "ㅤㅤㅤㅤㅤㅤㅤTWITCH PARTIE" },
        { name: "Compte lier : ", value: `${link}`, inline: true },
        { name: "MerseCoins : ", value : `${money}`, inline: true },
        { name: "Grade : ", value : `${grade}`, inline: true },
    )
    .setFooter({text: `Commande executez par ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
    .setTimestamp()

    interaction.reply({embeds: [embedUserInfo]})

}

module.exports.help = {
    name: "userinfo",
    aliases: ['userinfo'],
    category: "membre",
    description: "Renvoie des informations sur un utilisateur ou vous même.",
    usage: "[@mention]",
    options: [
        {
            type: 6,
            name: "utilisateur",
            description: "L'utilisateur dont vous souhaitez avoir les informations.",
            required: false,
        }
    ]
}