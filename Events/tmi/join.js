const { msgLog } = require("../../function/logs");
const twitchBdd = require('../../bdd/twitch.json');
const { saveBdd } = require("../../function/bdd");
const db = require('../../function/db');

module.exports = async (twitchBot, channel, username, self) => {
    console.log(`${msgLog(channel)} ${username} a rejoins le channel`);

    const sql = "SELECT * FROM compte WHERE twitch = ?";
    const result = await db.query(sql, [username]);
    if(result.length > 0) {
        twitchBdd.listeUser.push(username);
        saveBdd("twitch", twitchBdd);
        console.log(`${msgLog(channel)} ${username} a rejoins la collecte de point.`);
    }
}