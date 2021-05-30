const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Spawn = require('../../models/spawn.js')
const ms = require("ms");

module.exports = {
  name: "devhint",
  description: "Get a hint to help you guess the wild pokemon's name.",
  category: "Dev",
  args: false,
  usage: ["devhint"],
  cooldown: 3,
  permissions: [],
  aliases: ["dh"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
  let user = await User.findOne({ id: message.author.id })
  let spawn = await Spawn.findOne({id: message.channel.id})    
  if (!client.config.owners.includes(message.author.id)) {
  return message.channel.send(`This command can only be used by ${client.user.username} Owners.`)
  }
  if (client.config.owners.includes(message.author.id)) {
  return message.channel.send(spawn.pokemon[0] ? spawn.pokemon[0].name : "No Pokemon here.")
    }    
  }
}