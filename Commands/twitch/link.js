const discordClient = require('../../Connect/discordConnect');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require('../../bdd/config.json');
const db = require('../../function/db');

module.exports.run = async (client, channel, user, message, self, args) => {

    if (!args[0]) return client.action(channel, `❌| ${user["display-name"]}, Vous n'avez pas renseignez votre compte discord. [📛 1m]`);
    const sql = "SELECT * FROM compte WHERE twitch = ?";
    const response = await db.query(sql, [user.username]);

    if (response.length >= 1) return client.action(channel, `❌| Vous avez déjà un compte. [📛 1m]`);

    const guild = discordClient.guilds.cache.get(config.idGuild);
    await guild.members.fetch().then(console.log("member fetch !"));
    const researchUser = await guild.members.cache.find((member) => member.user.tag == args.join(" "));
    if (!researchUser) {
        return client.action(channel, `❌| ${user.username}, Le compte discord n'existe pas.`);
    } else {
        const embedConfirm = new EmbedBuilder()
            .setTitle("Confirmation lien twitch ↔ discord")
            .setTimestamp()
            .setDescription("Attention se message se supprimera au bout d'une minute\nPour accepter la liaison cliquez sur le bouton confirmer")
            .setColor("#5B3EBA")

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Confirmer")
                    .setCustomId(`confirmLink;${user.username}`)
                    .setStyle(ButtonStyle.Success)
            )
        return researchUser.send({ embeds: [embedConfirm], components: [row] }).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 60000); }).then(message => {
            client.action(channel, `✅| ${user.username}, Retourne voir sur discord, tu as reçu un message !`);
        });
    }
}

module.exports.help = {
    name: "link",
    aliases: ['link'],
    cooldown: "1s",
    description: "Permet de lier son compte twitch et discord pour les points de chaine",
    permissions: false
}