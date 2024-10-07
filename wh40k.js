const axios = require("axios");

const subreddit = "Warhammer40k"; // Fetch memes from the r/Warhammer40k subreddit
const memeApiUrl = `https://meme-api.com/gimme/${subreddit}`;

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

const handlewh40kCommand = async (message, retries = 5) => {
  if (/for the emperor/i.test(message.content)) {
    let meme = await fetchRandomMeme();

    while (meme && fetchedMemes.has(meme.url) && retries > 0) {
      meme = await fetchRandomMeme();
      retries--;
    }

    if (meme && !fetchedMemes.has(meme.url)) {
      message.channel.send(`"${meme.title}"\nr/${meme.subreddit}\n${meme.url}`);
      fetchedMemes.add(meme.url);
    } else if (retries === 0) {
      message.channel.send("Apologies, my lord. I could not find any memes at this moment.");
    } else {
      message.channel.send("No memes available, my lord.");
    }
  } 
};

module.exports = { handlewh40kCommand };
