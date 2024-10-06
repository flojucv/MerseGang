const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const indexFile = require("../../../index");
const db = require('../../../function/db');
const { addMerseCoins } = require('../../../function/merseCoinsFunction');

module.exports.runSlash = async (client, interaction) => {
    const item = interaction.options.getNumber("item");
    const sqlShop = "SELECT * FROM shop";
    const shop = await db.query(sqlShop);

    if (!item) {
        if(shop.length === 0) {
            return interaction.reply({content: "Le shop est vide... (Mersedi est un flemmard...)", ephemeral: true});
        }
        const embedShop = new EmbedBuilder()
            .setURL('https://mersegang.flojucvcreator.fr/shop')
            .setAuthor({ name: "Bot by flojucv", iconURL: "https://media.discordapp.net/attachments/894234723747004426/995231775762690138/logo512x512.png", url: "https://discord.gg/p2QC3NQSmG" })
            .setFooter({ text: "MerseCoins SYSTEM", iconURL: "https://cdn.discordapp.com/attachments/1069524271946268672/1135491536126230628/mersecoins.png" })
            .setColor("Purple")
            .setDescription("Voici la liste de tout ce que vous pouvez achetez avec des MerseCoins.")
            .setTitle("SHOP")

        shop.forEach(article => {
            embedShop.addFields({name: `\`${article.id_shop}\`・${article.article_name}`, value: `${article.article_desc} | ${article.prix} <:mersecoins:1135490066194645002>`})
        })

        return interaction.reply({ embeds: [embedShop], ephemeral: true })
    } else {
        if (item < 1 || item > shop.length) return interaction.reply({content: `❌| Vous devez rentrer un nombre compris entre 1 et ${shop.length}.`, ephemeral: true});
        const article = shop[item-1];
        console.log(article)
        const sqlCompte = "SELECT * FROM compte WHERE discord = ?";
        const comptes = await db.query(sqlCompte, [interaction.user.id]);
        if (comptes.length == 0) {
            return interaction.reply({content: "❌| Vous n'avez pas de compte.", ephemeral: true});
        }else if(comptes.length > 1) {
            return interaction.reply({content: "❌| Plusieurs compte on était trouvés.", ephemeral: true});
        }else {
            const compte = comptes[0];
            if(compte.mersecoins < article.prix)
                return interaction.reply({content: "❌| Vous n'avez pas assez de MerseCoins.", ephemeral: true});
            else {
                const prix = parseInt(article.prix);
                addMerseCoins(compte.twitch, -prix)
                indexFile.sendMsgTwitch(`L'utilisateur ${compte.twitch} a acheter ${article.article_name} !!`);
                return interaction.reply({content: "✅| Achat reussi !", ephemeral: true});
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
            type: ApplicationCommandOptionType.Number,
            minValue: 1
        }
    ]
}