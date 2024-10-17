const config = require('../bdd/config.json');
const twitchJson = require('../bdd/twitch.json');
const twitchBot = require('../Connect/tmiConnect');
const { saveBdd } = require('./bdd');
const bddQuestion = require('../bdd/quizz.json');
const db = require('./db');
const { addMerseCoins, strRandom } = require('./merseCoinsFunction');
const ms = require('ms');

let intervalMersecoins;
let intervalEvent;

/**
 * Permet le lancement des intervals pour la collecte de mersecoins mais aussi les events
 */
module.exports.startIntervalEventAndPoint = () => {
    intervalMersecoins = setInterval(async () => {
        const date = new Date();
        const jour = date.getDate();
        const mois = ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const annee = date.getFullYear();
        const heure = date.getHours() + 2;
        const minute = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
        console.log("───────────────────────────────");
        console.log(`${jour}/${mois}/${annee} ${heure}:${minute}`);
        console.log(config.channels[0]);
        twitchJson.listeUser.forEach(async (username) => {
            const sqlSearchAccount = "SELECT * FROM compte INNER JOIN grade ON grade.id_grade = compte.grade WHERE twitch = ?";
            const comptes = await db.query(sqlSearchAccount, [username]);

            if (comptes.length == 1) {
                const compte = comptes[0];
                if (twitchJson.doubleMersecoins) {
                    await addMerseCoins(compte.twitch, parseInt((compte.pointdechaine * 2)));
                    console.log(`${compte.twitch} a obtenue ${(compte.pointdechaine * 2)} MerseCoins. il/elle a ${compte.mersecoins + compte.pointdechaine} Mersecoins`);
                } else {
                    await addMerseCoins(compte.twitch, parseInt(compte.pointdechaine));
                    console.log(`${compte.twitch} a obtenue ${compte.pointdechaine} MerseCoins. il/elle a ${compte.mersecoins + compte.pointdechaine} Mersecoins`);
                }
            }
        });
        console.log("───────────────────────────────");
    }, ms("1m"));

    intervalEvent = setInterval(() => {
        let event = ["drop", "question", "question"];
        switch (event[Math.floor(Math.random() * event.length)]) {
            case "drop":
                twitchJson.typeEvent = "drop";
                twitchJson.motDrop = strRandom({
                    includeUpperCase: true,
                    includeNumbers: true,
                    length: 10,
                    startsWithLowerCase: true
                })
                twitchJson.unEvent = true;
                saveBdd('twitch', twitchJson);
                twitchBot.action(config.channels[0], `Un drop vient de tomber soit le premier a taper se mot : ${twitchJson.motDrop}`);
                break;
            case "question":
                twitchJson.typeEvent = "question";
                twitchJson.uneQuestion = bddQuestion[Math.floor(Math.random() * bddQuestion.length)];
                twitchJson.unEvent = true;
                saveBdd('twitch', twitchJson);
                twitchBot.action(config.channels[0], `${twitchJson.uneQuestion.question}`);
                console.log(`Question : ${twitchJson.uneQuestion.question}\nRéponse : ${twitchJson.uneQuestion.reponse}\nAlias : ${twitchJson.uneQuestion.alias}`);

                setTimeout(() => {
                    if (twitchJson.unEvent) {
                        twitchJson.propositionsEnable = true;
                        saveBdd('twitch', twitchJson)
                        twitchBot.action(config.channels[0], `Personne n'a trouver la réponse, voici un rappelle de la question : ${twitchJson.uneQuestion.question} et voici les propositions : 1| ${twitchJson.uneQuestion.propositions[0]}, 2| ${twitchJson.uneQuestion.propositions[1]}, 3| ${twitchJson.uneQuestion.propositions[2]}, 4| ${twitchJson.uneQuestion.propositions[3]}`)
                    }
                }, ms("2m"));
                break;
        }
    }, ms('15m'));
}

/**
 * Permet de couper les intervales de la collecte de point et des events
 */
module.exports.stopIntervalEventAndPoint = () => {
    if (intervalMersecoins) {
        clearInterval(intervalMersecoins);
    }
    if (intervalEvent) {
        clearInterval(intervalEvent);
    }
}