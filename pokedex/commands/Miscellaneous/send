const customisation = require('../../config.js');
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");


module.exports = {
    name: "send",
    description: "Send a message to the official server",
    category: "Miscellaneous",
    args: false,
    usage: ["bugreport <message>"],
    cooldown: 3,
    permissions: [],
    aliases: [],
    execute: async (client, message, args, prefix, guild, color, channel) => {

    let embed = new MessageEmbed()
    .setAuthor("Send A message to the Bot's Official Server")
    .setDescription("Please dont Send Spam messages or Junk Text! Doing so can get you banned from the official server or can even get you Bot Banned!")
    .addField("Send Feedback to the Official Server",`Usage: \`${prefix}send feedback <message>\``)
    .addField("Send Bug Report to the Official Server",`Usage: \`${prefix}send bug <message>\``)
    .addField("Send A Suggestion fot the Bot to the Official Server",`Usage: \`${prefix}send suggestion <message>\``)
    .setColor("#fff200")
    if(!args[0]) return message.channel.send(embed)

    if (args[0].toLowerCase()=="bug"){
    if (!args[1]) return message.channel.send("Please specify the bug. Example: `Trade command is not working!`");
    args = args.join(" ");
    message.reply(`Thanks for submitting a Bug! It would be more investigated at the ${client.user.username}'s Official Server!`);
    let content = new MessageEmbed()
    .setAuthor("Bug Report Received")
    .setDescription(`Report from **${message.author.username}#${message.author.discriminator}**\n\n${args}\n`)
    .setFooter(`From Server#ID: ${message.guild.id}`)
    .setColor("#00FFFF")
    client.channels.cache.get(customisation.bugchannelid).send(content)}

    if (args[0].toLowerCase()=="feedback"){
    if (!args[1]) return message.channel.send("Please include a Feedback Message.")
    args = args.join(" ");
    message.reply(`Thanks for submitting the Feedback!`);
    let content1 = new MessageEmbed()
    .setAuthor("Feedback Received")
    .setDescription(`Feedback from **${message.author.username}#${message.author.discriminator}**\n\n${args}\n`)
    .setFooter(`From Server#ID: ${message.guild.id}`)
    .setColor("#00FFFF")
    client.channels.cache.get(customisation.feedbackchannelid).send(content1)}

    if (args[0].toLowerCase()=="suggestion"){
    if (!args[1]) return message.channel.send("Please include a Suggestion Message.")
    args = args.join(" ");
    message.reply(`Thanks for submitting the Suggestion!`);
    let content2 = new MessageEmbed()
    .setAuthor("Suggestion Received")
    .setDescription(`Suggestion from **${message.author.username}#${message.author.discriminator}**\n\n${args}\n`)
    .setFooter(`From Server#ID: ${message.guild.id}`)
    .setColor("#00FFFF")
    client.channels.cache.get(customisation.suggestionchannelid).send(content2)}


}}