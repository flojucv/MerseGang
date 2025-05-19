const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandOptionType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { getMerseCoins, addMerseCoins } = require('../../../function/merseCoinsFunction');

// Configuration de la roulette
const ROULETTE_NUMBERS = [
    { number: 0, color: 'green' },
    { number: 1, color: 'red' }, { number: 2, color: 'black' }, { number: 3, color: 'red' },
    { number: 4, color: 'black' }, { number: 5, color: 'red' }, { number: 6, color: 'black' },
    { number: 7, color: 'red' }, { number: 8, color: 'black' }, { number: 9, color: 'red' },
    { number: 10, color: 'black' }, { number: 11, color: 'black' }, { number: 12, color: 'red' },
    { number: 13, color: 'black' }, { number: 14, color: 'red' }, { number: 15, color: 'black' },
    { number: 16, color: 'red' }, { number: 17, color: 'black' }, { number: 18, color: 'red' },
    { number: 19, color: 'red' }, { number: 20, color: 'black' }, { number: 21, color: 'red' },
    { number: 22, color: 'black' }, { number: 23, color: 'red' }, { number: 24, color: 'black' },
    { number: 25, color: 'red' }, { number: 26, color: 'black' }, { number: 27, color: 'red' },
    { number: 28, color: 'black' }, { number: 29, color: 'black' }, { number: 30, color: 'red' },
    { number: 31, color: 'black' }, { number: 32, color: 'red' }, { number: 33, color: 'black' },
    { number: 34, color: 'red' }, { number: 35, color: 'black' }, { number: 36, color: 'red' }
];

// Types de paris disponibles
const BET_TYPES = {
    COLOR: 'color',
    NUMBER: 'number',
    EVEN_ODD: 'even_odd',
    DOZEN: 'dozen',
    COLUMN: 'column',
    HIGH_LOW: 'high_low'
};

// Multiplicateurs pour chaque type de pari
const MULTIPLIERS = {
    [BET_TYPES.COLOR]: 2,        // Rouge ou Noir (1:1)
    [BET_TYPES.NUMBER]: 36,      // Numéro spécifique (35:1)
    [BET_TYPES.EVEN_ODD]: 2,     // Pair ou Impair (1:1)
    [BET_TYPES.DOZEN]: 3,        // Douzaine (2:1)
    [BET_TYPES.COLUMN]: 3,       // Colonne (2:1)
    [BET_TYPES.HIGH_LOW]: 2      // 1-18 ou 19-36 (1:1)
};

