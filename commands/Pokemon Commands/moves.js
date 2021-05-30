const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require('../../functions.js')
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
    name: "moves",
    description: "Display your pokemon's moves and movepool.",
    category: "Pokemon Commands",
    args: false,
    usage: ["moves"],
    cooldown: 3,
    permissions: [],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        let selected = user.selected,
            name = user.pokemons[selected].name.toLowerCase(),
            moves = {};
        let t = await get({
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            json: true
        }).catch(er => {
            if (er.message.includes(`404 - "Not Found"`)) return message.reply("Moves of **" + name.replace("-", " ") + "** Are still being worked on!");
        });
        Object.entries(t.moves).forEach((v) => {
            if (v[1].version_group_details) {
                let temp_z = v[1].version_group_details.filter((move) => {
                    if (move.move_learn_method.name == "level-up") return move;
                });
                temp_z = temp_z.map(move => {
                    if (move.move_learn_method.name == "level-up") return { name: move.move, level: move.level_learned_at };
                })
                if (temp_z.length > 0) moves[v[1].move.name] = temp_z[(temp_z.length - 1)].level;
            }
        });
        let avail = Object.entries(moves)//.filter(e => e[1] <= poke.level);
        avail = avail.map(x => {
            if(x[1] > user.pokemons[selected].level) return `${(x[0].charAt(0).toUpperCase() + x[0].substr(1))} 🔒`.split("-").map(r=>capitalize(r)).join(" ");
            else return `${(x[0].charAt(0).toUpperCase() + x[0].substr(1))}`.split("-").map(r=>capitalize(r)).join(" ");
        }).join("\n");
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Level ${user.pokemons[selected].level} ${user.pokemons[selected].name.split("-").map(r => capitalize(r)).join(" ")}` + "'s moves:")
            .setColor("#fff200")
            .setDescription("To learn a move, use the \`"+prefix+"learn <move>\` command.")
            .addField("**Current Moves**", user.pokemons[selected].moves.map((e,n) => `Move ${n+1}: ${e.name.split(" ").map(r=>capitalize(r)).join(" ")}`).join("\n") || "Move 1: Tackle\nMove 2: Tackle\nMove 3: Tackle\nMove 4: Tackle", true)
            .addField("**Available Moves**", avail, true)
            .setFooter(`Note: Moves shown with a 🔒 symbol are locked for now, and will be unlocked when your pokemon will level up.`)
        return message.channel.send(embed)
    }
}