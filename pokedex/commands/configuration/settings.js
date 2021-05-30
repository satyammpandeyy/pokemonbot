const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require('../../functions.js');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
    name: "settings",
    description: "Get the server's Settings..",
    category: "miscellaneous",
    args: false,
    usage: ["<prefix> settings"],
    cooldown: 3,
    permissions: [],
    aliases: ["setting"],
    execute: async (client, message, args, prefix, guild, color, channel) => {
      let nguild = await Guild.findOne({ id: message.guild.id });

      if(nguild.spawnchannel==null){
        let settingemb0 = new MessageEmbed()
      .addField("Server Prefix",`\`${prefix}\``,true)
      .addField("Spawns Redirected Channel",`\`None\``,true)
      .addField("Server Spawn",`\`${nguild.spawnbtn}\``,true)
      .addField("Server Silence",`\`${nguild.levelupbtn}\``,true)
      .setColor(color)

      return message.channel.send(settingemb0)

      }else {
      let settingemb = new MessageEmbed()
      .addField("Server Prefix",`\`${prefix}\``,true)
      .addField("Spawns Redirected Channel",`<#${nguild.spawnchannel}>`,true)
      .addField("Server Spawn",`\`${nguild.spawnbtn}\``,true)
      .addField("Server Silence",`\`${nguild.levelupbtn}\``,true)

      .setColor(color)

      message.channel.send(settingemb)
      }
    }
}
