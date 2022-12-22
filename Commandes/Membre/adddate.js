const { prefix } = require('../../bdd/config.json');
const fs = require("fs");
const listeanniv = require('../../bdd/listeanniv');

module.exports.run = async(client, message, args) => {
    message.delete();
    if(!args[0]) return message.channel.send(`❌| Vous n'avez pas renseignez de date d'anniversaire. \`${prefix}adddate <jj/mm/aaaa>\``).then(message => { setTimeout(()=> message.delete(), 5000); });
    const varJour = args[0].substring(0, 2);
    if(isNaN(varJour) === true) return message.channel.send(`❌| Date invalide ! Vous avez mal renseignez le jour de naissance. \`${prefix}adddate <jj/mm/aaaa>\``).then(message => { setTimeout(()=> message.delete(), 5000); });
    const varMois = args[0].substring(3, 5);
    if(isNaN(varMois) === true) return message.channel.send(`❌| Date invalide ! Vous avez mal renseignez le mois de naissance. \`${prefix}adddate <jj/mm/aaaa>\``).then(message => { setTimeout(()=> message.delete(), 5000); });
    const varAnnee = args[0].substring(6, 10);
    if(isNaN(varAnnee) === true) return message.channel.send(`❌| Date invalide ! Vous avez mal renseignez l'année de naissance. \`${prefix}adddate <jj/mm/aaaa>\``).then(message => { setTimeout(()=> message.delete(), 5000); });
    var i = 0;
    var verif = 0;
    while(listeanniv.length > i ) {
        if(listeanniv[i].id === message.author.id) {
            message.channel.send("❌|Vous avez déja rentrer une date d'anniversaire ! `-removedate` pour la supprimer").then(message => { setTimeout(()=> message.delete(), 5000); });
            verif =1;
            break;
        }
        i ++;
    }
    if(verif !=0){

    }else {
        listeanniv.push({ id: message.author.id, jour: varJour, mois: varMois, annee: varAnnee });
        fs.writeFile("./bdd/listeanniv.json", JSON.stringify(listeanniv, null, 4), (err) => {
            if(err) message.channel.send("Une erreur est survenue.");
        })
        message.channel.send("✅| Date d'anniversaire ajouter !").then(message => { setTimeout(()=> message.delete(), 5000); });
    }

}

module.exports.runSlash = async(client, interaction) => {
    var i = 0;
    while(listeanniv.length > i ) {
        if(listeanniv[i].id === interaction.user.id) {
            return interaction.reply({content: `❌|Vous avez déja rentrer une date d'anniversaire ! \`${prefix}removedate\` pour la supprimer`, ephemeral: true});
        }
        i ++;
    }
    listeanniv.push({ id: interaction.user.id, jour: `${interaction.options.getNumber('jour')}`, mois: interaction.options.getString('mois'), annee: `${interaction.options.getNumber('annee')}`});
    fs.writeFile("./bdd/listeanniv.json", JSON.stringify(listeanniv, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    })
    return interaction.reply({content : "✅| Date d'anniversaire ajouter !", ephemeral: true});

}

module.exports.help = {
    name: "adddate",
    aliases: ['adddate'],
    category: "membre",
    description: "Commande permettant de rentrer sa date d'anniversaire",
    usage: "<jj/mm/aaaa>",
    options: [
        {
            type: 10,
            name: 'jour',
            description: 'Votre jour de naissance.',
            required: true,
            minValue: 1,
            maxValue: 31
        },
        {
            type: 3,
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
            type: 10,
            name: "annee",
            description: 'Votre annee de naissance.',
            required: true,
            minValue: 1990,
            maxValue: new Date().getFullYear()
        }

    ]
}