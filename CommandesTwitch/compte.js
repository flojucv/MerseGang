const bddCoins = require("../bdd/coins.json");

module.exports.run = async(client, channel, user, message, self, args) => {
    if(bddCoins[user['display-name']] === undefined) {
        client.action(channel, `Vous avez 0 MerseCoins`);
    }else {
        client.action(channel, `Vous avez ${bddCoins[user['display-name']]} MerseCoins`);
    }
}

module.exports.help = {
    name: "compte",
    cooldown : "1m",
    description: "Combien de MerseCoins a tu ?",
    permissions: false
}