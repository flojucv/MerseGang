const bddShop = require("../../bdd/shop.json");
const bddCompte = require("../../bdd/compte.json");
const { EmbedBuilder } = require("discord.js");
const { saveBdd } = require("../../function/bdd");
const indexFile = require("../../index");
const { trouverCompteViaDiscord } = require("../../function/merseCoinsFunction");

module.exports.run = async (client, message, args) => {
    if (!args[0]) {

        if(bddShop.length === 0) {
            return message.channel.send("Le shop est vide... (Mersedi est un flemmard...)");
        }
        const embedShop = new EmbedBuilder()
            .setAuthor({ name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG" })
            .setFooter({ text: "MerseCoins SYSTEM" })
            .setColor("#5B3EBA")
            .setDescription("Voici la liste de tout ce que vous pouvez achetez avec des MerseCoins.")
            .setTitle("SHOP")
            .setURL("https://flojucvsitewebcreators.on.drv.tw/MerseGang%20site%20shop/")

        for (let e = 0; e < 9; e++) {
            if (e > bddShop.length - 1) break;
            const item = bddShop[e];
            embedShop.addFields({name: `\`${bddShop.indexOf(item) + 1}\`・${item.name} : `, value: `${item.description} | ${item.prix} MerseCoins`})
        }

        message.channel.send({ embeds: [embedShop] })
    } else {
        if (isNaN(args[0])) return message.channel.send("❌| Vous n'avez pas mis le numéro de l'article à acheter.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
        if (args[0] < 1 || args[0] > bddShop.length) return message.channel.send(`❌| Vous devez rentrer un nombre compris entre 1 et ${bddShop.length}.`).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
        const article = args[0] -1;
        const position = await trouverCompteViaDiscord(message.author.id)
        if (position === -1)
            return message.channel.send("❌| Vous n'avez pas de compte.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
        else {
            const compte = bddCompte[position];
            if(compte.MerseCoins < bddShop[article].prix)
                return message.channel.send("❌| Vous n'avez pas assez de MerseCoins.").then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
            else {
                compte.MerseCoins -= bddShop[article].prix;
                saveBdd("compte", bddCompte);
                indexFile.sendMsgTwitch(`L'utilisateur ${pseudo} a acheter ${bddShop[article].name} !!`);
            }
        }

    }

}

module.exports.runSlash = async (client, interaction) => {
    const item = interaction.options.getNumber("item");
    if (!item) {
        if(bddShop.length === 0) {
            return interaction.reply({content: "Le shop est vide... (Mersedi est un flemmard...)", ephemeral: true});
        }
        const embedShop = new EmbedBuilder()
            .setAuthor({ name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG" })
            .setFooter({ text: "MerseCoins SYSTEM" })
            .setColor("Purple")
            .setDescription("Voici la liste de tout ce que vous pouvez achetez avec des MerseCoins.")
            .setTitle("SHOP")

        for (let e = 0; e < 9; e++) {
            if (e > bddShop.length - 1) break;
            const article = bddShop[e];
            embedShop.addFields({name: `\`${bddShop.indexOf(article) + 1}\`・${article.name} : `, value: `${article.description} | ${article.prix} MerseCoins`})
        }

        interaction.reply({ embeds: [embedShop], ephemeral: true })
    } else {
        if (item < 1 || item > bddShop.length) return interaction.reply({content: `❌| Vous devez rentrer un nombre compris entre 1 et ${bddShop.length}.`, ephemeral: true});
        const article = item -1;
        const position = await trouverCompteViaDiscord(interaction.user.id);
        if (position === -1)
            return interaction.reply({content: "❌| Vous n'avez pas de compte.", ephemeral: true});
        else {
            const compte = bddCompte[position];
            if(compte.MerseCoins < bddShop[article].prix)
                return interaction.reply({content: "❌| Vous n'avez pas assez de MerseCoins.", ephemeral: true});
            else {
                compte.MerseCoins -= bddShop[article].prix;
                saveBdd("compte", bddCompte);
                indexFile.sendMsgTwitch(`L'utilisateur ${pseudo} a acheter ${bddShop[article].name} !!`);
                interaction.reply({content: "✅| Achat reussi !", ephemeral: true});

            }
        }

    }
}

module.exports.help = {
    name: "shop",
    aliases: ['buy'],
    category: "mersecoins",
    description: "Que vas-tu acheter avec tes MerseCoins ?",
    usage: "[item]",
    options: [
        {
            name: "item",
            description: "Le numéro de ce que vous souhaitez acheter.",
            type: 10,
            minValue: 1,
            maxValue: bddShop.length
        }
    ]
}