const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const { prefix } = require('../../../bdd/config.json');
const { readdirSync } = require("fs");
const categoryList = readdirSync('./Commands/discord/');

module.exports.runSlash = async(client, interaction) => {
    if(interaction.options.getString('commande') === null) {
        const embedHelp = new EmbedBuilder()
        .setURL('https://mersegang.flojucvcreator.fr/help')
        .setColor("#2B2D31")
        .addFields({name: "Liste des commandes", value: `Une liste de toutles les sous-catégories disponibles et leurs commandes.\nPour plus d'informations sur une commande, tapez \`${prefix}help <commande_name>\`.`})

        for(const category of categoryList) {
            if(category == "Administrateur") {
                if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    embedHelp.addFields({
                        name: `${category}`,
                        value: `\`${client.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => cmd.help.name).join('\` \`')}\``
                    });
                }
            } else {
                embedHelp.addFields({
                    name: `${category}`,
                    value: `\`${client.commands.filter(cat => cat.help.category === category.toLowerCase()).map(cmd => cmd.help.name).join('\` \`')}\``
                });
            }
        };

        return interaction.reply({ embeds:[embedHelp], ephemeral : true})
    }else{
        const cmd = client.commands.get(interaction.options.getString('commande')) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(interaction.options.getString('commande')));
        if(!cmd) return interaction.reply({ content: "❌| la commande rentrer n'existe pas", ephemeral: true});
        const embedHelp = new EmbedBuilder()
        .setURL('https://mersegang.flojucvcreator.fr/help')
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
            type: ApplicationCommandOptionType.String,
            name: 'commande',
            description: 'Renseignez la commande dont vous souhaitez avoir la page d\'aide.',
            required: false
        }
    ]
}