const { saveBdd } = require('../../function/bdd');
const pendingMariage = require('../../bdd/pendingMariage.json');
const db = require('../../function/db');

module.exports.run = async (client, channel, user, message, self, args) => {
    const marier1 = user.username;
    const mentionRegex = /@(\w+)/g;
    const mentionedUsers = message.match(mentionRegex);
    if (!mentionedUsers) return client.action(channel, "❌| Vous n'avez pas mentionné d'utilisateur.");
    const marier2 = mentionedUsers[0].substring(1).toLowerCase();


    const sqlMarier1 = "SELECT * FROM compte WHERE twitch = ? OR twitch = ?";
    const response = await db.query(sqlMarier1, [user.username, marier2]);
    if (response.length == 0) return client.action(channel, "❌| Vous n'avez pas de compte.");
    if (response.length < 2) return client.action(channel, "❌| Vous ou l'utilisateur que vous souhaitez marier n'avez pas de compte.");
    if (response.length > 2) return client.action(channel, "[ERROR] Plusieurs comptes ont été trouvés.");
    if (response.filter((compte) => compte.twitch === marier1)[0].mariage != null) return client.action(channel, "Vous êtes déjà mariés, vous devez divorcer avant de vous remarier.")
    if (response.filter((compte) => compte.twitch === marier2)[0].mariage != null) return client.action(channel, "❌| L'utilisateur que vous souhaitez épouser est déjà marié.");

    const demandeEnCour = pendingMariage.filter((mariage) => mariage.marier1 == marier1 || mariage.marier2 == marier1 || mariage.marier1 == marier2 || mariage.marier2 == marier1);
    if (demandeEnCour.length > 0) return client.action(channel, "❌| Il y a déjà une demande en mariage en cours pour vous ou l'utilisateur que vous souhaitez marier.");

    pendingMariage.push({ marier1: marier1, marier2: marier2, pending: true });
    saveBdd("pendingMariage", pendingMariage);
    client.action(channel, `${marier2} souhaitez-vous prendre pour époux jusqu'à la fin de votre vie ${marier1} ? (vous avez 30s pour répondre &acceptMariage pour accepter)`)

    return setTimeout(async () => {
        await pendingMariage.forEach((mariage, position) => {
            if (mariage.marier1 === marier1 && mariage.marier2 === marier2 && mariage.pending === true) {
                pendingMariage.splice(position);
                saveBdd("pendingMariage", pendingMariage);
                return client.action(channel, `❌| ${marier1}, C'est une bien triste nouvelle mais ${marier2} à refuser votre belle demande en mariage.`);
            }
        })
    }, 30000);
}

module.exports.help = {
    name: "mariage",
    aliases: ['mariage'],
    cooldown: "30s",
    description: "Permet de se marier à un autre utilisateur du chat.",
    permissions: false
}