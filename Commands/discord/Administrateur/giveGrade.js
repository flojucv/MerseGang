const { PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../../function/db');

module.exports.runSlash = async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const target = interaction.options.getUser("user");
    const gradeString = interaction.options.getString("grade");

    const sqlCompte = 'SELECT * FROM compte WHERE discord = ?';
    const responseCompte = await db.query(sqlCompte, [target.id]);

    if(responseCompte.length === 0) return interaction.reply({ content: "❌| L'utilisateur n'a pas de compte", ephemeral: true });
    if(responseCompte.length > 1) return interaction.reply({ content: "❌| Plusieurs comptes trouvés pour cet utilisateur.", ephemeral: true });

    const sqlGrade = 'SELECT * FROM grade WHERE grade_name = ?';
    const responseGrade = await db.query(sqlGrade, [gradeString.toLowerCase()]);

    if(responseGrade.length === 0) return interaction.reply({ content: "❌| Le grade n'existe pas", ephemeral: true });
    if(responseGrade.length > 1) return interaction.reply({ content: "❌| Plusieur grade on été trouvez", ephemeral: true });

    const sqlFinal = "UPDATE compte SET grade = ? WHERE twitch = ?";
    const response = await db.query(sqlFinal, [responseGrade[0].id_grade, responseCompte[0].twitch]);

    if(response) {
        return interaction.reply({content: `✅| Le grade ${gradeString} a été donner à ${target.username}`, ephemeral: true });
    } else {
        return interaction.reply({ content: "❌| Une erreur est survenue, merci de contactez un administrateur.", ephemeral: true });
    }


}

module.exports.help = {
    name: "givegrade",
    aliases: ['giveGrade'],
    category: "administrateur",
    description: "Permet de changer le grade d'un utilisateur.",
    usage: "<@user> <grade>",
    options: [
        {
            name: "user",
            description: "L'utilisateur a qui vous souhaitez donner un grade.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "grade",
            description: "Le grade que vous souhaitez donner a l'utilisateur.",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    default_member_permissions: PermissionsBitField.Flags.Administrator
}