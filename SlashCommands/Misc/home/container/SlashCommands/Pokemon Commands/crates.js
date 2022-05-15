const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js')
const { get } = require('request-promise-native')
const { classToPlain } = require("class-transformer");
const Pokemon = require("../../Classes/Pokemon");
const Forms = require('../../db/forms.js')

module.exports = {
    name: "crate",
    description: "Check out all your recevied crates!",
    options: [
        {
            name: "open",
            description: "Provide the name of the crate which u want to open!",
            type: 3,
            required: false,
            choices: [
                // Voting Crates
                {
                    name: "Bronze Crate",
                    value: "bronze"
                },
                {
                    name: "Silver Crate",
                    value: "silver"
                },
                {
                    name: "Golden Crate",
                    value: "golden"
                },
                {
                    name: "Diamond Crate",
                    value: "diamond"
                },
                {
                    name: "Deluxe Crate",
                    value: "deluxe"
                },

                // Patreon Crates
                {
                    name: "Turtwig Crate",
                    value: "turtwig"
                },
                {
                    name: "Eevee Crate",
                    value: "eevee"
                },
                {
                    name: "Charizard Crate",
                    value: "charizard"
                },
                {
                    name: "Celebi Crate",
                    value: "celebi"
                },
                {
                    name: "Guzzlord Crate",
                    value: "guzzlord"
                },
                {
                    name: "Groudon Crate",
                    value: "groudon"
                },
                {
                    name: "Pokemon Master Crate",
                    value: "master"
                }
            ]
        },
        {
            name: "amount",
            description: "Provide amount of boxes u want to open!",
            type: 4,
            required: false
        }
    ],
    run: async (client, interaction, args, color, prefix) => {
        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`{prefix}start\` before using this command.` })

        let embed = new Discord.MessageEmbed()
            .setAuthor("Crates - Voting Rewards")
            .addField("**Voting Crates**",
                `**Bronze Crate:** \`${user.crates.bronzecrate}\` crates\n` +
                `**Silver Crate:** \`${user.crates.silvercrate}\` crates\n` +
                `**Golden Crate:** \`${user.crates.goldencrate}\` crates\n` +
                `**Diamond Crate:** \`${user.crates.diamondcrate}\` crates\n` +
                `**Deluxe Crate:** \`${user.crates.deluxecrate}\` crates\n`
            )
            .addField("**Patreon Crates**",
                `**Turtwig Crate:** \`${user.crates.turtwigcrate}\` crates\n` +
                `**Eevee Crate:** \`${user.crates.eeveecrate}\` crates\n` +
                `**Charizard Crate:** \`${user.crates.charizardcrate}\` crates\n` +
                `**Celebi Crate:** \`${user.crates.celebicrate}\` crates\n` +
                `**Guzzlord Crate:** \`${user.crates.guzzlordcrate}\` crates\n` +
                `**Groudon Crate:** \`${user.crates.groudoncrate}\` crates\n` +
                `**Pokemon Master Crate:** \`${user.crates.mastercrate}\` crates`
            )
            .setFooter(`You can open your crates with "/crate open <bronze | silver | golden | diamond | deluxe | turtwig | eevee | charizard | celebi | guzzlord | groudon | pokemon master> [amount]".`)
            .setColor(color)
            .setThumbnail(client.user.displayAvatarURL())

        if (!args[0]) return interaction.followUp({ embeds: [embed] })
        else if (args[0]) {
            let name = interaction.options.getString('open')
            let amount = interaction.options.getInteger('amount')
            if (!amount) amount = 1
            if (amount >= 16) return interaction.followUp("You cannot open more than 15 crates at once!")
            if (amount <= 0) return interaction.followUp({ content: `\`${amount}\` is not a valid **amount**!` })
            if (name == "bronze") {
                if (user.crates.bronzecrate < amount) return interaction.followUp(`You don't have enought **Bronze** crates !`)
                let options = ["200g", "200g", "200g", "200g", "200g", "200g", "200g", "400g", "400g", "1r"], rewards = []
                for (let value = 0; value < amount; value++) {
                    let random = ~~(Math.random() * 10)
                    rewards.push(options[random])
                }

                let gold = rewards.filter(x => x.endsWith("g")).map(x => x.replace(/g/g, "")), totalGold = 0
                gold.forEach((x) => {
                    totalGold += parseInt(x)
                })

                let redeem = rewards.filter(x => x.endsWith("r")).map(x => x.replace(/r/g, "")), totalRedeem = 0
                redeem.forEach((x) => {
                    totalRedeem += parseInt(x)
                })

                let embed = new MessageEmbed()
                    .setAuthor("Crate Rewards")
                    .setDescription(`${gold.map(x => `${x.replace(/g/g, "")} Credits`).join("\n")}\n${redeem.map(x => `${x.replace(/g/g, "")} Redeem`).join("\n")}`)
                    .addFields(
                        {
                            name: "Overall Received",
                            value: `\`\`\`\nCredits: ${totalGold} | Redeems: ${totalRedeem}\nShards: 0 | Pokémons: 0\n\`\`\``
                        }
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(color)

                user.balance += totalGold
                user.redeems += totalRedeem
                user.crates.bronzecrate -= amount
                await user.save().catch(() => { })
                return interaction.followUp({ embeds: [embed] })

            } else if (name == "silver") {

                if (user.crates.silvercrate < amount) return interaction.followUp(`You don't have enought **Silver** crates !`)

                let name = random()
                let url, poke, Type
                let lvl = Math.floor(Math.random() * 50)
                let shiny = false
                let check
                let option = {
                    url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                    json: true
                }

                let options = ["200g", "200g", "200g", "200g", "400g", "400g", "400g", `p`, `p`, "1r"], rewards = []
                for (let value = 0; value < amount; value++) {
                    let random = ~~(Math.random() * 10)
                    rewards.push(options[random])
                }

                let gold = rewards.filter(x => x.endsWith("g")).map(x => x.replace(/g/g, "")), totalGold = 0
                gold.forEach((x) => {
                    totalGold += parseInt(x)
                })

                let redeem = rewards.filter(x => x.endsWith("r")).map(x => x.replace(/r/g, "")), totalRedeem = 0
                redeem.forEach((x) => {
                    totalRedeem += parseInt(x)
                })

                let pokemon = rewards.filter(x => x.endsWith("p")), totalPokemon = []
                for (let i = 0; i < pokemon.length; i++) {

                    name = random()
                    if (check(name) == true) name = random()
                    lvl = Math.floor(Math.random() * 50)
                    option = {
                        url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                        json: true
                    }
                    if (name.toLowerCase().startsWith("zacian")) option.url = "https://pokeapi.co/api/v2/pokemon/zacian-hero";
                    if (name.toLowerCase().startsWith("giratina")) option.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered";
                    if (name.toLowerCase().startsWith("deoxys")) option.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal";
                    if (name.toLowerCase().startsWith("shaymin")) option.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land";
                    if (name.toLowerCase() === "nidoran") option.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
                    if (name.toLowerCase() === "nidoran-f") option.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f";
                    if (name.toLowerCase().startsWith("porygon-z")) option.url = "https://pokeapi.co/api/v2/pokemon/porygon-z";
                    if (name.toLowerCase().startsWith("landorus")) option.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate";
                    if (name.toLowerCase().startsWith("thundurus")) option.url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate";
                    if (name.toLowerCase().startsWith("tornadus")) option.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate";
                    if (name.toLowerCase().includes("mr.mime")) option.url = "https://pokeapi.co/api/v2/pokemon/mr-rime";
                    if (name.toLowerCase().startsWith("pumpkaboo")) option.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average";
                    if (name.toLowerCase().startsWith("meowstic")) option.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male";
                    if (name.toLowerCase().startsWith("toxtricity")) option.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped";
                    if (name.toLowerCase().startsWith("mimikyu")) option.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised";

                    await get(option).then(async t => {
                        check = t.id.toString().length
                        if (check === 1) {
                            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
                        } else if (check === 2) {
                            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
                        } else if (check === 3) {
                            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
                        }

                        var re
                        Type = t.types.map(r => {
                            if (r !== r) re = r;
                            if (re == r) return;
                            return `${r.type.name}`
                        }).join(" | ")

                        poke = new Pokemon({ name: name, rarity: Type, url: url, shiny: shiny, nickname: null }, lvl)
                        // poke = await classToPlain(poke)
                    })

                    totalPokemon.push(poke)
                    user.pokemons.push(poke)
                }

                let embed = new MessageEmbed()
                    .setAuthor("Crate Rewards")
                    .setDescription(`${gold.map(x => `${x.replace(/g/g, "")} Credits`).join("\n")}\n${redeem.map(x => `${x.replace(/g/g, "")} Redeem`).join("\n")}\n${totalPokemon.map(x => `L${x.level} **${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${x.totalIV}%\` )`).join("\n")}`)
                    .addFields(
                        {
                            name: "Overall Received",
                            value: `\`\`\`\nCredits: ${totalGold} | Redeems: ${totalRedeem}\nShards: 0 | Pokémons: ${totalPokemon.length}\n\`\`\``
                        }
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(color)

                user.balance += totalGold
                user.redeems += totalRedeem
                user.crates.silvercrate -= amount
                await user.markModified("pokemons")
                await user.save().catch(() => { })
                return interaction.followUp({ embeds: [embed] })

            } else if (name == "golden") {

                if (user.crates.goldencrate < amount) return interaction.followUp(`You don't have enought **Golden** crates !`)

                let name = random()
                let url, poke, Type
                let lvl = Math.floor(Math.random() * 50)
                let shiny = false
                let check
                let option = {
                    url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                    json: true
                }

                let options = ["200g", "400g", "800g", "1r", "5s", "p", "p"], rewards = []
                for (let value = 0; value < amount; value++) {
                    let random = ~~(Math.random() * 7)
                    rewards.push(options[random])
                }

                let gold = rewards.filter(x => x.endsWith("g")).map(x => x.replace(/g/g, "")), totalGold = 0
                gold.forEach((x) => {
                    totalGold += parseInt(x)
                })

                let redeem = rewards.filter(x => x.endsWith("r")).map(x => x.replace(/r/g, "")), totalRedeem = 0
                redeem.forEach((x) => {
                    totalRedeem += parseInt(x)
                })

                let shard = rewards.filter(x => x.endsWith("s")).map(x => x.replace(/s/g, "")), totalShard = 0
                shard.forEach((x) => {
                    totalShard += parseInt(x)
                })

                let pokemon = rewards.filter(x => x.endsWith("p")), totalPokemon = []
                for (let i = 0; i < pokemon.length; i++) {
                    shiny = false
                    name = random()
                    lvl = Math.floor(Math.random() * 50)
                    if (lvl > 48) shiny = true

                    option = {
                        url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                        json: true
                    }
                    if (name.startsWith("zacian")) option.url = "https://pokeapi.co/api/v2/pokemon/zacian-hero";
                    if (name.startsWith("giratina")) option.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered";
                    if (name.startsWith("deoxys")) option.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal";
                    if (name.startsWith("shaymin")) option.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land";
                    if (name === "nidoran-m") option.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
                    if (name === "nidoran-f") option.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f";
                    if (name.startsWith("porygon-z")) option.url = "https://pokeapi.co/api/v2/pokemon/porygon-z";
                    if (name.startsWith("landorus")) option.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate";
                    if (name.startsWith("thundurus")) option.url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate";
                    if (name.startsWith("tornadus")) option.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate";
                    if (name.includes("mr-mime")) option.url = "https://pokeapi.co/api/v2/pokemon/mr-rime";
                    if (name.startsWith("pumpkaboo")) option.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average";
                    if (name.startsWith("meowstic")) option.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male";
                    if (name.startsWith("toxtricity")) option.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped";
                    if (name.startsWith("mimikyu")) option.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised";

                    await get(option).then(async t => {
                        check = t.id.toString().length
                        if (check === 1) {
                            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
                        } else if (check === 2) {
                            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
                        } else if (check === 3) {
                            url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
                        }

                        var re
                        Type = t.types.map(r => {
                            if (r !== r) re = r;
                            if (re == r) return;
                            return `${r.type.name}`
                        }).join(" | ")

                        poke = new Pokemon({ name: name, rarity: Type, url: url, shiny: shiny, nickname: null }, lvl)
                        // poke = await classToPlain(poke)
                    })

                    totalPokemon.push(poke)
                    user.pokemons.push(poke)
                }

                let embed = new MessageEmbed()
                    .setAuthor("Crate Rewards")
                    .setDescription(`${gold.map(x => `${x.replace(/g/g, "")} Credits`).join("\n")}\n${redeem.map(x => `${x.replace(/g/g, "")} Redeem`).join("\n")}\n${totalPokemon.map(x => `L${x.level}${x.shiny == false ? "" : " ⭐ "}**${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${x.totalIV}%\` )`).join("\n")}\n${shard.map(x => `${x.replace(/g/g, "")} Shards`).join("\n")}`)
                    .addFields(
                        {
                            name: "Overall Received",
                            value: `\`\`\`\nCredits: ${totalGold} | Redeems: ${totalRedeem}\nShards: ${totalShard} | Pokémons: ${totalPokemon.length}\n\`\`\``
                        }
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(color)

                user.balance += totalGold
                user.redeems += totalRedeem
                user.shards += totalShard
                user.crates.goldencrate -= amount
                await user.markModified("pokemons")
                await user.save().catch(() => { })
                return interaction.followUp({ embeds: [embed] })
            } else if (name == "diamond") {
                return interaction.followUp({ content: "In Development!" })
            } else if (name == "deluxe") {

                if (user.crates.deluxecrate < amount) return interaction.followUp(`You don't have enought **Deluxe** crates !`)

                const { getRandomNumberBetween, legend, mythical, form, ub } = require('../../functions.js')
                let name = random()
                let url, poke, Type
                let lvl = Math.floor(Math.random() * 50)
                let shiny = false
                let check
                let option = {
                    url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                    json: true
                }

                let options = ["10000g", "10000g", "20000g", "1r", "20s", "p", "p"], rewards = []
                for (let value = 0; value < amount; value++) {
                    let random = ~~(Math.random() * 7)
                    rewards.push(options[random])
                }

                let gold = rewards.filter(x => x.endsWith("g")).map(x => x.replace(/g/g, "")), totalGold = 0
                gold.forEach((x) => {
                    totalGold += parseInt(x)
                })

                let redeem = rewards.filter(x => x.endsWith("r")).map(x => x.replace(/r/g, "")), totalRedeem = 0
                redeem.forEach((x) => {
                    totalRedeem += parseInt(x)
                })

                let shard = rewards.filter(x => x.endsWith("s")).map(x => x.replace(/s/g, "")), totalShard = 0
                shard.forEach((x) => {
                    totalShard += parseInt(x)
                })

                let pokemon = rewards.filter(x => x.endsWith("p")), totalPokemon = []
                for (let i = 0; i < pokemon.length; i++) {
                    shiny = false
                    let Chance = getRandomNumberBetween(1, 21)
                    if (Chance == 1) {
                        name = random()
                        shiny = true
                    } else {
                        if (Chance < 6) name = legend()
                        else if (Chance > 6 && Chance < 11) name = mythical()
                        else if (Chance > 11 && Chance < 16) name = ub()
                        else if (Chance > 16 && Chance < 21) name = form()
                    }
                    lvl = Math.floor(Math.random() * 50)
                    if (lvl == 50) shiny = true

                    let Form = Forms.find(x => x.name == name)
                    if (Form) {
                        poke = new Pokemon({ name: Form.name, rarity: Form.type, url: Form.url, shiny: shiny, nickname: null }, lvl)
                        // poke = await classToPlain(poke)
                    } else {

                        option = {
                            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                            json: true
                        }
                        if (name.startsWith("zacian")) option.url = "https://pokeapi.co/api/v2/pokemon/zacian-hero";
                        if (name.startsWith("giratina")) option.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered";
                        if (name.startsWith("deoxys")) option.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal";
                        if (name.startsWith("shaymin")) option.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land";
                        if (name === "nidoran-m") option.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
                        if (name === "nidoran-f") option.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f";
                        if (name.startsWith("porygon-z")) option.url = "https://pokeapi.co/api/v2/pokemon/porygon-z";
                        if (name.startsWith("landorus")) option.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate";
                        if (name.startsWith("thundurus")) option.url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate";
                        if (name.startsWith("tornadus")) option.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate";
                        if (name.includes("mr-mime")) option.url = "https://pokeapi.co/api/v2/pokemon/mr-rime";
                        if (name.startsWith("pumpkaboo")) option.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average";
                        if (name.startsWith("meowstic")) option.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male";
                        if (name.startsWith("toxtricity")) option.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped";
                        if (name.startsWith("mimikyu")) option.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised";

                        await get(option).then(async t => {
                            if (t) {
                                check = t.id.toString().length
                                if (check === 1) {
                                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
                                } else if (check === 2) {
                                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
                                } else if (check === 3) {
                                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
                                }

                                var re
                                Type = t.types.map(r => {
                                    if (r !== r) re = r;
                                    if (re == r) return;
                                    return `${r.type.name}`
                                }).join(" | ")

                                poke = new Pokemon({ name: name, rarity: Type, url: url, shiny: shiny, nickname: null }, lvl)
                                // poke = await classToPlain(poke)
                            }
                        })
                    }
                    totalPokemon.push(poke)
                    user.pokemons.push(poke)
                }

                let embed = new MessageEmbed()
                    .setAuthor("Crate Rewards")
                    .setDescription(`${gold.map(x => `${x.replace(/g/g, "")} Credits`).join("\n")}\n${redeem.map(x => `${x.replace(/g/g, "")} Redeem`).join("\n")}\n${totalPokemon.map(x => `L${x.level}${x.shiny == false ? "" : " ⭐"} **${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${x.totalIV}%\` )`).join("\n")}\n${shard.map(x => `${x.replace(/g/g, "")} Shards`).join("\n")}`)
                    .addFields(
                        {
                            name: "Overall Received",
                            value: `\`\`\`\nCredits: ${totalGold} | Redeems: ${totalRedeem}\nShards: ${totalShard} | Pokémons: ${totalPokemon.length}\n\`\`\``
                        }
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(color)

                user.balance += totalGold
                user.redeems += totalRedeem
                user.shards += totalShard
                user.crates.deluxecrate -= amount
                await user.markModified("pokemons")
                await user.save().catch(() => { })
                return interaction.followUp({ embeds: [embed] })

            } else {
                return interaction.followUp({ content: "`/crate open <name> [amount]`" })
            }
        }
    }
}
function random() {
    let array = require('fs')
        .readFileSync('./db/dex.txt')
        .toString()
        .toLowerCase()
        .replace(" ", "-").replace("’", "-")
        .trim()
        .split('\n')
        .map(r => r.trim())
    return array[Math.floor(Math.random() * array.length)]
}
