const db = require('../../function/db');


module.exports.run = async (client, channel, user, message, self, args) => {
    const sql = "SELECT SUM(calcmersecoins) AS PIB FROM ((SELECT SUM(mersecoins) AS calcmersecoins FROM compte WHERE mariage IS NULL) UNION ALL (SELECT SUM(mersecoins)/2 AS calcmersecoins FROM compte WHERE mariage IS NOT NULL))t;";
    const response = await db.query(sql);
    client.action(channel, `Il y a ${Math.floor(response[0].PIB)} MerseCoins en circulations`);
}

module.exports.help = {
    name: "pib",
    aliases: ['pib'],
    cooldown: "1s",
    description: "Permet de connaître le montant total de mersecoins en circulation",
    permissions: false
}