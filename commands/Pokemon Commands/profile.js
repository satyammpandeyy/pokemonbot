const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "profile",
  description: "Displays stuff available in shop",
  category: "Pokemon Commands",
  args: false,
  usage: ["profile"],
  cooldown: 3,
  permissions: [],
  aliases: ["pf"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });

    if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");


    if (!user.createdAt || !isNaN(user.createdAt)) user.createdAt = new Date();
    await user.save();
    var time = user.createdAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    time = new Date(time).toISOString()
    time = time.replace("-", "T")
    time = time.replace("-", "T")
    time = time.split("T")
    time = `${time[2]}/${time[1]}/${time[0]}`;

    let e = message,
      n = args.join(" "),
      a = user,
      s = a.pokemons.map((r, i) => { r.num = i + 1; return r }),
      zbc = {};
    n.split(/--|—/gmi).map(x => {
      if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
    })
    let psinfo;
    if (!user.pokemons[selected]) {
      psinfo = 'Not Selected'
    }
    else {
      var selected = user.selected;
      var name = user.pokemons[selected].name;
      var Name = name;
      psinfo = `Lvl ${user.pokemons[user.selected].level} ${user.pokemons[selected].shiny ? "⭐ " : ""}${capitalize(user.pokemons[user.selected].name)}`
    }


    let embed = new MessageEmbed()
      .setColor("#fff200")
      .setAuthor(`${message.author.username}'s Profile`)
      .setDescription(
        ` **Balance:** ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  \n`
        + ` | **Redeems:** ${user.redeems}\n`
        + `✨ | **Shards**: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n`
        + ` | **Pokemons Caught:** ${user.caught.length || 0} \n`
        + ` | **Shinies Caught**: ${user.shinyCaught || 0}\n`
        + ` | **Total Shinies:** ${user.pokemons.filter(r => r.shiny).length}\n`
        + ` | **Pokemons Released**: ${user.released}\n`
        + ` | **Total Pokémons**: ${s.length}\n`
        + ` | **Selected Pokemon**: ${psinfo}\n`
        + ` | **Vote Streak**: ${user.streak}\n`
        + ` | **Upvotes:**: ${user.upvotes}\n`
        + ` | **XP Booster**: -\n`
        + ` | **Shiny Charm Expires**: -`)

      .setThumbnail(message.author.displayAvatarURL())
      .setFooter("Started " + client.user.username + " On | " + time)
    message.channel.send(embed)



  }
}

//











