const { msgLog } = require("../../function/logs");
const twitchBdd = require('../../bdd/twitch.json');
const { saveBdd } = require("../../function/bdd");

module.exports = (twitchBot, channel, username, self) => {
    console.log(`${msgLog(channel)} a quitté le live.`);
    if(twitchBdd.listeUser.indexOf(username) != -1) {
        twitchBdd.listeUser.splice(twitchBdd.listeUser.indexOf(username), 1);
        saveBdd("twitch", twitchBdd);
        console.log(`${username} a quitté la collecte de point.`);
    }
}