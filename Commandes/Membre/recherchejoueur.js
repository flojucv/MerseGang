const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder } = require('discord.js');
const { prefix } = require('../../bdd/config.json');
const ms = require('ms');
const fs = require('fs');

//COmmun
const attchment = new AttachmentBuilder('./img/rechercheJoueur.gif');

module.exports.run = async (client, message, args) => {
    message.delete()
    if (!args[0]) return message.channel.send(`❌| Veuillez rentrer le nombre de joueur qui doivent vous rejoindre. \`${prefix}recherchejoueur <nombre de joueur>\``).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    if (isNaN(args[0])) return message.channel.send(`❌| Vous devez rentrer un nombre. \`${prefix}recherchejoueur <nombre de joueur>\``).then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
    if (parseInt(args[0]) === 0) return message.channel.send(`❌| Vous ne pouvez pas lancez une recherche avec 0 joueur. \`${prefix}recherchejoueur <nombre de joueur>\``)
    let place = 1;
    let placeTotal = parseInt(args[0]) + 1
    let listeJoueur = []
    listeJoueur.push(message.author.id);

    const embedRechercheJoueur = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://cdn.discordapp.com/attachments/881093953036881940/881094182897324062/logo.png", url: "https://discord.gg/p2QC3NQSmG"} )
        .setColor('Random')
        .setTitle('Recherche de joueurs')
        .setDescription(`<@${message.author.id}> joue actuellement a ${args.slice(1).join("")}, il reste ${placeTotal - 1} place pour former une team de ${placeTotal} personne qui veut me rejoindre ?\nDurée pour rejoindre : 20 minutes`)
        .addFields(
            { name: "Place :", value: `${place}/${placeTotal}` },
            { name: "Liste des joueurs ayant rejoins", value: `<@${listeJoueur.join(">\n<@")}>` }
        )
        .setFooter({text: `Commande executez par ${message.author.username}`})
        .setImage('attachment://rechercheJoueur.gif')
        .setTimestamp()
    let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`recherche${message.author.id}`)
                .setEmoji('✔')
                .setLabel('| Rejoindre le groupe')
                .setStyle('SUCCESS')
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`recherche${message.author.id}leave`)
                .setEmoji('✖')
                .setLabel('| Quitter le groupe')
                .setStyle('DANGER')
        )

    let idMsg
    message.channel.send('Message Embed en construction...').then(msg => {
        idMsg = msg.id;
    })
    await message.channel.send({ content: 'Rejoingnez le :', embeds: [embedRechercheJoueur], components: [row], files: [attchment] }).then(async msg => {
        const msgRechercheJoueur = await message.channel.messages.cache.find(message => message.id === idMsg);
        msgRechercheJoueur.delete()
        idMsg = msg.id;
    });

    const msgRechercheJoueur = await message.channel.messages.cache.find(message => message.id === idMsg);

    let fullteam = false;
    const filter = (interaction) => interaction.customId === `recherche${message.author.id}`
    const collector = msgRechercheJoueur.createMessageComponentCollector(filter)
    setTimeout(() => {
        if (fullteam === true) return;
        if (listeJoueur.length === 1) {
            msgRechercheJoueur.delete();
            return message.channel.send("Malheureusement le Bot n’a pas trouver d’autre joueur retente ta chance plus tard ! 🙂")
        } else {
            msgRechercheJoueur.delete();
            return message.channel.send(`Malheureusement le Bot n’a pas trouver tout les joueurs mais tu peut jouer avec : \n<@${listeJoueur.join(">\n<@")}>`)
        }
    }, ms("20m"))

    collector.on('collect', async interaction => {
        if (interaction.customId === `recherche${message.author.id}`) {
            if (!(listeJoueur.indexOf(interaction.user.id) === -1)) return interaction.reply({ content: "❌| Vous avez déjà rejoins le groupe.", ephemeral: true });
            place++;
            listeJoueur.push(interaction.user.id);
            field_title = ["Place :", "Liste des joueurs ayant rejoins"];
            for (let i = 0; field_title.length > i; i++) {
                let indexField = '';
                embedRechercheJoueur.fields.map(field => {
                    if (indexField !== '') return;
                    if (field.name === field_title[i]) indexField += embedRechercheJoueur.fields.indexOf(field);
                })
                delete embedRechercheJoueur.fields[indexField];
            }
            embedRechercheJoueur.addFields(
                { name: "Place :", value: `${place}/${placeTotal}` },
                { name: "Liste des joueurs ayant rejoins", value: `<@${listeJoueur.join(">\n<@")}>` }
            )
            await msgRechercheJoueur.edit({ embeds: [embedRechercheJoueur] })
            interaction.reply({ content: "✅| Vous avez rejoins le groupe.", ephemeral: true });
            if (place == placeTotal) {
                msgRechercheJoueur.delete();
                message.channel.send(`Le groupe est au complet.\nLa team est composer de : \n<@${listeJoueur.join(`>\n<@`)}>\nGood Game`);
                fullteam = true;
            }
        }else if(interaction.customId === `recherche${message.author.id}leave`) {
            if (listeJoueur.indexOf(interaction.user.id) === -1) return interaction.reply({ content: "❌| Vous n'avez pas rejoint le groupe", ephemeral: true });
            if(interaction.member.id === message.author.id) return interaction.reply({ content: "❌| Vous ne pouvez pas quittez le groupe que vous avez créer", ephemeral: true });

            place--;
            let g = listeJoueur.indexOf(interaction.user.id);
            listeJoueur.splice(g, 1);
            field_title = ["Place :", "Liste des joueurs ayant rejoins"];
            for (let i = 0; field_title.length > i; i++) {
                let indexField = '';
                embedRechercheJoueur.fields.map(field => {
                    if (indexField !== '') return;
                    if (field.name === field_title[i]) indexField += embedRechercheJoueur.fields.indexOf(field);
                })
                delete embedRechercheJoueur.fields[indexField];
            }
            embedRechercheJoueur.addFields(
                { name: "Place :", value: `${place}/${placeTotal}` },
                { name: "Liste des joueurs ayant rejoins", value: `<@${listeJoueur.join(">\n<@")}>` }
            )
            await msgRechercheJoueur.edit({ embeds: [embedRechercheJoueur] })
            interaction.reply({ content: "✅| Vous avez quitter le groupe.", ephemeral: true });
        }

    })
}


