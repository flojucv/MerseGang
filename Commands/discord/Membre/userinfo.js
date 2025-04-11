const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../../function/db');
const moment = require("moment");

module.exports.runSlash = async(client, interaction) => {
    let member = interaction.member;
    let link, money, grade;
    const target = interaction.options.getUser('utilisateur');
    if(target) member = interaction.guild.members.cache.find(member => member.id === target.id);
    const user = member.user;

    const sql = "SELECT * FROM compte INNER JOIN grade ON grade.id_grade = compte.grade WHERE discord = ?";
    const response = await db.query(sql, [user.id]);
    
    if( response.length == 0) { link = "Non lier"; money = 0; grade = "aucun"; mariage = "Célibataire"} else { link = response[0].twitch; money = response[0].mersecoins; grade = response[0].grade_name; mariage = response[0].mariage; };

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
        { name: "Mariage :", value: `${mariage}` }
    )
    .setFooter({text: `Commande executez par ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
    .setTimestamp();

    return interaction.reply({embeds: [embedUserInfo]})

}

module.exports.help = {
    name: "userinfo",
    aliases: ['userinfo'],
    category: "membre",
    description: "Renvoie des informations sur un utilisateur ou vous même.",
    usage: "[@mention]",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "utilisateur",
            description: "L'utilisateur dont vous souhaitez avoir les informations.",
            required: false,
        }
    ]
}