const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");
const { capitalize } = require('../../functions.js')

module.exports = {
	name: "balance",
	description: "Display your credit balance.",
	category: "Economy",
	args: false,
	usage: ["balance"],
	cooldown: 3,
	permissions: [],
	aliases: ["bal"],
	execute: async (client, message, args, prefix, guild, color, channel) => {
	if(message.content.toLowerCase().startsWith((`${prefix.toLowerCase()}bal add` || `${prefix.toLowerCase()}bal remove`))) return;
	
	let user = await User.findOne({ id: message.author.id });
  if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");

	const embed = new MessageEmbed()
	.setAuthor(capitalize(message.member.displayName + "'s Balance"))
	.setDescription(`You currently have ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Craft Coins.`)
	.setThumbnail("https://cdn.discordapp.com/attachments/827395551628754985/841916355523248138/unknown.png")
	.setColor("YELLOW")

	if (!args[0]) return message.channel.send(embed);

  if (args[0].toLowerCase()=="upvotes" || args[0].toLowerCase()=="upv"){
    	const embed1 = new MessageEmbed()
	.setAuthor(capitalize(message.member.displayName + "'s Upvotes"))
	.setDescription(`You currently have ${user.upvotes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Upv.`)
	.setThumbnail("https://cdn.discordapp.com/attachments/827395551628754985/841916355523248138/unknown.png")
	.setColor("YELLOW")

	return message.channel.send(embed1);
  }
  if (args[0].toLowerCase()=="shards" || args[0].toLowerCase()=="sh"){
  const embed2 = new MessageEmbed()
	.setAuthor(capitalize(message.member.displayName + "'s Shards"))
	.setDescription(`You currently have ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Sh.`)
	.setThumbnail("https://cdn.discordapp.com/attachments/827395551628754985/841916355523248138/unknown.png")
	.setColor("YELLOW")

	return message.channel.send(embed2);
  }
	}
}