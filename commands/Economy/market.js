/*const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const { readFileSync } = require('fs')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const User = require('../../models/user.js');
const Market = require('../../models/market.js');
const Guild = require('../../models/guild.js');
const legends = readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const legends2 = readFileSync("./db/legends2.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const starters = readFileSync("./db/starters.txt").toString().trim().split("\n").map(r => r.trim());
const ub = readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
const galarians = readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Gmax = require('../../db/gmax.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const Concept = require('../../db/concept.js');
const ms = require("ms");

module.exports = {
  name: "market",
  description: "Market",
  category: "Economy",
  args: true,
  options: [""],
  cooldown: 3,
  permissions: [],
  aliases: ["m"],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    const user = await User.findOne({ id: message.author.id });
    const embed = new Discord.MessageEmbed()
    if (!user) return message.channel.send(`Please pick a starter before using this command.`);

    //market listings 
    if (message.content.toLowerCase().includes(guild.prefix + "market listings") || message.content.toLowerCase().includes(guild.prefix + "m listings") || message.content.toLowerCase().includes(guild.prefix + "m lt") || message.content.toLowerCase().includes(guild.prefix + "market lt") || message.content.toLowerCase().includes(guild.prefix + `market ${Number(args[0])} listings`) || message.content.toLowerCase().includes(guild.prefix + `market ${Number(args[0])} lt`) || message.content.toLowerCase().includes(guild.prefix + `m ${Number(args[0])} listings`) || message.content.toLowerCase().includes(guild.prefix + `m ${Number(args[0])} lt`)) {
    let all = await Market.find({});
      all.map((r, i) => {
      r.num = i + 1;
      return r;
      });
      all = all.filter(r => r.id === user.id);
      let chunks = chunk(all, 20);

      if (all[0]) {
        if (Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}m`) || Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}market`)) {
          //    if(args[0] == 0) args[0]; 
          let chunks = chunk(all, 20);
          let index = args[0] - 1;
          //   if(index) index;
          //   console.log(chunks[0]);
          let ix = ((index % chunks.length) + chunks.length) % chunks.length;
          //   const no = ((ix + 1)*20)-20
          embed
          let actualpage = index + 1
          index = ((index % chunks.length) + chunks.length) % chunks.length;
          if (args[0] > chunks.length) {
            embed.setDescription(`There is Nothing listed on Market`)
            embed.setFooter(`Showing ${args[0]}-${chunks.length} of ${all.length} pokémon matching this search.`);
          }
          else {
            const no = ((index + 1) * 20) - 20
            embed.setDescription(chunks[index].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${r.num} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} cc`).join('\n') || "There is no pokemon in market")
            embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${all.length} pokémon matching this search.`);
          }
          embed.setAuthor(`${message.author.tag}'s' Market Listings`)
          embed.setColor(`RED`)
          return message.channel.send(embed);
        }
        if (all[20] && message.content.endsWith(`${guild.prefix}m lt`) || all[20] && message.content.endsWith(`${guild.prefix}market lt`) || all[20] && message.content.endsWith(`${guild.prefix}market listings`) || all[20] && message.content.endsWith(`${guild.prefix}m listings`)) {
          //    if(args[0] == 0) args[0]; 
          let chunks = chunk(all, 20);
          let index = 0;
          //   if(index) index;
          //   console.log(chunks[0]);
          let ix = ((index % chunks.length) + chunks.length) % chunks.length;
          //   const no = ((ix + 1)*20)-20
          embed
          let actualpage = index + 1
          index = ((index % chunks.length) + chunks.length) % chunks.length;
          const no = ((index + 1) * 20) - 20
          embed.setAuthor(`${message.author.tag}'s Market Listings`)
          embed.setDescription(chunks[index].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${r.num} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} cc`).join('\n') || "There is no pokemon in market")
          embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${all.length} pokémon matching this search.`)
          embed.setColor(`RED`)
          return message.channel.send(embed);
        }
        else {
          embed
            .setAuthor(`${message.author.tag}'s Market Listings`)
            .setColor('RED')
            .setDescription(chunks[0].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${r.num} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} cc`).join('\n') || "There is no pokemon in market")
            .setFooter(`Showing 1-1 of ${all.length} pokémon matching this search.`);
          message.channel.send(embed)
        }
      }
      else {
        return message.channel.send("You don't have any pokemon listed on market.")
      }
    
    //Market remove
    } else if (args[0] === "remove" || args[0] === "r") {
      let removeembed = new MessageEmbed()
      .setTitle("confirm?")
      let msg = await message.channel.send(removeembed);
      let market = await Market.find({});

      market = market.map((r, i) => {
        r.num = i + 1;
        return r;
      }).filter(r => r.id === user.id);
      //let user = await Market.find({id: user.id});

      if (isNaN(args[1]) || !market.find(r => r.num === parseInt(args[1]))) return message.channel.send(`Invalid market number provided`);

      let num = parseInt(args[1]) - 1;

      //let check = await Market.findOne({pokemon: market[num].pokemon, price: market[num].price});

      let data = market.find(r => r.num === parseInt(args[1]));

      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
        user.pokemons.push(data.pokemon);
        await user.markModified(`pokemons`);

        await user.save().catch(console.error);

        await Market.deleteOne({ id: data.id, pokemon: data.pokemon, price: data.price });
        message.reactions.removeAll();
          msg.reactions.removeAll();
          message.delete();
        return message.channel.send(`Successfully removed your pokemon from market`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send(" Aborted.")
        }
      });

      collector.on('end', collected => {
        return;
      });

      }
      else if (args[0] === "info" || args[0] === "i") {
        let market = await Market.find({});
        //let user = await Market.find({id: user.id}); 
        if (isNaN(args[1]) || !market[parseInt(args[1]) - 1]) return message.channel.send(`Invalid market number provided`);
  
        let num = parseInt(args[1]) - 1;
        var name = market[num].pokemon.name
        let level = market[num].pokemon.level
        var nb = market[num].pokemon._nb
        //var tp = user.pokemons[selected].rarity;
        var stat1 = market[num].pokemon.hp
        var stat2 = market[num].pokemon.atk
        var stat3 = market[num].pokemon.def
        var stat4 = market[num].pokemon.spatk
        var stat5 = market[num].pokemon.spdef
        var stat6 = market[num].pokemon.speed
        const g8 = Gen8.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase())
        if (g8) {
          let hpBase = g8.hp;
          let atkBase = g8.atk;
          let defBase = g8.def;
          let spatkBase = g8.spatk;
          let spdefBase = g8.spdef;
          let speedBase = g8.speed;
          let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
          let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
          let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
          let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
          let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
          let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = g8.type.capitalize()
  
          const Embed = embed
          Embed.setColor('RED')
          Embed.setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} ${g8.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} CC`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          let url
          const s = shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) {
            url = s.url
          }
          else {
            url = g8.url
          }
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          return message.channel.send(Embed);
        }
        const mg = Mega.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("mega-", "").toLowerCase())
        if (mg && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
          let f = mg
          let hpBase = f.hp;
          let atkBase = f.atk;
          let defBase = f.def;
          let spatkBase = f.spatk;
          let spdefBase = f.spdef;
          let speedBase = f.speed;
          let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10);
          let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level / 100 + 5) * 0.9);
          let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0 / 4)) * level / 100 + 5) * 1);
          let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0 / 4)) * level / 100 + 5) * 1.1);
          let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0 / 4)) * level / 100 + 5) * 1);
          let fspeed = Math.floor(Math.floor((2 * speedBase + stat6 + (0 / 4)) * level / 100 + 5) * 1);
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = f.type.capitalize()
          if (isNaN(market[num].pokemon.xp)) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await user.save()
          }
          if (market[num].pokemon.xp > market[num].pokemon.level * 100 + 101) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await market[num].pokemon.save()
          }
          const Embed = embed
          Embed.setColor('RED')
          Embed.setTitle(`${(market[num].pokemon.shiny ? "⭐" : "")} Mega ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Level:**  ${market[num].pokemon.level} | **XP:** ${market[num].pokemon.xp}\n**Type:** ${tp}\n**Nature:** ${market[num].pokemon.nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          let url = f.url
          const mgs = megashiny.find(e => e.name === market[num].pokemon.name.replace("mega-", "").toLowerCase())
          if (market[num].pokemon.shiny && mgs) url = mgs.url
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          return message.channel.send(Embed);
        }
        const cp = Concept.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase())
        if (cp) {
          let f = cp
          let hpBase = f.hp;
          let atkBase = f.atk;
          let defBase = f.def;
          let spatkBase = f.spatk;
          let spdefBase = f.spdef;
          let speedBase = f.speed;
          let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10);
          let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level / 100 + 5) * 0.9);
          let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0 / 4)) * level / 100 + 5) * 1);
          let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0 / 4)) * level / 100 + 5) * 1.1);
          let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0 / 4)) * level / 100 + 5) * 1);
          let fspeed = Math.floor(Math.floor((2 * speedBase + stat6 + (0 / 4)) * level / 100 + 5) * 1);
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = f.type.capitalize()
          if (isNaN(market[num].pokemon.xp)) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await user.save()
          }
          if (market[num].pokemon.xp > market[num].pokemon.level * 100 + 101) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await market[num].pokemon.save()
          }
          const Embed = embed
          Embed.setColor('RED')
          Embed.setTitle(`${(market[num].pokemon.shiny ? "⭐" : "")} ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Level:**  ${market[num].pokemon.level} | **XP:** ${market[num].pokemon.xp}\n**Type:** ${tp}\n**Nature:** ${market[num].pokemon.nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          let url = f.url
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          return message.channel.send(Embed);
        }
        const sm = Shadow.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("shadow-", "").toLowerCase())
        if (sm && name.toLowerCase().startsWith("shadow")) {
          let f = sm
          let hpBase = f.hp;
          let atkBase = f.atk;
          let defBase = f.def;
          let spatkBase = f.spatk;
          let spdefBase = f.spdef;
          let speedBase = f.speed;
          let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10);
          let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level / 100 + 5) * 0.9);
          let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0 / 4)) * level / 100 + 5) * 1);
          let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0 / 4)) * level / 100 + 5) * 1.1);
          let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0 / 4)) * level / 100 + 5) * 1);
          let fspeed = Math.floor(Math.floor((2 * speedBase + stat6 + (0 / 4)) * level / 100 + 5) * 1);
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = f.type.capitalize()
          if (isNaN(market[num].pokemon.xp)) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await market[num].pokemon.save()
          }
          if (market[num].pokemon.xp > market[num].pokemon.level * 100 + 101) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await market[num].pokemon.save()
          }
          const Embed = new embed
          Embed.setColor('#05f5fc')
          Embed.setTitle(`${(market[num].pokemon.shiny ? "⭐" : "")} Shadow ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Level:**  ${market[num].pokemon.level} | **XP:** ${market[num].pokemon.xp}\n**Type:** ${tp}\n**Nature:** ${market[num].pokemon.nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          let url = f.url
          const s = shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) url = s.url
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          return message.channel.send(Embed);
        }
        const f = Forms.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase())
        if (f) {
          let hpBase = f.hp;
          let atkBase = f.atk;
          let defBase = f.def;
          let spatkBase = f.spatk;
          let spdefBase = f.spdef;
          let speedBase = f.speed;
          let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
          let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
          let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
          let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
          let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
          let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = f.type.capitalize()
          const Embed = embed
          Embed.setColor('RED')
          Embed.setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} ${f.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          let url
          const s = shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) {
            url = s.url
          }
          else {
            url = f.url
          }
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          return message.channel.send(Embed);
        }
          const gmax = Gmax.find(e => e.name.toLowerCase() === name.replace("gigantamax-", "").toLowerCase());
        if (gmax && market[num].pokemon.name.toLowerCase().startsWith('gigantamax')) {
          let hpBase = gmax.hp;
          let atkBase = gmax.atk;
          let defBase = gmax.def;
          let spatkBase = gmax.spatk;
          let spdefBase = gmax.spdef;
          let speedBase = gmax.speed;
          let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
          let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
          let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
          let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
          let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
          let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = gmax.type.capitalize()
          const Embed = embed
          Embed.setColor('RED')
          Embed.setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} Gigantamax ${gmax.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          let url
          const s = Shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) {
            url = s.url
          }
          else {
            url = gmax.url
          }
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          return message.channel.send(Embed);
        }
        const pk = Pokemon.find(e => e.name === market[num].pokemon.name.toLowerCase())
        if (pk) {
          let hpBase = pk.hp;
          let atkBase = pk.atk;
          let defBase = pk.def;
          let spatkBase = pk.spatk;
          let spdefBase = pk.spdef;
          let speedBase = pk.speed;
          let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
          let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
          let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
          let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
          let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
          let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = pk.type.capitalize()
  
          const Embed = embed
          Embed.setColor('RED')
          Embed.setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} ${pk.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          let url
          const s = shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) {
            url = s.url
          }
          if (market[num].pokemon.shiny && market[num].pokemon.name.toLowerCase() == "eternatus" || url == "https://imgur.com/TUtkb2v.png") {
            url = "https://i.imgur.com/lkx7zZ3.png"
          }
          else {
            url = pk.url
            if (market[num].pokemon.shiny && market[num].pokemon.name.toLowerCase() == "eternatus" || url == "https://imgur.com/TUtkb2v.png") {
              url = "https://i.imgur.com/lkx7zZ3.png"
            }
          }
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          return message.channel.send(Embed);
        }
        else {
          name = market[num].pokemon.name.toLowerCase();
          if (market[num].pokemon.name.startsWith("alolan")) {
            name = name.replace("alolan", "").trim().toLowerCase();
            name = `${name}-alola`.toLowerCase();
          }
          P.getPokemonByName(name).then(async function (response) {
            let hpBase = response.stats[0].base_stat;
            let atkBase = response.stats[1].base_stat;
            let defBase = response.stats[2].base_stat;
            let spatkBase = response.stats[3].base_stat;
            let spdefBase = response.stats[4].base_stat;
            let speedBase = response.stats[5].base_stat;
            let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
            let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
            let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
            let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
            let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
            let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
            let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
            const totalivs = Math.floor(Math.round(totaliv))
            const finaliv = (totaliv.toFixed(2))
            const options = {
              url: `https://pokeapi.co/api/v2/pokemon/${name}`,
              json: true
            };
            let bdy = await get(options)
            let id;
            if (bdy.id < 10) id = `00${bdy.id}`
            else if (bdy.id > 9 && bdy.id < 100) id = `0${bdy.id}`
            else if (bdy.id > 99) id = bdy.id
            if (name.endsWith('-alola')) {
              name = name.replace("-alola", "").trim().toLowerCase();
              const t = await P.getPokemonByName(name);
              id = `${t.id}_f2`
              const ch = getlength(t.id);
              if (ch === 1) {
                id = `00${t.id}_f2`
              } else if (ch === 2) {
                id = `0${t.id}_f2`
              } else if (ch === 3) {
                id = `${t.id}_f2`
              }
            }
            name = market[num].pokemon.name.toLowerCase();
            var tp = bdy.types[0].type.name.capitalize()
            embed
              .setColor('RED')
              .setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} ${market[num].pokemon.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc`)
              .setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
              .setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
              .setThumbnail(message.author.avatarURL({ dynamic: true }))
            var uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`
            const fm = Forms.find(e => e.name === name.toLowerCase())
            const mg = Mega.find(e => e.name === name.toLowerCase())
            const pm = Primal.find(e => e.name === name.toLowerCase())
            if (fm) {
              uri = fm.url
              name = "Pokemon.png"
            }
            if (mg && name.toLowerCase().startsWith("mega-")) {
              uri = mg.url
              name = "Pokemon.png"
            }
            if (pm && name.toLowerCase().startsWith("primal")) {
              uri = pm.url
              name = "Pokemon.png"
            }
            if (market[num].pokemon.name.toLowerCase() === "giratina-origin" && !market[num].pokemon.shiny) uri = "https://imgur.com/UHVxS2q.png"
            if (market[num].pokemon.shiny) {
              uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name.toLowerCase()}.gif`
              const pokemon = shiny.find(e => e.name === name)
              const mgs = megashiny.find(e => e.name === name.toLowerCase())
              if (!pokemon) {
                uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name.toLowerCase()}.gif`
                name = "Pokemon.gif"
              }
              if (pokemon) {
                uri = pokemon.url
                name = "Pokemon.png"
              }
              if (mgs && name.toLowerCase().startsWith("mega-")) {
                uri = mgs.url
                name = "Pokemon.png"
              }
              if (name.toLowerCase() == "giratina-origin") {
                uri = `https://imgur.com/UHVxS2q.png`
              }
              let p;
              if (name.toLowerCase() === "primal-kyogre") {
                p = primal[0]
                uri = "https://i.imgur.com/XdZwD0s.png"
              }
              if (name.toLowerCase() === "primal-groudon") {
                p = primal[1]
                uri = "https://i.imgur.com/Xzm1FDn.png"
              }
              embed.attachFiles([{ name: name, attachment: uri }])
                .setImage("attachment://" + name)
            }// Fixed
            let imgname = "Pokemon.png";
            if (uri.endsWith(".gif")) imgname = "Pokemon.gif"
            embed.attachFiles([{ name: imgname, attachment: uri }])
              .setImage("attachment://" + imgname)
            embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
            message.channel.send(embed);
          }) //.catch((err) => {
            //message.reply(`${err}`)
          //})
        }
  
      } else if (args[0] === "list" || args[0] === "l") {
      if (isNaN(args[1])) return message.channel.send(`Invalid Pokémon id provided. It should be in the form of \`${prefix}market list <pokemon id> <price>\``);
      let num = parseInt(args[1]) - 1;

      if (!user.pokemons[num]) return message.channel.send(`Unable to find that Pokémon in your Pokedex Collection.`);

      if (user.pokemons.length < 2) return message.channel.send(`You cannot list your only Pokemon!`);

      if (isNaN(args[2])) {
        return message.channel.send(`Invalid cc input provided. It should be in the form of \`${prefix}market list <pokemon#id> <price>\``);
      }
      if ((args[2])> 10000000) {
        return message.channel.send(`You cannot List your Pokémon on the Market for more than **\`10,000,000\`** CC. Please Try Again!`);
      }
      

      let newDoc = new Market({
        id: message.author.id,
        pokemon: user.pokemons[num],
        price: parseInt(args[2])
      });

      user.pokemons.splice(args[1] - 1, 1);

      await user.save().catch(e => console.log(e));

      await newDoc.save().catch(e => console.log(e));

      return message.channel.send(`Successfully listed your Pokemon N#${args[1]} on Markets for ${args[2]} cc.`);

    } else if (args[0] === "buy" || args[0] === "b") {
      let market = await Market.find({});
      //let user = await Market.find({id: user.id});

      if (isNaN(args[1]) || !market[parseInt(args[1]) - 1]) return message.channel.send(`Invalid market number provided`);

      let num = parseInt(args[1]) - 1;

      let check = await Market.findOne({ id: user.id, pokemon: market[num].pokemon, price: market[num].price });

      if (check) return message.channel.send(`You can't buy your own pokemon`);

      if (market[num].price > user.balance) {
        return message.channel.send(`You don't have enough cc to Buy Level ${market[num].pokemon.level} ${market[num].pokemon.name}`)
      }

      let vmsg = `Your **Level ${market[num].pokemon.level} ${market[num].pokemon.name}** has been bought by ${message.author.tag} and you have received ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc.`

      user.pokemons.push(market[num].pokemon);

      user.balance = user.balance - market[num].price;

      await user.markModified(`pokemons`);

      await user.save().catch(console.error);

      let userd = await User.findOne({ id: market[num].id });

      userd.balance = userd.balance + market[num].price;

      await userd.save().catch(console.error);

      let userD = client.users.cache.get(market[num].id);

      await Market.deleteOne({ id: market[num].id, pokemon: market[num].pokemon, price: market[num].price });

      message.channel.send(`You successfully bought Level ${market[num].pokemon.level} ${market[num].pokemon.name} from the Market.`);

      if (userD) await userD.send(vmsg);


    } else if (args[0] === "search" || args[0] === "s") {
      // let market = await Market.find({});
      // let e = message,
      //   n = args.slice(1).join(" "),
      //   a = market,
      //   i = guild,
      //   s = a.map((r, num) => { r.pokemon.num = num + 1; return r }),
      //   zbc = {};
      // console.log(n)
      // n.split(/--|—/gmi).map(x => {
      //   if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
      // });
      // if (zbc["legendary"] || zbc["l"]) s = s.filter(e => { if (legends.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      // if (zbc["mythical"] || zbc["m"]) s = s.filter(e => { if (mythics.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      // if (zbc["ultrabeast"] || zbc["ub"]) s = s.filter(e => { if (ub.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      // if (zbc["mega"] || zbc["mg"]) s = s.filter(e => { if ((e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) return e });
      // if (zbc["gmax"] || zbc["gigantamax"]) s = s.filter(e => { if ((e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("gigantamax-")) return e });
      // if (zbc["alolan"] || zbc["a"]) s = s.filter(e => { if (alolans.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      // if (zbc["galarian"]) s = s.filter(e => { if (galarians.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e; })
      // if (zbc["shiny"] || zbc["s"]) s = s.filter(e => { if (e.pokemon.shiny) return e });
      // if (zbc["name"] || zbc["n"]) s = s.filter(e => { if (e && (zbc['name'] || zbc['n']) == e.pokemon.name.toLowerCase().replace(/-+/g, ' ')) return e });
      // if (zbc['type'] || zbc["tp"]) s = s.filter(e => { if (e.pokemon.rarity.match(new RegExp((zbc['type'] || zbc["tp"]), "gmi")) != null) return e });
      // if (zbc['order'] || zbc['o']) {
      //   let order = zbc['order'] || zbc['o'];
      //   if (order == "price a") {
      //     s = s.sort((a, b) => { return parseFloat(a.price) - parseFloat(b.price) });
      //   }
      //   else if (order == "price d") {
      //     s = s.sort((a, b) => { return parseFloat(b.price) - parseFloat(a.price) });
      //   }
      //   else if (order == "iv") {
      //     s = s.sort((a, b) => { return parseFloat(b.totalIV) - parseFloat(a.totalIV) });
      //   }
      //   else if (order == "alphabet") {
      //     s = s.sort((a, b) => {
      //       if (a.name < b.name) { return -1; }
      //       if (a.name > b.name) { return 1; }
      //       return 0;
      //     })
      //   }
      // }
      // if (zbc["hpiv"]) {
      //   let a = zbc["hpiv"].split(" ")
      //   if (a[0] === ">") s = s.filter(e => { if (e.pokemon.hp > a[1]) return e });
      //   if (a[0] === "<") s = s.filter(e => { if (e.pokemon.hp < a[1]) return e });
      //   if (Number(a[0])) s = s.filter(e => { if (e.pokemon.hp == a[1]) return e });
      // }
      // if (zbc["atkiv"]) {
      //   let a = zbc["atkiv"].split(" ")
      //   if (a[0] === ">") s = s.filter(e => { if (e.pokemon.atk > a[1]) return e });
      //   if (a[0] === "<") s = s.filter(e => { if (e.pokemon.atk < a[1]) return e });
      //   if (Number(a[0])) s = s.filter(e => { if (e.pokemon.atk == a[1]) return e });
      // }
      // if (zbc["defiv"]) {
      //   let a = zbc["defiv"].split(" ")
      //   if (a[0] === ">") s = s.filter(e => { if (e.pokemon.def > a[1]) return e });
      //   if (a[0] === "<") s = s.filter(e => { if (e.pokemon.def < a[1]) return e });
      //   if (Number(a[0])) s = s.filter(e => { if (e.pokemon.def == a[1]) return e });
      // }
      // if (zbc["spatkiv"]) {
      //   let a = zbc["spatkiv"].split(" ")
      //   console.log(s.map(s => s.pokemon[0]))
      //   if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spatk > a[1]) return e });
      //   if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spatk < a[1]) return e });
      //   if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spatk == a[1]) return e });
      // }
      // if (zbc["spdefiv"]) {
      //   let a = zbc["spdefiv"].split(" ")
      //   console.log(s.map(s => s.pokemon[0]))
      //   if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spdef > a[1]) return e });
      //   if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spdef < a[1]) return e });
      //   if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spdef == a[1]) return e });
      // }
      // if (zbc["speediv"]) {
      //   let a = zbc["speediv"].split(" ")
      //   console.log(s.map(s => s.pokemon[0]))
      //   if (a[0] === ">") s = s.filter(e => { if (e.pokemon.speed > a[1]) return e });
      //   if (a[0] === "<") s = s.filter(e => { if (e.pokemon.speed < a[1]) return e });
      //   if (Number(a[0])) s = s.filter(e => { if (e.pokemon.speed == a[1]) return e });
      // }
      // let txt;
      // let num = 0
      // let embed = new Discord.MessageEmbed()
      // let array = [s];
      // //console.log(s)
      // let chunks = chunk(s, 20)

      // let index = 0;
      // if (Number(args[1])) index = parseInt(args[1]) - 1
      // let ix = ((index % chunks.length) + chunks.length) % chunks.length;
      // let actualpage = index + 1
      // index = ((index % chunks.length) + chunks.length) % chunks.length;
      // if (isNaN(e[1])) txt = s.map((item, i) => `${item.pokemon.shiny ? ":star: " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(item.price)} ツ`).slice(0, 15).join("\n")

      // if (Number(args[1])) {
      //   if (txt == "") {
      //     txt += "There is Nothing listed on Market"
      //   }
      //   if (chunks.length == 0) {
      //     chunks.length = 1
      //   }
      //   //console.log(chunks.map(item => {item.pokemon}).join("\n"))
      //   embed
      //     .setTitle(`PokeMania's Market`)
      //     .setColor('#05f5fc')
      //     .setDescription((chunks[index].map((item, i) => { return `${item.pokemon.shiny ? ":star: " : ""} **Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(item.price)} ツ` }).join("\n")))
      //   if (args[1] > chunks.length) {
      //     embed.setDescription("There is Nothing listed on Market")
      //   }
      //   embed.setFooter(`Showing ${args[1]}-${chunks.length} of ${s.length} pokémon matching this search.`);
      //   return e.channel.send(embed)
      // }
      // else {
      //   if (txt == "") {
      //     txt += "There is Nothing listed on Market"
      //   }
      //   if (chunks.length == 0) {
      //     chunks.length = 1
      //   }
      //   let embed = new Discord.MessageEmbed()
      //     .setTitle(`PokeMania's Market`)
      //     .setColor('#05f5fc')
      //     .setDescription(txt)
      //     .setFooter(`Showing 1-${chunks.length} of ${s.length} pokémon matching this search.`);
      //   return e.channel.send(embed)
      // }
      let all = await Market.find({});
      let chunks = chunk(all, 20);
      
    if(Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}m`) || Number(args[0]) && message.content.startsWith(`${guild.prefix}market`)){
//    if(args[0] == 0) args[0]; 
      let chunks = chunk(all, 20);
      let index = args[0]-1;
 //   if(index) index;
 //   console.log(chunks[0]);
      let ix = (( index % chunks.length) + chunks.length) % chunks.length;
 //   const no = ((ix + 1)*20)-20
      embed
      let actualpage = index + 1
      index = ((index % chunks.length) + chunks.length) % chunks.length;
      if(args[0] > chunks.length){
        embed.setDescription(`There is Nothing listed on Market`)
        embed.setFooter(`Showing ${args[0]}-${chunks.length} of ${all.length} pokémon matching this search.`);
      }
      else{
        const no = ((index + 1)*20)-20
        embed.setDescription(chunks[index].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐": "")}${r.pokemon.name.capitalize().replace(/-+/g, " ")}** | ID: ${no+i+1} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} cc`).join('\n') || "There is no pokemon in market")
        embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${all.length} pokémon matching this search.`);
      }
      embed.setAuthor(" Market")
      embed.setColor("RED")
      return message.channel.send(embed); 
    }
      if(all[20] && message.content.endsWith(`${guild.prefix}m`) || message.content.endsWith(`${guild.prefix}market`)){
//    if(args[0] == 0) args[0]; 
        let chunks = chunk(all, 20);
        let index = 0;
 //   if(index) index;
 //   console.log(chunks[0]);
        let ix = (( index % chunks.length) + chunks.length) % chunks.length;
 //   const no = ((ix + 1)*20)-20
        
        let actualpage = index + 1
        index = ((index % chunks.length) + chunks.length) % chunks.length;
        const no = ((index + 1)*20)-20
        
        embed
        .setAuthor(" Market")
        .setColor('RED')
        .setDescription(chunks[0].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐": "")}${r.pokemon.name.capitalize().replace(/-+/g, " ")}** | ID: ${i + 1} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} cc`).join('\n') || "There is no pokemon in market")
        .setFooter(`Showing 1-1 of ${all.length} pokémon matching this search.`);
        return message.channel.send(embed);
      
      }
      else{
        embed
        .setAuthor("Market")
        .setColor('RED')
        .setDescription(chunks[0].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐": "")}${r.pokemon.name.capitalize().replace(/-+/g, " ")}** | ID: ${i + 1} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} cc`).join('\n') || "There is no pokemon in market")
        .setFooter(`Showing Page 1-1 of ${all.length} pokémon matching this search.`);
        return message.channel.send(embed);
      }

    }else{
      
    }
  }
}

function chunk(array, chunkSize) {
  const temp = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    temp.push(array.slice(i, i + chunkSize));
  }
  return temp;
}


*/
const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const { readFileSync } = require('fs')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const User = require('../../models/user.js');
const Market = require('../../models/market.js');
const Guild = require('../../models/guild.js');
const legends = readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const legends2 = readFileSync("./db/legends2.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const starters = readFileSync("./db/starters.txt").toString().trim().split("\n").map(r => r.trim());
const ub = readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
const galarians = readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Gmax = require('../../db/gmax.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const Concept = require('../../db/concept.js');
const ms = require("ms");

module.exports = {
  name: "market",
  description: "Market",
  category: "Economy",
  args: true,
  options: [""],
  cooldown: 3,
  permissions: [],
  aliases: ["m"],
  execute: async (client, message, args, prefix, guild, color, channel) => {

    const user = await User.findOne({ id: message.author.id });
    const embed = new Discord.MessageEmbed()
    if (!user) return message.channel.send(`Please pick a starter before using this command.`);

    //market listings 
    if (message.content.toLowerCase().includes(guild.prefix + "market listings") || message.content.toLowerCase().includes(guild.prefix + "m listings") || message.content.toLowerCase().includes(guild.prefix + "m lt") || message.content.toLowerCase().includes(guild.prefix + "market lt") || message.content.toLowerCase().includes(guild.prefix + `market ${Number(args[0])} listings`) || message.content.toLowerCase().includes(guild.prefix + `market ${Number(args[0])} lt`) || message.content.toLowerCase().includes(guild.prefix + `m ${Number(args[0])} listings`) || message.content.toLowerCase().includes(guild.prefix + `m ${Number(args[0])} lt`)) {
    let all = await Market.find({});
      all.map((r, i) => {
      r.num = i + 1;
      return r;
      });
      all = all.filter(r => r.id === user.id);
      let chunks = chunk(all, 20);

      if (all[0]) {
        if (Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}m`) || Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}market`)) {
          //    if(args[0] == 0) args[0]; 
          let chunks = chunk(all, 20);
          let index = args[0] - 1;
          //   if(index) index;
          //   console.log(chunks[0]);
          let ix = ((index % chunks.length) + chunks.length) % chunks.length;
          //   const no = ((ix + 1)*20)-20
          embed
          let actualpage = index + 1
          index = ((index % chunks.length) + chunks.length) % chunks.length;
          if (args[0] > chunks.length) {
            embed.setDescription(`There is Nothing listed on Market`)
            embed.setFooter(`Showing ${args[0]}-${chunks.length} of ${all.length} pokémon matching this search.`);
          }
          else {
            const no = ((index + 1) * 20) - 20
            embed.setDescription(chunks[index].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${r.num} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} cc`).join('\n') || "There is no pokemon in market")
            embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${all.length} pokémon matching this search.`);
          }
          embed.setAuthor(`${message.author.tag}'s' Market Listings`)
          embed.setColor(`#05f5fc`)
          return message.channel.send(embed);
        }
        if (all[20] && message.content.endsWith(`${guild.prefix}m lt`) || all[20] && message.content.endsWith(`${guild.prefix}market lt`) || all[20] && message.content.endsWith(`${guild.prefix}market listings`) || all[20] && message.content.endsWith(`${guild.prefix}m listings`)) {
          //    if(args[0] == 0) args[0]; 
          let chunks = chunk(all, 20);
          let index = 0;
          //   if(index) index;
          //   console.log(chunks[0]);
          let ix = ((index % chunks.length) + chunks.length) % chunks.length;
          //   const no = ((ix + 1)*20)-20
          embed
          let actualpage = index + 1
          index = ((index % chunks.length) + chunks.length) % chunks.length;
          const no = ((index + 1) * 20) - 20
          embed.setAuthor(`${message.author.tag}'s Market Listings`)
          embed.setDescription(chunks[index].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${r.num} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} ツ`).join('\n') || "There is no pokemon in market")
          embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${all.length} pokémon matching this search.`)
          embed.setColor(`#05f5fc`)
          return message.channel.send(embed);
        }
        else {
          embed
            .setAuthor(`${message.author.tag}'s Market Listings`)
            .setColor('#05f5fc')
            .setDescription(chunks[0].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${r.num} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} ツ`).join('\n') || "There is no pokemon in market")
            .setFooter(`Showing 1-1 of ${all.length} pokémon matching this search.`);
          message.channel.send(embed)
        }
      }
      else {
        return message.channel.send("You don't have any pokemon listed on market.")
      }
    
    //Market remove
    } else if (args[0] === "remove" || args[0] === "r") {
      let removeembed = new MessageEmbed()
      .setTitle("Are you sure")
      let msg = await message.channel.send(removeembed);
      let market = await Market.find({});

      market = market.map((r, i) => {
        r.num = i + 1;
        return r;
      }).filter(r => r.id === user.id);
      //let user = await Market.find({id: user.id});

      if (isNaN(args[1]) || !market.find(r => r.num === parseInt(args[1]))) return message.channel.send(`Invalid market number provided`);

      let num = parseInt(args[1]) - 1;

      //let check = await Market.findOne({pokemon: market[num].pokemon, price: market[num].price});

      let data = market.find(r => r.num === parseInt(args[1]));

      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
        user.pokemons.push(data.pokemon);
        await user.markModified(`pokemons`);

        await user.save().catch(console.error);

        await Market.deleteOne({ id: data.id, pokemon: data.pokemon, price: data.price });
        message.reactions.removeAll();
          msg.reactions.removeAll();
          message.delete();
        return message.channel.send(`Successfully removed your pokemon from market`)
        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send("Ok Aborted.")
        }
      });

      collector.on('end', collected => {
        return;
      });

      }
      else if (args[0] === "info" || args[0] === "i") {
        let market = await Market.find({});
        //let user = await Market.find({id: user.id}); 
        if (isNaN(args[1]) || !market[parseInt(args[1]) - 1]) return message.channel.send(`Invalid market number provided`);
  
        let num = parseInt(args[1]) - 1;
        var name = market[num].pokemon.name
        let level = market[num].pokemon.level
        var nb = market[num].pokemon._nb
        //var tp = user.pokemons[selected].rarity;
        var stat1 = market[num].pokemon.hp
        var stat2 = market[num].pokemon.atk
        var stat3 = market[num].pokemon.def
        var stat4 = market[num].pokemon.spatk
        var stat5 = market[num].pokemon.spdef
        var stat6 = market[num].pokemon.speed
        const g8 = Gen8.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase())
        if (g8) {
          let hpBase = g8.hp;
          let atkBase = g8.atk;
          let defBase = g8.def;
          let spatkBase = g8.spatk;
          let spdefBase = g8.spdef;
          let speedBase = g8.speed;
          let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
          let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
          let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
          let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
          let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
          let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = g8.type.capitalize()
  
          const Embed = embed
          Embed.setColor('#05f5fc')
          Embed.setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} ${g8.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          let url
          const s = shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) {
            url = s.url
          }
          else {
            url = g8.url
          }
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          return message.channel.send(Embed);
        }
        const mg = Mega.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("mega-", "").toLowerCase())
        if (mg && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
          let f = mg
          let hpBase = f.hp;
          let atkBase = f.atk;
          let defBase = f.def;
          let spatkBase = f.spatk;
          let spdefBase = f.spdef;
          let speedBase = f.speed;
          let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10);
          let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level / 100 + 5) * 0.9);
          let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0 / 4)) * level / 100 + 5) * 1);
          let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0 / 4)) * level / 100 + 5) * 1.1);
          let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0 / 4)) * level / 100 + 5) * 1);
          let fspeed = Math.floor(Math.floor((2 * speedBase + stat6 + (0 / 4)) * level / 100 + 5) * 1);
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = f.type.capitalize()
          if (isNaN(market[num].pokemon.xp)) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await user.save()
          }
          if (market[num].pokemon.xp > market[num].pokemon.level * 100 + 101) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await market[num].pokemon.save()
          }
          const Embed = embed
          Embed.setColor('#05f5fc')
          Embed.setTitle(`${(market[num].pokemon.shiny ? "⭐" : "")} Mega ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Level:**  ${market[num].pokemon.level} | **XP:** ${market[num].pokemon.xp}\n**Type:** ${tp}\n**Nature:** ${market[num].pokemon.nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          let url = f.url
          const mgs = megashiny.find(e => e.name === market[num].pokemon.name.replace("mega-", "").toLowerCase())
          if (market[num].pokemon.shiny && mgs) url = mgs.url
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          return message.channel.send(Embed);
        }
        const cp = Concept.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase())
        if (cp) {
          let f = cp
          let hpBase = f.hp;
          let atkBase = f.atk;
          let defBase = f.def;
          let spatkBase = f.spatk;
          let spdefBase = f.spdef;
          let speedBase = f.speed;
          let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10);
          let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level / 100 + 5) * 0.9);
          let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0 / 4)) * level / 100 + 5) * 1);
          let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0 / 4)) * level / 100 + 5) * 1.1);
          let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0 / 4)) * level / 100 + 5) * 1);
          let fspeed = Math.floor(Math.floor((2 * speedBase + stat6 + (0 / 4)) * level / 100 + 5) * 1);
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = f.type.capitalize()
          if (isNaN(market[num].pokemon.xp)) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await user.save()
          }
          if (market[num].pokemon.xp > market[num].pokemon.level * 100 + 101) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await market[num].pokemon.save()
          }
          const Embed = embed
          Embed.setColor('#05f5fc')
          Embed.setTitle(`${(market[num].pokemon.shiny ? "⭐" : "")} ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Level:**  ${market[num].pokemon.level} | **XP:** ${market[num].pokemon.xp}\n**Type:** ${tp}\n**Nature:** ${market[num].pokemon.nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          let url = f.url
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          return message.channel.send(Embed);
        }
        const sm = Shadow.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("shadow-", "").toLowerCase())
        if (sm && name.toLowerCase().startsWith("shadow")) {
          let f = sm
          let hpBase = f.hp;
          let atkBase = f.atk;
          let defBase = f.def;
          let spatkBase = f.spatk;
          let spdefBase = f.spdef;
          let speedBase = f.speed;
          let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10);
          let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level / 100 + 5) * 0.9);
          let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0 / 4)) * level / 100 + 5) * 1);
          let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0 / 4)) * level / 100 + 5) * 1.1);
          let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0 / 4)) * level / 100 + 5) * 1);
          let fspeed = Math.floor(Math.floor((2 * speedBase + stat6 + (0 / 4)) * level / 100 + 5) * 1);
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = f.type.capitalize()
          if (isNaN(market[num].pokemon.xp)) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await market[num].pokemon.save()
          }
          if (market[num].pokemon.xp > market[num].pokemon.level * 100 + 101) {
            market[num].pokemon.xp = market[num].pokemon.level * 100
            await market[num].pokemon.save()
          }
          const Embed = new embed
          Embed.setColor('#05f5fc')
          Embed.setTitle(`${(market[num].pokemon.shiny ? "⭐" : "")} Shadow ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Level:**  ${market[num].pokemon.level} | **XP:** ${market[num].pokemon.xp}\n**Type:** ${tp}\n**Nature:** ${market[num].pokemon.nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          let url = f.url
          const s = shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) url = s.url
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          return message.channel.send(Embed);
        }
        const f = Forms.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase())
        if (f) {
          let hpBase = f.hp;
          let atkBase = f.atk;
          let defBase = f.def;
          let spatkBase = f.spatk;
          let spdefBase = f.spdef;
          let speedBase = f.speed;
          let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
          let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
          let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
          let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
          let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
          let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = f.type.capitalize()
          const Embed = embed
          Embed.setColor('#05f5fc')
          Embed.setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} ${f.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          let url
          const s = shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) {
            url = s.url
          }
          else {
            url = f.url
          }
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          return message.channel.send(Embed);
        }
          const gmax = Gmax.find(e => e.name.toLowerCase() === name.replace("gigantamax-", "").toLowerCase());
        if (gmax && market[num].pokemon.name.toLowerCase().startsWith('gigantamax')) {
          let hpBase = gmax.hp;
          let atkBase = gmax.atk;
          let defBase = gmax.def;
          let spatkBase = gmax.spatk;
          let spdefBase = gmax.spdef;
          let speedBase = gmax.speed;
          let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
          let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
          let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
          let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
          let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
          let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = gmax.type.capitalize()
          const Embed = embed
          Embed.setColor('#05f5fc')
          Embed.setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} Gigantamax ${gmax.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          let url
          const s = Shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) {
            url = s.url
          }
          else {
            url = gmax.url
          }
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          return message.channel.send(Embed);
        }
        const pk = Pokemon.find(e => e.name === market[num].pokemon.name.toLowerCase())
        if (pk) {
          let hpBase = pk.hp;
          let atkBase = pk.atk;
          let defBase = pk.def;
          let spatkBase = pk.spatk;
          let spdefBase = pk.spdef;
          let speedBase = pk.speed;
          let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
          let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
          let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
          let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
          let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
          let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
          let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
          const totalivs = Math.floor(Math.round(totaliv))
  
          const finaliv = (totaliv.toFixed(2))
          name = market[num].pokemon.name.toLowerCase();
          var tp = pk.type.capitalize()
  
          const Embed = embed
          Embed.setColor('#05f5fc')
          Embed.setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} ${pk.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc`)
          Embed.setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
          Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
          Embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
          let url
          const s = shiny.find(e => e.name === market[num].pokemon.name.toLowerCase())
          if (market[num].pokemon.shiny && s) {
            url = s.url
          }
          if (market[num].pokemon.shiny && market[num].pokemon.name.toLowerCase() == "eternatus" || url == "https://imgur.com/TUtkb2v.png") {
            url = "https://i.imgur.com/lkx7zZ3.png"
          }
          else {
            url = pk.url
            if (market[num].pokemon.shiny && market[num].pokemon.name.toLowerCase() == "eternatus" || url == "https://imgur.com/TUtkb2v.png") {
              url = "https://i.imgur.com/lkx7zZ3.png"
            }
          }
          Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
            .setImage("attachment://" + "Pokemon.png")
          return message.channel.send(Embed);
        }
        else {
          name = market[num].pokemon.name.toLowerCase();
          if (market[num].pokemon.name.startsWith("alolan")) {
            name = name.replace("alolan", "").trim().toLowerCase();
            name = `${name}-alola`.toLowerCase();
          }
          P.getPokemonByName(name).then(async function (response) {
            let hpBase = response.stats[0].base_stat;
            let atkBase = response.stats[1].base_stat;
            let defBase = response.stats[2].base_stat;
            let spatkBase = response.stats[3].base_stat;
            let spdefBase = response.stats[4].base_stat;
            let speedBase = response.stats[5].base_stat;
            let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
            let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
            let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
            let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
            let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
            let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
            let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
            const totalivs = Math.floor(Math.round(totaliv))
            const finaliv = (totaliv.toFixed(2))
            const options = {
              url: `https://pokeapi.co/api/v2/pokemon/${name}`,
              json: true
            };
            let bdy = await get(options)
            let id;
            if (bdy.id < 10) id = `00${bdy.id}`
            else if (bdy.id > 9 && bdy.id < 100) id = `0${bdy.id}`
            else if (bdy.id > 99) id = bdy.id
            if (name.endsWith('-alola')) {
              name = name.replace("-alola", "").trim().toLowerCase();
              const t = await P.getPokemonByName(name);
              id = `${t.id}_f2`
              const ch = getlength(t.id);
              if (ch === 1) {
                id = `00${t.id}_f2`
              } else if (ch === 2) {
                id = `0${t.id}_f2`
              } else if (ch === 3) {
                id = `${t.id}_f2`
              }
            }
            name = market[num].pokemon.name.toLowerCase();
            var tp = bdy.types[0].type.name.capitalize()
            embed
              .setColor('#05f5fc')
              .setTitle(`Level ${market[num].pokemon.level} ${(market[num].pokemon.shiny ? "⭐" : "")} ${market[num].pokemon.name.capitalize()}\nID: ${num + 1}\nPrice: ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc`)
              .setDescription(`${(market[num].pokemon.nick != null ? `**Nickname:** ${market[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
              .setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
              .setThumbnail(message.author.avatarURL({ dynamic: true }))
            var uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`
            const fm = Forms.find(e => e.name === name.toLowerCase())
            const mg = Mega.find(e => e.name === name.toLowerCase())
            const pm = Primal.find(e => e.name === name.toLowerCase())
            if (fm) {
              uri = fm.url
              name = "Pokemon.png"
            }
            if (mg && name.toLowerCase().startsWith("mega-")) {
              uri = mg.url
              name = "Pokemon.png"
            }
            if (pm && name.toLowerCase().startsWith("primal")) {
              uri = pm.url
              name = "Pokemon.png"
            }
            if (market[num].pokemon.name.toLowerCase() === "giratina-origin" && !market[num].pokemon.shiny) uri = "https://imgur.com/UHVxS2q.png"
            if (market[num].pokemon.shiny) {
              uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name.toLowerCase()}.gif`
              const pokemon = shiny.find(e => e.name === name)
              const mgs = megashiny.find(e => e.name === name.toLowerCase())
              if (!pokemon) {
                uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name.toLowerCase()}.gif`
                name = "Pokemon.gif"
              }
              if (pokemon) {
                uri = pokemon.url
                name = "Pokemon.png"
              }
              if (mgs && name.toLowerCase().startsWith("mega-")) {
                uri = mgs.url
                name = "Pokemon.png"
              }
              if (name.toLowerCase() == "giratina-origin") {
                uri = `https://imgur.com/UHVxS2q.png`
              }
              let p;
              if (name.toLowerCase() === "primal-kyogre") {
                p = primal[0]
                uri = "https://i.imgur.com/XdZwD0s.png"
              }
              if (name.toLowerCase() === "primal-groudon") {
                p = primal[1]
                uri = "https://i.imgur.com/Xzm1FDn.png"
              }
              embed.attachFiles([{ name: name, attachment: uri }])
                .setImage("attachment://" + name)
            }// Fixed
            let imgname = "Pokemon.png";
            if (uri.endsWith(".gif")) imgname = "Pokemon.gif"
            embed.attachFiles([{ name: imgname, attachment: uri }])
              .setImage("attachment://" + imgname)
            embed.setFooter(`Use ${guild.prefix}market buy ${num + 1} to buy this pokemon`)
            message.channel.send(embed);
          }) //.catch((err) => {
            //message.reply(`${err}`)
          //})
        }
  
      } else if (args[0] === "list" || args[0] === "l") {
      if (isNaN(args[1])) return message.channel.send(`Invalid Pokémon#id provided. It should be in the form of \`${prefix}market list <pokemon#id> <price>\``);
      let num = parseInt(args[1]) - 1;

      if (!user.pokemons[num]) return message.channel.send(`Unable to find that Pokémon in your Pokedex Collection.`);

      if (user.pokemons.length < 2) return message.channel.send(`You cannot list your only Pokemon!`);

      if (isNaN(args[2])) {
        return message.channel.send(`Invalid cc input provided. It should be in the form of \`${prefix}market list <pokemon#id> <price>\``);
      }
      if ((args[2])> 10000000) {
        return message.channel.send(`You cannot List your Pokémon on the Market for more than **\`10,000,000\`** cc. Please Try Again!`);
      }
      

      let newDoc = new Market({
        id: message.author.id,
        pokemon: user.pokemons[num],
        price: parseInt(args[2])
      });

      user.pokemons.splice(args[1] - 1, 1);

      await user.save().catch(e => console.log(e));

      await newDoc.save().catch(e => console.log(e));

      return message.channel.send(`Successfully listed your Pokemon N#${args[1]} on Markets for ${args[2]} cc.`);

    } else if (args[0] === "buy" || args[0] === "b") {
      let market = await Market.find({});
      //let user = await Market.find({id: user.id});

      if (isNaN(args[1]) || !market[parseInt(args[1]) - 1]) return message.channel.send(`Invalid market number provided`);

      let num = parseInt(args[1]) - 1;

      let check = await Market.findOne({ id: user.id, pokemon: market[num].pokemon, price: market[num].price });

      if (check) return message.channel.send(`You can't buy your own pokemon`);

      if (market[num].price > user.balance) {
        return message.channel.send(`You don't have enough cc to Buy Level ${market[num].pokemon.level} ${market[num].pokemon.name}`)
      }

      let vmsg = `Your **Level ${market[num].pokemon.level} ${market[num].pokemon.name}** has been bought by ${message.author.tag} and you have received ${new Intl.NumberFormat('en-IN').format(market[num].price)} cc.`

      user.pokemons.push(market[num].pokemon);

      user.balance = user.balance - market[num].price;

      await user.markModified(`pokemons`);

      await user.save().catch(console.error);

      let userd = await User.findOne({ id: market[num].id });

      userd.balance = userd.balance + market[num].price;

      await userd.save().catch(console.error);

      let userD = client.users.cache.get(market[num].id);

      await Market.deleteOne({ id: market[num].id, pokemon: market[num].pokemon, price: market[num].price });

      message.channel.send(`You successfully bought Level ${market[num].pokemon.level} ${market[num].pokemon.name} from the Market.`);

      if (userD) await userD.send(vmsg);


    } else if (args[0] === "search" || args[0] === "s") {
      let market = await Market.find({});
      let e = message,
        n = args.slice(1).join(" "),
        a = market,
        i = guild,
        s = a.map((r, num) => { r.pokemon.num = num + 1; return r }),
        zbc = {};
      console.log(n)
      n.split(/--|—/gmi).map(x => {
        if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
      });
      if (zbc["legendary"] || zbc["l"]) s = s.filter(e => { if (legends.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      if (zbc["mythical"] || zbc["m"]) s = s.filter(e => { if (mythics.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      if (zbc["ultrabeast"] || zbc["ub"]) s = s.filter(e => { if (ub.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      if (zbc["mega"] || zbc["mg"]) s = s.filter(e => { if ((e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) return e });
      if (zbc["gmax"] || zbc["gigantamax"]) s = s.filter(e => { if ((e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("gigantamax-")) return e });
      if (zbc["alolan"] || zbc["a"]) s = s.filter(e => { if (alolans.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
      if (zbc["galarian"]) s = s.filter(e => { if (galarians.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e; })
      if (zbc["shiny"] || zbc["s"]) s = s.filter(e => { if (e.pokemon.shiny) return e });
      if (zbc["name"] || zbc["n"]) s = s.filter(e => { if (e && (zbc['name'] || zbc['n']) == e.pokemon.name.toLowerCase().replace(/-+/g, ' ')) return e });
      if (zbc['type'] || zbc["tp"]) s = s.filter(e => { if (e.pokemon.rarity.match(new RegExp((zbc['type'] || zbc["tp"]), "gmi")) != null) return e });
      if (zbc['order'] || zbc['o']) {
        let order = zbc['order'] || zbc['o'];
        if (order == "price a") {
          s = s.sort((a, b) => { return parseFloat(a.price) - parseFloat(b.price) });
        }
        else if (order == "price d") {
          s = s.sort((a, b) => { return parseFloat(b.price) - parseFloat(a.price) });
        }
        else if (order == "iv") {
          s = s.sort((a, b) => { return parseFloat(b.totalIV) - parseFloat(a.totalIV) });
        }
        else if (order == "alphabet") {
          s = s.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
          })
        }
      }
      if (zbc["hpiv"]) {
        let a = zbc["hpiv"].split(" ")
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.hp > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.hp < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.hp == a[1]) return e });
      }
      if (zbc["atkiv"]) {
        let a = zbc["atkiv"].split(" ")
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.atk > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.atk < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.atk == a[1]) return e });
      }
      if (zbc["defiv"]) {
        let a = zbc["defiv"].split(" ")
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.def > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.def < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.def == a[1]) return e });
      }
      if (zbc["spatkiv"]) {
        let a = zbc["spatkiv"].split(" ")
        console.log(s.map(s => s.pokemon[0]))
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spatk > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spatk < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spatk == a[1]) return e });
      }
      if (zbc["spdefiv"]) {
        let a = zbc["spdefiv"].split(" ")
        console.log(s.map(s => s.pokemon[0]))
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spdef > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spdef < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spdef == a[1]) return e });
      }
      if (zbc["speediv"]) {
        let a = zbc["speediv"].split(" ")
        console.log(s.map(s => s.pokemon[0]))
        if (a[0] === ">") s = s.filter(e => { if (e.pokemon.speed > a[1]) return e });
        if (a[0] === "<") s = s.filter(e => { if (e.pokemon.speed < a[1]) return e });
        if (Number(a[0])) s = s.filter(e => { if (e.pokemon.speed == a[1]) return e });
      }
      let txt;
      let num = 0
      let embed = new Discord.MessageEmbed()
      let array = [s];
      //console.log(s)
      let chunks = chunk(s, 20)

      let index = 0;
      if (Number(args[1])) index = parseInt(args[1]) - 1
      let ix = ((index % chunks.length) + chunks.length) % chunks.length;
      let actualpage = index + 1
      index = ((index % chunks.length) + chunks.length) % chunks.length;
      if (isNaN(e[1])) txt = s.map((item, i) => `${item.pokemon.shiny ? ":star: " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(item.price)} cc`).slice(0, 15).join("\n")

      if (Number(args[1])) {
        if (txt == "") {
          txt += "There is Nothing listed on Market"
        }
        if (chunks.length == 0) {
          chunks.length = 1
        }
        //console.log(chunks.map(item => {item.pokemon}).join("\n"))
        embed
          .setTitle(` Market`)
          .setColor('#05f5fc')
          .setDescription((chunks[index].map((item, i) => { return `${item.pokemon.shiny ? ":star: " : ""} **Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(item.price)} cc` }).join("\n")))
        if (args[1] > chunks.length) {
          embed.setDescription("There is Nothing listed on Markets matching this Search!")
        }
        embed.setFooter(`Showing ${args[1]}-${chunks.length} of ${s.length} pokémon matching this search.`);
        return e.channel.send(embed)
      }
      else {
        if (txt == "") {
          txt += "There is Nothing listed on Markets matching this Search!"
        }
        if (chunks.length == 0) {
          chunks.length = 1
        }
        let embed = new Discord.MessageEmbed()
          .setTitle(` Market`)
          .setColor('#05f5fc')
          .setDescription(txt)
          .setFooter(`Showing 1-${chunks.length} of ${s.length} pokémon matching this search.`);
        return e.channel.send(embed)
      }
      let all = await Market.find({});
      // let chunks = chunk(all, 20);
      
    if(Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}m`) || Number(args[0]) && message.content.startsWith(`${guild.prefix}market`)){
//    if(args[0] == 0) args[0]; 
      let chunks = chunk(all, 20);
      let index = args[0]-1;
 //   if(index) index;
 //   console.log(chunks[0]);
      let ix = (( index % chunks.length) + chunks.length) % chunks.length;
 //   const no = ((ix + 1)*20)-20
      embed
      let actualpage = index + 1
      index = ((index % chunks.length) + chunks.length) % chunks.length;
      if(args[0] > chunks.length){
        embed.setDescription(`There is Nothing listed on Market`)
        embed.setFooter(`Showing ${args[0]}-${chunks.length} of ${all.length} pokémon matching this search.`);
      }
      else{
        const no = ((index + 1)*20)-20
        embed.setDescription(chunks[index].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐": "")}${r.pokemon.name.capitalize().replace(/-+/g, " ")}** | ID: ${no+i+1} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} `).join('\n') || "There is no pokemon in market")
        embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${all.length} pokémon matching this search.`);
      }
      embed.setAuthor(" Market")
      embed.setColor(`#05f5fc`)
      return message.channel.send(embed); 
    }
      if(all[20] && message.content.endsWith(`${guild.prefix}m`) || message.content.endsWith(`${guild.prefix}market`)){
//    if(args[0] == 0) args[0]; 
        let chunks = chunk(all, 20);
        let index = 0;
 //   if(index) index;
 //   console.log(chunks[0]);
        let ix = (( index % chunks.length) + chunks.length) % chunks.length;
 //   const no = ((ix + 1)*20)-20
        
        let actualpage = index + 1
        index = ((index % chunks.length) + chunks.length) % chunks.length;
        const no = ((index + 1)*20)-20
        
        embed
        .setAuthor(" Market")
        .setColor('#05f5fc')
        .setDescription(chunks[0].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐": "")}${r.pokemon.name.capitalize().replace(/-+/g, " ")}** | ID: ${i + 1} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} `).join('\n') || "There is no pokemon in market")
        .setFooter(`Showing 1-1 of ${all.length} pokémon matching this search.`);
        return message.channel.send(embed);
      
      }
      else{
        embed
        .setAuthor("Market")
        .setColor('#05f5fc')
        .setDescription(chunks[0].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐": "")}${r.pokemon.name.capitalize().replace(/-+/g, " ")}** | ID: ${i + 1} | IV: ${r.pokemon.totalIV}% | Price: ${new Intl.NumberFormat('en-IN').format(r.price)} `).join('\n') || "There is no Pokemon listed in the Markets!")
        .setFooter(`Showing 1-1 of ${all.length} pokémon matching this search.`);
        return message.channel.send(embed);
      }

    }else{
      
    }
  }
}

function chunk(array, chunkSize) {
  const temp = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    temp.push(array.slice(i, i + chunkSize));
  }
  return temp;
}

