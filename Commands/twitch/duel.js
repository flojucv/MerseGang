const pendingDuel = require("../../bdd/pendingDuel.json");
const db = require('../../function/db');
const { saveBdd } = require('../../function/bdd');

module.exports.run = async (client, channel, user, message, self, args) => {
    if (!args[0]) return client.action(channel, "❌| Vous n'avez pas mis de mise");
    if (isNaN(args[0]) || args[0] < 10) return client.action(channel, "❌| Vous n'avez pas mis un nombre ou votre mise est inférieure à 10");
    const mise = parseInt(args[0]);
    const player1 = user.username;
    const mentionRegex = /@(\w+)/g;
    const mentionedUsers = message.match(mentionRegex);
    const player2 = mentionedUsers[0].substring(1).toLowerCase();
    if (!mentionedUsers[0]) return client.action(channel, "❌| Vous n'avez pas mentionné d'utilisateur.");

    const sqlPlayer1 = "SELECT * FROM compte WHERE twitch = ?";
    let player1Compte = await db.query(sqlPlayer1, [player1]);
    const sqlPlayer2 = "SELECT * FROM compte WHERE twitch = ?";
    let player2Compte = await db.query(sqlPlayer2, [player2]);
    if (player1Compte.length === 0) return client.action(channel, "❌| Vous n'avez pas de compte.");
    if (player1Compte.length > 1) return client.action(channel, "[ERROR] Plusieurs compte on était trouvées;");
    player1Compte = player1Compte[0];
    if (player2Compte.length === 0) return client.action(channel, "❌| Vous n'avez pas mentionné d'utilisateur valide ou l'utilisateur mentionner n'a pas de compte.");
    if (player2Compte.length > 1) return client.action(channel, "[ERROR] Plusieurs compte on était trouvées.");
    player2Compte = player2Compte[0];
    if (player1Compte.mariage != null) {
        if (player1Compte.mariage == player2Compte.twitch) return client.action(channel, "❌| Vous ne pouvez pas défier la personne avec qui vous êtes mariés.")
    }

    if (player1Compte.mersecoins < mise) return client.action(channel, "❌| Vous n'avez pas assez pour miser");
    if (player2Compte.mersecoins < mise) return client.action(channel, "❌| L'utilisateur ciblé n'a pas assez de MerseCoins");
    let erreur = 0;
    await pendingDuel.forEach((duel, position) => {
        if (duel.player1 === player1 || duel.player2 === player1) {
            erreur = 1;
            return client.action(channel, "❌| Vous avez déjà une demande de duel en cours.");
        } else if (duel.player2 === player2 || duel.player1 === player2) {
            erreur = 1;
            return client.action(channel, "❌| Votre adversaire a déjà une demande de duel en cours.");
        }
    })
    if (erreur === 1) return;
    await pendingDuel.push({ player1: player1, player2: player2, mise: parseInt(mise), duelInProgress: false });
    await saveBdd("pendingDuel", pendingDuel);
    client.action(channel, `${player1} défi en duel ${player2}, aura-t-il/elle le courage de l'affronter ? Si tu souhaites te battre fait &accept.`);

    setTimeout(async () => {
        await pendingDuel.forEach((duel, position) => {
            if (duel.player1 === player1 && duel.player2 === player2 && duel.mise === mise && duel.duelInProgress === false) {
                pendingDuel.splice(position);
                saveBdd("pendingDuel", pendingDuel);
                client.action(channel, `❌| ${player1}, ${player2} a refusé(e) votre duel !`);
            }
        })
    }, 30000)
}

module.exports.help = {
    name: "duel",
    aliases: ['duel'],
    description: "Propose un duel à quelqu'un, mais arrivera tu à le battre pour gagner ses MerseCoins ?",
    cooldown: "10s",
    permissions: false
}