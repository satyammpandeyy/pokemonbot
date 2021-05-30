const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "nickname",
  description: "Give your pokemon a nickname.",
  category: "Pokemon Commands",
  args: true,
  usage: ["nickname <nickname>"],
  cooldown: 3,
  permissions: [],
  aliases: ["nick"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });
    if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");


    var selected = user.selected || 0;
    if (args[0].toLowerCase() === "reset") {
      user.pokemons[selected].nick = undefined;
      await user.markModified('pokemons');
      await user.save();
      return message.channel.send(`Resetted your Level ${user.pokemons[selected].level}${user.pokemons[selected].shiny ? "⭐ " : ""} ${user.pokemons[selected].name}'s nickname.`);
    }
    let nick = args.join(" ");
    if (nick.length > 30) return message.channel.send(`Please choose a shorter nickname!`);
    user.pokemons[selected].nick = nick;
    await user.markModified('pokemons');
    await user.save();
    return message.channel.send(`Changed your Level ${user.pokemons[selected].level} ${user.pokemons[selected].shiny ? "⭐ " : ""} ${user.pokemons[selected].name}'s nickname to ${user.pokemons[selected].nick}!`);
  }
}