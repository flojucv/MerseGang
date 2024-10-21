const logger = require("../../function/logger");
const twitchBdd = require('../../bdd/twitch.json');
const { saveBdd } = require("../../function/bdd");
const { stopIntervalEventAndPoint } = require("../../function/streamEventAndPoint");

module.exports = (twitch, streamData) => {
    logger.warn('[TWITCH] Fin du live de Mersedi detecter');
    console.log(twitchBdd);
    twitchBdd.stream = false;
    twitchBdd.doubleMersecoins = false;
    twitchBdd.unEvent = false;
    twitchBdd.typeEvent = "";
    twitchBdd.uneQuestion = {};
    twitchBdd.propositionEnable = false;
    twitchBdd.listeUser = [];
    saveBdd("twitch.json", twitchBdd);
    stopIntervalEventAndPoint();
}