module.exports.runSlash = async (client, interaction) => {
    const userId = interaction.user.id;
    const betAmount = interaction.options.getInteger('mise');

    // Vérifier si l'utilisateur a assez d'argent
    const userMoney = await getMerseCoins(userId);
    if (userMoney < betAmount) {
        return interaction.reply({
            content: `❌ Vous n'avez pas assez d'argent. Solde actuel: ${userMoney} <:mersecoins:1135490066194645002>`,
            ephemeral: true
        });
    }

    // Vérifie si une partie est déjà en cours
    if (client.activeGamesRoulette && client.activeGamesRoulette.has(userId)) {
        return interaction.reply({
            content: '❌ Vous avez déjà une partie de roulette en cours!',
            ephemeral: true
        });
    }


    // Créer l'embed pour choisir le type de pari
    const embed = new EmbedBuilder()
        .setTitle('🎰 Roulette - Sélection du pari')
        .setDescription(`Choisissez le type de pari que vous souhaitez faire.\nMise: ${betAmount} <:mersecoins:1135490066194645002>`)
        .setColor('#1E90FF')
        .addFields(
            { name: '🎨 Couleur', value: 'Pariez sur Rouge ou Noir (x2)', inline: true },
            { name: '🔢 Numéro', value: 'Pariez sur un numéro spécifique (x36)', inline: true },
            { name: '🎲 Pair/Impair', value: 'Pariez sur Pair ou Impair (x2)', inline: true },
            { name: '🧮 Douzaine', value: 'Pariez sur 1-12, 13-24 ou 25-36 (x3)', inline: true },
            { name: '📊 Colonne', value: 'Pariez sur une colonne (x3)', inline: true },
            { name: '↕️ Haut/Bas', value: 'Pariez sur 1-18 ou 19-36 (x2)', inline: true }
        )
        .setFooter({ text: 'Sélectionnez un type de pari ci-dessous' });

    // Créer le menu de sélection pour les types de paris
    const betTypeSelect = new StringSelectMenuBuilder()
        .setCustomId('bet-type-select')
        .setPlaceholder('Choisissez votre type de pari')
        .addOptions([
            new StringSelectMenuOptionBuilder()
                .setLabel('Couleur')
                .setDescription('Rouge ou Noir (x2)')
                .setValue(BET_TYPES.COLOR)
                .setEmoji('🎨'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Numéro')
                .setDescription('Un numéro spécifique (x36)')
                .setValue(BET_TYPES.NUMBER)
                .setEmoji('🔢'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Pair/Impair')
                .setDescription('Pair ou Impair (x2)')
                .setValue(BET_TYPES.EVEN_ODD)
                .setEmoji('🎲'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Douzaine')
                .setDescription('1-12, 13-24 ou 25-36 (x3)')
                .setValue(BET_TYPES.DOZEN)
                .setEmoji('🧮'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Colonne')
                .setDescription('Première, Deuxième ou Troisième colonne (x3)')
                .setValue(BET_TYPES.COLUMN)
                .setEmoji('📊'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Haut/Bas')
                .setDescription('1-18 ou 19-36 (x2)')
                .setValue(BET_TYPES.HIGH_LOW)
                .setEmoji('↕️')
        ]);

    const row = new ActionRowBuilder().addComponents(betTypeSelect);

    // Répondre avec le menu de sélection
    const response = await interaction.reply({
        embeds: [embed],
        components: [row],
        fetchReply: true
    });

    // Initialiser la partie et stocker les informations
    if (!client.activeGamesRoulette) {
        client.activeGamesRoulette = new Map();
    }

    const game = {
        betAmount,
        userId,
        interactionMessage: response,
        processingAction: false,
        selected: false // Indique si un choix a déjà été fait
    };

    client.activeGamesRoulette.set(userId, game);

    // Créer le collecteur pour le menu de sélection
    const collector = interaction.channel.createMessageComponentCollector({
        filter: i => i.user.id === userId && i.message.id === response.id,
        time: 60000 // 1 minute pour choisir
    });

    collector.on('collect', async i => {
        try {
            const game = client.activeGamesRoulette.get(userId);

            if (!game) {
                await i.reply({ content: '❌ Cette partie n\'existe plus.', ephemeral: true });
                collector.stop();
                return;
            }

            if (game.processingAction) {
                await i.reply({ content: '⏳ Action en cours...', ephemeral: true });
                return;
            }

            game.processingAction = true;

            // GESTION DES INTERACTIONS
            if (i.customId === 'bet-type-select') {
                await i.deferUpdate();
                await handleBetTypeSelection(client, interaction, i, game);

            } else if (i.customId === 'bet-option-number-manual') {
                // --- AFFICHAGE DU MODAL SANS DÉFÉRER ---
                const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
                const modal = new ModalBuilder()
                    .setCustomId('roulette-number-modal')
                    .setTitle('Choisissez un numéro')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('roulette-number-input')
                                .setLabel('Numéro entre 0 et 36')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('Ex: 17')
                                .setRequired(true)
                                .setMaxLength(2)
                        )
                    );

                // Afficher le modal SANS utiliser deferUpdate()
                await i.showModal(modal);

                // Déverrouiller immédiatement
                game.processingAction = false;
                return;

            } else if (i.customId.startsWith('bet-option-')) {
                await i.deferUpdate();
                await handleBetOptionSelection(client, interaction, i, game);

            } else if (i.customId === 'spin-roulette') {
                await i.deferUpdate();
                await spinRoulette(client, interaction, game);
            }

            game.processingAction = false;
        } catch (error) {
            console.error("Erreur dans le collecteur de la roulette:", error);
            const game = client.activeGamesRoulette.get(userId);
            if (game) game.processingAction = false;
        }
    });


    collector.on('end', async (collected, reason) => {
        if (reason === 'time' && client.activeGamesRoulette.has(userId)) {
            const game = client.activeGamesRoulette.get(userId);
            if (!game.selected) {
                try {
                    await interaction.followUp({
                        content: "⏱️ Le temps pour placer votre pari est écoulé. Votre mise vous est remboursée.",
                        ephemeral: true
                    });

                    // Rembourser la mise
                    client.activeGamesRoulette.delete(userId);

                    try {
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('🎰 Roulette - Annulée')
                                    .setDescription('Partie annulée : temps écoulé')
                                    .setColor('#FF0000')
                            ],
                            components: []
                        });
                    } catch (err) {
                        console.error("Erreur lors de la mise à jour du message:", err);
                    }
                } catch (err) {
                    console.error("Erreur lors de l'envoi du message de timeout:", err);
                }
            }
        }
    });
};

