const bddGiveaways = require("../bdd/giveaways.json");

module.exports.run = async(client, channel, user, message, self, args) => {
    let winner1 = bddGiveaways.participants[Math.floor(Math.random() * bddGiveaways.participants.length)];
    let winner2 = bddGiveaways.participants[Math.floor(Math.random() * bddGiveaways.participants.length)];
    do {
        let winner2 = bddGiveaways.participants[Math.floor(Math.random() * bddGiveaways.participants.length)];
    } while (winner1 === winner2)

    client.action(channel, `Les gagnants du giveaways sont : ${winner1}, ${winner2}`);
}

module.exports.help = {
    name: "winner",
    cooldown : "1m",
    description: "Permet de tiret au sort les gagnants du giveaways",
    permissions: "users",
    users: ["flojucv", "mersedi_"]
}