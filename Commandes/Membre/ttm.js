const { MessageEmbed } = require('discord.js');
const moment = require("moment");

module.exports.run = async(client, message, args) => {
    message.delete();
    message.channel.send(":fire: **Trouve ton mate**, mais qu'est ce que c'est ?\n\nUn serveur est né dans le but de te faire **matcher avec des mates** qui jouent aux jeux vidéo pour que tu puisses trouver ton mate idéal : duo, trio, etc.\n\nOn a créer un **système de rôles** parfait pour ton profil, comme ça plus qu'a cliquer pour trouver le/la/les mate de tes rêves  !\n\n:rofl:  Trop nul ou trop fort ? Pas de soucis notre communauté se développe autour de la **bienveillance**\n\n:heart_eyes: Tu cherches du **girl power** ? Parfait on est là et on essaye de s'entraider\n:video_game:  Quels jeux ? **Absolument tous**, le but c'est que tu trouves au moins quelqu'un dans la mesure du possible\n:trophy: Mais moi jveux **rank** ! Pas de soucis, tu peu creer ton propre channel, limiter les places et meme le renommer !\n:handshake: Tu es **actif sur Twitch** ? Viens présenter ton contenu et partager ta communauté\n:raised_hands: Deviens un vrai Mate :peach: en étant **actif sur Trouve ton mate**. Aide les autres à progresser sur ton jeu favori, **viens rire avec nous et participer à des activités en famille**  :heart:\n\n:love_letter: Un problème, une demande ? Nous sommes **à l'écoute** avec l'équipe pour que tout se passe pour le mieux\n\nAlors t'attends quoi :nerd: ? Invite tes potos : https://discord.gg/XhTSSttnxV");
}

module.exports.runSlash = async(client, interaction) => {
    interaction.reply(":fire: **Trouve ton mate**, mais qu'est ce que c'est ?\n\nUn serveur est né dans le but de te faire **matcher avec des mates** qui jouent aux jeux vidéo pour que tu puisses trouver ton mate idéal : duo, trio, etc.\n\nOn a créer un **système de rôles** parfait pour ton profil, comme ça plus qu'a cliquer pour trouver le/la/les mate de tes rêves  !\n\n:rofl:  Trop nul ou trop fort ? Pas de soucis notre communauté se développe autour de la **bienveillance**\n\n:heart_eyes: Tu cherches du **girl power** ? Parfait on est là et on essaye de s'entraider\n:video_game:  Quels jeux ? **Absolument tous**, le but c'est que tu trouves au moins quelqu'un dans la mesure du possible\n:trophy: Mais moi jveux **rank** ! Pas de soucis, tu peu creer ton propre channel, limiter les places et meme le renommer !\n:handshake: Tu es **actif sur Twitch** ? Viens présenter ton contenu et partager ta communauté\n:raised_hands: Deviens un vrai Mate :peach: en étant **actif sur Trouve ton mate**. Aide les autres à progresser sur ton jeu favori, **viens rire avec nous et participer à des activités en famille**  :heart:\n\n:love_letter: Un problème, une demande ? Nous sommes **à l'écoute** avec l'équipe pour que tout se passe pour le mieux\n\nAlors t'attends quoi :nerd: ? Invite tes potos : https://discord.gg/XhTSSttnxV");
}

module.exports.help = {
    name: "ttm",
    aliases: ['ttm'],
    category: "membre",
    description: "Découvre le monde fabuleux de la ttm",
}