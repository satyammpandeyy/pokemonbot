const Discord = require("discord.js");

let client = new Discord.Client();

 

var DanBotHosting = require("danbot-hosting");

 

client.on("ready", async () => {

  console.log("bot is now ready");

  const API = new DanBotHosting.Client("danbot-6lye3g", client);

 

  // Start posting

  let initalPost = await API.autopost();

 

  if (initalPost) {

    console.error(initalPost); // console the error

  }

});
client.login("ODQwNTc5MTQ0NTI1MDIxMTg1.YJaQVQ.cMzG4JogKF0_K29OZfsG68btAWg")