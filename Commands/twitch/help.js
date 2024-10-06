module.exports.run = async(client, channel, user, message, self, args) => {
    client.action(channel, "Si tu veut voir les commandes rend toi sur le discord (&helptwitch) ou regarde via se lien : https://mersegang.flojucvcreator.fr/help ");
}

module.exports.help = {
    name: "help",
    aliases: ['aide'],
    cooldown : "1m",
    description : "Commande permettant d'affichez tout les commandes du bots",
    permissions: false
}