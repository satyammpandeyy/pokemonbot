const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "order",
  description: "Give your pokemon a order.",
  category: "Pokemon Commands",
  args: false,
  usage: ["order <type>"],
  cooldown: 3,
  permissions: [],
  aliases: ["o"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });
    if (!user) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
    let orda = ''
    let ordi = ''
    let ordn = ''

    if (user.orderAlphabet == false) { orda = "" } else { orda = "Alphabet" }
    if (user.orderIV == false) { ordi = "" } else { ordi = "IV" }
    // if (user.orderLevel == false) { ordi = "" } else { ordi = "Level" }

    if (!user.orderIV == true && !user.orderAlphabet == true) { ordn = "Number" } else { ordn = "" }
    if (!args[0]) {
      let orderemb = new MessageEmbed()
        .setAuthor("Order Configuration")
        .setDescription(`Please select from one of the Modes.\nUsage: \`${prefix}order <type>\``)
        .addField("Order IV", 'Order your Pokémons according to decreasing IV.')
        .addField("Order Alphabet", 'Order your Pokémons alphabetically ( A - Z ).')
        .addField("Order Level", 'Order your Pokémons according to decreasing Level.')
        .addField("Order Number", 'Order your Pokémons according to your Catch Chronology.')
        .setColor(color)
      return message.channel.send(orderemb);
    }
    if (args[0].toLowerCase() == 'alphabet' || args[0].toLowerCase() == 'a') {
      let user = await User.findOne({ id: message.author.id });
      user.orderAlphabet = !user.orderAlphabet;
      if (user.orderAlphabet == true) {
        user.orderIV = false;
      }
      await user.save()
      return message.channel.send({ embed: { title: `Order Configuration`, color: 0x00f9ff, description: `Alphabet Order for <@${message.author.id}> has been set to \`${user.orderAlphabet ? true : false}\`` } });
    } else if (args[0].toLowerCase() == 'iv') {
      let user = await User.findOne({ id: message.author.id });
      if (!user) return message.channel.send(`You need to pick a pokemon before disabling level up messages`);
      user.orderIV = !user.orderIV; //(args[1].toLowerCase() === "true") ? true : false;
      if (user.orderIV == true) {
        user.orderAlphabet = false;
      }
      await user.save()
      return message.channel.send({ embed: { title: `Order Configuration`, color: 0x00f9ff, description: `IV Order for <@${message.author.id}> has been set to \`${user.orderIV ? true : false}\`` } });
    } else if (args[0].toLowerCase() == 'number' || args[0].toLowerCase() == 'no') {
      let user = await User.findOne({ id: message.author.id });
      if (!user) return message.channel.send(`You need to pick a pokemon before disabling level up messages`);
      user.orderAlphabet = false;
      user.orderIV = false;
      await user.save()
      return message.channel.send({ embed: { title: `Order Configuration`, color: 0x00f9ff, description: `Order Configuration for <@${message.author.id}> has been set to \`Number\`` } });
    } else if (args[0].toLowerCase() == 'level' || args[0].toLowerCase() == 'lvl') {
      let user = await User.findOne({ id: message.author.id });
      user.orderLevel = !user.orderLevel;
      if (user.orderLevel == true) {
        user.orderIV = false;
        user.orderAlphabet = false;
      }
      await user.save()
      return message.channel.send({ embed: { title: `Order Configuration`, color: 0x00f9ff, description: `Level Order for <@${message.author.id}> has been set to \`${user.orderLevel ? true : false}\`` } });
    }
    


  }
}



