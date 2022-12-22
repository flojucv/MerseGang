const { PermissionsBitField } = require('discord.js');
const bddCoins = require("../../bdd/coins.json");
const bddLink = require("../../bdd/link.json");
const { saveBdd } = require("../../function/bdd");

module.exports.run = async(client, message, args) => {
    message.delete()
    if(!message.guild.members.cache.get(message.author.id).permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("❌| Vous n'avez pas la permissions d'utilisez cette commande.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    const target = message.mentions.members.first();
    if(!target) return message.channel.send("❌| Vous n'avez pas mentionner d'utilisateur.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    if(!args[1] || isNaN(args[1])) return message.channel.send("❌| Vous n'avez pas renseignez de nombre.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    if(args[1] < 1) return message.channel.send("❌| Votre nombre doit être supérieur a 0").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });

    const pseudo = bddLink[target.user.tag];
    if (bddCoins[pseudo] === undefined)
        return message.channel.send("❌| L'utilisateur n'a pas de compte.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    bddCoins[pseudo] += parseInt(args[1]);
    saveBdd("coins", bddCoins);
    message.channel.send(`✅| ${args[1]} MerseCoins ont été donné a ${target.user.tag}.`).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
}

module.exports.runSlash = async(client, interaction) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "❌| Vous n'avez pas la permissions d'utilisez cette commande.", ephemeral: true });

    const target = interaction.options.getUser("user");
    const nombre = interaction.options.getNumber("nombre");
    if(nombre < 1) return interaction.reply({content: "❌| Votre nombre doit être supérieur a 0", ephemeral: true});

    const pseudo = bddLink[target.tag];
    
    if (bddCoins[pseudo] === undefined)
        return interaction.reply({content: "❌| L'utilisateur n'a pas de compte.", ephemeral: true});
    bddCoins[pseudo] += parseInt(nombre);
    saveBdd("coins", bddCoins);
    interaction.reply({content: `✅| ${nombre} MerseCoins ont été donné a ${target.tag}.`, ephemeral: true});
}

module.exports.help = {
    name: "addmersecoins",
    aliases: ['addMerseCoins'],
    category: "administrateur",
    description: "Permet d'ajouter des merseCoins a un utilisateur.",
    usage: "<@user> <nombre>",
    options: [
        {
            name: "user",
            description: "L'utilisateur a qui vous souhaitez ajouter des merseCoins.",
            type: 6,
            required: true
        },
        {
            name: "nombre",
            description: "Le nombre de merseCoins que vous souhaitez ajoutée a l'utilisateur.",
            type: 10,
            required: true,
            minValue: 1
        }
        
    ]
}