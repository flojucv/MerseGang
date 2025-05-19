const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandOptionType } = require('discord.js');
const { getMerseCoins, addMerseCoins } = require('../../../function/merseCoinsFunction');
const ms = require('ms');

// Emojis des cartes pour une meilleure visualisation
const CARD_SUITS = ['♠️', '♥️', '♦️', '♣️'];
const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];


module.exports.runSlash = async (client, interaction) => {
    const userId = interaction.user.id;
    const bet = interaction.options.getInteger('mise');

    // Vérifier si l'utilisateur a déjà une partie en cours
    if (client.activeGamesBlackjack.has(userId)) {
        return interaction.reply({
            content: '❌| Vous avez déjà une partie de Blackjack en cours!',
            ephemeral: true
        });
    }

    // Vérifier si l'utilisateur a assez d'argent
    const userMoney = await getMerseCoins(userId);
    if (userMoney < bet) {
        return interaction.reply({
            content: `❌| Vous n'avez pas assez d'argent. Solde actuel: ${userMoney} <:mersecoins:1135490066194645002>`,
            ephemeral: true
        });
    }

    // Déduire la mise du solde de l'utilisateur
    await addMerseCoins(userId, -bet, false, 'discord');

    // Initialiser une nouvelle partie
    const game = {
        bet,
        playerHand: [],
        dealerHand: [],
        deck: createShuffledDeck(),
        gameEnded: false,
        playerStood: false,
        interactionMessage: null, // Pour stocker la référence au message d'interaction
        collector: null // Pour stocker le collecteur de composants
    };

    // Distribution initiale
    game.playerHand.push(dealCard(game.deck));
    game.dealerHand.push(dealCard(game.deck));
    game.playerHand.push(dealCard(game.deck));
    game.dealerHand.push(dealCard(game.deck));

    // Enregistrer la partie
    client.activeGamesBlackjack.set(userId, game);

    // Vérifier si le joueur a un Blackjack naturel
    if (calculateHandValue(game.playerHand) === 21) {
        await handlePlayerBlackjack(client, interaction, userId, game);
    } else {
        // Afficher l'état du jeu
        await displayGameState(client, interaction, game);
    }
};

// Fonctions utilitaires pour le jeu

// Créer un paquet de cartes mélangé
function createShuffledDeck() {
    const deck = [];
    for (const suit of CARD_SUITS) {
        for (const value of CARD_VALUES) {
            deck.push({ value, suit });
        }
    }

    // Mélanger le paquet (algorithme de Fisher-Yates)
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

// Distribuer une carte du paquet
function dealCard(deck) {
    return deck.pop();
}

// Calculer la valeur d'une main
function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    for (const card of hand) {
        if (card.value === 'A') {
            aces += 1;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }

    // Ajuster la valeur des as si nécessaire
    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }

    return value;
}

// Formater une main de cartes pour l'affichage
function formatHand(hand) {
    return hand.map(card => `${card.value}${card.suit}`).join('| ');
}

// Gérer un Blackjack naturel du joueur
async function handlePlayerBlackjack(client, interaction, userId, game) {
    const dealerValue = calculateHandValue(game.dealerHand);
    let winnings = 0;
    let resultMessage = '';

    if (dealerValue === 21 && game.dealerHand.length === 2) {
        // Égalité de Blackjack
        winnings = game.bet;
        resultMessage = '🤝| Égalité! Vous et le croupier avez un Blackjack. Votre mise vous est rendue.';
    } else {
        // Blackjack du joueur (paie 3:2)
        winnings = game.bet + Math.floor(game.bet * 1.5);
        resultMessage = `🎉| Blackjack! Vous avez gagné {winnings} <:mersecoins:1135490066194645002>`;
    }

    // Mettre à jour l'argent de l'utilisateur
    const gains = await addMerseCoins(userId, winnings, true, 'discord');
    resultMessage = resultMessage.replace('{winnings}', gains);

    // Supprimer la partie
    client.activeGamesBlackjack.delete(userId);

    // Créer l'embed pour le résultat final
    const embed = new EmbedBuilder()
        .setTitle('🃏 Blackjack - Résultat')
        .setColor('#FFD700')
        .addFields(
            { name: '🎮| Votre main', value: `${formatHand(game.playerHand)}`, inline: true },
            { name: '🃏| Score des cartes', value: `${calculateHandValue(game.playerHand)}`, inline: true },
            { name: '🎭| Main du croupier', value: `${formatHand(game.dealerHand)} (${calculateHandValue(game.dealerHand)})`},
            { name: '💰| Résultat', value: resultMessage }
        );

    await interaction.reply({ embeds: [embed] });
}

