const bddCompte = require("../bdd/compte.json");
const { trouverCompteViaTwitch } = require("../function/merseCoinsFunction");

module.exports.run = async(client, channel, user, message, self, args) => {
    const position = await trouverCompteViaTwitch(user.username);
    if(position === -1) {
        client.action(channel, `Vous n'avez pas de compte.`);
    }else {
        client.action(channel, `Vous avez ${bddCompte[position].MerseCoins} MerseCoins`);
    }
}

module.exports.help = {
    name: "compte",
    cooldown : "1m",
    description: "Combien de MerseCoins a tu ?",
    permissions: false
}