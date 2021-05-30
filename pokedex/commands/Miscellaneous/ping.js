const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
	name: "ping",
    description: "Get bot ping.",
    category: "Miscellaneous",
    args: false,
    usage: ["ping"],
    cooldown: 3,
    permissions: [],
    aliases: [""],
		name: "ping",
	execute: async (client, message, args, prefix, guild, color, channel) => {
    let days = Math.floor(client.uptime / 86400000),
		hours = Math.floor(client.uptime / 3600000) % 24,
		minutes = Math.floor(client.uptime / 60000) % 60,
		seconds = Math.floor(client.uptime / 1000) % 60;
		let time = Date.now()
 let ping = time - message.createdTimestamp
 let start = Date.now();
let user = await User.findOne({id: message.author.id})
let end = Date.now();
let ping2 = end - start;

    let embed = new MessageEmbed()
    .setDescription(`Pong! Bot Latency is **${ping}ms****`)
		.setColor(color)
    return message.channel.send(embed);

	}
}