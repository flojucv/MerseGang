const { Client } = require('twitchrequest');
require('dotenv').config();

const twitch = new Client({
    channels: ["mersedi_"],
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    interval: 15
});

module.exports = twitch;