async function handleBetTypeSelection(client, interaction, i, game) {
    const betType = i.values[0];
    game.betType = betType;

    let optionsRow;
    let embed;

    console.log("Bet type selected:", betType);
    switch (betType) {
        case BET_TYPES.COLOR:
            optionsRow = createColorOptions();
            embed = createBetEmbed('Couleur', 'Choisissez Rouge ou Noir', game.betAmount);
            break;
        case BET_TYPES.NUMBER:
            optionsRow = createNumberManualInputButton();
            embed = createBetEmbed('Numéro', 'Cliquez sur le bouton ci-dessous pour entrer un numéro entre 0 et 36.', game.betAmount);
            break;
        case BET_TYPES.EVEN_ODD:
            optionsRow = createEvenOddOptions();
            embed = createBetEmbed('Pair ou Impair', 'Choisissez Pair ou Impair', game.betAmount);
            break;
        case BET_TYPES.DOZEN:
            optionsRow = createDozenOptions();
            embed = createBetEmbed('Douzaine', 'Choisissez une douzaine', game.betAmount);
            break;
        case BET_TYPES.COLUMN:
            optionsRow = createColumnOptions();
            embed = createBetEmbed('Colonne', 'Choisissez une colonne', game.betAmount);
            break;
        case BET_TYPES.HIGH_LOW:
            optionsRow = createHighLowOptions();
            embed = createBetEmbed('Haut ou Bas', 'Choisissez 1-18 ou 19-36', game.betAmount);
            break;

        default:
            optionsRow = null;
            embed = new EmbedBuilder()
                .setTitle('❌ Type de pari invalide')
                .setDescription('Veuillez sélectionner un type de pari valide.')
                .setColor('#FF0000');
            break;
    }

    // Mettre à jour le message avec les options spécifiques
    await interaction.editReply({
        embeds: [embed],
        components: [optionsRow]
    });
}

async function handleBetOptionSelection(client, interaction, i, game) {
    const optionId = i.customId.replace('bet-option-', '');
    game.betOption = optionId;
    game.selected = true;

    // Déduire la mise du solde de l'utilisateur
    await addMerseCoins(game.userId, -game.betAmount, false, 'discord');

    // Modifier le message pour montrer le choix fait
    const betTypeText = getBetTypeText(game.betType);
    const betOptionText = getBetOptionText(game.betType, game.betOption);

    const embed = new EmbedBuilder()
        .setTitle('🎰 Roulette - Pari placé')
        .setDescription(`Vous avez parié ${game.betAmount} <:mersecoins:1135490066194645002> sur ${betOptionText}`)
        .setColor('#1E90FF')
        .addFields(
            { name: 'Type de pari', value: betTypeText, inline: true },
            { name: 'Multiplicateur', value: `x${MULTIPLIERS[game.betType]}`, inline: true }
        );

    // Bouton pour lancer la roulette
    const spinButton = new ButtonBuilder()
        .setCustomId('spin-roulette')
        .setLabel('Lancez la Roulette! 🎰')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(spinButton);

    await interaction.editReply({
        embeds: [embed],
        components: [row]
    });
}

