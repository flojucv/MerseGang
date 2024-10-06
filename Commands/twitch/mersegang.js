
module.exports.run = async(client, channel, user, message, self, args) => {
    return client.action(channel, "MerseGang est un bot discord et twitch permettant l'utilisation des MerseCoins, une money que l'on peut obtenir en regardant les streams de Mersedi, selon ton grade tu gagnes des MerseCoins, tu peux aussi utiliser la commande &quitoudouble pour tenter de doubler ta mise ! Pour commencez à utiliser les MerseCoins rend toi sur notre discord (!discord). Une fois dessus je t'invite à envoyer dans se tchat twitch la commande &link tagDiscord, puis de retourner sur le discord pour terminer ton lien, et voilà maintenant tu collectes des MerseCoins alors amuses-toi bien :)")
}

module.exports.help = {
    name: "mersegang",
    aliases: ["mersegang"],
    cooldown : "1m",
    description: "Permet d'avoir une petit description du bot",
    permissions: false
}