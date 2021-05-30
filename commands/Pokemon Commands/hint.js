const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Spawn = require('../../models/spawn.js')
const ms = require("ms");

module.exports = {
    name: "hint",
    description: "Get a hint to help you guess the wild pokemon's name.",
    category: "Pokemon Commands",
    args: false,
    usage: ["hint"],
    cooldown: 3,
    permissions: [],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {
        let user = await User.findOne({ id: message.author.id })
        if (!user) return message.channel.send("You need to pick a starter pokémon using the `start` command before using this command!");

        let spawn = await Spawn.findOne({ id: message.channel.id })
        if (!spawn.pokemon[0]) return message.channel.send("There is no pokemon here!");

        if (spawn.hcool) return message.channel.send("You can't use hint this much quickly, please try after few seconds.");
        let name = spawn.pokemon[0].name.split("");
        let done = [];
        name.forEach(e => done.push(e))
        for (var i = 0; i < name.length; i++) {
            let pos = Math.floor(Math.random() * name.length)
            done[done.map((x, i) => [i, x]).filter(x => x[1] == done[pos])[0][0]] = "\\_"
        }
        spawn.hcool = true
        await spawn.save()
        setTimeout(async () => {
            spawn.hcool = false
            await spawn.save()
        }, 10000)
        return message.channel.send(`The wild pokémon is ${done.join("")}`)
    }
}