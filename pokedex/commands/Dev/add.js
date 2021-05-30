const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
  name: "add",
  description: "Dev commands",
  category: "Dev",
  args: true,
  usage: ["add <user> <amount>"],
  cooldown: 3,
  permissions: [],
  aliases: [],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user1 = message.mentions.members.first() || client.users.cache.get(args[1]);
    let user2 = await User.findOne({ id: user1.id });
    if (!user2 || !user2.pokemons[0]) return message.channel.send(user1 + " needs to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");

    if (args[0].toLowerCase() == "bal") {
      let amount = args[2];
      if (!Number(amount)) return message.channel.send(`${amount} is not a valid Number!`);
      amount = parseInt(amount);

      let msg = await message.channel.send(`Do you Confirm to give ${amount} Craft Coins to ${user1.tag} (${user1.id}) ?`);
      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          user2.balance = user2.balance + amount;
          await user2.save();
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send(`Success.`)
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
    if (args[0].toLowerCase() == "redeem" || args[0].toLowerCase() == "r") {
      let amount = args[2];
      if (!Number(amount)) return message.channel.send(`${amount} is not a number!`);
      amount = parseInt(amount);

      let msg = await message.channel.send(`Do you Confirm to give ${amount} Redeem to ${user1.tag} (${user1.id}) ?`);
      await msg.react("✅");
      msg.react("❌");


      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          user2.redeems = user2.redeems + amount;
          await user2.save();
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send("Success.")
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
    if (args[0].toLowerCase() == "shards" || args[0].toLowerCase() == "sh") {
      let amount = args[2];
      if (!Number(amount)) return message.channel.send(`${amount} is not a number!`);
      amount = parseInt(amount);

      let msg = await message.channel.send(`Do you Confirm to give ${amount} Shards to ${user1.tag} (${user1.id}) ?`);
      await msg.react("✅");
      msg.react("❌");


      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          user2.redeems = user2.redeems + amount;
          await user2.save();
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send("Success.")
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
    if (args[0].toLowerCase() == "upvotes" || args[0].toLowerCase() == "upv") {
      let amount = args[2];
      if (!Number(amount)) return message.channel.send(`${amount} is not a number!`);
      amount = parseInt(amount);

      let msg = await message.channel.send(`Do you Confirm to give ${amount} Upvotes to ${user1.tag} (${user1.id}) ?`);
      await msg.react("✅");
      msg.react("❌");


      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          user2.redeems = user2.redeems + amount;
          await user2.save();
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send("Success.")
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
