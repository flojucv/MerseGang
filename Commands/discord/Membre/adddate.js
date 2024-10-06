const { ApplicationCommandOptionType } = require('discord.js');
const db = require('../../../function/db');

module.exports.runSlash = async(client, interaction) => {
    const sqlSearch = "SELECT * FROM anniversaire WHERE id_discord = ?";
    const responseSearch = await db.query(sqlSearch, [interaction.user.id]);

    if(responseSearch.length > 0) {
        return interaction.reply({content: "❌| Vous avez déjà rentré votre date d'anniversaire. Si vous souhaitez la changer, merci de la supprimer en premier.", ephemeral: true });
    } else {
        const jour = interaction.options.getNumber('jour');
        const mois = interaction.options.getString('mois');
        const annee = interaction.options.getNumber('annee');
        const date = `${annee}-${mois}-${jour}`;
        const sqlInsert = "INSERT INTO anniversaire (id_discord, date_anniv) VALUES (?, ?)";
        const response = await db.query(sqlInsert, [interaction.user.id, date]);

        console.log(response);
        if(response) {
            return interaction.reply({content : "✅| Date d'anniversaire ajouter !", ephemeral: true});
        } else {
            return interaction.reply({content: "❌| Une erreur est survenue, merci de contacter un administrateur.", ephemeral: true});
        }
    }


}

module.exports.help = {
    name: "addanniversaire",
    aliases: ['addAnniversaire', "addAnniv", "addanniv"],
    category: "membre",
    description: "Commande permettant de rentrer sa date d'anniversaire",
    usage: "<jj/mm/aaaa>",
    options: [
        {
            type: ApplicationCommandOptionType.Number,
            name: 'jour',
            description: 'Votre jour de naissance.',
            required: true,
            minValue: 1,
            maxValue: 31
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "mois",
            description: 'Votre mois de naissance.',
            required: true,
            choices: [
                {
                    name: "Janvier",
                    value: "01"
                },
                {
                    name: "Février",
                    value: "02"
                },
                {
                    name: "Mars",
                    value: "03"
                },
                {
                    name: "Avril",
                    value: "04"
                },
                {
                    name: "Mai",
                    value: "05"
                },
                {
                    name: "Juin",
                    value: "06"
                },
                {
                    name: "Juillet",
                    value: "07"
                },
                {
                    name: "Août",
                    value: "08"
                },
                {
                    name: "Septembre",
                    value: "09"
                },
                {
                    name: "Octobre",
                    value: "10"
                },
                {
                    name: "Novembre",
                    value: "11"
                },
                {
                    name: "Decembre",
                    value: "12"
                },

            ]
        },
        {
            type: ApplicationCommandOptionType.Number,
            name: "annee",
            description: 'Votre année de naissance.',
            required: true,
            minValue: 1990,
            maxValue: new Date().getFullYear()
        }

    ]
}