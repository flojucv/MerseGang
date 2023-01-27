const bddPrediction = require("../bdd/prediction.json");
const bddCoins = require('../bdd/coins.json');
const { saveBdd } = require("../function/bdd.js");

module.exports.run = async (client, channel, user, message, self, args) => {
    if (bddPrediction.termine) return client.action("❌| Il n'y a pas de prediction en cours.");

    if (!args[0]) return client.action(channel, "❌| Vous devez préciser qu'elle choix l'emporte.");

    let miseTotal = 0;
    let gainTotal = 0;
    switch (args[0]) {
        case 'choix1':

            for (let i = 0; i < bddPrediction.ParticipantChoix2.length; i++) {
                gainTotal += bddPrediction.ParticipantChoix2[i].mise;
            }
            for (let e = 0; e < bddPrediction.ParticipantChoix1.length; e++) {
                miseTotal += bddPrediction.ParticipantChoix1[e].mise;
            }

            for (let i = 0; i < bddPrediction.ParticipantChoix1.length; i++) {
                const pourcentage = parseInt((bddPrediction.ParticipantChoix1[i].mise * 100 / miseTotal)) + 1;
                const gain = parseInt(gainTotal * (pourcentage / 100));
                bddCoins[bddPrediction.ParticipantChoix1[i].username] += parseInt(bddPrediction.ParticipantChoix1[i].mise);
                bddCoins[bddPrediction.ParticipantChoix1[i].username] += parseInt(gain);
            }


            const choix1 = bddPrediction.Choix1;
            clearBddPrediction(choix1);
            break;
        case 'choix2':
            for (let i = 0; i < bddPrediction.ParticipantChoix1.length; i++) {
                gainTotal += bddPrediction.ParticipantChoix1[i].mise;
            }
            for (let e = 0; e < bddPrediction.ParticipantChoix2.length; e++) {
                miseTotal += bddPrediction.ParticipantChoix2[e].mise;
            }
            for (let i = 0; i < bddPrediction.ParticipantChoix2.length; i++) {
                const pourcentage = parseInt((bddPrediction.ParticipantChoix2[i].mise * 100 / miseTotal)) + 1;
                const gain = parseInt(gainTotal * (pourcentage / 100));
                bddCoins[bddPrediction.ParticipantChoix2[i].username] += parseInt(bddPrediction.ParticipantChoix2[i].mise);
                bddCoins[bddPrediction.ParticipantChoix2[i].username] += parseInt(gain);
            }
            const choix2 = bddPrediction.Choix2;
            clearBddPrediction(choix2);
            break;
        default:
            return client.action(channel, "❌| Vous n'avez pas précisé qu'elle choix l'emporte (choix1/choix2)");
    }

    function clearBddPrediction(choix) {
        bddPrediction.Question = "";
        bddPrediction.Choix1 = "";
        bddPrediction.Choix2 = "";
        bddPrediction.ParticipantChoix1 = [];
        bddPrediction.ParticipantChoix2 = [];
        bddPrediction.termine = true;
        saveBdd("prediction", bddPrediction);
        saveBdd("coins", bddCoins);
        return client.action(channel, `✅| Prediction terminé le bon choix était ${choix}. Tout les gagnants ont reçus leur point !`);
    }
}

module.exports.help = {
    name: "predictionstop",
    cooldown: "1m",
    description: "Permets de stoper une prédiction, et de donner les points au gagnant. Syntaxe: &predictionstop <choix1/choix2>",
    permissions: "moderator",
}