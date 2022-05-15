const Discord = require('discord.js')
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native')
const fs = require("fs");
const { classToPlain } = require("class-transformer");
const { getlength } = require("../../functions");
const User = require('../../models/user.js')


module.exports = {
  name: "suspend",
  description: "suspends a user",
  category: "dev",
  args: true,
  usage: ["suspend <user>"],
  cooldown: 3,
  permissions: [],
  aliases: [],

  execute: async (client, message, args, prefix, guild, color, channel) => {
    let player = message.mentions.users.first() || client.users.cache.get(args[0])

    if(!player) return message.channel.send('Invalid user')
    let user = await User.findOne({id: player.id})
    let reason = args[1]
      if (!reason) {return message.channel.send('Pls give a reason to suspend!')
      } else {

      user.blacklist = true
      await user.save()

      let embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle('Account Suspended')
      .setDescription(`Your account was found to be violating Psycord  rules and has been permanently blacklisted from the bot.
      
      **Reason**
       ${reason}`)
      player.send(embed)

      let embed1 = new Discord.MessageEmbed()
      .setTitle('Account Suspended')
      .setColor("RED")
      .setDescription(`Suspended **${player.tag}**!\n
      **Reason**
       ${reason}`)
      message.channel.send(embed1)
      }
  }
}