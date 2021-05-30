const discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const hastebin = require("hastebin-gen");
const { uptime } = require('process');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");


module.exports = {
  name: "eval",
  description: "Evals the code",
  category: "Dev",
  args: false,
  usage: ["eval <code>"],
  cooldown: 3,
  permissions: [],
  aliases: [],

  execute: async (client, message, args, prefix, guild, color, channel) => {
  	const code = args.join(" ");
  if(!code) code = "message.channel.send(\"Hii, Sup Provide Code Pls\")"
   const embed = new discord.MessageEmbed()
    .addField("**Code:**", "```js\n"+code+"```")
    .setColor("#25C059")
   .setFooter("Requested By: " +message.author.tag, message.author.avatarURL({ format: 'png', dynamic: true}))
    
     try{
     let evaled = await eval(`(async() => { ${code} })()`);
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
        if (evaled.includes(client.token) && !message.author.id === config.owner) evaled.replace(client.token, "||Cencosred||")
        if(code.length > 1000){
          const haste = await hastebin(code, {extension: "js"})
          embed.fields[0].value = `[Code](${haste})`
        }  
        if(evaled.length > 1000) {
            const haste = await hastebin(evaled, { extension: "txt" })
            embed.addField("**OUTPUT: **", `[Evaled File](${haste})`)
          }else{
          embed.addField("**OUTPUT: **", "```xl\n"+evaled+"```")
          }
          embed.addField("**OUTPUT TYPE: **", "```xl\n"+typeof evaled+"```")
          return message.channel.send(embed)
        
    } catch (err) {
      if(err.length > 1000) {
            const haste = await hastebin(err, { extension: "txt" })
        embed.addField("**ERROR: **", `[Error!](${haste})`)
          }else{
        embed.addField("**ERROR: **", "```xl\n"+err+"```")
          }
      return message.channel.send(embed)
    }
}
}



