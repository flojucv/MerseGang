const { trouverCompteViaDiscord } = require("../../function/merseCoinsFunction");
const bddCompte = require("../../bdd/compte.json");
const { saveBdd } = require("../../function/bdd");

module.exports.run = async(client, message, args) => {
    if(!message.guild.members.cache.get(message.author.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("❌| Vous n'avez pas la permissions d'utilisez cette commande.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    if(!args[0]) return message.channel.send("❌| Vous n'avez pas mentionné de pseudo discord").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    const target = message.mentions.members.first();
    if(!target) return message.channel.send("❌| Vous n'avez pas mentionné de pseudo discord").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    const position = await trouverCompteViaDiscord(target.user.id);
    if(position === -1) return message.channel.send("❌| L'utilisateur mentionné n'a pas de compte").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    await bddCompte.splice(position, 1);
    saveBdd("compte", bddCompte);
    return message.channel.send("✅| Le compte a bien été supprimé").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
}

module.exports.runSlash = async (client, interaction) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    if(!args[0]) return interaction.reply({content: "❌| Vous n'avez pas mentionné de pseudo discord", ephemeral: true});
    const target = interaction.options.getUser("utilisateur");
    if(!target) return interaction.reply({content: "❌| Vous n'avez pas mentionné de pseudo discord", ephemeral: true});

    const position = await trouverCompteViaDiscord(target.id);
    if(position === -1) return interaction.reply({content: "❌| L'utilisateur mentionné n'a pas de compte", ephemeral: true});

    await bddCompte.splice(position, 1);
    saveBdd("compte", bddCompte);
    return interaction.reply({content: "✅| Le compte a bien été supprimé", ephemeral: true});
}

module.exports.help = {
    name: "supprimercompte",
    aliases: ['deletecompte'],
    category: "administrateur",
    description: "Permet de supprimer le compte d'un utilisateur via son pseudo discord",
    usage: "<@user>",
    options: [
        {
            name: "utilisateur",
            description: "L'utilisateur à qui vous supprimez le compte.",
            type: 6,
            required: true
        }
    ]
}