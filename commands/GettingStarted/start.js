const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "start",
  description: "Find out how to get your first pokémon!",
  category: "GettingStarted",
  args: false,
  usage: ["start"],
  cooldown: 3,
  permissions: [],
  aliases: [],

  async execute(client, message, args, prefix, guild, color, channel) {
    let user = await User.findOne({ id: message.author.id });



    let embed = new MessageEmbed()
      .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
      .setTitle("Hello " + message.author.username + "!")
      .setDescription(`**Welcome to the world of Pokémon!**`
        + `\nTo begin playing, choose one of these pokémon with the \`${prefix}pick <pokemon>\` command. \nLike this: \`${prefix}pick squirtle\``)
      .addField(`Generation I (Kanto)`, `Bulbasaur · Charmander · Squirtle`)
      .addField(`Generation II (Johto)`, `Chikorita · Cyndaquil · Totodile`)
      .addField(`Generation III (Hoenn)`, `Treecko · Torchic · Mudkip`)
      .addField(`Generation IV (Sinnoh)`, `Turtwig · Chimchar · Piplup`)
      .addField(`Generation V (Unova)`, `Snivy · Tepig · Oshawott`)
      .addField(`Generation VI (Kalos)`, `Chespin · Fennekin · Froakie`)
      .addField(`Generation VII (Alola)`, `Rowlet · Litten · Popplio`)
      .addField(`Generation VIII (Galar)`, `Grookey · Scorbunny · Sobble`)
      .setColor("#fff200")
      .setFooter(`Hope you enjoy the ${client.user.username} Bot and make sure you join the Bot's Official Server to stay updated about the Bot!`)
      .setImage("https://cdn.discordapp.com/attachments/853888483919003648/853909021189603389/images_11.jpeg")

    return message.channel.send(embed)
  }
}