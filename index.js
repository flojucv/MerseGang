const Discord = require('discord.js');
const { GatewayIntentBits } = require("discord.js");
const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,

    ]
});
const fs = require('fs');
const config = require("./bdd/config.json");
const bddQuestion = require("./bdd/quizz.json");
const { strRandom, getRandomInt } = require('./function/merseCoinsFunction');
require('dotenv').config();

client.login(process.env.Token)

client.commands = new Discord.Collection();

console.log("┌────────────────────────────────┐\n│             COMMAND            │\n├────────────────────────────────┤")
function loadCommands(dir = "./Commandes/") {
    fs.readdirSync(dir).forEach(dirs => {
        const commands = fs.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
        let folderName = `${dirs.toUpperCase()}`
        for (let i = dirs.length; i < 30; i += 2) {
            folderName = ` ${folderName} `;
        }
        console.log(`│┌──────────────────────────────┐│\n││${folderName}││\n│├─────────────────────────┬────┤│`)
        for (const file of commands) {
            const getFileName = require(`${dir}/${dirs}/${file}`);
            client.commands.set(getFileName.help.name, getFileName);
            let f = getFileName.help.name;
            let fName = ""
            if (f.length > 25)
                fName = `${f.substring(0, 22)}...`
            else {
                fName = `${f}`;
                for (let i = f.length; i < 25; i++) {
                    fName += ' ';
                }
            }

            console.log(`││${fName}│ ✔  ││`)
        }
        console.log("│└─────────────────────────┴────┘│")
    });
}

loadCommands();
console.log("└────────────────────────────────┘")
fs.readdir("./Events/", (error, f) => {
    if (error) console.log(error);
    console.log(`┌────────────────────────────────┐\n│             EVENTS             │\n├───────────────────────────┬────┤`)

    f.forEach((f) => {
        const events = require(`./Events/${f}`);
        const event = f.split(".")[0];
        let fName = ""
        if (f.length > 27)
            fName = `${f.substring(0, 25)}...`
        else {
            fName = `${f}`;
            for (let i = f.length; i < 27; i++) {
                fName += ' ';
            }
        }

        console.log(`│${fName}│ ✔  │`)
        client.on(event, events.bind(null, client));
    });
    console.log("└───────────────────────────┴────┘")
});


//---------------------------TWITCH PARTIE---------------------------\\
const tmi = require('tmi.js');
const { prefix } = require("./bdd/config.json");
const ms = require('ms');
const bddLink = require("./bdd/link.json");
const bddCoins = require("./bdd/coins.json");
const { saveBdd } = require("./function/bdd.js");

function msgLog(channel) {
    const date = new Date()

    let heure = date.getHours();
    let minute = date.getMinutes();

    if (minute < 10)
        minute = `0${minute}`;
    if (heure < 10)
        heure = `0${heure}`;
    return `[${heure}:${minute}] info: [${channel}]`
}

const options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "MerseGang",
        password: "oauth:z3qe647pysc4mzlryv7lx78bi5l0tz"
    },
    channels: config.channels
};

const twitchBot = new tmi.Client(options);


twitchBot.connect()

twitchBot.commands = new Map();
twitchBot.cooldowns = new Map();

/**
 * 
 * @param {String} prmMessage Message a envoyez dans le chat twitch
 */
module.exports.sendMsgTwitch = function (prmMessage) {
    twitchBot.action(config.channels[0], prmMessage);
}


fs.readdir("./CommandesTwitch/", (error, f) => {
    if (error) return console.log(error);

    let commandes = f.filter(f => f.split(".").pop() === "js");
    if (commandes.length <= 0) return console.log("[WARN] Aucune commande trouvée !");

    console.log("┌──────────────────────────────┐\n│        TWITCH COMMAND        │\n├─────────────────────────┬────┤")
    commandes.forEach((f) => {
        let commande = require(`./CommandesTwitch/${f}`);
        let fName = ""
        if (f.length > 25)
            fName = `${f.substring(0, 22)}...`
        else {
            fName = `${f}`;
            for (let i = f.length; i < 25; i++) {
                fName += ' ';
            }
        }

        console.log(`│${fName}│ ✔  │`)


        twitchBot.commands.set(commande.help.name, commande)
    })
    console.log("└─────────────────────────┴────┘")
})

let motDrop = "";
let unEvent = false;
let typeEvent = "";
let uneQuestion;
let propositionsEnable = false;
let stream = false;

