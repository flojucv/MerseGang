const pendingMariage = require("../../bdd/pendingMariage.json");
const { saveBdd } = require("../../function/bdd");
const { addMerseCoins } = require("../../function/merseCoinsFunction");
const db = require('../../function/db');


module.exports.run = async (client, channel, user, message, self, args) => {
    await pendingMariage.forEach(async (mariage, position) => {
        if (mariage.marier2 === user.username && mariage.pending === true) {
            mariage.pending = false;
            saveBdd("pendingMariage", pendingMariage);

            const sqlMarier = "SELECT * FROM compte WHERE twitch = ? OR twitch = ?";
            const response = await db.query(sqlMarier, [mariage.marier1, mariage.marier2]);
            if (response.length == 0) return client.action(channel, "❌| Vous n'avez pas de compte.");
            if (response.length < 2) return client.action(channel, "❌| Vous ou l'utilisateur que vous souhaitez marier n'avez pas de compte.");
            if (response.length > 2) return client.action(channel, "[ERROR] Plusieurs comptes ont été trouvés.");
            if (response[0].mariage != null) return client.action(channel, "Vous êtes déjà mariés, vous devez divorcer avant de vous remarier.")
            if (response[1].mariage != null) return client.action(channel, "❌| L'utilisateur que vous souhaitez épouser est déjà marié.");
            const marier1 = response[0];
            const marier2 = response[1];

            const sqlUpdateMarier1 = "UPDATE compte SET mariage = ?, mersecoins = ? WHERE twitch = ?";
            await db.query(sqlUpdateMarier1, [marier2.twitch, (marier1.mersecoins + marier2.mersecoins), marier1.twitch]);
            const sqlUpdateMarier2 = "UPDATE compte SET mariage = ?, mersecoins = ? WHERE twitch = ?";
            await db.query(sqlUpdateMarier2, [marier1.twitch, (marier1.mersecoins + marier2.mersecoins), marier2.twitch]);

            pendingMariage.splice(position);
            saveBdd("pendingMariage", pendingMariage);

            return client.action(channel, `💍| ${marier2.twitch} à accepter la demande en mariage de ${marier1.twitch} !!`);
        }
    })
}

module.exports.help = {
    name: "acceptMariage",
    aliases: ['mariageAccept'],
    description: "Permet d'accepter une demande en mariage lancer par un autre utilisateur",
    cooldown: "10s",
    permissions: false,
}