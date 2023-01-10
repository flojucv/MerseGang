module.exports.run = async(client, channel, user, message, self, args) => {
    client.action(channel, "Si tu veut voir les commandes rend toi sur le discord (&helptwitch) ou regarde via se lien : https://flojucvsitewebcreators.on.drv.tw/MerseGang%20site%20shop/help.html ");
}

module.exports.help = {
    name: "help",
    cooldown : "1m",
    description : "Commande permettant d'affichez tout les commandes du bots",
    permissions: false
}