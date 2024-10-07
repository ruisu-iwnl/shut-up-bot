const fs = require('fs');
const path = require('path');

const fetchAllMessages = async (message) => {
  if (message.content.toLowerCase() === 'fetch all') {
    // Fetch all messages in the channel
    const fetchedMessages = [];
    let lastMessageId;

    try {
      while (true) {
        const options = { limit: 100 };
        if (lastMessageId) options.before = lastMessageId;

        const messages = await message.channel.messages.fetch(options);
        if (messages.size === 0) break;

        // Include date and time with each message
        messages.forEach(msg => {
          const date = new Date(msg.createdTimestamp).toLocaleString();
          // Format as CSV row
          fetchedMessages.push(`"${date}","${msg.author.username}","${msg.content.replace(/"/g, '""')}"`);
        });

        lastMessageId = messages.last().id;
      }

      // Prepare CSV content
      const csvHeader = '"Date","Username","Message"\n';
      const csvContent = csvHeader + fetchedMessages.join('\n');

      // Ensure the logs directory exists
      const logsDir = path.join(__dirname, 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
      }

      // Format current date and time for the filename
      const now = new Date();
      const dateString = now.toISOString().replace(/:/g, '-').slice(0, 19); // Format as YYYY-MM-DDTHH-MM-SS
      let fileName = `messages_${dateString}.csv`;

      // Check for existing files and increment the filename if necessary
      let filePath = path.join(logsDir, fileName);
      let count = 1;

      while (fs.existsSync(filePath)) {
        filePath = path.join(logsDir, `messages_${dateString}(${count}).csv`);
        count++;
      }

      // Save messages to a .csv file in the logs folder
      fs.writeFileSync(filePath, csvContent, 'utf-8');

      message.channel.send(`All messages have been fetched and saved to your path folder.`);
    } catch (error) {
      console.error('Error fetching messages:', error);
      message.channel.send('There was an error fetching the messages.');
    }
  }
};

module.exports = { fetchAllMessages };
