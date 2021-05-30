const Pokemon = require("../../Classes/Pokemon.js");
let gen8 = require('../../db/gen8.js');
let concept = require('../../db/concept.js');
let shadow = require('../../db/shadow.js');
let gmax = require('../../db/gmax.js');
let forms = require('../../db/forms.js');
let mg = require('../../db/mega.js');
let primal = require('../../db/primal.js');
let galar = require('../../db/galarians.js');
const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize, getlength } = require("../../functions.js");
const { readFileSync } = require('fs')
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Altnames = require('../../db/altnames.js');
const Gmax = require('../../db/gmax.js');
const Forms = require('../../db/forms.js');
const Levelup = require('../../db/levelup.js');
const Pokemons = require('../../db/pokemon.js');
const Concept = require('../../db/concept.js');
const { classToPlain } = require("class-transformer");
const ms = require("ms");
module.exports = {
  name: "poke_add",
  description: "Dev commands",
  category: "Dev",
  args: true,
  usage: ["pokemon_add <user> <pokemon>"],
  cooldown: 3,
  permissions: [],
  aliases: ["pokemon_add"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user1 = message.mentions.members.first() || client.users.cache.get(args[0]);
    let user2 = await User.findOne({ id: user1.id });
    if (!user2 || !user2.pokemons[0]) return message.channel.send(user1 + " need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");


    const Name = args[1].toLowerCase();
    let name = Name;
    let url;
    var gene8 = gen8.find(r => r.name === name);
    var fcon = concept.find(r => r.name === name);
    var shad = shadow.find(r => r.name === name.toLowerCase().replace("shadow-", ""));
    var gigantamax = gmax.find(r => r.name === name.toLowerCase().replace("gigantamax-", ""));
    var form = forms.find(r => r.name === name);
    var mega = mg.find(r => r.name === name.toLowerCase().replace("mega-", ""));
    var prim = primal.find(r => r.name === name.toLowerCase().replace("primal-", ""));
    var gg = galar.find(r => r.name === name.toLowerCase().replace("galarian-", ""));



    //PRimal 
    if (prim) {
      let level = Number(args[3])
      url = prim.url;
      if (!args[2]&&!args[3]) {
        sh = false;
        lvl = Math.floor(Math.random() * 50)
      }
      else if (args[2].toLowerCase() == "--shiny") {
        sh = true
        lvl = Math.floor(Math.random() * 50)
      }
      else if (args[2].toLowerCase() == "--level" && args[3] == level) {
        sh = false
        lvl = level
      }
      // let lvl = Math.floor(Math.random() * 50)
      poke = new Pokemon({ name: Name, shiny: sh, url: url }, lvl);
      poke = await classToPlain(poke);
      let embed = new MessageEmbed()
        .setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name).replace(/-+/g, " ")}`)
        .setDescription(`${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}XP\n`
          + `**Types:** ${prim.type}\n`
          + `**Nature:** ${poke.nature}\n`
          + `**HP:**  - IV: ${poke.hp}/31\n`
          + `**Attack:** - IV : ${poke.atk}/31\n`
          + `**Defense:** - IV:${poke.def}/31\n`
          + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
          + `**Sp. Def:** - IV:${poke.spdef}/31\n`
          + `**Speed:** - IV: ${poke.speed}/31\n`
          + `**Total IV%:** ${poke.totalIV}%\n`)
        .setFooter(`Displaying Pokémon: ${user2.pokemons.length + 1}/${user2.pokemons.length + 1}\nTotal Pokémons: ${user2.pokemons.length + 1}`)
        .setThumbnail(user1.user.displayAvatarURL())
        .setImage(url)
        .setColor("#b6ffdb")
      let msg = await message.channel.send(embed);

      await msg.react("✅");
      msg.react("❌");
      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          await user2.pokemons.push(poke);
          message.reactions.removeAll();
          msg.reactions.removeAll();
          await user2.save();
          return message.channel.send(`Success.`)
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

    //galarian 
    if (gg) {
      url = gg.url;
      if (!args[2]) {
        sh = false;
      }
      else if (args[2].toLowerCase() == "--shiny") {
        sh = true
      }
      let lvl = Math.floor(Math.random() * 50)
      let poke = new Pokemon({ name: Name, shiny: sh, url: url }, lvl);
      poke = await classToPlain(poke);
      let embed = new MessageEmbed()
        .setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name).replace(/-+/g, " ")}`)
        .setDescription(`${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}XP\n`
          + `**Types:** ${gg.type}\n`
          + `**Nature:** ${poke.nature}\n`
          + `**HP:**  - IV: ${poke.hp}/31\n`
          + `**Attack:** - IV : ${poke.atk}/31\n`
          + `**Defense:** - IV:${poke.def}/31\n`
          + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
          + `**Sp. Def:** - IV:${poke.spdef}/31\n`
          + `**Speed:** - IV: ${poke.speed}/31\n`
          + `**Total IV%:** ${poke.totalIV}%\n`)
        .setFooter(`Displaying Pokémon: ${user2.pokemons.length + 1}/${user2.pokemons.length + 1}\nTotal Pokémons: ${user2.pokemons.length + 1}`)
        .setThumbnail(user1.user.displayAvatarURL())
        .setImage(url)
        .setColor("#b6ffdb")
      let msg = await message.channel.send(embed);

      await msg.react("✅");
      msg.react("❌");
      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          await user2.pokemons.push(poke);
          message.reactions.removeAll();
          msg.reactions.removeAll();
          await user2.save();
          return message.channel.send(`Success.`)
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
    //gen 8
    if (gene8) {
      url = gene8.url;
      if (!args[2]) {
        sh = false;
      }
      else if (args[2].toLowerCase() == "--shiny") {
        sh = true
      }
      let lvl = Math.floor(Math.random() * 50)
      poke = new Pokemon({ name: Name, shiny: sh, url: url }, lvl);
      poke = await classToPlain(poke);
      let embed = new MessageEmbed()
        .setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name).replace(/-+/g, " ")}`)
        .setDescription(`${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}XP\n`
          + `**Types:** ${gene8.type}\n`
          + `**Nature:** ${poke.nature}\n`
          + `**HP:**  - IV: ${poke.hp}/31\n`
          + `**Attack:** - IV : ${poke.atk}/31\n`
          + `**Defense:** - IV:${poke.def}/31\n`
          + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
          + `**Sp. Def:** - IV:${poke.spdef}/31\n`
          + `**Speed:** - IV: ${poke.speed}/31\n`
          + `**Total IV%:** ${poke.totalIV}%\n`)
        .setFooter(`Displaying Pokémon: ${user2.pokemons.length + 1}/${user2.pokemons.length + 1}\nTotal Pokémons: ${user2.pokemons.length + 1}`)
        .setThumbnail(user1.user.displayAvatarURL())
        .setImage(url)
        .setColor("#b6ffdb")
      let msg = await message.channel.send(embed);

      await msg.react("✅");
      msg.react("❌");
      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          await user2.pokemons.push(poke);
          message.reactions.removeAll();
          msg.reactions.removeAll();
          await user2.save();
          return message.channel.send(`Success.`)
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

    //mega

    if (mega && name.toLowerCase().startsWith('mega')) {
      url = mega.url;
      if (!args[2]) {
        sh = false;
      }
      else if (args[2].toLowerCase() == "--shiny") {
        sh = true
      }
      let lvl = Math.floor(Math.random() * 50)
      let poke = new Pokemon({ name: Name, shiny: sh, url: url }, lvl);
      poke = await classToPlain(poke);
      let embed = new MessageEmbed()
        .setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name).replace(/-+/g, " ")}`)
        .setDescription(`${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}XP\n`
          + `**Types:** ${mega.type}\n`
          + `**Nature:** ${poke.nature}\n`
          + `**HP:**  - IV: ${poke.hp}/31\n`
          + `**Attack:** - IV : ${poke.atk}/31\n`
          + `**Defense:** - IV:${poke.def}/31\n`
          + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
          + `**Sp. Def:** - IV:${poke.spdef}/31\n`
          + `**Speed:** - IV: ${poke.speed}/31\n`
          + `**Total IV%:** ${poke.totalIV}%\n`)
        .setFooter(`Displaying Pokémon: ${user2.pokemons.length + 1}/${user2.pokemons.length + 1}\nTotal Pokémons: ${user2.pokemons.length + 1}`)
        .setThumbnail(user1.user.displayAvatarURL())
        .setImage(url)
        .setColor("#b6ffdb")
      let msg = await message.channel.send(embed);

      await msg.react("✅");
      msg.react("❌");
      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          await user2.pokemons.push(poke);
          message.reactions.removeAll();
          msg.reactions.removeAll();
          await user2.save();
          return message.channel.send(`Success.`)
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

    //concept
    if (fcon) {
      url = fcon.url;
      if (!args[2]) {
        sh = false;
      }
      else if (args[2].toLowerCase() == "--shiny") {
        sh = true
      }
      let lvl = Math.floor(Math.random() * 50)
      let poke = new Pokemon({ name: Name, shiny: sh, url: url }, lvl);
      poke = await classToPlain(poke);
      let embed = new MessageEmbed()
        .setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name).replace(/-+/g, " ")}`)
        .setDescription(`${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}XP\n`
          + `**Types:** ${fcon.type}\n`
          + `**Nature:** ${poke.nature}\n`
          + `**HP:**  - IV: ${poke.hp}/31\n`
          + `**Attack:** - IV : ${poke.atk}/31\n`
          + `**Defense:** - IV:${poke.def}/31\n`
          + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
          + `**Sp. Def:** - IV:${poke.spdef}/31\n`
          + `**Speed:** - IV: ${poke.speed}/31\n`
          + `**Total IV%:** ${poke.totalIV}%\n`)
        .setFooter(`Displaying Pokémon: ${user2.pokemons.length + 1}/${user2.pokemons.length + 1}\nTotal Pokémons: ${user2.pokemons.length + 1}`)
        .setThumbnail(user1.user.displayAvatarURL())
        .setImage(url)
        .setColor("#b6ffdb")
      let msg = await message.channel.send(embed);

      await msg.react("✅");
      msg.react("❌");
      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          await user2.pokemons.push(poke);
          message.reactions.removeAll();
          msg.reactions.removeAll();
          await user2.save();
          return message.channel.send(`Success.`)
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

    //gmax
    if (gigantamax && name.toLowerCase().startsWith('gigantamax' || 'gmax')) {
      url = gigantamax.url;
      if (!args[2]) {
        sh = false;
      }
      else if (args[2].toLowerCase() == "--shiny") {
        sh = true
      }
      let lvl = Math.floor(Math.random() * 50)
      let poke = new Pokemon({ name: Name, shiny: sh, url: url }, lvl);
      poke = await classToPlain(poke);
      let embed = new MessageEmbed()
        .setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name).replace(/-+/g, " ")}`)
        .setDescription(`${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}XP\n`
          + `**Types:** ${gigantamax.type}\n`
          + `**Nature:** ${poke.nature}\n`
          + `**HP:**  - IV: ${poke.hp}/31\n`
          + `**Attack:** - IV : ${poke.atk}/31\n`
          + `**Defense:** - IV:${poke.def}/31\n`
          + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
          + `**Sp. Def:** - IV:${poke.spdef}/31\n`
          + `**Speed:** - IV: ${poke.speed}/31\n`
          + `**Total IV%:** ${poke.totalIV}%\n`)
        .setFooter(`Displaying Pokémon: ${user2.pokemons.length + 1}/${user2.pokemons.length + 1}\nTotal Pokémons: ${user2.pokemons.length + 1}`)
        .setThumbnail(user1.user.displayAvatarURL())
        .setImage(url)
        .setColor("#b6ffdb")
      let msg = await message.channel.send(embed);
      await msg.react("✅");
      msg.react("❌");
      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          await user2.pokemons.push(poke);
          message.reactions.removeAll();
          msg.reactions.removeAll();
          await user2.save();
          return message.channel.send(`Success.`)
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

    //shadow
    if (shad && name.toLowerCase().startsWith('shadow')) {
      url = shad.url;
      if (!args[2]) {
        sh = false;
      }
      else if (args[2].toLowerCase() == "--shiny") {
        sh = true
      }
      let lvl = Math.floor(Math.random() * 50)
      let poke = new Pokemon({ name: Name, shiny: sh, url: url }, lvl);
      poke = await classToPlain(poke);
      let embed = new MessageEmbed()
        .setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name).replace(/-+/g, " ")}`)
        .setDescription(`${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}XP\n`
          + `**Types:** ${shad.type}\n`
          + `**Nature:** ${poke.nature}\n`
          + `**HP:**  - IV: ${poke.hp}/31\n`
          + `**Attack:** - IV : ${poke.atk}/31\n`
          + `**Defense:** - IV:${poke.def}/31\n`
          + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
          + `**Sp. Def:** - IV:${poke.spdef}/31\n`
          + `**Speed:** - IV: ${poke.speed}/31\n`
          + `**Total IV%:** ${poke.totalIV}%\n`)
        .setFooter(`Displaying Pokémon: ${user2.pokemons.length + 1}/${user2.pokemons.length + 1}\nTotal Pokémons: ${user2.pokemons.length + 1}`)
        .setThumbnail(user1.user.displayAvatarURL())
        .setImage(url)
        .setColor("#b6ffdb")
      let msg = await message.channel.send(embed);

      await msg.react("✅");
      msg.react("❌");
      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          await user2.pokemons.push(poke);
          message.reactions.removeAll();
          msg.reactions.removeAll();
          await user2.save();
          return message.channel.send(`Success.`)
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

    //pokemon form 
    if (form) {
      url = form.url;
      if (!args[2]) {
        sh = false;
      }
      else if (args[2].toLowerCase() == "--shiny") {
        sh = true
      }
      let lvl = Math.floor(Math.random() * 50)
      let poke = new Pokemon({ name: Name, shiny: sh, url: url }, lvl);
      poke = await classToPlain(poke);
      let embed = new MessageEmbed()
        .setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name).replace(/-+/g, " ")}`)
        .setDescription(`${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}XP\n`
          + `**Types:** ${form.type}\n`
          + `**Nature:** ${poke.nature}\n`
          + `**HP:**  - IV: ${poke.hp}/31\n`
          + `**Attack:** - IV : ${poke.atk}/31\n`
          + `**Defense:** - IV:${poke.def}/31\n`
          + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
          + `**Sp. Def:** - IV:${poke.spdef}/31\n`
          + `**Speed:** - IV: ${poke.speed}/31\n`
          + `**Total IV%:** ${poke.totalIV}%\n`)
        .setFooter(`Displaying Pokémon: ${user2.pokemons.length + 1}/${user2.pokemons.length + 1}\nTotal Pokémons: ${user2.pokemons.length + 1}`)
        .setThumbnail(user1.user.displayAvatarURL())
        .setImage(url)
        .setColor("#b6ffdb")
      let msg = await message.channel.send(embed);

      await msg.react("✅");
      msg.react("❌");
      const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          await user2.pokemons.push(poke);
          message.reactions.removeAll();
          msg.reactions.removeAll();
          await user2.save();
          return message.channel.send(`Success.`)
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
    else {
      const options = {
        url: `https://pokeapi.co/api/v2/pokemon/${Name}`,
        json: true
      };
      await get(options).then(async t => {
        let check = t.id.toString().length
        let url;
        if (check === 1) {
          url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
        } else if (check === 2) {
          url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
        } else if (check === 3) {
          url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
        }
        if (!args[2]) {
          sh = false;
        }
        else if (args[2].toLowerCase() == "--shiny") {
          sh = true
        }
        let lvl = Math.floor(Math.random() * 50)
        let poke = new Pokemon({ name: Name, shiny: sh, url: url }, lvl);
        poke = await classToPlain(poke);
        let embed = new MessageEmbed()
          .setTitle(`Level ${lvl} ${(poke.shiny ? " ⭐ " : "")}${capitalize(poke.name).replace(/-+/g, " ")}`)
          .setDescription(`${poke.xp}/${(1.2 * lvl ^ 3) - (15 * lvl ^ 2) + (100 * lvl) - 140}XP\n`
            + `**Types:** ${t.type}\n`
            + `**Nature:** ${poke.nature}\n`
            + `**HP:**  - IV: ${poke.hp}/31\n`
            + `**Attack:** - IV : ${poke.atk}/31\n`
            + `**Defense:** - IV:${poke.def}/31\n`
            + `**Sp. Atk:** - IV: ${poke.spatk}/31\n`
            + `**Sp. Def:** - IV:${poke.spdef}/31\n`
            + `**Speed:** - IV: ${poke.speed}/31\n`
            + `**Total IV%:** ${poke.totalIV}%\n`)
          .setFooter(`Displaying Pokémon: ${user2.pokemons.length + 1}/${user2.pokemons.length + 1}\nTotal Pokémons: ${user2.pokemons.length + 1}`)
          .setThumbnail(user1.user.displayAvatarURL())
          .setImage(url)
          .setColor("#b6ffdb")
        let msg = await message.channel.send(embed);

        await msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });

        collector.on('collect', async (reaction, user) => {
          if (reaction.emoji.name === "✅") {
            collector.stop();
            await user2.pokemons.push(poke);
            message.reactions.removeAll();
            msg.reactions.removeAll();
            await user2.save();
            return message.channel.send(`Success.`)
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

      }).catch(err => {
        if (err.message.includes(`404 - "Not Found"`)) return message.channel.send(`That pokémon doesn't seem to exist. Maybe you spelled it wrong?`);
      });
    }
  }
}
