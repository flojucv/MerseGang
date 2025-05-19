const Discord = require('discord.js');
const { GatewayIntentBits } = require("discord.js");
require('dotenv').config();

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ]
});
client.login(process.env.Token);
client.commands = new Discord.Collection();
client.modals = new Discord.Collection();
client.activeGamesBlackjack = new Discord.Collection();
client.activeGamesRoulette = new Discord.Collection();

module.exports = client;