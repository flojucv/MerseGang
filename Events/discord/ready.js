const ms = require("ms")
const { idGuild } = require("../../bdd/config.json");
const logger = require("../../function/logger");
const db = require('../../function/db');

module.exports = async (client) => {

    let statuses = [
        "Bot by flojucv",
        "MerseGang",
    ]
    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(status);
    }, 5000)


    const cmdGuild = await client.guilds.cache.get(idGuild);

    cmdGuild.commands.set(client.commands.map(cmd => cmd.help));
    client.guilds.cache.get(idGuild).members.fetch({ force: true }).then(console.log("membre fetch !"))


    console.log(`┌──────────────────────────────────────────┐\n│                   INFO                   │\n├──────────────────────────────────────────┤`)
    console.log(`│               BOT CHARGEE                │`);
    let phrase = `CONNECTE AU BOT: ${client.user.username}`;
    let phraseFinal = ""
    if (phrase.length > 42)
        phraseFinal = `${phrase.substring(0, 39)}...`
    else {
        phraseFinal = `${phrase}`;
        for (let i = phrase.length; i < 42; i += 2) {
            phraseFinal = ' ' + phraseFinal + ' ';
        }
    }
    console.log(`│${phraseFinal}│`);
    console.log("└──────────────────────────────────────────┘");
    logger.warn("[Discord] Le bot a bien démarrer");


    async function RechercheAnniv() {
        //---------ANNIVERSAIRE---------\\
        var date = new Date();
        console.log("─────────────────────────────");
        console.log("initialisation date du jour...");
        var jour = date.getDate();
        console.log(`jour : ${jour}`);
        var mois = date.getMonth() + 1;
        console.log(`mois : ${mois}`);
        var annee = date.getFullYear();
        console.log(`annee : ${annee}`);
        var heure = date.getHours() + 2;
        console.log(`heure : ${heure}`);
        console.log("initialisation terminé");
        console.log("─────────────────────────────");
        if (heure === 9) {
            if (mois < 10) mois = `0${mois}`;
            if (jour < 10) jour = `0${jour}`;
            const sql = "SELECT *, YEAR(date_anniv) AS annee FROM anniversaire WHERE MONTH(date_anniv) = ? AND DAY(date_anniv) = ?";
            const response = await db.query(sql, [mois, jour]);
            console.log("mois", mois)
            console.log("jour", jour)
            console.log(response);
            if (response.length == 0) return;
            console.log("Recherche d'un anniversaire...");
            response.forEach((anniv) => {
                console.log(anniv)
                client.channels.cache.find(channel => channel.id === "985048672125452329").send(`C'est l'anniversaire de <@${anniv.id_discord}> !\n\nOn fête ses ${(annee - anniv.annee)} ans !!`);
                console.log(`anniversaire de ${anniv.id_discord}`);
            })
            console.log("fin de la recherche d'anniversaire");
            console.log("─────────────────────────────");
        }
    }
    RechercheAnniv();
    setInterval(() => RechercheAnniv(), ms("1h"));
};