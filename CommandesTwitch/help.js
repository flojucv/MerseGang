const fs = require("fs");

module.exports.run = async(client, channel, user, message, self, args) => {
    let messageHelp = "";

    fs.readdir("./CommandesTwitch/", async (error, f) => {
        if(error) return console.log(error);
    
        let commandes = f.filter(f => f.split(".").pop() === "js");
        if(commandes.length <= 0) 
            messageHelp = "💠| Il n'y a pas de commandes."

        await commandes.forEach((f) => {
            let commande = require(`../CommandesTwitch/${f}`);
            
            messageHelp += `${commande.help.name}| ${commande.help.description}, `
        })
        
        client.action(channel, messageHelp);
    })
}

module.exports.help = {
    name: "help",
    cooldown : "1m",
    description : "Commande permettant d'affichez tout les commandes du bots",
    permissions: false
}