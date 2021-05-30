const Discord = require("discord.js")
var attacks = require("../../db/attacks.js");
var pokemon = require("../../db/pokemon.js");
const User = require('../../models/user.js');
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native')
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const { getlength } = require("../../functions.js");

module.exports = {
  name: "weak",
  description: "Gives weakness info of a particular Pokemon",
  category: "Pokemon Commands",
  args: false,
  usage: ["p!weak <Pokemon#name>"],
  cooldown: 3,
  permissions: [],
  aliases: ["w"],
  execute:  (client, message, args, prefix, guild, color, channel) => {
        if (!args[0]) return message.channel.send(`Error: No <Pokemon#name> recieved! It should be in the form of \`${prefix}weak <pokemon#name>\`.`);

        let pkmn = args[0].toLowerCase();
        for (var i = 0; i < attacks.length; i++) {
        if (pkmn == attacks[i].Name.toLowerCase()) {
        let embed = new MessageEmbed()
        .setAuthor(`#${attacks[i].Number} ${attacks[i].Name} (${attacks[i].Types})`)
        .addField("Weaknesses",`${attacks[i].Weaknesses}`)
        .addField("Normal",'-')
        .addField("Resistance",`${attacks[i].Resistant}`)
        .setColor(0x05f5fc)
        return message.channel.send(embed)
        }
        // if (pkmn !== attacks[i].Name.toLowerCase()) return message.channel.send("sad")
      }
    }
  }