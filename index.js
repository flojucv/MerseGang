const client = require('./Connect/discordConnect');
const twitchBot = require('./Connect/tmiConnect');
const twitch = require('./Connect/twitchRequestConnect');
const fs = require('fs');
const { logFile } = require('./function/logs');

/*-------------CONST FOLDERS--------------*/
const dirCmdDiscord = "./Commands/discord/";
const dirEventDiscord = "./Events/discord/";
const dirCmdTwitch = "./Commands/twitch/";
const dirEventTmi = "./Events/tmi/";
const dirEventTwitchRequest = "./Events/twitchRequest/";
const dirModalsDiscord = "./Modals/discord";


console.log("┌────────────────────────────────┐\n│             COMMAND            │\n├────────────────────────────────┤");
fs.readdirSync(dirCmdDiscord).forEach(dirs => {
    const commands = fs.readdirSync(`${dirCmdDiscord}/${dirs}/`).filter(files => files.endsWith(".js"));
    let folderName = `${dirs.toUpperCase()}`
    for (let i = dirs.length; i < 30; i += 2) {
        folderName = ` ${folderName} `;
    }
    console.log(`│┌──────────────────────────────┐│\n││${folderName}││\n│├─────────────────────────┬────┤│`);
    for (const file of commands) {
        const getFileName = require(`${dirCmdDiscord}/${dirs}/${file}`);
        client.commands.set(getFileName.help.name, getFileName);
        let f = getFileName.help.name;

        console.log(`││${logFile(f, 22)}│ ✔  ││`);
    }
    console.log("│└─────────────────────────┴────┘│");
});
console.log("└────────────────────────────────┘");

fs.readdir(dirEventDiscord, (error, f) => {
    if (error) console.log(error);
    console.log(`┌────────────────────────────────┐\n│             EVENTS             │\n├───────────────────────────┬────┤`);

    f.forEach(async (f) => {
        const events = require(`${dirEventDiscord}/${f}`);
        const event = f.split(".")[0];
        console.log(`│${logFile(event, 24)}│ ✔  │`)
        client.on(event, events.bind(null, client));
    });
    console.log("└───────────────────────────┴────┘");
});

fs.readdir(dirModalsDiscord, (error, f) => {
    if (error) console.log(error);                                 
    console.log(`┌────────────────────────────────┐\n│             MODALS             │\n├───────────────────────────┬────┤`);

    f.forEach(async (f) => {
        const modalFile = require(`${dirModalsDiscord}/${f}`);
        const modal = f.split(".")[0];
        console.log(`│${logFile(modal, 24)}│ ✔  │`)
        client.modals.set(modal, modalFile);
    });
    console.log("└───────────────────────────┴────┘");
});


//---------------------------TWITCH PARTIE---------------------------\
fs.readdir(dirCmdTwitch, (error, f) => {
    if (error) return console.log(error);

    let commandes = f.filter(f => f.split(".").pop() === "js");
    if (commandes.length <= 0) return console.log("[WARN] Aucune commande trouvée !");

    console.log("┌──────────────────────────────┐\n│        TWITCH COMMAND        │\n├─────────────────────────┬────┤");
    commandes.forEach((f) => {
        let commande = require(`${dirCmdTwitch}/${f}`);
        console.log(`│${logFile(commande.help.name, 22)}│ ✔  │`);
        twitchBot.commands.set(commande.help.name, commande);
    })
    console.log("└─────────────────────────┴────┘");
})

fs.readdir(dirEventTmi, (error, f) => {
    if (error) console.error(error);
    console.log(`┌────────────────────────────────┐\n│          EVENTS TWITCH         │\n├───────────────────────────┬────┤`);

    f.forEach((f) => {
        const eventsTwitch = require(`${dirEventTmi}/${f}`);
        const eventName = f.split(".")[0];
        twitchBot.on(eventName, eventsTwitch.bind(null, twitchBot));
        console.log(`│${logFile(eventName, 24)}│ ✔  │`);
    })
    console.log("└───────────────────────────┴────┘");

})

// /-----------------TWITCH CONFIG-------------------\ \\

fs.readdir(dirEventTwitchRequest, (error, f) => {
    if (error) console.error(error);
    console.log(`┌────────────────────────────────┐\n│         EVENTS TWITCH R        │\n├───────────────────────────┬────┤`);

    f.forEach((f) => {
        const eventsTwitch = require(`${dirEventTwitchRequest}/${f}`);
        const eventName = f.split(".")[0];
        twitch.on(eventName, eventsTwitch.bind(null, twitch));
        console.log(`│${logFile(eventName, 24)}│ ✔  │`);
    })
    console.log("└───────────────────────────┴────┘");

})