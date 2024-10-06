const { msgLog } = require("../../function/logs");
const twitchBdd = require('../../bdd/twitch.json');
const { saveBdd } = require("../../function/bdd");

module.exports = (twitchBot, channel, username, self) => {
    console.log(`${msgLog(channel)} ${username} a rejoins le channel`);
    twitchBdd.listeUser.push(username);
    saveBdd("twitch", twitchBdd);
    console.log(`${msgLog(channel)} ${username} a rejoins la collecte de point.`);
}