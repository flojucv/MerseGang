const tmi = require('tmi.js');
const config = require('../bdd/config.json');
const Discord = require('discord.js');
require('dotenv').config();

const options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    },
    channels: config.channels
};

const twitchBot = new tmi.Client(options);
twitchBot.connect()

twitchBot.commands = new Discord.Collection();
twitchBot.cooldowns = new Map();

module.exports = twitchBot;