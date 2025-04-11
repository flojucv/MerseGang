const twitchBdd = require('../../bdd/twitch.json');
const {saveBdd} = require('../../function/bdd');
const { getRandomInt, addMerseCoins } = require('../../function/merseCoinsFunction');
const db = require('../../function/db');
const { prefix } = require('../../bdd/config.json');
const logger = require('../../function/logger');
const ms = require('ms');

module.exports = async (twitchBot, channel, user, message, self) => {
    if(self || user.username=== "MerseGang" || channel != "#mersedi_") return;

    if(twitchBdd.unEvent) {
        const sqlSearchAccount = "SELECT * FROM compte WHERE twitch = ?";
        const comptes = await db.query(sqlSearchAccount, [user.username]);
        if(comptes.length == 1) {
            const compte = comptes[0];
            switch(twitchBdd.typeEvent) {
                case "drop":
                    if(message === twitchBdd.motDrop) {
                        const coinsAdd = getRandomInt(50, 101);
                        twitchBdd.unEvent = false;
                        saveBdd('twitch', twitchBdd);
                        addMerseCoins(compte.twitch, coinsAdd, true);
                        twitchBot.action(channel, `${user.username}  a récuperer le drop ! il/elle gagne ${coinsAdd} MerseCoins`);
                    }
                    break;
                case "question":
                    console.log(twitchBdd.uneQuestion);
                    if(message.toLowerCase() === twitchBdd.uneQuestion.response.toLowerCase() || (twitchBdd.uneQuestion.alias != null && (twitchBdd.uneQuestion.alias.map(element => element.toLowerCase()).indexOf(message.toLowerCase()) != -1))) {
                        let coinsAdd = 0;
                        if(twitchBdd.propositionEnable) {
                            coinsAdd = getRandomInt(25, 51);
                            twitchBot.action(channel, `${user.username} a trouvé la réponse a la question ! il/elle gagne ${coinsAdd} MerseCoins | ${twitchBdd.uneQuestion.anecdote} (${twitchBdd.uneQuestion.id})`);
                        } else {
                            coinsAdd = getRandomInt(50, 101);
                            twitchBot.action(channel, `${user.username} a trouvé la réponse à la question est sans les propositions ! il/elle gagne ${coinsAdd} MerseCoins | ${twitchBdd.uneQuestion.anecdote} (${twitchBdd.uneQuestion.id})`);
                        }
                        twitchBdd.unEvent = false;
                        propositionEnable = false;
                        saveBdd("twitch", twitchBdd);
                        addMerseCoins(compte.twitch, coinsAdd, true);
                    }
                break;
            }
        }
    }

    if(!message.startsWith(prefix)) return;

    const args = message.slice(prefix.length).trim().split(/ +/g);
    const commande = args.shift();
    const cmd = twitchBot.commands.get(commande) || twitchBot.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commande));
    if(((!twitchBdd.stream) && commande != "forcestream") || (!cmd)) return;

    if(!twitchBot.cooldowns.has(cmd.help.name)) {
        twitchBot.cooldowns.set(cmd.help.name, new Map());
    }

    const timeNow = Date.now();
    const tStamps = twitchBot.cooldowns.get(cmd.help.name);
    const cdAmount = ms(cmd.help.cooldown);

    if(tStamps.has(user["user-id"])) {
        const cdExpirationTime = tStamps.get(user['user-id']) + cdAmount;

        if(timeNow < cdExpirationTime) {
            timeLeft = (cdExpirationTime - timeNow) / 1000;
            return twitchBot.action(channel, `${user.username}, merci d'attendre ${timeLeft.toFixed(0)} seconde(s) avant de ré-utiliser la commande ${cmd.help.name}.`);
        }
    }
    tStamps.set(user["user-id"], timeNow);
    setTimeout(() => tStamps.delete(user["user-id"]), cdAmount);

    if(cmd.help.permissions === undefined) throw new Error(`[TWITCH ERROR] NO PERM ENTER FOR COMMAND ${cmd.help.name}`);

    switch(cmd.help.permissions) {
        case "users": 
            if(cmd.help.users === undefined || cmd.help.users.length === 0) throw new Error(`[TWITCH ERROR] NO USER ENTER FOR COMMAND ${cmd.help.name}`);
            if(cmd.help.users.indexOf(user['username']) === -1) return twitchBot.action(channel, `❌| ${user["username"]}, Vous n'avez pas la permissions d'utilisez cette commande.`);
            break;
        case "vip" :
            if((!user['vip'])) return twitchBot.action(channel, `❌| ${user["username"]}, Vous n'avez pas la permissions d'utilisez cette commande.`);
            break;
        case "moderator" :
            if((!user["mod"]) && user["username"] != "mersedi_") return twitchBot.action(channel, `❌| ${user["username"]}, Vous n'avez pas la permissions d'utilisez cette commande.`);
            break;
        case false:
            break;
        default :
            throw new Error(`[ERROR TWITCH] PERMISSION ENTER NOT SUPPORTED IN FILE ${cmd.help.name}`);
    }

    logger.info(`[Twitch] Commande ${cmd.help.name} executez par ${user.username} | ${message}`);
    cmd.run(twitchBot, channel, user, message, self, args);
}