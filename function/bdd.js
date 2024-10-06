const fs = require('fs');

/**
 * 
 * @param {String} bdd Le nom du fichier de la base de donnée. (sans le .json)
 * @param {Variable} functionBdd Le nom de la variable de la base de donnée.
 */
module.exports.saveBdd = function(bdd, functionBdd) {
    verif = false;
    fs.readdir("./bdd/", async (error, f) => {
        if(error) console.log(error);
    
        let bdds = f.filter(f => f.split(".").pop() === "json");
        if(bdds.length <= 0) return console.log("[ERROR] Aucune Base de donnée trouvée !");
    
        await bdds.forEach((f) => {
            if(f === `${bdd}.json`) {
                verif = true;
            }
        });
        if(verif === true) {
            fs.writeFile(`./bdd/${bdd}.json`, JSON.stringify(functionBdd, null, 4), (err) => {
                if(err) message.channel.send("Une erreur est survenue.");
            })
        }else {
            console.log("[ERROR] La base de donnée que vous voulez sauvegardez n'existe pas");
        }
    });
}