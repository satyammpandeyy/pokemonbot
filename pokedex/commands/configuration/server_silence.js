const Discord = require("discord.js");
const Guild = require('../../models/guild.js')
const { MessageEmbed } = require("discord.js");
const { capitalize } = require('../../functions.js');
const User = require("./../../models/user");


module.exports = {
  name: "server_silence",
  description: "Toggle Enable/Disable Level Up Message!",
  category: "configuration",
  args: true,
  usage: ["server_spawn <true/false>"],
  cooldown: 3,
  permissions: ['MANAGE_MESSAGES'],
  aliases: ["s_s"],
  execute: async (client, message, args, color, channel) => {
    let nguild = await Guild.findOne({ id: message.guild.id });
    let user = await User.findOne({ id: message.author.id });
    if (!args[0]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}server_silence <true/false>** or **${nguild.prefix || client.config.prefix}s_s <true/false>**`);
    if (!args[0].toLowerCase().match(/true|false|enable|disable/)) return message.channel.send(`Correct usage: ${nguild.prefix || client.config.prefix}server_spawn <true/false>`)
    nguild.levelupbtn = (args[0].toLowerCase() === "true" || (args[0].toLowerCase() === "enable")) ? true : false;
    await nguild.save();
    return message.channel.send({ embed: { title: `Level Up Messages Configuration`, color: 0x00f9ff, description: `Level Up Messages for ${message.guild.name} has been Set to \`${nguild.spawnbtn}\`` } });

  }
}