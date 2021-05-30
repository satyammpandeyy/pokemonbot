const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "gift",
  description: "Gift stuff to another trainer",
  category: "Economy",
  args: false,
  usage: ["gift redeem/CC @user <amount>"],
  cooldown: 3,
  permissions: [],
  aliases: [],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let embed = new MessageEmbed()
    .setAuthor("Gift Command")
    .setDescription("Gift your Items to another Trainee.")
    .addField("Gift Redeem",`\`${prefix}gift redeem <amount> <@user>\``)
    .addField("Gift cc",`\`${prefix}gift cc <amount> <@user>\``)
    .setColor("#fff200")
    let user = await User.findOne({ id: message.author.id });
    if(!args[0]) return message.channel.send(embed)
    let amount = args[1];
    amount = parseInt(amount);
    if (!args[1]) return message.channel.send(`Error: No <amount> Receieved! It should be in the form of \`${prefix}gift redeem <amount> <user>\``);
    if (!amount && args[1].toLowerCase()!=="all") return message.channel.send(`Error: No <amount> Receieved! It should be in the form of \`${prefix}gift redeem <amount> <user>\``)
    if (!Number(amount) && args[1].toLowerCase()!=="all") return message.channel.send(`${amount} is not a valid Int!`);
    if (!user) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
    let user1 = message.mentions.members.first() || client.users.cache.get(args[2]);
    if (!args[2]) return message.channel.send(`Mention a <@user> to Gift Item to. \`${prefix}gift <item> <amount> <@user>\``)
    let user2 = await User.findOne({ id: user1.id });
    if (!user2 || !user2.pokemons[0]) return message.channel.send(user1 + " needs to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
    
    
    if (args[0].toLowerCase()=="redeem"||args[0].toLowerCase()=="r"){
      if (user.redeems == 0 ) return message.channel.send("You don't have any Redeem to Gift!")
      if(user1.id == message.author.id) return message.channel.send(`Strange! You wanna Gift your own Items to Yourself??`);
      if (amount>15) return message.channel.send(`Error! Cannot Gift more than 15 ${args[0]}s at a Time!`);
      if (amount>user.redeems) return message.channel.send(`You don't have ${amount} Redeems in your Inventory to Gift!`)

      if(amount==1){
      msg = await message.channel.send(`Do you Confirm to gift ${amount} Redeem to ${user1.user.username}?`);
      }
      else if (amount>1){
      msg = await message.channel.send(`Do you Confirm to gift ${amount} Redeems to ${user1.user.username}?`);
      }
      else if(args[1].toLowerCase()=="all"||args[1].toLowerCase()=="max"){
      amount = user.redeems
      }
      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, userx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          user2.redeems = user2.redeems + amount;
          user.redeems = user.redeems - amount;
          await user2.save();
          await user.save();
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send(`Gifted!🎉`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send("Cancelled!")
        }
      });

      collector.on('end', collected => {
        return;
      })
    }
      if (args[0].toLowerCase()=="ricks"||args[0].toLowerCase()=="balance"||args[0].toLowerCase()=="bal"){
      if (user.balance == 0 ) return message.channel.send("You don't have any Balance to Gift!")
      if (user1.id == message.author.id) return message.channel.send(`Strange! You wanna Gift your own Items to Yourself??`);
      if (amount==1 && amount>user.balance) return message.channel.send(`You don't have ${amount} Rick to Gift!`)
      if (amount>=2 && amount>user.balance) return message.channel.send(`You don't have ${amount} Ricks to Gift!`)
      if(args[1].toLowerCase()=="all"||args[1].toLowerCase()=="max"){
      amount = user.balance
      }
 

      if(amount==1){
      msg = await message.channel.send(`Do you Confirm to gift ${amount} Rick to ${user1.user.username}?`);
      }
      else if (amount>1){
      msg = await message.channel.send(`Do you Confirm to gift ${amount} Ricks to ${user1.user.username}?`);
      }
      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, userx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          user2.balance = user2.balance + amount;
          user.balance = user.balance - amount;
          await user2.save();
          await user.save();
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send(`Gifted!🎉`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send("Cancelled!")
        }
      });

      collector.on('end', collected => {
        return;
      })
    }

  }
}