const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const { readFileSync } = require('fs')
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const legends = readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const legends2 = readFileSync("./db/legends2.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const ub = readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
const galarians = readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const ms = require("ms");

module.exports = {
  name: "check_pokemon",
  description: "checks the user",
  category: "Dev",
  args: true,
  usage: ["check_pokemon <@user | userID>"],
  cooldown: 3,
  permissions: [],
  aliases: ["check_pk"],

  async execute(client, message, args, prefix, guild, color, channel) {
    let user1 = message.mentions.members.first() || client.users.cache.get(args[0]);
    let user = await User.findOne({ id: user1.id });
    if (!user || !user.pokemons[0]) return message.channel.send(user1 + " needs to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");

    let e = message,
      n = args.join(" "),
      a = user,
      s = a.pokemons.map((r, i) => { r.num = i + 1; return r }),
      zbc = {};
    n.split(/--|—/gmi).map(x => {
      if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
    })
    if (zbc["legendary"] || zbc["legend"]) s = s.filter(e => {
      if (legends.includes(e.name.capitalize().replace(/-+/g, " ")) || legends2.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    });
    if (zbc["l"] || zbc["legend"]) s = s.filter(e => {
      if (legends.includes(e.name.capitalize().replace(/-+/g, " ")) || legends2.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    });
    if (zbc["mythical"] || zbc["mythic"]) s = s.filter(e => {
      if (mythics.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    });
    if (zbc["m"] || zbc["mythic"]) s = s.filter(e => {
      if (mythics.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    });
    if (zbc["ultrabeast"] || zbc["ub"]) s = s.filter(e => {
      if (ub.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    });
    if (zbc["ub"] || zbc["ub"]) s = s.filter(e => {
      if (ub.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    });
    if (zbc["mega"]) s = s.filter(e => {
      if ((e.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) return e;
    });
    if (zbc["alolan"]) s = s.filter(e => {
      if (alolans.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    });
    if (zbc["a"]) s = s.filter(e => {
      if (alolans.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    });
    if (zbc["galarian"]) s = s.filter(e => {
      if (galarians.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    })
    if (zbc["g"]) s = s.filter(e => {
      if (galarians.includes(e.name.capitalize().replace(/-+/g, " "))) return e;
    })
    if (zbc["shiny"]) s = s.filter(e => {
      if (e.shiny) return e;
    });
    if (zbc["s"]) s = s.filter(e => {
      if (e.shiny) return e;
    });
    if (zbc["name"]) s = s.filter(e => {
      if (e && (zbc['name']) == e.name.toLowerCase().replace(/-+/g, ' ')) return e;
    });
    if (zbc["n"]) s = s.filter(e => {
      if (e && (zbc['n']) == e.name.toLowerCase().replace(/-+/g, ' ')) return e;
    });
    if (zbc["nick"] || zbc["nickname"]) s = s.filter(e => {
      if (e.nick && (zbc['nick'] || zbc["nickname"]) == e.nick.toLowerCase().replace(/-+/g, ' ')) return e;
    });
    if (zbc.fav) s = s.filter(e => {
      if (e.fav) return e;
    });
    if (zbc['type']) s = s.filter(e => {
      if (e.rarity.match(new RegExp((zbc['type']), "gmi")) != null) return e;
    });
    if (zbc['level']) s = s.filter(e => {
      let a = zbc["level"].split(" ")
      if (a[0] === ">") s = s.filter(e => {
        if (e.level > a[1]) return e;
      });
      if (a[0] === "<") s = s.filter(e => {
        if (e.level < a[1]) return e;
      });
      if (Number(a[0])) s = s.filter(e => {
        if (e.level == a[1]) return e;
      });
    })
    if (zbc["hpiv"]) {
      let a = zbc["hpiv"].split(" ")
      if (a[0] === ">") s = s.filter(e => {
        if (e.hp > a[1]) return e;
      });
      if (a[0] === "<") s = s.filter(e => {
        if (e.hp < a[1]) return e;
      });
      if (Number(a[0])) s = s.filter(e => {
        if (e.hp == a[1]) return e;
      });
    }
    if (zbc["atkiv"]) {
      let a = zbc["atkiv"].split(" ")
      if (a[0] === ">") s = s.filter(e => {
        if (e.atk > a[1]) return e;
      });
      if (a[0] === "<") s = s.filter(e => {
        if (e.atk < a[1]) return e;
      });
      if (Number(a[0])) s = s.filter(e => {
        if (e.atk == a[1]) return e;
      });
    }
    if (zbc["defiv"]) {
      let a = zbc["defiv"].split(" ")
      if (a[0] === ">") s = s.filter(e => {
        if (e.def > a[1]) return e;
      });
      if (a[0] === "<") s = s.filter(e => {
        if (e.def < a[1]) return e;
      });
      if (Number(a[0])) s = s.filter(e => {
        if (e.def == a[1]) return e;
      });
    }
    if (zbc["spatkiv"]) {
      let a = zbc["spatkiv"].split(" ")
      if (a[0] === ">") s = s.filter(e => {
        if (e.spatk > a[1]) return e;
      });
      if (a[0] === "<") s = s.filter(e => {
        if (e.spatk < a[1]) return e;
      });
      if (Number(a[0])) s = s.filter(e => {
        if (e.spatk == a[1]) return e;
      });
    }
    if (zbc["spdefiv"]) {
      let a = zbc["spdefiv"].split(" ")
      if (a[0] === ">") s = s.filter(e => {
        if (e.spdef > a[1]) return e;
      });
      if (a[0] === "<") s = s.filter(e => {
        if (e.spdef < a[1]) return e;
      });
      if (Number(a[0])) s = s.filter(e => {
        if (e.spdef == a[1]) return e;
      });
    }
    if (zbc["speediv"]) {
      let a = zbc["speediv"].split(" ")
      if (a[0] === ">") s = s.filter(e => {
        if (e.speed > a[1]) return e;
      });
      if (a[0] === "<") s = s.filter(e => {
        if (e.speed < a[1]) return e;
      });
      if (Number(a[0])) s = s.filter(e => {
        if (e.speed == a[1]) return e;
      });
    }
    if (a[0] === "orderiv") {
      user.orderIV = true;
    }
    if (a[0] === "orderalphabet") {
      user.orderAlphabet = true;
    }
    if (user.orderIV === true) s = s.sort((a, b) => {
      return b.totalIV - a.totalIV;
    })
    if (user.orderAlphabet == true) s = s.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })

    let txt,
      chunks = chunk(s, 20),
      index = 0,
      embed = new MessageEmbed();

    if (Number(args[1])) index = parseInt(args[1]) - 1;
    index = ((index % chunks.length) + chunks.length) % chunks.length;
    if (isNaN(e[0])) txt = s.map((item, i) => `${item.shiny ? "⭐ " : ""}**${item.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}**  | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}` : "")}`).slice(0, 20).join("\n");

    if (Number(args[1])) {
      if (txt == "") return message.channel.send("Found no pokémon matching this search.");
      if (chunks.length == 0) chunks.length = 1;
      if (args[1] > chunks.length) return message.channel.send("Found no Pokémon matching this search.")
      embed
        .setTitle(`Showing ${user1.tag}'s (${user1.id}) Pokémons`)
        .setColor("#fff200")
        .setDescription((chunks[index].map((item, i) => { return `${item.shiny ? "⭐ " : ""}**${item.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | Level: ${item.level} | Number: ${item.num} | IV: ${item.totalIV}%${(item.nick != null ? ` | Nickname: ${item.nick}` : "")}` }).join("\n")))
        .setFooter(`Displaying ( Page 1 of ${chunks.length} ) of total Pokémons: ${s.length}`);
      return e.channel.send(embed)
    } else {
      if (txt == "") return message.channel.send("Found no pokémon matching this search.");
      if (chunks.length == 0) chunks.length = 1;
      embed
        .setTitle(`Showing ${user1.tag}'s (${user1.id}) Pokémons`)
        .setColor("#fff200")
        .setDescription(txt)
        .setFooter(`Displaying ( Page 1 of ${chunks.length} ) of total Pokémons: ${s.length}`)
      return e.channel.send(embed)
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