// Afficher l'état actuel du jeu
async function displayGameState(client, interaction, game) {
    const playerValue = calculateHandValue(game.playerHand);
    const dealerValue = calculateHandValue(game.dealerHand);

    // Créer l'embed
    const embed = new EmbedBuilder()
        .setTitle('🃏 Blackjack')
        .setColor('#1E90FF')
        .addFields(
            { name: '🎮| Votre main', value: `${formatHand(game.playerHand)}`, inline: true },
            { name: '🃏| Score des cartes', value: `${playerValue}`, inline: true },
            {
                name: '🎭| Main du croupier', value: game.playerStood
                    ? `${formatHand(game.dealerHand)} (${dealerValue})`
                    : `${game.dealerHand[0].value}${game.dealerHand[0].suit} ❓`
            },
            { name: '💰| Mise', value: `${game.bet}` }
        );

    // Créer les boutons si la partie n'est pas terminée
    let components = [];
    if (!game.gameEnded && !game.playerStood) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('hit')
                    .setLabel('Tirer')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('stand')
                    .setLabel('Rester')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('double')
                    .setLabel('Doubler')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(game.playerHand.length > 2) // Désactiver si plus de 2 cartes
            );
        components.push(row);
    }

    // Envoi initial ou mise à jour du message
    let messageResponse;
    if (interaction.replied || interaction.deferred) {
        messageResponse = await interaction.editReply({ embeds: [embed], components });
    } else {
        messageResponse = await interaction.reply({ embeds: [embed], components, fetchReply: true });
    }

    // Stocker la référence au message pour les mises à jour futures
    game.interactionMessage = messageResponse;

    // Enregistrer le collecteur dans l'objet game pour pouvoir y accéder ailleurs
    if (!game.gameEnded && !game.playerStood) {
        // Créer un nouveau collecteur sur l'interaction elle-même pour une meilleure fiabilité
        const collector = interaction.channel.createMessageComponentCollector({
            filter: i => ['hit', 'stand', 'double'].includes(i.customId) && 
                        i.user.id === interaction.user.id &&
                        i.message.id === messageResponse.id,
            time: ms('5m') // Augmentation du temps à 5 minutes
        });

        // Stocker le collecteur dans l'objet game
        game.collector = collector;

        collector.on('collect', async i => {
            try {
                const userId = i.user.id;
                const game = client.activeGamesBlackjack.get(userId);

                if (!game) {
                    await i.reply({ content: '❌ Cette partie n\'existe plus.', ephemeral: true });
                    collector.stop();
                    return;
                }

                // Répondre immédiatement à l'interaction pour éviter l'erreur
                try {
                    await i.deferUpdate();
                } catch (err) {
                    // Tenter une approche alternative si deferUpdate échoue
                    try {
                        await i.reply({ content: "Traitement en cours...", ephemeral: true });
                    } catch (replyErr) {
                        return; // Abandonner cette interaction si les deux méthodes échouent
                    }
                }

                // Traiter l'action
                switch (i.customId) {
                    case 'hit':
                        await handleHit(client, interaction, userId, game);
                        break;
                    case 'stand':
                        await handleStand(client, interaction, userId, game);
                        break;
                    case 'double':
                        await handleDouble(client, interaction, userId, game);
                        break;
                }

                // Si la partie est terminée, arrêter le collecteur
                if (game.gameEnded) {
                    collector.stop();
                }
            } catch (error) {
                console.error("Erreur lors du traitement de l'action:", error);
            }
        });

        collector.on('end', async (collected, reason) => {
            try {
                const game = client.activeGamesBlackjack.get(interaction.user.id);
                if (game && !game.gameEnded) {
                    // Si le collecteur se termine sans action, gérer la fin de la partie
                    game.gameEnded = true;
                    await handleBust(client, interaction, interaction.user.id, game);
                    // Créer un embed pour indiquer que le temps est écoulé
                    const timeoutEmbed = new EmbedBuilder()
                        .setTitle('⏰| Temps écoulé!')
                        .setColor('#FF0000')
                        .setDescription('Vous avez pris trop de temps pour agir. La partie est terminée.');
                    await interaction.followUp({ embeds: [timeoutEmbed], ephemeral: true });
                    // Supprimer la partie
                    client.activeGamesBlackjack.delete(interaction.user.id);
                    // Arrêter le collecteur
                    if (game.collector) {
                        try {
                            game.collector.stop();
                        } catch (err) {
                            console.error("Erreur lors de l'arrêt du collecteur:", err);
                        }
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la fin du collecteur:", error);
            }
        });
    }
}

// Gérer l'action "Tirer"
async function handleHit(client, interaction, userId, game) {
    try {
        // Tirer une carte
        game.playerHand.push(dealCard(game.deck));
        const playerValue = calculateHandValue(game.playerHand);

        // Vérifier si le joueur a dépassé 21
        if (playerValue > 21) {
            await handleBust(client, interaction, userId, game);
        } else {
            // Mettre à jour l'affichage
            await displayGameState(client, interaction, game);
        }
    } catch (error) {
        console.error("Erreur dans handleHit:", error);
    }
}

// Gérer l'action "Rester"
async function handleStand(client, interaction, userId, game) {
    try {
        game.playerStood = true;
        await handleDealerTurn(client, interaction, userId, game);
    } catch (error) {
        console.error("Erreur dans handleStand:", error);
    }
}

// Gérer l'action "Doubler"
async function handleDouble(client, interaction, userId, game) {
    try {
        // Vérifier si le joueur a assez d'argent pour doubler
        const userMoney = await getMerseCoins(userId);
        if (userMoney < game.bet) {
            // Utiliser followUp au lieu de reply pour éviter les erreurs d'interaction déjà utilisée
            await interaction.followUp({
                content: `❌| Vous n'avez pas assez d'argent pour doubler votre mise. Solde actuel: ${userMoney} <:mersecoins:1135490066194645002>`,
                ephemeral: true
            });
            return;
        }

        // Déduire la mise supplémentaire
        await addMerseCoins(userId, -game.bet, false, 'discord');
        game.bet *= 2;

        // Tirer une seule carte
        game.playerHand.push(dealCard(game.deck));
        const playerValue = calculateHandValue(game.playerHand);

        // Vérifier si le joueur a dépassé 21
        if (playerValue > 21) {
            await handleBust(client, interaction, userId, game);
        } else {
            // Passer le tour au croupier
            game.playerStood = true;
            await handleDealerTurn(client, interaction, userId, game);
        }
    } catch (error) {
        console.error("Erreur dans handleDouble:", error);
    }
}

// Gérer le dépassement du joueur
async function handleBust(client, interaction, userId, game) {
    try {
        game.gameEnded = true;

        // Arrêter le collecteur si existant
        if (game.collector) {
            try {
                game.collector.stop();
            } catch (err) {
                console.error("Erreur lors de l'arrêt du collecteur:", err);
            }
        }

        let message = '';

        if(calculateHandValue(game.playerHand) > 21) {
            message = `❌| Perdu! Vous avez dépassé 21. Vous perdez ${game.bet} <:mersecoins:1135490066194645002>`;
        } else {
            message = `❌| Perdu! Vous avez mit trop de temps pour agir. Vous perdez ${game.bet} <:mersecoins:1135490066194645002>`;
        }

        // Créer l'embed pour le résultat
        const embed = new EmbedBuilder()
            .setTitle('🃏 Blackjack - Résultat')
            .setColor('#FF0000')
            .addFields(
                { name: '🎮| Votre main', value: `${formatHand(game.playerHand)}`, inline: true },
                { name: '🃏| Score des cartes', value: `${calculateHandValue(game.playerHand)}`, inline: true },
                { name: '🎭| Main du croupier', value: `${formatHand(game.dealerHand)} (${calculateHandValue(game.dealerHand)})` },
                { name: '💰| Résultat', value: message }
            );

        // Afficher le résultat en utilisant editReply sur l'interaction originale
        try {
            await interaction.editReply({ embeds: [embed], components: [] });
        } catch (err) {
            console.error("Erreur lors de l'édition du message:", err);
            // Tenter d'envoyer un nouveau message si l'édition échoue
            try {
                await interaction.followUp({ embeds: [embed], ephemeral: true });
            } catch (followUpErr) {
                console.error("Erreur lors de l'envoi du followUp:", followUpErr);
            }
        }

        // Supprimer la partie
        client.activeGamesBlackjack.delete(userId);
    } catch (error) {
        console.error("Erreur dans handleBust:", error);
    }
}

// Gérer le tour du croupier
async function handleDealerTurn(client, interaction, userId, game) {
    try {
        // Le croupier tire des cartes jusqu'à avoir au moins 17
        while (calculateHandValue(game.dealerHand) < 17) {
            game.dealerHand.push(dealCard(game.deck));
        }

        // Déterminer le résultat
        await determineWinner(client, interaction, userId, game);
    } catch (error) {
        console.error("Erreur dans handleDealerTurn:", error);
    }
}

// Déterminer le gagnant et le paiement
async function determineWinner(client, interaction, userId, game) {
    try {
        game.gameEnded = true;

        // Arrêter le collecteur si existant
        if (game.collector) {
            try {
                game.collector.stop();
            } catch (err) {
                console.error("Erreur lors de l'arrêt du collecteur:", err);
            }
        }

        const playerValue = calculateHandValue(game.playerHand);
        const dealerValue = calculateHandValue(game.dealerHand);

        let resultMessage = '';
        let winnings = 0;
        let color = '#FF0000'; // Rouge par défaut (perte)

        // Calculer le résultat
        if (dealerValue > 21) {
            // Le croupier dépasse
            winnings = game.bet * 2;
            resultMessage = `🎉| Gagné! Le croupier a dépassé 21. Vous gagnez {winnings} <:mersecoins:1135490066194645002> (mise: ${game.bet}).`;
            color = '#00FF00';
        } else if (playerValue > dealerValue) {
            // Le joueur gagne
            winnings = game.bet * 2;
            resultMessage = `🎉| Gagné! Votre main (${playerValue}) bat celle du croupier (${dealerValue}). Vous gagnez {winnings} <:mersecoins:1135490066194645002> (mise: ${game.bet}).`;
            color = '#00FF00';
        } else if (playerValue === dealerValue) {
            // Égalité
            winnings = game.bet;
            resultMessage = `🤝| Égalité! Votre mise vous est rendue.`;
            color = '#FFFF00';
        } else {
            // Le croupier gagne
            resultMessage = `❌| Perdu! La main du croupier (${dealerValue}) bat la vôtre (${playerValue}). Vous perdez ${game.bet} <:mersecoins:1135490066194645002>`;
        }

        // Mettre à jour l'argent de l'utilisateur
        const gains = await addMerseCoins(userId, winnings, (color == '#00FF00') ? true : false, 'discord');
        resultMessage = resultMessage.replace('{winnings}', gains);

        // Créer l'embed pour le résultat final
        const embed = new EmbedBuilder()
            .setTitle('🃏 Blackjack - Résultat')
            .setColor(color)
            .addFields(
                { name: '🎮| Votre main', value: `${formatHand(game.playerHand)} (${playerValue})`, inline: true },
                { name: '🃏| Score des cartes', value: `${playerValue}`, inline: true },
                { name: '🎭| Main du croupier', value: `${formatHand(game.dealerHand)} (${dealerValue})` },
                { name: '💰| Résultat', value: resultMessage }
            );

        // Afficher le résultat en utilisant editReply sur l'interaction originale
        try {
            await interaction.editReply({ embeds: [embed], components: [] });
        } catch (err) {
            console.error("Erreur lors de l'édition du message:", err);
            // Tenter d'envoyer un nouveau message si l'édition échoue
            try {
                await interaction.followUp({ embeds: [embed], ephemeral: true });
            } catch (followUpErr) {
                console.error("Erreur lors de l'envoi du followUp:", followUpErr);
            }
        }

        // Supprimer la partie
        client.activeGamesBlackjack.delete(userId);
    } catch (error) {
        console.error("Erreur dans determineWinner:", error);
    }
}


module.exports.help = {
    name: "blackjack",
    aliases: ['b', 'bj'],
    category: "casino",
    description: "Commande qui permet de jouer au blackjack.",
    usage: "<mise>",
    options: [
        {
            name: "mise",
            description: "Mise que vous souhaitez mettre.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            minValue: 10
        }
    ]
}