const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "price",
  description: "Get the approximate price of any pokemon",
  category: "Pokemon Commands",
  args: false,
  usage: ["price <pokemon_name>"],
  cooldown: 3,
  permissions: [],
  aliases: [],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });
    if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
    if (!args[0]) return message.channel.send(`Normal Pokemon's Prices are yet to be added , please check shint prices. \`${prefix}price shiny <pokemon_name>\``)
    if (args[0].toLowerCase() == "shiny") {
      if (!args[1]) return message.channel.send("Please specify the pokemon name")
      else if (args[1].toLowerCase() == "rayquaza") return message.channel.send("⭐ Rayquaza: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "articuno") return message.channel.send("⭐ Articuno: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "zapdos") return message.channel.send("⭐ Zapdos: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "mewtwo"||args[1].toLowerCase() == "mewtu") return message.channel.send("⭐ Mewtwo: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "moltres") return message.channel.send("⭐ Moltres: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "raikou") return message.channel.send("⭐ Raikou: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "entei") return message.channel.send("⭐ Entei: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "suicune") return message.channel.send("⭐ Suicune: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "lugia") return message.channel.send("⭐ Lugia: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "hooh" || args[1].toLowerCase() == "ho-oh") return message.channel.send("⭐ Ho oh: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "ho" || args[2] == "oh") return message.channel.send("⭐ Ho oh: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "regirock") return message.channel.send("⭐ Regirock: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "regice") return message.channel.send("⭐ Regice: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "registeel") return message.channel.send("⭐ Registeel: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "latias") return message.channel.send("⭐ Latias: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "kyogre") return message.channel.send("⭐ Kyogre: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "groudon") return message.channel.send("⭐ Groudon: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "uxie") return message.channel.send("⭐ Uxie: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "mesprit") return message.channel.send("⭐ Mesprit: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "azelf") return message.channel.send("⭐ Azelf: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "dialga") return message.channel.send("⭐ Dialga: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "palkia") return message.channel.send("⭐ Palkia: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "giratina") return message.channel.send("⭐ Giratina: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "cresselia") return message.channel.send("⭐ Cresselia: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "heatran") return message.channel.send("⭐ Heatran: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "regigigas") return message.channel.send("⭐ Regigigas: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "cobalion") return message.channel.send("⭐ Cobalion: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "terrakion") return message.channel.send("⭐ Terrakion: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "virizion") return message.channel.send("⭐ Virizion: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "tornadus") return message.channel.send("⭐ Tornadus: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "thundurus") return message.channel.send("⭐ Thundurus: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "landorus") return message.channel.send("⭐ Landorus: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "reshiram") return message.channel.send("⭐ Reshiram: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "zekrom") return message.channel.send("⭐ Zekrom: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "kyurem") return message.channel.send("⭐ Kyurem: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "xerneas") return message.channel.send("⭐ Xerneas: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "yveltal") return message.channel.send("⭐ Yveltal: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "zygarde") return message.channel.send("⭐ Zygarde: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "type-null") return message.channel.send("⭐ Type Null: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "type" || args[2] == "null") return message.channel.send("⭐ Type  Null: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "tapu" || args[2] == "koko" || args[2] == "Koko") return message.channel.send("⭐ Tapu Koko: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "tapu" || args[2] == "lele"||args[2] == "Lele") return message.channel.send("⭐ Tapu  Lele: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "tapu" || args[2] == "bulu" || args[2] == "Bulu") return message.channel.send("⭐ Tapu  Bulu: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "tapu" || args[2] == "fini" || args[2] == "Fini") return message.channel.send("⭐ Tapu  Fini: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "silvally") return message.channel.send("⭐ Silvally: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "cosmog") return message.channel.send("⭐ Cosmog: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "cosmoem") return message.channel.send("⭐ Cosmoem: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "solgaleo") return message.channel.send("⭐ Solgaleo: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "lunala") return message.channel.send("⭐ Lunala: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "necrozma") return message.channel.send("⭐ Necrozma: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "zacian") return message.channel.send("⭐ Zacian: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "eternatus") return message.channel.send("⭐ Eternatus: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "kubfu") return message.channel.send("⭐ Kubfu: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "mew") return message.channel.send("⭐ Mew: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "celebi") return message.channel.send("⭐ Celebi: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "deoxys") return message.channel.send("⭐ Deoxys: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "jirachi") return message.channel.send("⭐ Jirachi: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "arceus") return message.channel.send("⭐ Arceus: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "darkrai") return message.channel.send("⭐ Darkrai: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "manaphy") return message.channel.send("⭐ Manaphy: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "phione") return message.channel.send("⭐ Phione: 1,00,000 ツ")
      else if (args[1].toLowerCase() == "shaymin") return message.channel.send("⭐ Shaymin: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "genesect") return message.channel.send("⭐ Genesect: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "meloetta") return message.channel.send("⭐ Meloetta: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "victini") return message.channel.send("⭐ Victini: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "hoopa") return message.channel.send("⭐ Hoopa: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "diancie") return message.channel.send("⭐ Diancie: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "magearna") return message.channel.send("⭐ Magearna: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "marshadow") return message.channel.send("⭐ Marshadow: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "zeraora") return message.channel.send("⭐ Zeraora: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "meltan") return message.channel.send("⭐ Meltan: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "melmetal") return message.channel.send("⭐ Melmetal: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "guzzlord") return message.channel.send("⭐ Guzzlord: 2,500,000 ツ")
      else if (args[1].toLowerCase() == "celesteela") return message.channel.send("⭐ Celesteela: 2,000,000 ツ")
      else if (args[1].toLowerCase() == "pheromosa") return message.channel.send("⭐ Pheromosa: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "stakataka") return message.channel.send("⭐ Stakataka: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "buzzwole") return message.channel.send("⭐ Buzzwole: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "blacephalon") return message.channel.send("⭐ Blacephalon: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "poipole") return message.channel.send("⭐ Poipole: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "lartana") return message.channel.send("⭐ Kartana: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "nihilego") return message.channel.send("⭐ Nihilego: 1,000,000 ツ")
      else if (args[1].toLowerCase() == "xurkitree") return message.channel.send("⭐ Xurkitree: 1,500,000 ツ")
      else if (args[1].toLowerCase() == "naganadel") return message.channel.send("⭐ Naganadel: 1,500,000 ツ")
      else{
      return message.channel.send("That Pokemon's price isn't added yet or that Pokemon doesn't seem to exist!")
    }
    }
    
  }
}
