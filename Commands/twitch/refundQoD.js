const twitchJson = require('../../bdd/twitch.json');
const { saveBdd } = require('../../function/bdd');
const { addMerseCoins } = require('../../function/merseCoinsFunction');


module.exports.run = async (client, channel, user, message, self, args) => {
    if(twitchJson.qod != 0) {
        const randomUser = twitchJson.listeUser[Math.floor(Math.random() * twitchJson.listeUser.length)];
        const refund = Math.floor(twitchJson.qod * 0.3);

        addMerseCoins(randomUser, refund, false);

        twitchJson.qod = 0;
        saveBdd('twitch', twitchJson);

        console.log(`Remboursement de ${refund} MerseCoins a ${randomUser}`);
        client.action(channel, `✅| ${randomUser} a gagné 30% des mersecoins perdu au Quit ou Double (${refund} MerseCoins) !`);
    } else {
        client.action(channel, "❌| Il n'y a pas de mersecoins a rembourser !");
    }
}

module.exports.help = {
    name: "refundQoD",
    aliases: ['rQoD', 'rQod'],
    cooldown: "1s",
    description: "Permet de rembourser 30% a un joueur aléatoire",
    permissions: "users",
    users: ["flojucv", "mersedi_"]
}