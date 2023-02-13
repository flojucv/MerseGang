const bddPrediction = require("../bdd/prediction.json");
const { saveBdd } = require("../function/bdd.js");
const ms = require("ms");

module.exports.run = async(client, channel, user, message, self, args) => {
    if(!bddPrediction.termine) return client.action(channel, `❌| Une prédiction est déjà en cours merci de termine la prediction en cours avec la commande &predictionstop <choix1/choix2>`);

    if(!args[0]) return client.action(channel, "❌| Vous n'avez pas mit de prédiction.");

    const stringTotal = args.join(' ');
    const stringQuestion = stringTotal.split("question:").join(" ");
    const question = stringQuestion.split("choix1:")[0];
    const choix = stringQuestion.split("choix1:")[1].split("choix2:");

    bddPrediction.Question = question;
    bddPrediction.Choix1 = choix[0];
    bddPrediction.Choix2 = choix[1];
    bddPrediction.termine = false;
    bddPrediction.inscription = false;
    saveBdd("prediction", bddPrediction);

    client.action(channel, `Une prédiction a été lancer : ${bddPrediction.Question}  1|${bddPrediction.Choix1}  2|${bddPrediction.Choix2}`);
    setInterval(() => {
        bddPrediction.inscription = true;
        saveBdd("prediction", bddPrediction);
    }, ms("10m"))
}

module.exports.help = {
    name: "predictionstart",
    cooldown : "1m",
    description: "Permets de lancer une prédiction, Syntaxe : &predictionstart question:votre question choix1:votre premier choix 2:votre deuxième choix",
    permissions: "moderator"
}