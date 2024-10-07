const axios = require("axios");

const subreddit = "shitposting";
const memeApiUrl = `https://meme-api.com/gimme/${subreddit}`;
const allowedChannelId = "1276620142238765188";

const fetchedMemes = new Set();

const fetchRandomMeme = async () => {
  try {
    const response = await axios.get(memeApiUrl);
    const memeData = response.data;

    return {
      url: memeData.url,
      title: memeData.title,
      subreddit: memeData.subreddit
    };
  } catch (error) {
    console.error("Error fetching meme:", error);
    return null;
  }
};

const handleMemeCommand = async (message, retries = 5) => {
  if (message.channel.id === allowedChannelId) {
    if (message.content.toLowerCase() === "meme") {
      let meme = await fetchRandomMeme();

      while (meme && fetchedMemes.has(meme.url) && retries > 0) {
        meme = await fetchRandomMeme();
        retries--;
      }

      if (meme && !fetchedMemes.has(meme.url)) {
        message.channel.send(`"${meme.title}"\nr/${meme.subreddit}\n${meme.url}`);
        fetchedMemes.add(meme.url);
      } else if (retries === 0) {
        message.channel.send("pasensya na bro. wala ako mahanap ngayon.");
      } else {
        message.channel.send("wala ako mahanap boss.");
      }
    } else {
      await message.delete();
      try {
        const responseMessage = await message.channel.send(
          "```\nOnly 'meme' is allowed in this channel.\n```"
        );
        setTimeout(() => responseMessage.delete().catch(console.error), 60000);
      } catch (error) {
        console.error("Error sending response message:", error);
      }
    }
  } else if (message.content.toLowerCase() === "meme") {
    await message.delete();
    try {
      const warningMessage = await message.channel.send(
        "Please use the 'meme' command in the #meme-bot channel."
      );
      setTimeout(() => warningMessage.delete().catch(console.error), 60000);
    } catch (error) {
      console.error("Error sending warning message:", error);
    }
  }
};

module.exports = { handleMemeCommand };
