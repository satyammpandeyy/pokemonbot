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

devs = devs.splice(0,2);

    let embed = new MessageEmbed()

      .setAuthor("Bot Stats")

      .addField("DeVeLoPeR", 

      devs.map(r=>{

       r= client.users.cache.get(r);

       if(!r) return r = "\`Unknown User#0000\`";

       else return `\`${r.tag}\``;

      }).join("\n"))

      .addField("Default Prefix", `\`${prefix}\``, true)

    

      .addField("General Info's", `**Servers**: \`${client.guilds.cache.size}\`\n**Channels**: \`${client.channels.cache.size}\`\n**Users**: \`${client.users.cache.size}\`\n**Players**: \`${d.length}\``)

      .addField("Library :books:", `\`discord.py 1.7. 2 \``)

 

      .setColor("BLUE")

      

      .setTimestamp()

    return message.channel.send(embed)

  }

}

