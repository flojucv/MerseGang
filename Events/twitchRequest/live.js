const logger = require("../../function/logger");
const twitchBdd = require('../../bdd/twitch.json');
const { saveBdd } = require("../../function/bdd");
const twitchBot = require("../../Connect/tmiConnect");
const config = require('../../bdd/config.json');
const { startIntervalEventAndPoint } = require("../../function/streamEventAndPoint");

module.exports = (twitch, streamData) => {
    logger.warn("[TWITCH] Début du live de Mersedi detecter");
    twitchBdd.stream = true;
    saveBdd("twitch", twitchBdd);
    twitchBot.action(config.channels[0], "La collecte de point a démarrer.");
    startIntervalEventAndPoint();
}