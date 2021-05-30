const Discord = require("discord.js");
const Canvas = require("canvas");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { randomNumber } = require('../../functions.js');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const Concept = require('../../db/concept.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const cooldown = new Set();
const ms = require("ms");
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;
    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
};
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = {
    name: "battle",
    description: "Battle another user.",
    category: "Pokemon Commands",
    args: true,
    usage: ["pvp <@user>"],
    cooldown: 3,
    permissions: [],
    aliases: ["pvp"],
    execute: async (client, message, args, prefix, guild, color, channel) => {
        //message.channel.send("Duel is under construction. If you still like to proceed , Continue.")
        let embed = new MessageEmbed()
            .setColor(color);
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix.toLowerCase() + "start\` command before using this command!");
        let user1 = message.mentions.members.first();
        if (user1.id === message.author.id) return message.channel.send(` Usage : ${prefix.toLowerCase()}battle <@user>\nSee (${prefix.toLowerCase()}help) ${module.exports.name} for more information on Battle.`);

        let user2 = await User.findOne({ id: user1.id });
        if (!user2 || !user2.pokemons[0]) return message.channel.send(user1.user.username + " need to pick a starter pokémon using the \`" + prefix.toLowerCase() + "start\` command before using this command!");
        if (cooldown.has(message.author.id)) return message.channel.send(`You are already in a Battle. Please wait for it to finish or if not please wait for a few minutes`);
        else if (cooldown.has(user1.id)) return message.channel.send(`The user you mentioned is already in a Battle or must wait for cooldown to end.`);
        //if (!user.selected || !user2.selected) return message.channel.send(`Either you or your opponent has not selected any pokemon to Battle!`)

        var selected = user.selected || 0;
        var selected1 = user2.selected || 0;
        var name = user.pokemons[selected].name.toLowerCase();
        if (name.startsWith("alolan")) {
            name = name.replace("alolan", "").trim().toLowerCase();
            name = `${name}-alola`.toLowerCase();
        }
        var name1 = user2.pokemons[selected1].name;
        if (name1.toLowerCase().startsWith("alolan")) {
            name1 = name1.replace("alolan", "").trim().toLowerCase();
            name1 = `${name1}-alola`.toLowerCase();
        }
        //Battleer checker
        const cp = Concept.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
        const g = Galarians.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase().replace("galarian-", ""))
        const pk = Pokemon.find(e => e.name === user.pokemons[selected].name.toLowerCase())
        const g8 = Gen8.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())
        const s = Shiny.find(e => e.name === user.pokemons[selected].name.toLowerCase())
        const f = Forms.find(e => e.name.toLowerCase() === user.pokemons[selected].name.toLowerCase())

        //Accepter checker
        const cp1 = Concept.find(e => e.name.toLowerCase() === user2.pokemons[selected1].name.toLowerCase())
        const g1 = Galarians.find(e => e.name.toLowerCase() === user2.pokemons[selected1].name.toLowerCase().replace("galarian-", ""))
        const pk1 = Pokemon.find(e => e.name === user2.pokemons[selected1].name.toLowerCase())
        const g81 = Gen8.find(e => e.name.toLowerCase() === user2.pokemons[selected1].name.toLowerCase())
        const s1 = Shiny.find(e => e.name === user2.pokemons[selected1].name.toLowerCase())
        const f1 = Forms.find(e => e.name.toLowerCase() === user2.pokemons[selected1].name.toLowerCase())

        var url = user.pokemons[selected].url
        var url1 = user2.pokemons[selected1].url
        let msg = await message.channel.send(`${message.member.displayName} has challenged you to a Battle! Type \`${prefix.toLowerCase()}accept\` or \`${prefix.toLowerCase()}deny\` to respond.`);
        const collector = new MessageCollector(msg.channel, m => m.author.id === user2.id, { time: 30000 });
        collector.on('collect', async m => {
            if (m.content.toLowerCase() === prefix.toLowerCase() + "accept") {
                cooldown.add(message.author.id);
                cooldown.add(user1.id);

                const canvas = Canvas.createCanvas(700, 350);
                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage(`https://i.imgur.com/Mq0LVTV.png`);
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#74037b';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                const poke1 = await Canvas.loadImage(url); // Battleer pokemon image url here 
                ctx.drawImage(poke1, 450, 100, 180, 180);
                const poke2 = await Canvas.loadImage(url1); // accepter pokemon image url here
                ctx.drawImage(poke2, 50, 100, 180, 180)

                let hp = /* totalHPofauthor */ Math.floor(Math.floor((2 * user.pokemons[selected].hp + user.pokemons[selected].hp + (0 / 4) * user.pokemons[selected].level) / 100) + user.pokemons[selected].level + 10);
                let hp1 = /* totalHPofaccepter */ Math.floor(Math.floor((2 * user2.pokemons[selected1].hp + user2.pokemons[selected1].hp + (0 / 4) * user2.pokemons[selected1].level) / 100) + user2.pokemons[selected1].level + 10)
                let hp2 = /* remainingHPofauthor */ hp;
                let hp3 = /* totalHPofaccepter */ hp1;
                embed
                    .setAuthor(`${message.member.displayName} VS ${user1.username}`)
                    .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.replace(/-+/g, " ").capitalize()}: ${hp2}/${hp}HP\n${user1.user.username}'s ${user2.pokemons[selected1].name.replace(/-+/g, " ").capitalize()}: ${hp3}/${hp1}HP`)
                    .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                    .setImage("attachment://" + "Battle.png")
                    .setFooter("Instructions will be sent to you in DMs! Please read it carefully!")
                let em = await message.channel.send(embed);

                let PokemonSpeed = Math.floor(Math.floor((2 * user.pokemons[selected].speed + user.pokemons[selected].speed + (0 / 4) * user.pokemons[selected].level) / 100) + user.pokemons[selected].level + 10);
                let pokemonTwoSpeed = Math.floor(Math.floor((2 * user2.pokemons[selected1].speed + user2.pokemons[selected1].speed + (0 / 4) * user2.pokemons[selected1].level) / 100) + user2.pokemons[selected1].level + 10);

                let used = null;
                let used2 = null;
                let filter = mes => [message.author.id, user1.id].includes(mes.author.id) && mes.content.toLowerCase().startsWith(`${prefix.toLowerCase()}use`)
                let Duelcollector = message.channel.createMessageCollector(filter, { time: (3 * 60000) });

                Duelcollector.on("collect", async (mes) => {
                    if (mes.author.id === message.author.id && mes.content.startsWith(`${prefix.toLowerCase()}use`)) {
                        let ar = mes.content.slice(`${prefix.toLowerCase()}use`.length).trim().split(/ +/g);
                        if (!ar[0] || isNaN(ar[0])) return message.channel.send(`Invalid number provided`);

                        if (used !== null) return message.channel.send(`Wait for your opponent to pick a move!`);
                        used = 'done'
                        mes.delete()
                        if (used && used2) RunDuel();
                    }
                    else if (mes.author.id === user1.id && mes.content.startsWith(`${prefix.toLowerCase()}use`)) {
                        let ar = mes.content.slice(`${prefix.toLowerCase()}use`.length).trim().split(/ +/g);
                        if (!ar[0] || isNaN(ar[0])) return message.channel.send(`Invalid number provided`);

                        if (used2 !== null) return message.channel.send(`Wait for your opponent to pick a move!`);
                        used2 = 'done';
                        mes.delete()
                        if (used && used2) RunDuel();
                    }
                });

                async function RunDuel() {
                    used = null;
                    used2 = null;

                    let damage = Math.floor(randomNumber(10, 20));
                    if (PokemonSpeed > pokemonTwoSpeed) {
                        hp1 = hp1 - damage

                        let damage1 = Math.floor(randomNumber(10, 20));
                        hp = hp - damage1

                        if (hp < 1) hp = 0
                        if (hp1 < 1) hp1 = 0
                        embed
                            .setAuthor(`${message.member.displayName} VS ${user1.user.username}`)
                            .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.replace(/-+/g, " ").capitalize()}: ${hp2}/${hp}HP\n${user1.user.username}'s ${user2.pokemons[selected1].name.replace(/-+/g, " ").capitalize()}: ${hp3}/${hp1}HP`)
                            .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                            .setImage("attachment://" + "Battle.png")
                            .setColor(color)
                            .setFooter("Instructions will be sent to you in DMs! Please read it carefully!")

                        em.edit(embed)
                        if (hp < 1) {
                            Duelcollector.stop();
                            cooldown.delete(message.author.id);
                            cooldown.delete(user.id)
                            embed
                                .setAuthor(`Battle ended!`)
                                .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${user1.username}'s ${user2.pokemons[selected1].name.capitalize()}\n\nBattle ended and ${user1} won the Battle`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return em.edit(embed)
                        } else if (hp1 < 1) {
                            Duelcollector.stop();
                            cooldown.delete(message.author.id);
                            cooldown.delete(user.id)
                            embed
                                .setAuthor(`Battle ended!`)
                                .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${user1.username}'s ${user2.pokemons[selected1].name.capitalize()}\n\nBattle ended and ${message.author} won the Battle`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return em.edit(embed)
                        }
                    } else {
                        hp = hp - damage

                        let damage1 = Math.floor(randomNumber(10, 20));
                        hp1 = hp1 - damage
                        if (hp < 1) hp = 0
                        if (hp1 < 1) hp1 = 0
                        embed
                            .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${user1.username}'s ${user2.pokemons[selected1].name.capitalize()}\n\n${user1} has used move and dealt ${damage} Damage.\n${message.author} has used move and dealt ${damage1} Damage.\n\n${user.pokemons[selected].name}: ${hp}\n${user2.pokemons[selected1].name}: ${hp1}`)
                            .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                            .setImage("attachment://" + "Battle.png")
                            .setColor(color)
                        em.edit(embed)
                        if (hp < 1) {
                            Duelcollector.stop();
                            cooldown.delete(message.author.id);
                            cooldown.delete(user.id)
                            embed
                                .setAuthor(`Battle ended!`)
                                .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${user1.username}'s ${user2.pokemons[selected1].name.capitalize()}\n\nBattle ended and ${user1} won the Battle`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return em.edit(embed)
                            //Battle ended and ${user1} won the Battle
                        } else if (hp1 < 1) {
                            Duelcollector.stop();
                            cooldown.delete(message.author.id);
                            cooldown.delete(user.id)
                            embed
                                .setAuthor(`Battle ended!`)
                                .setDescription(`${message.author.username}'s ${user.pokemons[selected].name.capitalize()} VS ${user1.username}'s ${user2.pokemons[selected1].name.capitalize()}\n\nBattle ended and ${message.author} won the Battle`)
                                .attachFiles([{ name: "Battle.png", attachment: canvas.toBuffer() }])
                                .setImage("attachment://" + "Battle.png")
                                .setColor(color)
                            return em.edit(embed)
                            //Battle ended and ${message.author} won the Battle
                        }
                    }

                }

            } else if (m.content === prefix.toLowerCase() + "deny") {
                message.channel.send("Cancelled the Battle")
                collector.stop('deny')
            } else {

            }
        })
        collector.on('end', (r, reason) => {
            if (['reason', 'deny'].includes(reason)) {
                message.channel.send(`Battle request expired`)
                cooldown.delete(message.author.id);
                cooldown.delete(user.id)
            }
        });
    }
}