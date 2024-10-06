const pendingDuel = require("../../bdd/pendingDuel.json");
const { saveBdd } = require("../../function/bdd");
const { getRandomInt, trouverCompteViaTwitch, addMerseCoins } = require("../../function/merseCoinsFunction");
const db = require('../../function/db');


module.exports.run = async (client, channel, user, message, self, args) => {
    await pendingDuel.forEach(async (duel, position) => {
        if (duel.player2 === user.username && duel.duelInProgress === false) {
            duel.duelInProgress = true;
            saveBdd("pendingDuel", pendingDuel);
            const scorePlayer1 = (await getRandomInt(1, 7) + await getRandomInt(1, 7));
            const scorePlayer2 = (await getRandomInt(1, 7) + await getRandomInt(1, 7));
            if (scorePlayer1 > scorePlayer2) {
                client.action(channel, `Le gagnant du grand duel est ${duel.player1}, il/elle remporte ${duel.mise} !`);
                addMerseCoins(duel.player1, duel.mise);
                addMerseCoins(duel.player2, -duel.mise);
            } else if (scorePlayer2 > scorePlayer1) {
                client.action(channel, `Le gagnant du grand duel est ${duel.player2}, il/elle remporte ${duel.mise} !`);
                addMerseCoins(duel.player2, duel.mise);
                addMerseCoins(duel.player1, -duel.mise);
            } else {
                client.action(channel, `Oh non, les deux combattants sont tombés au sol personne n'a gagné.`);
            }
            pendingDuel.splice(position);
            saveBdd("pendingDuel", pendingDuel);
        }
    })
}

module.exports.help = {
    name: "accept",
    aliases: ['duelAccept'],
    description: "Permet d'accepter un duel lancé par quelqu'un",
    cooldown: "10s",
    permissions: false,
}