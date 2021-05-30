const Discord = require("discord.js");
const Guild = require('../../models/guild.js')
const {MessageEmbed} = require("discord.js");
const { capitalize } = require('../../functions.js');
const User = require("./../../models/user");


module.exports = {
  name: "server_spawn",
  description: "Toggle Enable/Disable spawns!",
  category: "configuration",
  args: true,
  usage: ["server_spawn <true/false>"],
  cooldown: 3,
  permissions: ['ADMINISTRATOR'],
  aliases: ["s_e"],
  execute: async (client, message, args, color, channel,guild) => {
     if(!guild) {
      const server = new Guild({id: message.guild.id, prefix: null, spawnchannel: null, spawnbtn: false, levelupchannel: null, levelupbtn: null});
      await server.save();
    }
     let nguild = await Guild.findOne({ id: message.guild.id });
    
   let user = await User.findOne({id: message.author.id});
if(!user){
      return message.reply(`Please pick a starter pokemons using ${nguild.prefix}start before using this command`)
    }
  
     if(!args[0]) return message.channel.send(`Correct usage: **${nguild.prefix || client.config.prefix}server_spawn <true/false>** or **${nguild.prefix || client.config.prefix}s_e <true/false>**`);
    if(!args[0].toLowerCase().match(/true|false|enable|disable/)) return message.channel.send(`Correct usage: ${nguild.prefix || client.config.prefix}server_spawn <true/false>`)
    nguild.spawnbtn = (args[0].toLowerCase() === "true" || (args[0].toLowerCase() === "enable")) ? true : false;
    await nguild.save();
    return message.channel.send( {embed: {title: `Pokemon Spawn Configuration`, color: 0x00f9ff, description: `Pokemon Spawns for ${message.guild.name} has been Set to \`${nguild.spawnbtn}\``}} );
    
  }
}