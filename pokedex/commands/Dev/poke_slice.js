const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Pokemon = require("../../Classes/Pokemon.js");
let gen8 = require('../../db/gen8.js')
let concept = require('../../db/concept.js')
const { classToPlain } = require("class-transformer");
const ms = require("ms");

module.exports = {
  name: "poke_slice",
  description: "Dev commands",
  category: "Dev",
  args: true,
  usage: ["pokemon_slice <usertag/userid> <no>"],
  cooldown: 3,
  permissions: [],
  aliases: ["pokemon_slice"],

  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user1 = message.mentions.members.first() || client.users.cache.get(args[0]);
    let user2 = await User.findOne({ id: user1.id });
    if (!user2 || !user2.pokemons[0]) return message.channel.send(user1 + " need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");

    var num = parseInt(args[1]) - 1;

    let msg = await message.channel.send(`Confirm?`);

    await msg.react("✅");
    msg.react("❌");
    const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

    collector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === "✅") {
        collector.stop();
        await user2.pokemons.splice(num, 1);
        message.reactions.removeAll();
        msg.reactions.removeAll();
        await user2.save();
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
}