async function spinRoulette(client, interaction, game) {
    // Sélectionner un numéro aléatoire de la roulette
    const winningNumber = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];

    // Vérifier si le joueur a gagné
    const isWin = checkWin(game.betType, game.betOption, winningNumber);

    // Calculer les gains éventuels
    let winnings = 0;
    let resultMessage = '';
    let color = '#FF0000'; // Rouge par défaut (perte)

    if (isWin) {
        winnings = game.betAmount * MULTIPLIERS[game.betType];
        const gains = await addMerseCoins(game.userId, winnings, true, 'discord');
        resultMessage = `🎉 Gagné! Vous avez remporté ${gains} <:mersecoins:1135490066194645002>`;
        color = '#00FF00';
    } else {
        resultMessage = `❌ Perdu! Votre mise était de ${game.betAmount} <:mersecoins:1135490066194645002>`;
    }

    // Afficher le résultat avec une animation simple
    const loadingEmbed = new EmbedBuilder()
        .setTitle('🎰 Roulette - En cours...')
        .setDescription('La bille tourne...')
        .setColor('#FFA500');

    await interaction.editReply({
        embeds: [loadingEmbed],
        components: []
    });

    // Attendre 2 secondes pour simuler la rotation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Afficher le résultat final
    const finalEmbed = new EmbedBuilder()
        .setTitle('🎰 Roulette - Résultat')
        .setColor(color)
        .addFields(
            { name: '🎯 Numéro gagnant', value: `${winningNumber.number} ${getColorEmoji(winningNumber.color)}` },
            { name: '🎲 Votre pari', value: `${getBetTypeText(game.betType)} - ${getBetOptionText(game.betType, game.betOption)}` },
            { name: '💰 Résultat', value: `La bille s'est arrêtée sur ${winningNumber.number} ${getColorEmoji(winningNumber.color)}` },
            { name: '💸 Gains', value: resultMessage }
        );

    await interaction.editReply({
        embeds: [finalEmbed],
        components: []
    });

    // Supprimer la partie
    client.activeGamesRoulette.delete(game.userId);
}

// Fonction pour vérifier si le joueur a gagné
function checkWin(betType, betOption, winningNumber) {
    switch (betType) {
        case BET_TYPES.COLOR:
            return betOption === winningNumber.color;

        case BET_TYPES.NUMBER:
            return parseInt(betOption) === winningNumber.number;

        case BET_TYPES.EVEN_ODD:
            if (winningNumber.number === 0) return false;
            if (betOption === 'even') return winningNumber.number % 2 === 0;
            return winningNumber.number % 2 === 1;

        case BET_TYPES.DOZEN:
            if (winningNumber.number === 0) return false;
            if (betOption === 'first') return winningNumber.number >= 1 && winningNumber.number <= 12;
            if (betOption === 'second') return winningNumber.number >= 13 && winningNumber.number <= 24;
            return winningNumber.number >= 25 && winningNumber.number <= 36;

        case BET_TYPES.COLUMN:
            if (winningNumber.number === 0) return false;
            if (betOption === 'first') return winningNumber.number % 3 === 1;
            if (betOption === 'second') return winningNumber.number % 3 === 2;
            return winningNumber.number % 3 === 0;

        case BET_TYPES.HIGH_LOW:
            if (winningNumber.number === 0) return false;
            if (betOption === 'low') return winningNumber.number >= 1 && winningNumber.number <= 18;
            return winningNumber.number >= 19 && winningNumber.number <= 36;
    }
}

// Fonctions pour créer les différentes options de paris
function createColorOptions() {
    const redButton = new ButtonBuilder()
        .setCustomId('bet-option-red')
        .setLabel('Rouge')
        .setStyle(ButtonStyle.Danger);

    const blackButton = new ButtonBuilder()
        .setCustomId('bet-option-black')
        .setLabel('Noir')
        .setStyle(ButtonStyle.Secondary);

    return new ActionRowBuilder().addComponents(redButton, blackButton);
}

function createNumberManualInputButton() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('bet-option-number-manual')
            .setLabel('Entrer un numéro')
            .setStyle(ButtonStyle.Primary)
    );
}

function createEvenOddOptions() {
    const evenButton = new ButtonBuilder()
        .setCustomId('bet-option-even')
        .setLabel('Pair')
        .setStyle(ButtonStyle.Primary);

    const oddButton = new ButtonBuilder()
        .setCustomId('bet-option-odd')
        .setLabel('Impair')
        .setStyle(ButtonStyle.Primary);

    return new ActionRowBuilder().addComponents(evenButton, oddButton);
}

