const { EmbedBuilder } = require("discord.js");

module.exports.run = async(client, message, args) => {
    message.delete();
    if(!args[0]) return message.channel.send("❌| Vous n'avez pas mit votre idée.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    const idee = args.join('');
    if(idee.length > 1024) return message.channel.send("❌| Votre message doit faire moins de 1024 caractères.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    
    const embedIdee = new EmbedBuilder()
    .setColor('Blurple')
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter({text: `Idée proposez par : ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
    .setTimestamp()
    .addFields(
        {  name: `Idée proposez par **${message.author.username}** :`, value: `${idee}` },
        { name: `Réaction :`, value: `🟢| Oui\n⚪| Pas d'avis\n🔴| Non` }
    )

    message.guild.channels.cache.find(channel => channel.id === "1009370795178459156").send({ embeds: [embedIdee] }).then(async msg => {
        await msg.react("🟢");
        await msg.react("⚪");
        await msg.react("🔴");
    })
}

module.exports.runSlash = async(client, interaction) => {

    const idee = interaction.options.getString('idee');
    if(idee.length > 1024) return interaction.reply({content: "❌| Votre message doit faire moins de 1024 caractères.", ephemeral: true });

    console.log(idee)
    const embedIdee = new EmbedBuilder()
    .setColor('Blurple')
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter({text: `Idée proposez par : ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
    .setTimestamp()
    .addFields(
        {  name: `Idée proposez par **${interaction.user.username}** :`, value: idee },
        { name: `Réaction :`, value: `🟢| Oui\n⚪| Pas d'avis\n🔴| Non` }
    )

    interaction.guild.channels.cache.find(channel => channel.id === "822187286552117308").send({ embeds: [embedIdee] }).then(async msg => {
        await msg.react("🟢");
        await msg.react("⚪");
        await msg.react("🔴");
    })
    interaction.reply({ content: "✔| Votre idée a été postez <#1009370795178459156>", ephemeral: true });

}

module.exports.help = {
    name: "idée",
    aliases: ['proposition'],
    category: "membre",
    description: "Envoie votre idée dans le channel <#1009370795178459156>.",
    usage: "<idée>",
    options: [
        {
            type: 3,
            required: true,
            name: 'idee',
            description: 'Mettez votre idée ici.'
        }
    ]
}