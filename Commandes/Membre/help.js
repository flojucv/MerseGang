const { EmbedBuilder } = require("discord.js");
const { prefix } = require('../../bdd/config.json');
const { readdirSync } = require("fs");
const categoryList = readdirSync('./Commandes');

module.exports.run = async(client, message, args) => {
    message.delete();
    if(!args.length) {
        const embedHelp = new EmbedBuilder()
        .setColor("Random")
        .addFields({name: "Liste des commandes", value: `Une liste de toutles les sous-catégories disponibles et leurs commandes.\nPour plus d'informations sur une commande, tapez \`${prefix}help <commande_name>\`.`})

        for(const category of categoryList) {
            embedHelp.addFields({
                name: `${category}`,
                value: `\`${client.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => cmd.help.name).join('\` \`')}\``
            });
        };

        return message.channel.send({ embeds:[embedHelp]});
    }else{
        const cmd = client.commands.get(args[0]) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0]));

        if(!cmd) return message.channel.send("❌| La commande renseignez n'existe pas").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
        const embedHelp = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`\`${cmd.help.name}\``)
        .addFields({name: "Description",value:  `${cmd.help.description}`})
        .addFields({name: "Utilisation",value: `${cmd.help.usage ? `${prefix}${cmd.help.name} ${cmd.help.usage}` : `${prefix}${cmd.help.name}`}`})

        if(!(cmd.help.aliases[0] === cmd.help.name)) embedHelp.addFields({name: 'Alias', value: `${cmd.help.aliases.join(", ")}`, inline: true});
        return message.channel.send({ embeds:[embedHelp]});
    }
}

module.exports.runSlash = async(client, interaction) => {
    if(interaction.options.getString('commande') === null) {
        const embedHelp = new EmbedBuilder()
        .setColor("Random")
        .addFields({name: "Liste des commandes", value: `Une liste de toutles les sous-catégories disponibles et leurs commandes.\nPour plus d'informations sur une commande, tapez \`${prefix}help <commande_name>\`.`})

        for(const category of categoryList) {
            embedHelp.addFields({
                name: `${category}`,
                value: `\`${client.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => cmd.help.name).join('\` \`')}\``
            });
        };

        return interaction.reply({ embeds:[embedHelp], ephemeral : true})
    }else{
        const cmd = client.commands.get(interaction.options.getString('commande')) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(interaction.options.getString('commande')));
        if(!cmd) return interaction.reply({ content: "❌| la commande rentrer n'existe pas", ephemeral: true});
        const embedHelp = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`\`${cmd.help.name}\``)
        .addFields({name: "Description", value: `${cmd.help.description}`})
        .addFields({name: "Utilisation", value: `${cmd.help.usage ? `${prefix}${cmd.help.name} ${cmd.help.usage}` : `${prefix}${cmd.help.name}`}`})

        if(!(cmd.help.aliases[0] === cmd.help.name)) embedHelp.addFields({name: 'Alias', value: `${cmd.help.aliases.join(", ")}`, inline: true});
        return interaction.reply({ embeds:[embedHelp], ephemeral : true});
    }
}

module.exports.help = {
    name: "help",
    aliases: ['aide', "h"],
    category: "membre",
    description: "Commande d'aide, pour avoir tout les commandes",
    usage: "<command_name>",
    options: [
        {
            type: 3,
            name: 'commande',
            description: 'Renseignez la commande dont vous souhaitez avoir la page d\'aide.',
            required: false
        }
    ]
}