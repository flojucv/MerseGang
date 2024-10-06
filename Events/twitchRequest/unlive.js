const logger = require("../../function/logger");
const twitchBdd = require('../../bdd/twitch.json');
const { saveBdd } = require("../../function/bdd");
const { stopIntervalEventAndPoint } = require("../../function/streamEventAndPoint");

module.exports = (twitch, streamData) => {
    logger.warn('[TWITCH] Fin du live de Mersedi detecter');
    twitchBdd.stream = false;
    twitchBdd.doubleMersecoins = false;
    saveBdd("twitch.json", twitchBdd);
    stopIntervalEventAndPoint();
}