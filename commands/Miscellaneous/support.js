const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
    name: "support",
    description: "get the support server link",
    category: "miscellaneous",
    args: false,
    usage: ["support"],
    cooldown: 3,
    permissions: [],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {

      let embed = new MessageEmbed()
      .setDescription(`[Click Here](https://discord.gg/fVhbVXXFSU) to join the support server.`)
      .setColor("RANDOM")
      message.channel.send(embed)

    }
}
