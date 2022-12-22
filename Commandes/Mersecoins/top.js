const bddCoins = require("../../bdd/coins.json");

module.exports.run = async(client, message, args) => {
    const listePlusRiche = [];
    for (const user in bddCoins) {
        Coins = bddCoins[user];
        if(listePlusRiche.length === 0) {
            listePlusRiche.push(user = Coins)
        } else {
            for (const riche in listePlusRiche) {
            
            }
        }
    }
}

module.exports.help = {
    name: "top",
    description: "commande en cour de cration"
}