module.exports.runSlash = async(client, interaction) => {
    let place = 1;
    let placeTotal = interaction.options.getNumber('joueur') + 1
    let listeJoueur = []
    listeJoueur.push(interaction.user.id);

    const embedRechercheJoueur = new EmbedBuilder()
    .setAuthor( {name: "Bot by flojucv", iconURL: "https://cdn.discordapp.com/attachments/881093953036881940/881094182897324062/logo.png", url: "https://discord.gg/p2QC3NQSmG"} )
        .setColor('Random')
        .setTitle('Recherche de joueurs')
        .setDescription(`<@${interaction.user.id}> joue actuellement a ${interaction.options.getString('jeux')}, il reste ${placeTotal - 1} place pour former une team de ${placeTotal} personne qui veut me rejoindre ?\nDurée pour rejoindre : 20 minutes`)
        .addFields(
            { name: "Place :", value: `${place}/${placeTotal}` },
            { name: "Liste des joueurs ayant rejoins", value: `<@${listeJoueur.join(">\n<@")}>` }
        )
        .setFooter({text: `Commande executez par ${interaction.user.username}`})
        .setImage('attachment://rechercheJoueur.gif')
        .setTimestamp()
    let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`recherche${interaction.user.id}`)
                .setEmoji('✔')
                .setLabel('| Rejoindre le groupe')
                .setStyle('SUCCESS')
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`recherche${interaction.user.id}leave`)
                .setEmoji('✖')
                .setLabel('| Quitter le groupe')
                .setStyle('DANGER')
        )

    let idMsg
    interaction.reply({content: 'Message Embed en construction...', ephemeral: true})
    await interaction.channel.send({ content: 'Rejoingnez le :', embeds: [embedRechercheJoueur], components: [row], files: [attchment] }).then(async message => {
        idMsg = message.id;
    });

    const msgRechercheJoueur = await interaction.channel.messages.cache.find(message => message.id === idMsg);

    let fullteam = false;
    const filter = (interaction) => interaction.customId === `recherche${interaction.user.id}`
    const collector = msgRechercheJoueur.createMessageComponentCollector(filter)
    setTimeout(() => {
        if (fullteam === true) return;
        if (listeJoueur.length === 1) {
            msgRechercheJoueur.delete();
            return interaction.channel.send("Malheureusement le Bot n’a pas trouver d’autre joueur retente ta chance plus tard ! 🙂")
        } else {
            msgRechercheJoueur.delete();
            return interaction.channel.send(`Malheureusement le Bot n’a pas trouver tout les joueurs mais tu peut jouer avec : \n<@${listeJoueur.join(">\n<@")}>`)
        }
    }, ms("20m"))

    const idAuthor = interaction.user.id
    collector.on('collect', async interaction => {
        if (interaction.customId === `recherche${idAuthor}`) {
            if (!(listeJoueur.indexOf(interaction.user.id) === -1)) return interaction.reply({ content: "❌| Vous avez déjà rejoins le groupe.", ephemeral: true });
            place++;
            listeJoueur.push(interaction.user.id);
            field_title = ["Place :", "Liste des joueurs ayant rejoins"];
            for (let i = 0; field_title.length > i; i++) {
                let indexField = '';
                embedRechercheJoueur.fields.map(field => {
                    if (indexField !== '') return;
                    if (field.name === field_title[i]) indexField += embedRechercheJoueur.fields.indexOf(field);
                })
                delete embedRechercheJoueur.fields[indexField];
            }
            embedRechercheJoueur.addFields(
                { name: "Place :", value: `${place}/${placeTotal}` },
                { name: "Liste des joueurs ayant rejoins", value: `<@${listeJoueur.join(">\n<@")}>` }
            )
            await msgRechercheJoueur.edit({ embeds: [embedRechercheJoueur] })
            interaction.reply({ content: "✅| Vous avez rejoins le groupe.", ephemeral: true });
            if (place == placeTotal) {
                msgRechercheJoueur.delete();
                interaction.channel.send(`Le groupe est au complet.\nLa team est composer de : \n<@${listeJoueur.join(`>\n<@`)}>\nGood Game`);
                fullteam = true;
            }
        }else if(interaction.customId === `recherche${idAuthor}leave`) {
            if (listeJoueur.indexOf(interaction.user.id) === -1) return interaction.reply({ content: "❌| Vous n'avez pas rejoint le groupe", ephemeral: true });
            if(interaction.member.id === idAuthor) return interaction.reply({ content: "❌| Vous ne pouvez pas quittez le groupe que vous avez créer", ephemeral: true });

            place--;
            let g = listeJoueur.indexOf(interaction.user.id);
            listeJoueur.splice(g, 1);
            field_title = ["Place :", "Liste des joueurs ayant rejoins"];
            for (let i = 0; field_title.length > i; i++) {
                let indexField = '';
                embedRechercheJoueur.fields.map(field => {
                    if (indexField !== '') return;
                    if (field.name === field_title[i]) indexField += embedRechercheJoueur.fields.indexOf(field);
                })
                delete embedRechercheJoueur.fields[indexField];
            }
            embedRechercheJoueur.addFields(
                { name: "Place :", value: `${place}/${placeTotal}` },
                { name: "Liste des joueurs ayant rejoins", value: `<@${listeJoueur.join(">\n<@")}>` }
            )
            await msgRechercheJoueur.edit({ embeds: [embedRechercheJoueur] })
            interaction.reply({ content: "✅| Vous avez quitter le groupe.", ephemeral: true });
        }

    })
}



module.exports.help = {
    name: "recherchejoueur",
    aliases: ['rj', 'game'],
    category: "membre",
    description: "Commande qui te permet de demandez au gens du discord s'il souhaite jouez avec toi !",
    usage: "<nombre de joueurs> <jeux>",
    options: [
        {
            type: 10,
            name: 'joueur',
            description: 'Vous devez mettre le nombre de joueur qui doivent vous rejoindre.',
            required: true
        },
        {
            type: 3,
            name: 'jeux',
            description: 'Le jeux auquelle vous allez jouer.',
            required: true
        }
    ]
}