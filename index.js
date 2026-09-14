const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const http = require('http');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
const ROBLOX_GROUP_ID = process.env.ROBLOX_GROUP_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;
const UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minutes

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function updateMemberCount() {
    try {
        // Pedido corrigido com a barra e as aspas inclinadas corretas
        const response = await axios.get(`https://roblox.com{ROBLOX_GROUP_ID}`);
        const memberCount = response.data.memberCount;

        const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
        if (channel) {
            await channel.setName(`Members: ${memberCount}`);
            console.log(`[Counter] Successfully updated: ${memberCount} members.`);
        }
    } catch (error) {
        console.error('[Error] Failed to update counter:', error.message);
    }
}

client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}!`);
    updateMemberCount();
    setInterval(updateMemberCount, UPDATE_INTERVAL);
});

http.createServer((req, res) => {
    res.write("Bot is running!");
    res.end();
}).listen(process.env.PORT || 3000);

client.login(DISCORD_TOKEN);
