const { EmbedBuilder } = require('discord.js');
const moment = require("moment");

module.exports.runSlash = async(client, interaction) => {
    const embedBotInfo = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setDescription(`Informations concernant : **${client.user.tag}**`)
    .addFields(
        { name: "<:developpeur:1009367951461326898>| Développeur", value: 'flojucv#6188' },
        { name: "<:enlignedepuis:1009367952656703498>| En ligne depuis", value: `${Math.floor(client.uptime / 1000 / 60).toString()} minutes` },
        { name: "<:programmeren:1009367957551464448>| Programmer en", value: "JavaScript" },
        { name: "<:framework:1009367953663332353>| Framework", value: "Node.js" },
        { name: "<:api:1009367948760207390>| API", value: "discord.js" },
        { name: "<:memoireutilise:1009367955135549480>| Mémoire utilisée", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
        { name: "<:serveurs:1009367958776201276>| Serveurs", value: `${client.guilds.cache.size }` },
        { name: "<:creele:1009367950194647120>| Créer le", value: `${moment(interaction.guild.members.cache.find(member => member.id === client.user.id).user.createdAt).format('DD/MM/YYYY')}`}
    )
    .setColor("#B4E0E0")

    return interaction.reply({ embeds: [embedBotInfo]});

}

module.exports.help = {
    name: "botinfo",
    aliases: ['botinfo'],
    category: "membre",
    description: "Renvoie des informations sur le bot",
}