const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");
const {pefix} = require("../../config")

module.exports = {
  name: "stats",
  description: "Displays the bot stats!",
  category: "miscellaneous",
  args: false,
  usage: ["<prefix> stats"],
  cooldown: 3,
  permissions: [],
  aliases: ["botinfo"],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    let days = Math.floor(client.uptime / 86400000),
      hours = Math.floor(client.uptime / 3600000) % 24,
      minutes = Math.floor(client.uptime / 60000) % 60,
      seconds = Math.floor(client.uptime / 1000) % 60;
    let time = Date.now()
    let ping = time - message.createdTimestamp;
    
let devs = []
let d = await User.find({});
client.config.owners.map(r=>devs.push(r));
devs = devs.splice(0,3);

 let embed = new MessageEmbed()
      .setAuthor("Bot Stats")
      .addField("Developers", 
      devs.map(r=>{
       r= client.users.cache.get(r);
       if(!r) return r = "\`Unknown User#0000\`";
       else return `\`${r.tag}\``;
      }).join("\n"))
   .addField("Default Prefix", `\`${prefix}\``, true)
      .addField("Bot Currency", `\`cc (craft coins)\``, true)
 .addField("🛰 Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() /1024 /1024).toFixed(2)} MB`, true)
      .addField("Uptime", `\`${hours}h ${minutes}m ${seconds}s\``, true)
 .addField("Others", " [INVITE ME](https://discord.com/api/oauth2/authorize?client_id=840579144525021185&permissions=67226625&scope=bot) | [SUPPORT SERVER](https://discord.gg/YVhqK7ak3z)",true)
    .setThumbnail(client.user.displayAvatarURL())
      .setColor(color)
    
  
    return message.channel.send(embed)
  }
}
