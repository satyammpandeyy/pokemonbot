const Discord = require("discord.js");

const { MessageEmbed, MessageCollector, Collection } = require("discord.js");

const { get } = require('request-promise-native');

const User = require('../../models/user.js');

const Guild = require('../../models/guild.js');

const ms = require("ms");

module.exports = {

    name: "shiny-hunt",

    description: "Hunt a Pokemon As Shiny ",

    category: "miscellaneous",

    args: false,

    usage: ["shiny-hunt <pokemkn name>"],

    cooldown: 3,

    permissions: [],

    aliases: ["sh"],

    execute: async (client, message, args, prefix, guild, color, channel) => {

   

// inside a command, event listener, etc.

const Embed = new Discord.MessageEmbed()

	.setColor('#0099ff')

	.setTitle('Shiny Hunt Is Enabled')

	.setURL('https://discord.gg/q9uJ7zA6gb')

	

	.setDescription("YouR ShinY HunT IS BoosteD BY 10%")




	.setThumbnail('https://cdn.discordapp.com/attachments/845894644273643550/849511529031270430/final_60b63c5ec24077007ff490be_956899.gif')

	

		

	

	

	

	

	

message.channel.send(Embed);

        }

    }