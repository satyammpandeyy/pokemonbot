const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
  name: "!suspend",
  description: "unsuspends the user",
  category: "Dev",
  args: true,
  usage: ["unsuspend <userping/userid>"],
  cooldown: 3,
  permissions: [],
  aliases: ["unsuspend"],

  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user1 = message.mentions.members.first() || client.users.cache.get(args[0]);
    let user2 = await User.findOne({ id: user1.id });
    if(!user2.blacklist) return message.channel.send(`${user1.tag} is not Suspended!`); 
    
   
    else{
    let msg = await message.channel.send(`Do you Confirm to Unsuspend ${user1.tag} (${user1.id}) ?`);
    await msg.react("✅");
    msg.react("❌");

    const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

    collector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === "✅") {
        collector.stop();
        user2.blacklist = false;
        await user2.save();
        message.reactions.removeAll();
        msg.reactions.removeAll();
        message.delete();
        return message.channel.send(`Successfully Unsuspended.`)
      } else if (reaction.emoji.name === "❌") {
        collector.stop("aborted");
        message.reactions.removeAll();
        msg.reactions.removeAll();
        return message.channel.send("Ok Aborted.")
      }
    });

    collector.on('end', collected => {
      return;
    });
  }
}
}



