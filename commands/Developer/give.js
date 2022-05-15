const discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const hastebin = require("hastebin-gen");
const { uptime } = require('process');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Spawn = require('../../models/spawn.js')
const ms = require("ms");
const moment = require('moment')
let Pokemon = require('../../models/pokemons.js');
const { classToPlain } = require("class-transformer");

module.exports = {
  name: "give",
  description: "Evals the code",
  category: "dev",
  args: false,
  usage: ["give <user> <item> <amount>"],
  cooldown: 3,
  permissions: [],
  aliases: [],

  execute: async (client, message, args, prefix, guild, color, channel) => {

     let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag === args[0]);
        if (!user) return message.channel.send("Mention an User to Give Balance to.");

        let userDB = await User.findOne({ id: user.id });
        if (!userDB) return message.channel.send("That user is not listed in DB!");

        let amount = args[2];
        if (isNaN(amount)) return message.channel.send(`${amount} is not a valid Number!`);
        amount = parseInt(amount)

        let op = message.client.users.cache.get(user.id);



    if (args[1].toLowerCase() === "redeems") {

      let codeembed2 = new MessageEmbed()

            .setDescription(`Confirm to give ${amount} Redeems to ${user}'s account?`)
            .setColor('#add8e6')
        let msg = await message.channel.send(`Confirm to give ${amount} Redeems to ${user}'s account?`);

        await msg.react("✅")
        await msg.react("❌")

         let filter = (reaction, user) => user.id !== message.client.user.id;
    let collector = msg.createReactionCollector(filter, {
      time: 45000
      });

        collector.on('collect', async (reaction) => {
            if (reaction.emoji.name === "✅") {
               let embed = new MessageEmbed()
            .setDescription(`:white_check_mark: Successfully added ${amount} Redeems to ${op.username}'s account!`)
          
            .setColor('#add8e6')
                userDB.redeems = userDB.redeems + amount;
                await userDB.save();
                collector.stop();
               return message.channel.send(`:white_check_mark: Successfully added ${amount} Redeems to ${op.username}'s account!`)
               await msg.delete();
            }
            if (reaction.emoji.name === "❌") {
                collector.stop();
                return message.channel.send("**OK ABORTED!**");
                await msg.delete();
            }
        });
        collector.on('end', collected => {
            return msg.reactions.removeAll();
        });

    } else if (args[1].toLowerCase() === "shards") {

      let codeembed2 = new MessageEmbed()
            .setDescription(`Confirm to give ${amount} Shards to ${user}'s account?`)
            .setColor('#add8e6')
        let msg = await message.channel.send(`Confirm to give ${amount} Shards to ${user}'s account?`);

        await msg.react("✅")
        await msg.react("❌")

        let filter = (reaction, user) => user.id !== message.client.user.id;
    let collector = msg.createReactionCollector(filter, {
      time: 45000
      });

        collector.on('collect', async (reaction) => {
            if (reaction.emoji.name === "✅") {
               let embed = new MessageEmbed()
            .setDescription(`:white_check_mark: Successfully added ${amount} Shards to ${op.username}'s account!`)
            .setColor('#add8e6')
                userDB.shards = userDB.shards + amount;
                await userDB.save();
                collector.stop();
                return message.channel.send(`:white_check_mark: Successfully added ${amount} Shards to ${op.username}'s account!`)
                await msg.delete();
            }
            if (reaction.emoji.name === "❌") {
                collector.stop();
                return message.channel.send("ABORTED!");
                await msg.delete();
            }
        });
        collector.on('end', collected => {
            return msg.reactions.removeAll();
        });

    }  else if (args[1].toLowerCase() === "pbcrate") {

      let codeembed2 = new MessageEmbed()
            .setDescription(`Confirm to give ${amount} PBcrates to ${user}'s account?`)
            .setColor('#add8e6 ')
        let msg = await message.channel.send(`Confirm to give ${amount} PBcrates to ${user}'s account?`);

        await msg.react("✅")
        await msg.react("❌")

        let filter = (reaction, user) => user.id !== message.client.user.id;
    let collector = msg.createReactionCollector(filter, {
      time: 45000
      });

        collector.on('collect', async (reaction) => {
            if (reaction.emoji.name === "✅") {
               let embed = new MessageEmbed()
            .setDescription(`:white_check_mark: Gave ${amount} PBcrate to ${op.username}'s account!`)
            .setColor('#add8e6')
                userDB.pbcrates = userDB.pbcrates + amount;
                await userDB.save();
                collector.stop();
                return message.channel.send(`:white_check_mark: Gave ${amount} PBcrate to ${op.username}'s account!`)
                await msg.delete();
            }
            if (reaction.emoji.name === "❌") {
                collector.stop();
                return message.channel.send("**OK ABORTED!**");
                await msg.delete();
            }
        });
        collector.on('end', collected => {
            return msg.reactions.removeAll();
        });

    }  else if (args[1].toLowerCase() === "mb") {

      let codeembed2 = new MessageEmbed()
            .setDescription(`Are You Sure you want to  give ${amount} MasterBox's to ${user} !! 
            
            React With ✅ to confirm adding ${amount} MasterBox `)
        
            .setColor('#add8e6 ')
          
        let msg = await message.channel.send(codeembed2);

        await msg.react("✅")
        await msg.react("❌")

        let filter = (reaction, user) => user.id !== message.client.user.id;
    let collector = msg.createReactionCollector(filter, {
      time: 45000
      });

        collector.on('collect', async (reaction) => {
            if (reaction.emoji.name === "✅") {
               let embed = new MessageEmbed()
            .setDescription(`:white_check_mark: Successfully added ${amount} Masterbox to ${op.username}'s account `)
            
            .setColor('#ffff00')
                userDB.mcrate = userDB.mcrate + amount;
                await userDB.save();
                collector.stop();
                return message.channel.send(embed)
                await msg.delete();
            }
            if (reaction.emoji.name === "❌") {
                collector.stop();
                return message.channel.send("ABORTED!");
                await msg.delete();
            }
        });
        collector.on('end', collected => {
            return msg.reactions.removeAll();
        });

    } else if (args[1].toLowerCase() === "coins") {

let codeembed2 = new MessageEmbed()
            .setDescription(`Confirm to give ${amount} Psycord Coins to ${user}'s account?`)
            .setColor('#add8e6')
        let msg = await message.channel.send(`Confirm to give ${amount} Psycoins  to ${user}'s account?`);

        await msg.react("✅")
        await msg.react("❌")

         let filter = (reaction, user) => user.id !== message.client.user.id;
    let collector = msg.createReactionCollector(filter, {
      time: 45000
      });

        collector.on('collect', async (reaction) => {
            if (reaction.emoji.name === "✅") {
               let embed = new MessageEmbed()
            .setDescription(`:white_check_mark: Successfully added ${amount} Psycoins to ${op.username}'s account!`)
          
            .setColor('#add8e6')
                userDB.balance = userDB.balance + amount;
                await userDB.save();
                collector.stop();
               return message.channel.send(`:white_check_mark: Successfully added ${amount} Psycoins to ${op.username}'s account!`)
               await msg.delete();
            }
            if (reaction.emoji.name === "❌") {
                collector.stop();
                return message.channel.send("**OK ABORTED!**");
                await msg.delete();
            }
        });
         collector.on('end', collected => {
            return msg.reactions.removeAll();
              });


        }  if (args[1].toLowerCase() === "eggs") {

      let codeembed2 = new MessageEmbed()

            .setDescription(`Confirm to give ${amount} Eggs to ${user}'s account?`)
            .setColor('#add8e6')
        let msg = await message.channel.send(`Confirm to give ${amount} Eggs to ${user}'s account?`);

        await msg.react("✅")
        await msg.react("❌")

         let filter = (reaction, user) => user.id !== message.client.user.id;
    let collector = msg.createReactionCollector(filter, {
      time: 45000
      });

        collector.on('collect', async (reaction) => {
            if (reaction.emoji.name === "✅") {
               let embed = new MessageEmbed()
            .setDescription(`:white_check_mark: Successfully added ${amount} Eggs to ${op.username}'s account!`)
          
            .setColor('#add8e6')
                userDB.egg = userDB.egg + amount;
                await userDB.save();
                collector.stop();
               return message.channel.send(`:white_check_mark: Successfully added ${amount} Eggs to ${op.username}'s account!`)
               await msg.delete();
            }
            if (reaction.emoji.name === "❌") {
                collector.stop();
                return message.channel.send("**OK ABORTED!**");
                await msg.delete();
              }
        });
        collector.on('end', collected => {
            return msg.reactions.removeAll();
        })
        } else {
      message.channel.send(":white_check_mark:")
    }
}
}