twitchBot.on("chat", (channel, user, message, self) => {
    if (self) return;
    if (user['display-name'] === "MerseGang") return;
    if (channel != "#mersedi_") return;
    if (unEvent === true) {
        switch(typeEvent) {
            case "drop" :
                if (message === motDrop) {
                    const coinsAdd = getRandomInt(50, 101);
                    if (bddCoins[user.username] != undefined) {
                        unEvent = false;
                        bddCoins[user.username] += coinsAdd;
                        saveBdd("coins", bddCoins);
                        twitchBot.action(channel, `${user.username} a récuperer le drop ! il/elle gagne ${coinsAdd} MerseCoins`);
                    }
                }
                break;
            case "question":
                if(message.toLowerCase() === uneQuestion.reponse.toLowerCase()) {
                    if(!propositionsEnable) {
                        const coinsAdd = getRandomInt(50, 101);
                        if(bddCoins[user.username] != undefined) {
                            unEvent = false;
                            bddCoins[user.username] += coinsAdd;
                            saveBdd("coins", bddCoins);
                            twitchBot.action(channel, `${user.username} a trouvé la réponse a la question est sans les propositions ! il/elle gagne ${coinsAdd} MerseCoins | ${uneQuestion.anecdote}`);
                        }
                    } else {
                        const coinsAdd = getRandomInt(25, 51);
                        if(bddCoins[user.username] != undefined) {
                            unEvent = false;
                            propositionsEnable	= false;
                            bddCoins[user.username] += coinsAdd;
                            saveBdd("coins", bddCoins);
                            twitchBot.action(channel, `${user.username} a trouvé la réponse a la question ! il/elle gagne ${coinsAdd} MerseCoins | ${uneQuestion.anecdote}`)
                        }
                    }
                } else if(uneQuestion.alias.indexOf(message.toLowerCase()) != -1) {
                    if(!propositionsEnable) {
                        const coinsAdd = getRandomInt(50, 101);
                        if(bddCoins[user.username] != undefined) {
                            unEvent = false;
                            bddCoins[user.username] += coinsAdd;
                            saveBdd("coins", bddCoins);
                            twitchBot.action(channel, `${user.username} a trouvé la réponse a la question est sans les propositions ! il/elle gagne ${coinsAdd} MerseCoins | ${uneQuestion.anecdote}`);
                        }
                    } else {
                        const coinsAdd = getRandomInt(25, 51);
                        if(bddCoins[user.username] != undefined) {
                            unEvent = false;
                            propositionsEnable	= false;
                            bddCoins[user.username] += coinsAdd;
                            saveBdd("coins", bddCoins);
                            twitchBot.action(channel, `${user.username} a trouvé la réponse a la question ! il/elle gagne ${coinsAdd} MerseCoins | ${uneQuestion.anecdote}`)
                        }
                    }
                }
                break;
        }
    }

    if (!message.startsWith(prefix)) return;
    
    const args = message.slice(prefix.length).trim().split(/ +/g);
    const commande = args.shift();
    const cmd = twitchBot.commands.get(commande);
    if(stream === false && commande != "forcestream") return;
    if (!cmd) return;


    if (!twitchBot.cooldowns.has(cmd.help.name)) {
        twitchBot.cooldowns.set(cmd.help.name, new Map());
    }

    const timeNow = Date.now();
    const tStamps = twitchBot.cooldowns.get(cmd.help.name);
    const cdAmount = ms(cmd.help.cooldown);

    if (tStamps.has(user["user-id"])) {
        const cdExpirationTime = tStamps.get(user["user-id"]) + cdAmount;

        if (timeNow < cdExpirationTime) {
            timeLeft = (cdExpirationTime - timeNow) / 1000;
            return twitchBot.action(channel, `${user["display-name"]}, merci d'attendre ${timeLeft.toFixed(0)} seconde(s) avant de ré-utiliser la commande ${cmd.help.name}.`);
        }
    }
    tStamps.set(user["user-id"], timeNow);
    setTimeout(() => tStamps.delete(user["user-id"]), cdAmount);

    if (cmd.help.permissions === undefined) return console.log("[ERROR TWITCH] NO PERM ENTER");

    switch (cmd.help.permissions) {
        case "users":
            if (cmd.help.users === undefined || cmd.help.users.length === 0) return console.log("[ERROR TWITCH] NO USER ENTER");
            if (cmd.help.users.indexOf(user["username"]) === -1) return twitchBot.action(channel, `❌| ${user["username"]}, Vous n'avez pas la permissions d'utilisez cette commande.`);
            cmd.run(twitchBot, channel, user, message, self, args);
            break;
        case "vip":
            if (user["vip"] != true) return twitchBot.action(channel, `❌| ${user["username"]}, Vous n'avez pas la permissions d'utilisez cette commande.`);
            cmd.run(twitchBot, channel, user, message, self, args);
            break;
        case "moderator":
            if (user["mod"] === false && user["username"] != "mersedi_") return twitchBot.action(channel, `❌| ${user["username"]}, Vous n'avez pas la permissions d'utilisez cette commande.`);
            cmd.run(twitchBot, channel, user, message, self, args);
            break;
        case false:
            cmd.run(twitchBot, channel, user, message, self, args);
            break;
        default:
            return console.log("[ERROR TWITCH] PERMISSION CASE DEFAULT");
    }
})




