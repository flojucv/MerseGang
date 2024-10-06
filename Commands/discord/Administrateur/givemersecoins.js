const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../../function/db');
const { addMerseCoins } = require('../../../function/merseCoinsFunction');

module.exports.runSlash = async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const target = interaction.options.getUser("user");
    const nombre = interaction.options.getNumber("nombre");

    const sql = "SELECT * FROM compte WHERE discord = ?";
    const response = await db.query(sql, [target.id]);

    if (response.length === 0) return interaction.reply({ content: "❌| L'utilisateur n'a pas de compte.", ephemeral: true });
    if(response.length > 1) return interaction.reply({ content: "❌| Plusieur utilisateur trouver.", ephemeral: true });

    addMerseCoins(response[0].twitch, parseInt(nombre), true);
    interaction.reply({ content: `✅| ${nombre} <:mersecoins:1135490066194645002> ont été donné a ${target.tag}.`, ephemeral: true });
}

module.exports.help = {
    name: "addmersecoins",
    aliases: ['addMerseCoins'],
    category: "administrateur",
    description: "Permet d'ajouter des merseCoins a un utilisateur.",
    usage: "<@user> <nombre>",
    options: [
        {
            name: "user",
            description: "L'utilisateur a qui vous souhaitez ajouter des merseCoins.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "nombre",
            description: "Le nombre de merseCoins que vous souhaitez ajoutée a l'utilisateur.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }

    ],
    default_member_permissions: PermissionsBitField.Flags.Administrator
}