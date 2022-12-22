const bddShop = require("../bdd/shop.json");
const bddCoins = require("../bdd/coins.json");
const { saveBdd } = require("../function/bdd.js");
const indexFile = require("../index");


module.exports.run = async (client, channel, user, message, self, args) => {
    if (!args[0]) {

        if(bddShop.length === 0) {
            return client.action(channel, "Le shop est vide... (Mersedi est un flemmard...)");
        }

        client.action(channel, "Si tu veut voir le shop rend toi sur le discord ou regarde via se lien : https://flojucvsitewebcreators.on.drv.tw/MerseGang%20site%20shop/ ");
    } else {
        if (isNaN(args[0])) return client.action(channel, "❌| Vous n'avez pas mis le numéro de l'article à acheter.");
        if (args[0] < 1 || args[0] > bddShop.length) returnclient.action(channel, `❌| Vous devez rentrer un nombre compris entre 1 et ${bddShop.length}.`);
        const article = args[0] -1;
        const pseudo = user['display-name'];
        if (bddCoins[pseudo] === undefined)
            return client.action(channel, "❌| Vous n'avez pas de MerseCoins.");
        else {
            if(bddCoins[pseudo] < bddShop[article].prix)
                return client.action(channel, "❌| Vous n'avez pas assez de MerseCoins.");
            else {
                bddCoins[pseudo] -= bddShop[article].prix;
                saveBdd("coins", bddCoins);
                indexFile.sendMsgTwitch(`/announce L'utilisateur ${pseudo} a acheter ${bddShop[article].name} !!`);
            }
        }

    }

}

module.exports.help = {
    name: "shop",
    cooldown : "1m",
    description: "Que vas-tu acheter avec tes MerseCoins ?",
    permissions: false
}