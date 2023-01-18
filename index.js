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
    twitchBot.say(config.channels[0], prmMessage);
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
let motDropEnable = false;

twitchBot.on("chat", (channel, user, message, self) => {
    if (self) return;
    if (user['display-name'] === "MerseGang") return;
    if (channel != "#mersedi_") return;

    if(motDropEnable === true) {
        if(message === motDrop) {
            motDropEnable = false;
            const coinsAdd = getRandomInt(50, 101);
            if(bddCoins[user.username] != undefined) {
                bddCoins[user.username] += coinsAdd;
                saveBdd("coins", bddCoins);
                twitchBot.action(channel, `${user.username} a récuperer le drop !`);
            }
        }
    }
    
    if (!message.startsWith(prefix)) return;
    const args = message.slice(prefix.length).trim().split(/ +/g);
    const commande = args.shift();
    const cmd = twitchBot.commands.get(commande);

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
            if (user["mod"] === false) return twitchBot.action(channel, `❌| ${user["username"]}, Vous n'avez pas la permissions d'utilisez cette commande.`);
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
let intervalDrop;

// /-----------------AUTO TWITCH-------------------\ \\
twitch.on("live", streamData => {

    console.log("Mersedi_ est en live.");
    twitchBot.action("La collecte de point a démarer.");
    intervalMerseCoincs = setInterval(() => {
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
    }, ms("1m"));


});

intervalDrop = setInterval(()=> {
    motDrop = strRandom({
        includeUpperCase: true,
        includeNumbers: true,
        length: 10,
        startsWithLowerCase: true
    })
    twitchBot.say(config.channels[0], `/announce Un drop vient de tomber soit le premier a taper se mot : ${motDrop}`);
    motDropEnable = true;
    console.log(`Drop lancé : mot du drop : ${motDrop}`)
}, ms(`30s`))//${getRandomInt(15, 31)}m

twitch.on("unlive", streamData => {
    console.log("Le live de mersedi c'est arrêter.");
    twitchBot.action(config.channels[0], "La collecte de point c'est arreter.");
    clearInterval(intervalMerseCoincs);
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