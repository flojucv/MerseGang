const bddCompte = require("../bdd/compte.json");


module.exports.run = async(client, channel, user, message, self, args) => {
    let PIB = 0;
    bddCompte.forEach(compte => {
        PIB += compte.MerseCoins;
    })

    client.action(channel, `Il y a ${PIB} MerseCoins en circulations`);
}

module.exports.help = {
    name: "pib",
    aliases: ['pib'],
    cooldown : "1s",
    description: "Permet de connaître le montant total de mersecoins en circulation",
    permissions: false
}