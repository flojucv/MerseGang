const db = require('../../function/db');

module.exports.run = async (client, channel, user, message, self, args) => {
    const sqlVerifMariage = "SELECT * FROM compte WHERE twitch = ?";
    const responseVerif = await db.query(sqlVerifMariage, [user.username]);

    if (responseVerif.length === 0) return client.action(channel, "❌| Vous n'avez pas de compte.");
    if (responseVerif.length > 1) return client.action(channel, "[ERROR] Plusieurs comptes ont été trouvés");
    if (responseVerif[0].mariage === null) return client.action(channel, "❌| Vous devez être mariés pour divorcer.");

    const sqlUpdateDivorce = "UPDATE compte SET mariage = NULL, mersecoins = ? WHERE twitch = ? OR twitch = ?";
    await db.query(sqlUpdateDivorce, [(responseVerif[0].mersecoins / 2), responseVerif[0].twitch, responseVerif[0].mariage]);

    return client.action(channel, `💔| Oh non, ${user.username} vient de divorcer avec ${responseVerif[0].mariage}.`);
}

module.exports.help = {
    name: "divorce",
    aliases: ['divorce'],
    cooldown: "30s",
    description: "Permet de divorce d'une personne mariée.",
    permissions: false
}