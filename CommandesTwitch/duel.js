const pendingDuel = require("../bdd/pendingDuel.json");
const { trouverCompteViaTwitch } = require("../function/merseCoinsFunction");
const bddCompte = require("../bdd/compte.json");
const { saveBdd } = require("../function/bdd");

module.exports.run = async(client, channel, user, message, self, args) => {
    if(!args[0]) return client.action(channel, "❌| Vous n'avez pas mis de mise");
    if(isNaN(args[0]) || args[0] < 10) return client.action(channel, "❌| Vous n'avez pas mis un nombre ou votre mise est inférieure à 10");
    const mise = parseInt(args[0]);
    const player1 = user.username;
    const player2 = args.slice(1).join(" ");
    const player1Position = await trouverCompteViaTwitch(player1);
    const player2Position = await trouverCompteViaTwitch(player2);
    if(!player2) return client.action(channel, "❌| Vous n'avez pas mentionné d'utilisateur.");
    if(player1Position === -1) return client.action(channel, "❌| Vous n'avez pas de compte.");
    if(player2Position === -1) return client.action(channel, "❌| Vous n'avez pas mentionné d'utilisateur valide ou l'utilisateur mentionner n'a pas de compte");
    if(bddCompte[player1Position].MerseCoins < mise) return client.action(channel, "❌| Vous n'avez pas assez pour miser");
    if(bddCompte[player2Position].MerseCoins < mise) return client.action(channel, "❌| L'utilisateur ciblé n'a pas assez de MerseCoins");
    let erreur = 0;
    await pendingDuel.forEach((duel, position) => {
        if(duel.player1 === player1 || duel.player2 === player1) {
            erreur = 1;
            return client.action(channel, "❌| Vous avez déjà une demande de duel en cours.");
        } else if(duel.player2 === player2 || duel.player1 === player2) {
            erreur = 1;
            return client.action(channel, "❌| Votre adversaire a déjà une demande de duel en cours.");
        }
    })
    if(erreur === 1) return;
    await pendingDuel.push({player1: player1, player2: player2, mise: parseInt(mise), duelInProgress: false});
    await saveBdd("pendingDuel", pendingDuel);
    client.action(channel, `${player1} défis en duel ${player2}, aura-t-il/elle le courage de l'affronter ?`);
    setTimeout(async () => {
        await pendingDuel.forEach((duel, position) => {
            if(duel.player1 === player1 && duel.player2 === player2 && duel.mise === mise && duel.duelInProgress === false) {
                pendingDuel.splice(position);
                saveBdd("pendingDuel", pendingDuel);
                client.action(channel, `❌| ${player1}, ${player2} a refusé(e) votre duel !`);
            }
        })
    }, 10000)
}

module.exports.help = {
    name: "duel",
    aliases: ['duel'],
    description: "Propose un duel à quelqu'un pourtant de gagner ses MerseCoins",
    cooldown: "10s",
    permissions: false
}