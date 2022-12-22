const ms = require("ms")
const listeanniv = require('../bdd/listeanniv.json');
const { idGuild } = require("../bdd/config.json");

module.exports = async(client) => {

    let statuses = [
        "Bot by flojucv",
        "MerseGang",
    ]
    setInterval(function(){
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(status);
    }, 5000)

    const cmdGuild = await client.guilds.cache.get(idGuild);
    cmdGuild.commands.set(client.commands.map(cmd => cmd.help));

    client.guilds.cache.get(idGuild).members.fetch().then( console.log("membre fetch !"))


    console.log(`┌──────────────────────────────────────────┐\n│                   INFO                   │\n├──────────────────────────────────────────┤`)
    console.log(`│               BOT CHARGEE                │`);
    let phrase = `CONNECTE AU BOT: ${client.user.username}`;
    let phraseFinal = ""
    if (phrase.length > 42)
        phraseFinal = `${phrase.substring(0, 39)}...`
    else {
        phraseFinal = `${phrase}`;
        for (let i = phrase.length; i < 42; i+= 2) {
            phraseFinal = ' ' + phraseFinal + ' ';
        }
    }
    console.log(`│${phraseFinal}│`);
    console.log("└──────────────────────────────────────────┘");

    function RechercheAnniv() {
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
        if(heure === 9) {
            var i = 0;
            if(listeanniv.length === 0) return
            console.log("recherche d'un anniversaire...");
            while( i < listeanniv.length) {
                if((jour === parseInt(listeanniv[i].jour)) && (mois === parseInt(listeanniv[i].mois))) {
                    client.channels.cache.find(channel => channel.name === "👥・discussion").send(`
                            
C'est l'anniversaire de <@${listeanniv[i].id}> !
                            
On fête ses ${(annee - listeanniv[i].annee)}ans.`);
                    console.log(`anniversaire de ${listeanniv[i].id}`);
                }
                i ++;
            }
            console.log("fin de la recherche d'anniversaire");
            console.log("─────────────────────────────");
        }
    }
    RechercheAnniv();
    setInterval(() => RechercheAnniv(), ms("1h"));
};