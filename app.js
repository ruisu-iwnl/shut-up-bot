require('dotenv').config();

const express = require("express");
const app = express();
const mySecret = process.env.TOKEN;
const { client } = require("./discordBot");

app.listen(3000, () => {
  console.log("Project is running!");
});

app.get("/", (req, res) => {
  res.send("testing!");
});

client.login(mySecret);
