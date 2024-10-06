const db = require('../../../function/db');
const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");

module.exports.runSlash = async (client, interaction) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const target = interaction.options.getString("utilisateur");
    if(!target) return interaction.reply({content: "❌| Vous n'avez pas mentionné d'utilisateur", ephemeral: true});

    const mode = interaction.options.getString('mode');
    if(!mode) return interaction.reply({content: "❌| Vous n'avez pas mentionné de mode (discord/twitch)", ephemeral: true });

    let sql = "";

    switch(mode) {
        case "discord" :
            sql = "SELECT * FROM compte WHERE discord = ?";
            break;
        case "twitch" :
            sql = "SELECT * FROM compte WHERE twitch = ?";
            break;
        default :
            return interaction.reply({content: "❌| Le mode spécifier n'est pas valide.", ephemeral: true });
    }

    const response = await db.query(sql, [target]);

    if(response.length == 0) {
        return interaction.reply({content: "❌| Il n'y a pas de compte pour cet utilisateur.", ephemeral: true });
    } else if(response.length > 1) {
        return interaction.reply({content: "❌| Plusieur compte on été trouver pour cet utilisateur.", ephemeral: true });
    }

    const sqlDelete = "DELETE FROM compte WHERE twitch = ?";
    await db.query(sqlDelete, [response[0].twitch]);
    return interaction.reply({content: "✅| Le compte a bien été supprimé", ephemeral: true});
}

module.exports.help = {
    name: "supprimercompte",
    aliases: ['deletecompte'],
    category: "administrateur",
    description: "Permet de supprimer le compte d'un utilisateur via son pseudo discord",
    usage: "<@user> <mode discord/twitch>",
    options: [
        {
            name: "utilisateur",
            description: "L'utilisateur à qui vous supprimez le compte. (Si c'est discord mettre l'id)",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "mode",
            description: "Si c'est l'id discord ou le pseudo twitch",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "discord",
                    value: "discord"
                },
                {
                    name: "twitch",
                    value: "twitch"
                }
            ]
        }
    ],
    default_member_permissions: PermissionsBitField.Flags.Administrator
}