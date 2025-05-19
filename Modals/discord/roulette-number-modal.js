const { addMerseCoins } = require('../../function/merseCoinsFunction');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

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

module.exports = async (client, interaction) => {
    const userId = interaction.user.id;
    // On récupère la partie en cours pour ce joueur
    const game = client.activeGamesRoulette?.get(userId);
    if (!game) {
        await interaction.reply({ content: '❌ Cette partie n\'existe plus.', ephemeral: true });
        return;
    }

    // On récupère la valeur du champ texte
    const value = interaction.fields.getTextInputValue('roulette-number-input');
    const number = parseInt(value, 10);

    // Vérification du numéro
    if (isNaN(number) || number < 0 || number > 36) {
        await interaction.reply({ content: '❌ Veuillez entrer un numéro valide entre 0 et 36.', ephemeral: true });
        return;
    }

    game.betOption = number.toString();
    game.selected = true;

    // Déduire la mise
    await addMerseCoins(game.userId, -game.betAmount, false, 'discord');

    // Afficher le pari placé
    const embed = new EmbedBuilder()
        .setTitle('🎰 Roulette - Pari placé')
        .setDescription(`Vous avez parié ${game.betAmount} <:mersecoins:1135490066194645002> sur le numéro ${number}`)
        .setColor('#1E90FF')
        .addFields(
            { name: 'Type de pari', value: 'Numéro', inline: true },
            { name: 'Multiplicateur', value: `x${MULTIPLIERS[game.betType]}`, inline: true }
        );

    const spinButton = new ButtonBuilder()
        .setCustomId('spin-roulette')
        .setLabel('Lancez la Roulette! 🎰')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(spinButton);

    // On répond au modal (nouveau message)
    await interaction.update({
        embeds: [embed],
        components: [row],
        ephemeral: false
    });
}