function createDozenOptions() {
    const firstDozenButton = new ButtonBuilder()
        .setCustomId('bet-option-first')
        .setLabel('1-12')
        .setStyle(ButtonStyle.Primary);

    const secondDozenButton = new ButtonBuilder()
        .setCustomId('bet-option-second')
        .setLabel('13-24')
        .setStyle(ButtonStyle.Primary);

    const thirdDozenButton = new ButtonBuilder()
        .setCustomId('bet-option-third')
        .setLabel('25-36')
        .setStyle(ButtonStyle.Primary);

    return new ActionRowBuilder().addComponents(firstDozenButton, secondDozenButton, thirdDozenButton);
}

function createColumnOptions() {
    const firstColButton = new ButtonBuilder()
        .setCustomId('bet-option-first')
        .setLabel('1ère Colonne (1,4,7...)')
        .setStyle(ButtonStyle.Primary);

    const secondColButton = new ButtonBuilder()
        .setCustomId('bet-option-second')
        .setLabel('2ème Colonne (2,5,8...)')
        .setStyle(ButtonStyle.Primary);

    const thirdColButton = new ButtonBuilder()
        .setCustomId('bet-option-third')
        .setLabel('3ème Colonne (3,6,9...)')
        .setStyle(ButtonStyle.Primary);

    return new ActionRowBuilder().addComponents(firstColButton, secondColButton, thirdColButton);
}

function createHighLowOptions() {
    const lowButton = new ButtonBuilder()
        .setCustomId('bet-option-low')
        .setLabel('1-18')
        .setStyle(ButtonStyle.Primary);

    const highButton = new ButtonBuilder()
        .setCustomId('bet-option-high')
        .setLabel('19-36')
        .setStyle(ButtonStyle.Primary);

    return new ActionRowBuilder().addComponents(lowButton, highButton);
}

// Fonctions utilitaires
function createBetEmbed(title, description, betAmount) {
    return new EmbedBuilder()
        .setTitle(`🎰 Roulette - Pari sur ${title}`)
        .setDescription(description)
        .setColor('#1E90FF')
        .addFields(
            { name: '💰 Mise', value: `${betAmount} <:mersecoins:1135490066194645002>`, inline: true }
        );
}

function getColorEmoji(color) {
    switch (color) {
        case 'red': return '🔴';
        case 'black': return '⚫';
        case 'green': return '🟢';
        default: return '';
    }
}

function getBetTypeText(betType) {
    switch (betType) {
        case BET_TYPES.COLOR: return 'Couleur';
        case BET_TYPES.NUMBER: return 'Numéro';
        case BET_TYPES.EVEN_ODD: return 'Pair/Impair';
        case BET_TYPES.DOZEN: return 'Douzaine';
        case BET_TYPES.COLUMN: return 'Colonne';
        case BET_TYPES.HIGH_LOW: return 'Haut/Bas';
        default: return 'Inconnu';
    }
}

function getBetOptionText(betType, betOption) {
    switch (betType) {
        case BET_TYPES.COLOR:
            return betOption === 'red' ? 'Rouge 🔴' : 'Noir ⚫';

        case BET_TYPES.NUMBER:
            return `Numéro ${betOption}`;

        case BET_TYPES.EVEN_ODD:
            return betOption === 'even' ? 'Pair' : 'Impair';

        case BET_TYPES.DOZEN:
            if (betOption === 'first') return '1-12';
            if (betOption === 'second') return '13-24';
            return '25-36';

        case BET_TYPES.COLUMN:
            if (betOption === 'first') return '1ère Colonne';
            if (betOption === 'second') return '2ème Colonne';
            return '3ème Colonne';

        case BET_TYPES.HIGH_LOW:
            return betOption === 'low' ? '1-18' : '19-36';

        default:
            return 'Inconnu';
    }
}

module.exports.help = {
    name: "roulette",
    aliases: ['r', 'rl'],
    category: "casino",
    description: "Jouez à la roulette et tentez de gagner des Merse Coins!",
    usage: "<mise>",
    options: [
        {
            name: "mise",
            description: "Mise que vous souhaitez parier.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            minValue: 10
        }
    ]
};