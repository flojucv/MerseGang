const voteCandidat = require("../bdd/candidat.json");
const vote = require("../bdd/vote.json");
const fs = require('fs');
const { EmbedBuilder } = require("discord.js")

module.exports = async(client, interaction) => {

    if(interaction.isCommand()) {
        const cmd = client.commands.get(interaction.commandName);
        if(!cmd) return interaction.reply("Erreur, cette commande n'existe pas");
        cmd.runSlash(client, interaction);
    }else if(interaction.isButton()) {
        /*if(interaction.channel.id === "989083104054505562") {

            if(vote.indexOf(interaction.member.id) === -1){
                vote.push(interaction.member.id);
                fs.writeFile("./bdd/vote.json", JSON.stringify(vote, null, 4), (err) => {
                    if(err) message.channel.send("Une erreur est survenue.");
                })
            }else {
                return interaction.reply({ content : "❌| Vous avez déja voter", ephemeral: true });
            }


            argsInte = interaction.customId.split(";")
            if(voteCandidat[argsInte[1]] === undefined) {
                voteCandidat[argsInte[1]] = 0;
            }

            voteCandidat[argsInte[1]] ++;
            fs.writeFile("./bdd/candidat.json", JSON.stringify(voteCandidat, null, 4), (err) => {
                if(err) message.channel.send("Une erreur est survenue.");
            })

            const msgCandidat = await interaction.channel.messages.cache.find(message => message.id === interaction.message.id)

            const embedEdit = new EmbedBuilder()
            .setTitle(`${msgCandidat.embeds[0].title}`)
            .setColor(`RANDOM`)
            .setAuthor( {name: "Bot by flojucv", iconURL: "https://cdn.discordapp.com/attachments/881093953036881940/881094182897324062/logo.png", url: "https://discord.gg/p2QC3NQSmG"} )
            .addFields(
                { name: "Texte du candidat", value: `${msgCandidat.embeds[0].fields[0]["value"]}` },
                { name: "Nombre de vote", value: `${voteCandidat[argsInte[1]]}`}
            )
            if(msgCandidat.embeds[0].image != null) {
                embedEdit.setImage(`${msgCandidat.embeds[0].image.url}`)
            }

            msgCandidat.edit({embeds:[embedEdit]})
            return interaction.reply({ content:`✅| Votre vote a été enregistré.`, ephemeral: true });
        }*/
    }
};