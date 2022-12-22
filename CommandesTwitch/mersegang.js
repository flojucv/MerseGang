
module.exports.run = async(client, channel, user, message, self, args) => {
    return client.action(channel, "MerseGang est un bot créer pour le live de Mersedi_ qui a pour but de faire le lien entre discord et twitch, il permettra de faire les points de chaine par la suite en attend que Mersedi_ les débloque.")
}

module.exports.help = {
    name: "mersegang",
    cooldown : "1m",
    description: "Permet d'avoir une petit description du bot",
    permissions: false
}