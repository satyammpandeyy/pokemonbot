const Discord = require('discord.js')
const User = require('../../models/user.js')


module.exports = {
  name: "unsuspend",
  description: "unsuspends a user",
  category: "dev",
  args: true,
  usage: ["unsuspend <user>"],
  cooldown: 3,
  permissions: [],
  aliases: [],

  execute: async (client, message, args, prefix, guild, color, channel) => {
    let player = message.mentions.users.first() || client.users.cache.get(args[0])

    if(!player) return message.channel.send('Invalid user')
    let user = await User.findOne({id: player.id})
  

      user.blacklist = false
      await user.save()
      player.send(`You have been unsuspended from the bot !!`)
      message.channel.send(`Unsuspended **${player.tag}**!`)
      }
  }
