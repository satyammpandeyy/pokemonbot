const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Spawn = require('../../models/spawn.js')
const ms = require("ms");

module.exports = {
    name: "devhelp",
    description: "Get a hint to help you guess the wild pokemon's name.",
    category: "Dev",
    args: false,
    usage: ["devhelp"],
    cooldown: 3,
    permissions: [],
    aliases: ["dhp"],
    execute: async (client, message, args, prefix, guild, color, channel) => {
    	let embed = new MessageEmbed()
    	.setAuthor("Dev Help")
    	.setColor(color)
    	.setDescription(client.commands.filter(r=>r.category.toLowerCase() === "dev").map(r=>`**${r.usage[0]} - ** ${r.description}`).join("\n"));
    	
    	return message.channel.send(embed)
  }
}