const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const { handleMessages } = require("./messageHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", handleMessages);

module.exports = { client };
