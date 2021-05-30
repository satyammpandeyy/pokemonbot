const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require('../../functions.js');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "setprefix",
  description: "Select a different pokemon.",
  category: "configuration",
  args: false,
  usage: ["setprefix <args> <pokemonID>"],
  cooldown: 3,
  permissions: ['MANAGE_MESSAGES'],
  aliases: ["setp"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    //const guild = await Guild.findOne({ id: message.guild.id });
    if (!guild) {
      const server = new Guild({ id: message.guild.id, prefix: null, spawnchannel: null, spawnbtn: false, levelupchannel: null, levelupbtn: null });
      await server.save();
    }

    let msg = await message.channel.send(`Do you Confirm to Set New Prefix to \`${args[0]}\` ?`);
    await msg.react("✅");
    msg.react("❌");

    const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

    collector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === "✅") {
        collector.stop();
        let nguild = await Guild.findOne({ id: message.guild.id });
        let user = await User.findOne({ id: message.author.id });
        if (!args[0]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}prefix <value>** or **${nguild.prefix || client.config.prefix}px <value>**`)
        let nprefix = args.slice(0).join(" ");
        if (prefix.length > 5) return message.channel.send(`Max prefix length is 5 characters`);
        nguild.prefix = nprefix;
        await nguild.save();
        message.reactions.removeAll();
        msg.reactions.removeAll();
        return message.channel.send({ embed: { title: `Prefix configuration`, color: 0x00f9ff, description: `Prefix for ${message.guild.name} has been set to \`${nguild.prefix}\`` } });
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