let listeUser = []

twitchBot.on("join", (channel, username, self) => {
    console.log(`${msgLog(channel)} ${username} a rejoins le channel`);

    for (const key in bddLink) {
        if (bddLink[key] === username) {
            listeUser.push(username);
            console.log(`${username} à rejoins la collecte de point.`);
        }
    }
})

twitchBot.on("part", (channel, username, self) => {
    console.log(`${msgLog(channel)} ${username} a quitté le channel`)
    if (listeUser.indexOf(username) != -1) {
        listeUser.splice(listeUser.indexOf(username), 1);
        console.log(`${username} à quitté la collecte de point.`);
    }
})

// /-----------------TWITCH-------------------\ \\

// /-----------------TWITCH CONFIG-------------------\ \\

const { Client } = require('twitchrequest');

const twitch = new Client({
    channels: ["mersedi_"],
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    interval: 15
});

let intervalMerseCoincs;
let intervalEvent;

// /-----------------AUTO TWITCH-------------------\ \\
twitch.on("live", streamData => {

    console.log("Mersedi_ est en live.");
    stream = true;
    twitchBot.action(config.channels[0], "La collecte de point a démarer.");
    streamEventAndPoint();
});



twitch.on("unlive", streamData => {
    stream = false;
    twitchBot.action(config.channels[0], "La collecte de point c'est arreter.");
    clearInterval(intervalMerseCoincs);
    clearInterval(intervalEvent);
})


/**
 * 
 * @param {String} prmTag Le tag du membre auquel on souhaite recuperer l'id.
 * @returns L'id du membre.
 */
module.exports.researchID = async function (prmTag) {
    const researchUser = await client.guilds.cache.get(config.idGuild).members.cache.find(member => member.user.tag === prmTag);

    return researchUser.id;
}

module.exports.forceStream = async function () {
    twitchBot.action(config.channels[0], "La collecte de point a démarer.");
    stream = true;
    streamEventAndPoint();
}

async function streamEventAndPoint() {
    intervalMerseCoincs = setInterval(async () => {
        const date = new Date();
        var jour = date.getDate();
        var mois = date.getMonth() + 1;
        var annee = date.getFullYear();
        var heure = date.getHours() + 2;
        var minute = date.getMinutes();
        if(minute < 10)
            minute = `0${minute}`;
        if(mois < 10)
            mois = `0${mois}`;
        console.log("───────────────────────────────");
        console.log(`${jour}/${mois}/${annee}  ${heure}:${minute}`);
        console.log(config.channels[0])
        listeUser.forEach(username => {
            if (!bddCoins[username]) {
                bddCoins[username] = 1;
                saveBdd("coins", bddCoins);
                console.log(`${username} à gagnez 1 coins | il a ${bddCoins[username]}`);
            } else {
                bddCoins[username]++;
                saveBdd("coins", bddCoins);
                console.log(`${username} à gagnez 1 coins | il a ${bddCoins[username]}`);
            }
        })
        console.log("───────────────────────────────");
    }, ms("10s"));
    
    intervalEvent = setInterval(() => {
        let event = ["drop", "question"];
        switch (event[Math.floor(Math.random() * event.length)]) {
            case "drop" :
                typeEvent = "drop";
                motDrop = strRandom({
                    includeUpperCase: true,
                    includeNumbers: true,
                    length: 10,
                    startsWithLowerCase: true
                })
                twitchBot.action(config.channels[0], `Un drop vient de tomber soit le premier a taper se mot : ${motDrop}`);
                unEvent = true;
                break;
            case "question" :
                typeEvent = "question";
                uneQuestion = bddQuestion[Math.floor(Math.random()* bddQuestion.length)];
                twitchBot.action(config.channels[0], `${uneQuestion.question}`);
                unEvent = true;
                setTimeout(() => {
                    if(unEvent) {
                        propositionsEnable = true;
                        twitchBot.action(config.channels[0], `Personne n'a trouver la réponse, voici un rappelle de la question : ${uneQuestion.question} et voici les propositions : 1| ${uneQuestion.propositions[0]}, 2| ${uneQuestion.propositions[1]}, 3| ${uneQuestion.propositions[2]}, 4| ${uneQuestion.propositions[3]}`)
                    }
                }, ms("2m"));
                break;
        }
    }, ms(`${getRandomInt(15, 31)}m`))
}