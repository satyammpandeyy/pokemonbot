const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
    name: "invite",
    description: "invite the bot to your server",
    category: "miscellaneous",
    args: false,
    usage: ["invite"],
    cooldown: 3,
    permissions: [],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {

      
      let embed = new MessageEmbed()
      .setDescription(`**[Click Here](https://discord.com/api/oauth2/authorize?client_id=840579144525021185&permissions=67226625&scope=bot).**`)
      .setFooter("Thank You for inviting the bot.")
      .setColor("fff200")
      message.channel.send(embed)

    }
}
