const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports.run = async(client, message, args) => {
    message.delete();
    if(!message.guild.members.cache.get(message.author.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("❌| Vous n'avez pas la permissions d'utilisez cette commande.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    if(!args[0]) return message.channel.send("❌| Vous n'avez pas mentionnez si vous validez ou refuser l'idée.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    if(!(args[0] === "valide" || args[0] === "refuse")) return message.channel.send("❌| Vous devez mettre valide ou refuse.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    if(!args[1]) return message.channel.send("❌| Vous n'avez pas mit l'id du message.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    if(!isNaN(args[0])) return message.channel.send("❌| L'id du message est un nombre.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    let messageEdit = await message.guild.channels.cache.find(channel => channel.id === "1009370795178459156").messages.fetch(args[1]).catch(err => {
        return message.channel.send("❌| L'id rentrer est invalide.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    });
    if(!messageEdit) return

    const embedEditIdee = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter(messageEdit.embeds[0].footer)
    .setFields(messageEdit.embeds[0].fields)

    if(args[0] === "refuse") {
        embedEditIdee.setColor("Red")
        embedEditIdee.setDescription("L'idée a été refusé par l'équipe de moderation.")
    } else {
        embedEditIdee.setColor('Green')
        embedEditIdee.setDescription("L'idée a été accepté par l'équipe de moderation.")
    }

    messageEdit.edit({embeds:  [embedEditIdee]})
}

module.exports.runSlash = async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });
    const valideOrRefuse = interaction.options.getString("choix");
    const idMessage = interaction.options.getString('id_message');

    console.log(idMessage)
    if(isNaN(idMessage)) return interaction.reply({content: "❌| L'id doit être un nombre.", ephemeral: true });

    let messageEdit = await interaction.guild.channels.cache.find(channel => channel.id === "1009370795178459156").messages.fetch(idMessage).catch(err => {
        return interaction.reply({content: "❌| L'id rentrer est invalide.", ephemeral: true});
    });
    if(!messageEdit) return

    const embedEditIdee = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG"} )
    .setFooter(messageEdit.embeds[0].footer)
    .setFields(messageEdit.embeds[0].fields)

    if(valideOrRefuse === "refuse") {
        embedEditIdee.setColor("Red")
        embedEditIdee.setDescription("L'idée a été refusé par l'équipe de moderation.")
    } else {
        embedEditIdee.setColor('Green')
        embedEditIdee.setDescription("L'idée a été accepté par l'équipe de moderation.")
    }

    messageEdit.edit({embeds:  [embedEditIdee]})
    interaction.reply({content: "✅| Message changer.", ephemeral: true})

}

module.exports.help = {
    name: "adminidée",
    aliases: ['adminproposition'],
    category: "administrateur",
    description: "Valide ou refuse une idée.",
    usage: "<valide/refuse> <ID_message>",
    options: [
        {
            type: 3,
            required: true,
            name: 'id_message',
            description: 'Mettez l\'id du message de l\'id.',
        },
        {
            type: 3,
            required: true,
            name: 'choix',
            description: 'Choisissez si vous validez ou refusez une idée.',
            choices: [
                {
                    name: "valide",
                    value: "valide"
                },
                {
                    name: "refuse",
                    value: "refuse"
                }
            ]
        }
    ]
}