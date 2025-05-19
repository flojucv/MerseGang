const { addMerseCoins } = require("../../function/merseCoinsFunction");
const twitchJson = require('../../bdd/twitch.json');
const db = require('../../function/db');
const { saveBdd } = require("../../function/bdd");


module.exports.run = async (client, channel, user, message, self, args) => {
    if (!args[0]) return client.action(channel, "❌| Vous n'avez pas misé !");
    if (isNaN(args[0])) return client.action(channel, "❌| Vous n'avez pas misé un nombre !");
    const mise = parseInt(args[0]);

    const sql = "SELECT * FROM compte WHERE twitch = ?";
    const response = await db.query(sql, [user.username]);
    if (response.length === 0) return client.action(channel, "❌| Vous n'avez pas créez de compte !");
    if (response.length > 1) return client.action(channel, "[ERROR] Plusieurs comptes trouvées.");
    if (response[0].mersecoins < mise) return client.action(channel, "❌| Vous n'avez pas assez d'argent !");
    if (10 > mise) return client.action(channel, "❌| Vous ne pouvez pas misé en dessous de 10 MerseCoins !");

    addMerseCoins(response[0].twitch, -mise);
    const choix = ["gagner", "perdue"];
    const definirChoix = choix[Math.floor(Math.random() * choix.length)];

    switch (definirChoix) {
        case 'gagner':
            const gains = addMerseCoins(response[0].twitch, mise * 2, true);
            return client.action(channel, `✅| Vous avez gagné ! Vous avez gagné ${gains} MerseCoins`);
        case 'perdue':
            twitchJson.qod += mise;
            saveBdd('twitch', twitchJson);
            return client.action(channel, `❌| Vous avez perdu ! Votre mise était de ${mise} MerseCoins`);
    }
}

module.exports.help = {
    name: "quitoudouble",
    aliases: ['qod'],
    cooldown: "15m",
    description: "Doublez votre mise ou perdez tout ! (mise minimale : 10 MerseCoins)",
    permissions: false,
}