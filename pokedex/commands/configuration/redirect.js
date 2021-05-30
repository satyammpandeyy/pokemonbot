const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require('../../functions.js');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
    name: "redirect",
    description: "Select a different pokemon.",
    category: "configuration",
    args: false,
    usage: ["redirect <args> <pokemonID>"],
    cooldown: 3,
    permissions: ['MANAGE_MESSAGES'],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {
    
    //const guild = await Guild.findOne({ id: message.guild.id });
    if(!guild) {
      const server = new Guild({id: message.guild.id, prefix: null, spawnchannel: null, spawnbtn: false, levelupchannel: null, levelupbtn: null});
      await server.save();
    }
 
    let nguild = await Guild.findOne({ id: message.guild.id });
    let user = await User.findOne({id: message.author.id});
    if(!user){
      return message.reply(`Please pick a starter pokemons using ${nguild.prefix}start`)
    }
    if(!args[0]) return message.reply(`Please specify a channel to redirect spawns using \`${nguild.prefix}redirect <channel>\` or use \`${nguild.prefix}redirect reset\` to reset redirect channel.`)
    if(args[0].toLowerCase() == "reset") {
      nguild.spawnchannel = null;
      await nguild.save();
      return message.channel.send(`Removed redirect channel.`);
    }
    let nchannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(r=>r.name.toLowerCase().includes(args[0]))
    if(!nchannel) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}redirect <mentionchannel/id/name>**`);
      nguild.spawnchannel = nchannel.id;
      await nguild.save();
      return message.channel.send( {embed: {title: `Redirect channel configuration`, color: 0x00f9ff, description: `Redirect channel for ${message.guild.name} has been set to <#${nguild.spawnchannel}>`}} );
  }
}  
