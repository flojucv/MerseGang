const { prefix } = require('../../bdd/config.json');
const fs = require("fs");
const listeanniv = require('../../bdd/listeanniv');

module.exports.run = async(client, message, args) => {
    message.delete();
    
    let a = 0;
    while(a < listeanniv.length) {
        if(message.author.id === listeanniv[a].id) {
            break;
        }else {
            a ++;
        }
    }
    if( a > -1){
        listeanniv.splice(a, 1);
    }
    fs.writeFile("./bdd/listeanniv.json", JSON.stringify(listeanniv, null, 4), (err) => {
        if(err) message.channel.send("Une erreur est survenue.");
    })

    message.channel.send('✅| Votre date d\'anniversaire a été supprimer').then(message => { setTimeout(() => message.delete().catch(err => console.log(err)), 5000); });
}

module.exports.runSlash = async(client, interaction) => {
    let a = 0;
    while(a < listeanniv.length) {
        if(interaction.user.id === listeanniv[a].id) {
            break;
        }else {
            a ++;
        }
    }
    if( a > -1){
        listeanniv.splice(a, 1);
    }
    fs.writeFile("./bdd/listeanniv.json", JSON.stringify(listeanniv, null, 4), (err) => {
        if(err) message.channel.send("Une erreur est survenue.");
    })

    return interaction.reply({ content: "✅| Votre date d'anniversaire a bien été supprimer.", ephemeral: true})
}

module.exports.help = {
    name: "removedate",
    aliases: ['rd'],
    category: "membre",
    description: "Commande permettant de retirer sa date d'anniversaire",
    usage: "<jj/mm/aaaa>",
    cooldown : 1
}