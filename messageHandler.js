const { AttachmentBuilder } = require("discord.js");
const { handleMemeCommand } = require("./memeHandler");
const { handlewh40kCommand } = require("./wh40k");
const { fetchAllMessages } = require('./fetchMessages');

const monitoredChannelId = "1275732476408500255";
const adminRoleId = "1275712561282547763";

const handleMessages = async (message) => {
  if (message.author.bot) return;

  // AUTO DELETE NON-ATTACHMENT MESSAGES
  if (message.channel.id === monitoredChannelId) {
    const hasAdminRole = message.member.roles.cache.has(adminRoleId);

    if (message.attachments.size === 0 && !hasAdminRole) {
      message
        .delete()
        .then(() =>
          console.log(`Deleted message from channel ${monitoredChannelId}`),
        )
        .catch(console.error);
    }
  }

  // COMMANDS HANDLER
  if (/help po/i.test(message.content)) {
    message.channel.send(
      "```" +
      "\nHello! I am bot Luis. Ginawa ako para manggago. Maraming Salamat! :D" +
      "\nhttps://github.com/ruisu-iwnl" +
      "\n----------------------------------------------------" +
      "\nFunny Commands:\n\n" +
      "chino - Displays magic word\n" +
      "zombie - Displays summoning word\n" +
      "for the emperor - Fetches a random Warhammer 40k meme\n" +
      "----------------------------------------------------" +
      "\n!!!USEFUL Commands:\n\n" +
      "help po - Displays this message\n" +
	  "fetch all - (for dev only)wraps all messages into a text file\n" +
      "linis po - clears the last 10 messages" +
      "\n----------------------------------------------------" +
      "\n```",
    );
  }

  if (/chino/i.test(message.content)) {
    const attachment = new AttachmentBuilder(__dirname + '/emote.jpg');
    message.channel.send({ content: "TANG INA MO!", files: [attachment] });
  }

  if (/zombie/i.test(message.content)) {
    message.channel.send(
      "```" + "\nleft4dead reference? dying light????" + "\n```",
    );
  }

  if (/kuya/i.test(message.content)) {
    const attachment = new AttachmentBuilder(__dirname + '/boomer.png');
    message.channel.send({
      content: "```" + "\nleft 4 dead 2 (:" + "\n```",
      files: [attachment],
    });
  }

  if (message.content === "linis po") {
    const ask = async (q, filter) => {
      const tempMessage = await message.channel.send(`\`\`\`\n${q}\n\`\`\``);
      const collected = await message.channel.awaitMessages({
        filter,
        max: 1,
        time: 30000,
        errors: ["time"],
      });
      await tempMessage.delete();
      return collected.first().content;
    };

    const filterByUser = (m) => m.author.id === message.author.id;

    let deleteCount = await ask(
      "Ilan ba gusto mo burahin? (Max: 99)",
      (m) => !isNaN(m.content) && filterByUser(m),
    );
    deleteCount = Math.min(parseInt(deleteCount), 99);

    const confirmation = await ask(
      `sigurado ka buburahin mo ${deleteCount} na mensahe? \n 1 : yes \n 2 : no`,
      (m) => ["1", "2"].includes(m.content) && filterByUser(m),
    );

    if (confirmation === "1") {
      const fetchedMessages = await message.channel.messages.fetch({
        limit: deleteCount + 1,
      });
      await message.channel.bulkDelete(fetchedMessages, true);
      console.log(`Deleted the last ${deleteCount} messages.`);
    } else {
      const tempMessage = await message.channel.send(
        "walang binura na message.",
      );
      setTimeout(() => tempMessage.delete(), 5000);
    }
  }

  // FETCH ALL MESSAGES COMMAND
  await fetchAllMessages(message);

  // HANDLE MEME COMMAND
  handleMemeCommand(message);
  
  handlewh40kCommand(message);
};

module.exports = { handleMessages };
