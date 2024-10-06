
const { trouverCompteViaTwitch } = require("../../function/merseCoinsFunction");
const db = require('../../function/db');

module.exports.run = async (client, channel, user, message, self, args) => {
    const sql = "SELECT * FROM compte WHERE twitch = ?";
    const response = await db.query(sql, [user.username])

    if (response.length == 0) {
        client.action(channel, `❌| Vous n'avez pas de compte.`);
    } else if (response.length > 1) {
        client.action(channel, `[ERROR] Plusieurs comptes ont été trouvés.`)
    } else {
        client.action(channel, `Vous avez ${response[0].mersecoins} MerseCoins`);
    }
}

module.exports.help = {
    name: "compte",
    aliases: ['compte'],
    cooldown: "1m",
    description: "Combien de MerseCoins a tu ?",
    permissions: false
}