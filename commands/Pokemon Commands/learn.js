const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require('../../functions.js');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
    name: "learn",
    description: "Teach your Pokemon a move.",
    category: "Pokemon Commands",
    args: false,
    usage: ["learn <moveName>"],
    cooldown: 3,
    permissions: [],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        if (!args[0]) return message.channel.send("That move doesn't exist, or your pokémon doesn't have access to it!");
        var selected = user.selected;
        let poke = user.pokemons[selected];
        if (!poke.moves[0]) {
            user.pokemons[selected].moves = [{ name: "Tackle" }, { name: "Tackle" }, { name: "Tackle" }, { name: "Tackle" }];
            await user.markModified(`pokemons`);
            await user.save();
        }
        let name = poke.name.toLowerCase();
        let moves = {};
        let move = args.join("-");
        let t = await get({
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            json: true
        }).catch(er => {
            if (er.message.includes(`404 - "Not Found"`)) return message.reply("Moves of **" + poke.name.replace("-", " ") + "** Are still being worked on!");
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
        let avail = Object.entries(moves).filter(e => e[1] <= poke.level);
        avail = avail.map(x => {
            return `${(x[0].charAt(0).toUpperCase() + x[0].substr(1))}`;
        }).join("\n");
        //console.log(avail)
        move = move.charAt(0).toUpperCase() + move.substr(1).toLowerCase();
        if (!avail.split("\n").includes(move)) return message.reply("That move doesn't exist, or your pokémon doesn't have access to it!");
        let embed = new MessageEmbed()
            .setAuthor(poke.name.split("-").map(r => capitalize(r)).join(" ") + "'s moves:")
            .setDescription(`Select the move you want to replace with ${move.split("-").map(r => capitalize(r)).join(" ")}`)
            .setColor("#fff200");
        user.pokemons[selected].moves.map((r, n) => {
            embed.addField(r.name, `${prefix}replace ${n + 1}`)
        })
        let m = await message.channel.send(embed);
        let collector = await m.channel.awaitMessages(msg => msg.author.id == message.author.id && msg.content.toLowerCase().startsWith(`${prefix}replace `),
            { max: 1, time: 60000, errors: ['time'] })
            .then(async collected => {
                let place = collected.first().content.split(" ")[1];
                if (!parseInt(place)) return;
                let mv = poke.moves[Number(place) - 1].name
                user.pokemons[selected].moves[Number(place) - 1] = { name: move.replace("-", " ") }
                await user.markModified(`pokemons`)
                await user.markModified(`moves`)
                await user.save()
                return message.channel.send(`Replaced ${mv} with ${move.replace("-", " ")}`)
            })
            .catch(collected => {
                return;
            });
        //if (!parseInt(place)) return message.reply("<prefix>learn <move> <position>")
        /*if (poke.moves.length === 4) {
            message.channel.send(`Replaced ${poke.moves[Number(place) - 1].name} with ${move.replace("-", " ")}`)
            poke.moves[Number(place) - 1].name = move.replace("-", " ")
            await user.markModified(`pokemons`)
            await user.markModified(`moves`)
            await user.save()
        } else {
            poke.moves.push({ name: "Tackle" }, { name: "Tackle" }, { name: "Tackle" }, { name: "Tackle" })
            message.channel.send(`Replaced ${poke.moves[Number(place) - 1].name} with ${move.replace("-", " ")}`)
            poke.moves[Number(place) - 1].name = move.replace("-", " ")
            await user.markModified(`pokemons`)
            await user.markModified(`moves`)
            await user.save()
        }*/
    }
}