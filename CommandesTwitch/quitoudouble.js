const { saveBdd } = require("../function/bdd");
const { trouverCompteViaTwitch, addMerseCoins } = require("../function/merseCoinsFunction");
const bddCompte = require("../bdd/compte.json");

module.exports.run = async (client, channel, user, message, self, args) => {
    if(!args[0]) return client.action(channel, "❌| Vous n'avez pas misé !");
    if(isNaN(args[0])) return client.action(channel, "❌| Vous n'avez pas misé un nombre !");
    const mise = parseInt(args[0]);

    const position = await trouverCompteViaTwitch(user.username);
    if(position === -1) return client.action(channel, "❌| Vous n'avez pas créez de compte !");
    if(bddCompte[position].MerseCoins < mise) return client.action(channel, "❌| Vous n'avez pas assez d'argent !");
    if(10 > mise) return client.action(channel, "❌| Vous ne pouvez pas misé en dessous de 10 MerseCoins !");

    bddCompte[position].MerseCoins -= mise;
    const choix = ["gagner", "perdue"];
    const definirChoix = choix[Math.floor(Math.random() * choix.length)];

    switch(definirChoix) {
        case 'gagner' :
            
            addMerseCoins(position, mise*2);
            saveBdd("compte", bddCompte);
            return client.action(channel, `✅| Vous avez gagné ! Tu as gagné ${mise*2} MerseCoins`);
        case 'perdue' :
            saveBdd("compte", bddCompte);
            return client.action(channel, `❌| Vous avez perdu ! Ta mise était de ${mise} MerseCoins`);
    }
}

module.exports.help = {
    name: "quitoudouble",
    aliases: ['qod'],
    cooldown: "10m",
    description: "Double ta mise ou perd tout ! (mise minimale : 10 MerseCoins)",
    permissions: false,
}