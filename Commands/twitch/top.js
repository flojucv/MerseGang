module.exports.run = async (client, channel, user, message, self, args) => {
    return client.action(channel, 'Voici le classement : https://mersegang.flojucvcreator.fr/classement');
}


module.exports.help = {
    name: "top",
    aliases: ['top'],
    description: "Qui sont les 10 premières personnes à posséder le plus de MerseCoins ?",
    cooldown:"1m",
    permissions: false,
}