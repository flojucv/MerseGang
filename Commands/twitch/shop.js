const { addMerseCoins } = require("../../function/merseCoinsFunction");
const indexFile = require("../../index");
const db = require('../../function/db');

module.exports.run = async (client, channel, user, message, self, args) => {
    const sqlShop = "SELECT * FROM shop";
    const shop = await db.query(sqlShop);

    if (!args[0]) {
        if (shop.length === 0) {
            return client.action(channel, "Le shop est vide... (Mersedi est un flemmard...)");
        }

        client.action(channel, "Si tu veut voir le shop rend toi sur le discord ou regarde via se lien : https://mersegang.flojucvcreator.fr/shop ");
    } else {
        if (isNaN(args[0])) return client.action(channel, "❌| Vous n'avez pas mis le numéro de l'article à acheter.");
        if (args[0] < 1 || args[0] > shop.length) return client.action(channel, `❌| Vous devez rentrer un nombre compris entre 1 et ${shop.length}.`);
        const article = shop.filter((article) => article.id_shop == args[0])[0];
        const pseudo = user.username;

        console.log(shop)
        console.log(article);
        if (!article) return client.action(channel, "❌| Aucun article trouvée");
        const sqlCompte = "SELECT * FROM compte WHERE twitch = ?";
        const comptes = await db.query(sqlCompte, [pseudo]);
        if (comptes.length == 0) {
            return client.action(channel, "❌| Vous n'avez pas de compte.");
        } else if (comptes.length > 1) {
            return client.action(channel, "[ERROR] Plusieurs comptes trouvée.");
        } else {
            const compte = comptes[0];
            if (compte.mersecoins < article.prix)
                return client.action(channel, "❌| Vous n'avez pas assez de MerseCoins.");
            else {
                addMerseCoins(compte.twitch, -parseInt(article.prix));
                indexFile.sendMsgTwitch(`L'utilisateur ${compte.twitch} a acheter ${article.article_name} !!`);
            }
        }

    }

}

module.exports.help = {
    name: "shop",
    aliases: ['shop'],
    cooldown: "1m",
    description: "Que vas-tu acheter avec tes MerseCoins ?",
    permissions: false
}