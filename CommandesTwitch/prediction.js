const bddPrediction = require("../bdd/prediction.json");
const bddCoins = require("../bdd/coins.json");
const { saveBdd } = require("../function/bdd.js");

module.exports.run = async(client, channel, user, message, self, args) => {
    if(bddPrediction.termine) return client.action(channel, "❌| Il n'y a pas de prédiction en cours.");

    if(!args[0]) return client.action(channel, "❌| Vous n'avez pas mit votre choix 'choix1' ou 'choix2'");
    if(!(args[0] === "choix1" || args[0] === "choix2")) return client.action(channel, "❌| Vous n'avez pas mit votre choix 'choix1' ou 'choix2'");
    if(!args[1]) return client.action(channel, "❌| Vous n'avez pas mit votre mise");
    if(isNaN(args[1])) return client.action(channel, "❌| Vous devez mettre un chiffre");
    if(args[1] <= 9) return client.action(channel, "❌| Vous ne pouvez pas mise en dessous de 10 MerseCoins");

    if(bddCoins[user.username] === undefined) return client.action(channel, "❌| Vous n'avez pas de compte, vous ne pouvez pas participez au prediction");
    if(bddCoins[user.username] < args[1]) return client.action(channel, "❌| Vous n'avez pas assez de MerseCoins pour parier cette somme.");
    const resultReseach = research(user.username);
    if(args[0] ===  "choix1") {
        if(resultReseach === null) {
            bddPrediction.ParticipantChoix1.push({username: user.username, mise: parseInt(args[1])});
            bddCoins[user.username] -= parseInt(args[1]);
            saveBdd("prediction", bddPrediction);
            saveBdd("coins", bddCoins);
        }else if(resultReseach.choix === 1) {
            bddPrediction.ParticipantChoix1[resultReseach.index].mise += parseInt(args[1]);
            bddCoins[user.username] -= parseInt(args[1]);
            saveBdd("prediction", bddPrediction);
            saveBdd("coins", bddCoins);
        } else if(resultReseach.choix === 2) {
            return client.action(channel, "❌| Vous ne pouvez pas changer de choix.");
        }
    } else {
        if(resultReseach === null) {
            bddPrediction.ParticipantChoix2.push({username: user.username, mise: parseInt(args[1])});
            bddCoins[user.username] -= args[1];
            saveBdd("prediction", bddPrediction);
            saveBdd("coins", bddCoins);
        }else if(resultReseach.choix === 1) {
            return client.action(channel, "❌| Vous ne pouvez pas changer de choix.");
        } else if(resultReseach.choix === 2){
            bddPrediction.ParticipantChoix2[resultReseach.index].mise += parseInt(args[1]);
            bddCoins[user.username] -= parseInt(args[1]);
            saveBdd("prediction", bddPrediction);
            saveBdd("coins", bddCoins);
        }
    }

    let miseTotal
    if(resultReseach != null) {
        if(resultReseach.choix === 1) {
            miseTotal = bddPrediction.ParticipantChoix1[resultReseach.index].mise;
        } else {
            miseTotal = bddPrediction.ParticipantChoix2[resultReseach.index].mise;
        }
    }

    client.action(channel, `${user.username} a misé ${args[1]} MerseCoins sur le choix : ${args[0] === "choix1" ? bddPrediction.Choix1 : bddPrediction.Choix2}. Montant de sa mise total : ${miseTotal === undefined ? args[1] : miseTotal} MerseCoins`);


    function research(username) {
        const tableauChoix = [bddPrediction.ParticipantChoix1, bddPrediction.ParticipantChoix2];
        for (let i = 0; i < tableauChoix.length; i++) {
            for (let e = 0; e < tableauChoix[i].length; e++) {
                if(tableauChoix[i][e].username === username) {
                    console.log(e)
                    return {choix: i+1, index: e};
                }
            }
        }
        return null;
    }
}

module.exports.help = {
    name: "prediction",
    cooldown : "1m",
    description: "Permet de choisir lors de votre prédiction, Syntaxe : &prediction <choix1/choix2> <mise>",
    permissions: false,
}