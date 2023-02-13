const { saveBdd } = require("../function/bdd");
const coinsBdd = require("../bdd/coins.json");

module.exports.run = async (client, channel, user, message, self, args) => {
    if(!args[0]) return client.action(channel, "❌| Vous n'avez pas misé !");
    if(isNaN(args[0])) return client.action(channel, "❌| Vous n'avez pas misé un nombre !");
    const mise = parseInt(args[0]);

    if(coinsBdd[user.username] === undefined) return client.action(channel, "❌| Vous n'avez pas créez de compte !");
    if(coinsBdd[user.username] < mise) return client.action(channel, "❌| Vous n'avez pas assez d'argent !");
    if(10 > mise) return client.action(channel, "❌| Vous ne pouvez pas misé en dessous de 10 MerseCoins !");

    coinsBdd[user.username] -= mise;
    const choix = ["gagner", "perdue"];
    const definirChoix = choix[Math.floor(Math.random() * choix.length)];

    switch(definirChoix) {
        case 'gagner' :
            coinsBdd += (mise*2);
            saveBdd("coins", coinsBdd);
            return client.action(channel, `✅| Vous avez gagné ! Tu as gagné ${mise*2} MerseCoins`);
        case 'perdue' :
            saveBdd("coins", coinsBdd);
            return client.action(channel, `❌| Vous avez perdu ! Ta mise était de ${mise} MerseCoins`);
    }
}

module.exports.help = {
    name: "quitoudouble",
    cooldown: "10m",
    description: "Double ta mise ou perd tout ! (mise minimale : 10 MerseCoins)",
    permissions: false,
}