const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const Discord = require('discord.js')
const { get } = require('request-promise-native');
const User = require('../../models/user.js')
const Auction = require('../../models/auction.js')
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Gmax = require('../../db/gmax.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const shiny = require('../../db/shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Concept = require('../../db/concept.js');
const Pokemon = require('../../db/pokemons.js');

module.exports = {
    name: "auction",
    description: "Buy items from Auction!",
    options: [
        {
            type: 'SUB_COMMAND',
            name: "search",
            description: "Search auction for a [specific] pokemon(s)!",
            options: [
                {
                    name: 'arguments',
                    description: "Provide valid arguments to narrow down your search !",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "info",
            description: "Take a look at the Pokémon's stats listed on auctions.",
            options: [
                {
                    name: 'id',
                    description: "Provide auction id of the pokémon which you would like to see!",
                    type: 4,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "bid",
            description: "Bid on a Pokémon listed on the auctions.",
            options: [
                {
                    name: 'id',
                    description: "Provide auction id of the pokémon on which you would like to bid!",
                    type: 4,
                    required: true
                },
                {
                    name: 'amount',
                    description: 'Provide the amount of credits you want to bid.',
                    type: 4,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'biddings',
            description: 'Check all the auction pokémons you have bidded on.',
            options: [
                {
                    name: 'arguments',
                    description: "Provide valid arguments to narrow down your search !",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "list",
            description: "List your pokémon on the the auctions.",
            options: [
                {
                    name: 'id',
                    description: "Provide id of your pokémon which you would like to list!",
                    type: 4,
                    required: true
                },
                {
                    name: 'timeout',
                    description: "Provide time amount for your auctioned pokemon.",
                    type: 3,
                    required: true
                },
                {
                    name: 'buyout',
                    description: "Provide buyout bid price for your pokémon!",
                    type: 4,
                    required: false
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'listings',
            description: 'Check all your pokémons listed on the auctions.',
            options: [
                {
                    name: 'arguments',
                    description: "Provide valid arguments to narrow down your search !",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'remove',
            description: 'Remove your listed pokémon from the auctions.',
            options: [
                {
                    name: "id",
                    description: 'Provide auction id of the pokémon which you would like to remove!',
                    type: 4,
                    required: true
                }
            ]
        }
    ],
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("YES")
                    .setStyle("SUCCESS")
                    .setCustomId("yes"),
                new MessageButton()
                    .setLabel("NO")
                    .setStyle("DANGER")
                    .setCustomId("no")
            )
        let rowx = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("YES")
                    .setStyle("SUCCESS")
                    .setCustomId('disabledYes')
                    .setDisabled(),
                new MessageButton()
                    .setLabel("NO")
                    .setStyle("DANGER")
                    .setCustomId("disabledNo")
                    .setDisabled()
            )
        let button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("⬅")
                    .setStyle("SUCCESS")
                    .setCustomId("backward"),
                new MessageButton()
                    .setLabel("➡")
                    .setStyle("SUCCESS")
                    .setCustomId("forward"),
                // new MessageButton()
                //     .setLabel("#")
                //     .setStyle("SUCCESS")
                //     .setCustomId("pageTravel")
            )
        let buttonx = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("⬅")
                    .setStyle("SUCCESS")
                    .setCustomId("disabledForward")
                    .setDisabled(),
                new MessageButton()
                    .setLabel("➡")
                    .setStyle("SUCCESS")
                    .setCustomId("disabledBackwards")
                    .setDisabled(),
                // new MessageButton()
                //     .setLabel("#")
                //     .setStyle("SUCCESS")
                //     .setCustomId("disabledPageTravel")
                //     .setDisabled()
            )


        const filter = async (inter) => {
            if (interaction.user.id == inter.user.id) return true
            else {
                await inter.deferUpdate()
                inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                return false
            }
        }

        let auction = await Auction.find()

        const [subcommand] = args

        if (subcommand == "bid") {

            let id = interaction.options.getInteger('id'), num = id - 1
            let bid = interaction.options.getInteger('amount')
            if (isNaN(num) || isNaN(bid)) return interaction.followUp(`Failed to convert \`Parametre\` to \`Int\`.`)
            if (!auction[num]) return interaction.followUp({ content: `\`${id}\`, unable to find that pokémon in the auctions !` })


            if (bid > user.balance) return interaction.followUp(`You don't have enough credit to bid on Level \`${auction[num].pokemon.level}\` **${auction[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}**!`)

            let check = await Auction.findOne({ ownerId: interaction.user.id, pokemon: auction[num].pokemon, buyout: auction[num].buyout })
            if (check) return interaction.followUp({ content: `**Strange** ! You wanna buy with your own pokémon ?!` })

            if (auction[num].bid >= bid) return interaction.followUp(`You can't bid lower than the current bid ( \`${auction[num].bid}\` ${auction[num].bid == 1 ? "credit" : "credits"}) !`)

            let embed = new MessageEmbed()
                .setTitle(`💰 ・ ${client.user.username} Auctions`)
                .setDescription(`${interaction.user.tag}\nAre you sure you want to bid on **Level ${auction[num].pokemon.level} ${auction[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** (\`${auction[num].pokemon.totalIV}%\` Iv) ?\n**Bid**: ${bid.toLocaleString()} ${bid == 1 ? "credit" : "credits"}`)
                .setColor(color)

            let msg = await interaction.followUp({ embeds: [embed], components: [row] })

            const collector = msg.createMessageComponentCollector({
                filter, max: 1, time: 30000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'yes') {
                    if (auction[num].bid != null && bid == auction[num].buyout) {
                        user.balance -= bid
                        user.pokemons.push(auction[num].pokemon)
                        await user.markModified("pokemons")
                        await user.save().catch(() => { })
                        let userD = await User.findOne({ id: auction[num].ownerId })
                        if (userD) {
                            userD.balance += bid
                            await userD.save()
                            client.users.cache.get(userD.id).send(`Your auction was bought, you received \`${bid.toLocaleString()}\` credit !`)
                        }
                        await auction[num].delete()
                        return interaction.followUp({ content: `Congratulations **${interaction.user.tag}**, you bought a **Level ${auction[num].pokemon.level} ${auction[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** (\`${auction[num].pokemon.totalIV}%\` Iv) !` })
                    }
                    let userD = client.users.cache.get(auction[num].highestBidderId)
                    if (userD) {
                        let xyz = await User.findOne({ id: userD.id })
                        if (xyz) {
                            xyz.balance += auction[num].bid
                            await xyz.save().catch(() => { })
                        }
                        userD.send(`You have been outbidded on auction Id: \`${num + 1}\`, **Level ${auction[num].pokemon.level} ${auction[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** (\`${auction[num].pokemon.totalIV}%\` Iv) !`).catch(() => { })
                    }
                    user.balance -= bid
                    auction[num].highestBidderId = interaction.user.id
                    auction[num].bid = bid
                    let userQuest = await Quests.findOne({ id: interaction.user.id })
                    if (userQuest) {
                        if (userQuest.auctions.biddings >= 10) {
                            userQuest.auctions.biddings = 0
                            user.balance += 1000
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the auctions quest ( **bid on 10 pokémons in auctions** ) and you were rewarded with \`1,000\` credits !`)
                        } else userQuest.auctions.biddings += 1
                        await userQuest.save().catch(() => { })
                    }
                    await user.save().catch(() => { })
                    await auction[num].save().catch(() => { })
                    return interaction.channel.send(`Success !`)
                } else if (i.customId === 'no') {
                    return interaction.channel.send({ content: "Ok Aborted!" })
                } else {
                    return collector.stop()
                }
            })

            collector.on('end', () => {
                interaction.editReply({ components: [rowx] }).catch(() => { })
                return
            })
        } else if (subcommand == "biddings") {

            let n = args.join().slice(8)
            if (interaction.options.getString('arguments')) n = interaction.options.getString('arguments')

            let a = auction,
                s = a.map((r, num) => {
                    r.num = num + 1
                    return r
                }).filter(r => r.highestBidderId === user.id), zbc = {}
            n = n.split(/--|—/gmi).map(x => {
                if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true
            })

            let validOptions = ["legendary", "legend", "l", "mythical", "mythic", "myth", "m", "starter", "starters", "ultrabeast", "ub", "mega", "gigantamaxable", "primal", "megable", "alolan", "a", "galarian", "g", "gmax", "gigantamax", "shad", "shadow", "shiny", "s", "sh", "name", "n", "type", "level", "hpiv", "atkiv", "defiv", "spatkiv", "spdefiv", "speediv", "region","type"]

            for (const [key, value] of Object.entries(zbc)) {
                if (!validOptions.find(r => r == key)) return interaction.followUp(`\`--${key}\` is not a valid argument !`)
            }

            if (zbc["legendary"] || zbc["legend"] || zbc["l"]) {
                s = s.filter(e => legends.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))) || legends2.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["mythical"] || zbc["mythic"] || zbc["m"]) {
                s = s.filter(e => mythics.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["starter"] || zbc["starters"]) {
                s = s.filter(e => starters.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["ultrabeast"] || zbc["ub"]) {
                s = s.filter(e => ub.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["mega"]) {
                s = s.filter(e => (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) || (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-").startsWith("primal"))))
            }
            if (zbc["gigantamaxable"]) {
                s = s.filter(e => gigantamaxable.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["primal"]) {
                s = s.filter(e => (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("primal")))
            }
            if (zbc["megable"]) {
                s = s.filter(e => megable.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["alolan"] || zbc["a"]) {
                s = s.filter(e => alolans.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["galarian"] || zbc["g"]) {
                s = s.filter(e => galarians.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["gmax"] || zbc["gigantamax"]) {
                s = s.filter(e => gmax.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["shad"] || zbc["shadow"]) {
                s = s.filter(e => e.pokemon.name.toLowerCase().replace(/ +/g, "-").startsWith("shadow"))
            }
            if (zbc["shiny"] || zbc["s"]) {
                s = s.filter(e => e.pokemon.shiny)
            }
            if (zbc["name"] || zbc["n"]) s = s.filter(e => {
                if (e && (zbc['name'] || zbc["n"]) == e.pokemon.name.toLowerCase().replace(/-+/g, ' ')) return e
            })
            if (zbc['type']) s = s.filter(e => {
                if (e.pokemon.rarity.toLowerCase().split(" | ").includes(zbc['type'])) return e
            })
            if (zbc['level']) {
                let a = zbc["level"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.level == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.level < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.level == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.level > a[1])
                    }
                }
            }
            if (zbc['hpiv']) {
                let a = zbc["hpiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.hp == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.hp < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.hp == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.hp > a[1])
                    }
                }
            }
            if (zbc['atkiv']) {
                let a = zbc["atkiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.atk == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.atk < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.atk == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.atk > a[1])
                    }
                }
            }
            if (zbc['defiv']) {
                let a = zbc["defiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.def == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.def < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.def == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.def > a[1])
                    }
                }
            }
            if (zbc['spatkiv']) {
                let a = zbc["spatkiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.spatk == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.spatk < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.spatk == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.spatk > a[1])
                    }
                }
            }
            if (zbc['spdefiv']) {
                let a = zbc["spdefiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.spdef == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.spdef < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.spdef == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.spdef > a[1])
                    }
                }
            }
            if (zbc['speediv']) {
                let a = zbc["speediv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.speed == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.speed < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.speed == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.speed > a[1])
                    }
                }
            }
            if (zbc["region"]) {
                let a = zbc["region"].toLowerCase().split(" ")
                if (a[0] === "kanto") {
                    s = s.filter(e => kanto.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "johto") {
                    s = s.filter(e => johto.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "hoenn") {
                    s = s.filter(e => hoenn.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "sinnoh") {
                    s = s.filter(e => sinnoh.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "unova") {
                    s = s.filter(e => unova.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "kalos") {
                    s = s.filter(e => kalos.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "alola") {
                    s = s.filter(e => alola.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "galar") {
                    s = s.filter(e => galar.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else {
                    return interaction.followUp(`\`${a[0]}\` region doesnt exist !`)
                }
            }

            if (zbc['order'] || zbc['o']) {
                let order = zbc['order'] || zbc['o']
                if (order == "price a") {
                    s = s.sort((a, b) => { return parseFloat(a.pokemon.price) - parseFloat(b.pokemon.price) });
                }
                else if (order == "price d") {
                    s = s.sort((a, b) => { return parseFloat(b.pokemon.price) - parseFloat(a.pokemon.price) });
                }
                else if (order == "iv") {
                    s = s.sort((a, b) => { return parseFloat(b.pokemon.totalIV) - parseFloat(a.pokemon.totalIV) });
                }
                else if (order == "alphabet") {
                    s = s.sort((a, b) => {
                        if (a.pokemon.name < b.pokemon.name) return -1
                        if (a.pokemon.name > b.pokemon.name) return 1
                        return 0
                    })
                }
            }
            let x = 0, y = 15
            let txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${i + 1} | IV: ${item.pokemon.totalIV}% | Bid: ${item.bid.toLocaleString()} ${item.bid == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")

            if (txt.length == 0) txt = "Found no auction pokémons matching this search !"

            let embed = new MessageEmbed()
                .setAuthor(`💰 ・ ${client.user.username} Auctions`)
                .setDescription(txt)
                .setColor(color)
                .setFooter(`Showing page 1 of ${~~(s.length / 15) + 1} of total ${auction.length} pokémons.\n`)

            let msg = await interaction.followUp({ embeds: [embed], components: [button] })

            const collector = await msg.createMessageComponentCollector({
                filter, time: 60000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'forward') {
                    x += 15, y += 15
                    if (!auction[x]) return interaction.channel.send({ content: `<@${interaction.user.id}> , your auction biddings doesn't have any more pokémons !`, ephemeral: true })
                    txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${i + 1} | IV: ${item.pokemon.totalIV}% | Bid: ${item.bid.toLocaleString()} ${item.bid == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")
                    if (txt.length == 0) {
                        return interaction.channel.send({ content: `<@${interaction.user.id}> , your auction biddings doesn't have any more pokémons !`, ephemeral: true })
                    }

                    let Embed = new MessageEmbed()
                        .setAuthor(`💰 ・ ${client.user.username} Auctions`)
                        .setDescription(txt)
                        .setColor(color)
                        .setFooter(`Showing page ${y / 15} of ${~~(s.length / 15) + 1} of total ${auction.length} pokémons.\n`)

                    msg.edit({ embeds: [Embed] })
                } else if (i.customId === 'backward') {
                    x -= 15, y -= 15
                    if (!auction[x]) return i.followUp({ content: `<@${interaction.user.id}> , your auction biddings doesn't have any less pokémons !`, epehmeral: true })
                    txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Bid: ${item.bid.toLocaleString()} ${item.bid == 1 ? "credit" : "credits"} | Buyout: ${item.buyout <= 0 ? "None" : buyout.toLocaleString()} credits`).slice(x, y).join("\n")
                    if (txt.length == 0) return i.followUp({ content: `<@${interaction.user.id}> , your auction biddings doesn't have any less pokémons !`, epehmeral: true })

                    let Embed = new MessageEmbed()
                        .setAuthor(`💰 ・ ${client.user.username} Auctions`)
                        .setDescription(txt)
                        .setColor(color)
                        .setFooter(`Showing page ${y / 15} of ${~~(s.length / 15) + 1} of total ${auction.length} pokémons.\n`)

                    msg.edit({ embeds: [Embed] })
                }
            })
            collector.on('end', () => {
                msg.edit({ components: [buttonx] }).catch(() => { })
            })

        } else if (subcommand == "info") {

            let auction = await Auction.find()
            let id = parseInt(args[1]), num = id - 1
            if (!auction[num]) return interaction.followUp({ content: `Unable to find that pokémon in the auctions!` })

            let a = auction, s = a.map((r, num) => { r.pokemon.num = num + 1; return r })

            let level = auction[num].pokemon.level,
                hp = auction[num].pokemon.hp,
                atk = auction[num].pokemon.atk,
                def = auction[num].pokemon.def,
                spatk = auction[num].pokemon.spatk,
                spdef = auction[num].pokemon.spdef,
                speed = auction[num].pokemon.speed,
                types = `${auction[num].pokemon.rarity}`,
                nature = auction[num].pokemon.nature,
                totalIV = auction[num].pokemon.totalIV,
                pokename = auction[num].pokemon.name.replace(" ", "-").toLowerCase().trim(),
                name = `${auction[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
                xp = `${auction[num].pokemon.xp}/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 + 51 * level - 140}`,
                hpBase,
                atkBase,
                defBase,
                spatkBase,
                spdefBase,
                speedBase,
                url = auction[num].pokemon.url,
                bid = `${auction[num].bid.toLocaleString()}  ${auction[num].bid == 1 ? "credit" : "credits"}`

            let gen8 = Gen8.find(e => e.name.toLowerCase() === pokename),
                form = Forms.find(e => e.name.toLowerCase() === pokename),
                concept = Concept.find(e => e.name.toLowerCase() === pokename),
                galarian = Galarians.find(e => e.name.toLowerCase() === pokename.replace("galarian-", "")),
                mega = Mega.find(e => e.name.toLowerCase() === pokename.replace("mega-", "").toLowerCase()),
                shadow = Shadow.find(e => e.name.toLowerCase() === pokename.replace("shadow-", "").toLowerCase()),
                primal = Primal.find(e => e.name === pokename.replace("primal-", "").toLowerCase()),
                pokemon = Pokemon.find(e => e.name.english.toLowerCase() === pokename),
                gmax = Gmax.find(e => e.name.toLowerCase() === pokename.replace("gigantamax-", "").toLowerCase())

            if (gen8) {
                hpBase = gen8.hp,
                    atkBase = gen8.atk,
                    defBase = gen8.def,
                    spatkBase = gen8.spatk,
                    spdefBase = gen8.spdef,
                    speedBase = gen8.speed
            } else if (form) {
                hpBase = form.hp,
                    atkBase = form.atk,
                    defBase = form.def,
                    spatkBase = form.spatk,
                    spdefBase = form.spdef,
                    speedBase = form.speed
            } else if (concept) {
                hpBase = concept.hp,
                    atkBase = concept.atk,
                    defBase = concept.def,
                    spatkBase = concept.spatk,
                    spdefBase = concept.spdef,
                    speedBase = concept.speed
            } else if (galarian && auction[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                hpBase = galarian.hp,
                    atkBase = galarian.atk,
                    defBase = galarian.def,
                    spatkBase = galarian.spatk,
                    spdefBase = galarian.spdef,
                    speedBase = galarian.speed
            } else if (mega && auction[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                hpBase = mega.hp,
                    atkBase = mega.atk,
                    defBase = mega.def,
                    spatkBase = mega.spatk,
                    spdefBase = mega.spdef,
                    speedBase = mega.speed
            } else if (shadow && auction[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                hpBase = shadow.hp,
                    atkBase = shadow.atk,
                    defBase = shadow.def,
                    spatkBase = shadow.spatk,
                    spdefBase = shadow.spdef,
                    speedBase = shadow.speed
            } else if (primal && auction[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                hpBase = primal.hp,
                    atkBase = primal.atk,
                    defBase = primal.def,
                    spatkBase = primal.spatk,
                    spdefBase = primal.spdef,
                    speedBase = primal.speed
            } else if (gmax && auction[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                hpBase = gmax.hp,
                    atkBase = gmax.atk,
                    defBase = gmax.def,
                    spatkBase = gmax.spatk,
                    spdefBase = gmax.spdef,
                    speedBase = gmax.speed
            } else if (pokemon) {
                hpBase = pokemon.base.hp,
                    atkBase = pokemon.base.attack,
                    defBase = pokemon.base.defense,
                    spatkBase = pokemon.base.spatk,
                    spdefBase = pokemon.base.spdef,
                    speedBase = pokemon.base.speed
            } else {

                if (pokename.startsWith("alolan")) {
                    pokename = pokename.replace("alolan-", "").toLowerCase().trim()
                    pokename = `${pokename}-alola`.toLowerCase().trim()
                }

                let t = await get({
                    url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                    json: true
                }).catch((err) => {
                    return interaction.followUp({ content: "An error occured to info the pokemon. Please contact the developers of the bot!" })
                })
                if (t) {
                    hpBase = t.stats[0].base_stat,
                        atkBase = t.stats[1].base_stat,
                        defBase = t.stats[2].base_stat,
                        spatkBase = t.stats[3].base_stat,
                        spdefBase = t.stats[4].base_stat,
                        speedBase = t.stats[5].base_stat
                }
            }

            let hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1)
            let atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9)
            let defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1)
            let spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1)
            let spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1)
            let speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

            let Embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Auction Details__", `**ID**: ${num + 1}\n**Bid**: ${bid}`).setFooter(`Displaying Auction Pokémon: ${num + 1}/${s.length}\nUse "${prefix}auction bid ${num + 1}" to bid on this Pokémon.`).setImage(url).setColor(color)

            let msg = await interaction.followUp({ embeds: [Embed], components: [button] })

            const filter = async (inter) => {
                if (interaction.user.id == inter.user.id) return true
                else {
                    await inter.deferUpdate()
                    inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                    return false
                }
            }

            const collector = msg.createMessageComponentCollector({
                filter, max: 10
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'forward') {

                    num += 1
                    if (num >= s.length - 1) num = 0
                    level = auction[num].pokemon.level,
                        hp = auction[num].pokemon.hp,
                        atk = auction[num].pokemon.atk,
                        def = auction[num].pokemon.def,
                        spatk = auction[num].pokemon.spatk,
                        spdef = auction[num].pokemon.spdef,
                        speed = auction[num].pokemon.speed,
                        nb = auction[num].pokemon._nb,
                        types = `${auction[num].pokemon.rarity}`,
                        nature = auction[num].pokemon.nature,
                        totalIV = auction[num].pokemon.totalIV,
                        pokename = auction[num].pokemon.name.replace(" ", "-").toLowerCase().trim(),
                        name = `${auction[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
                        xp = `${auction[num].pokemon.xp}/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 + 51 * level - 140}`,
                        url = auction[num].pokemon.url,
                        bid = `${auction[num].bid.toLocaleString()}  ${auction[num].bid == 1 ? "credit" : "credits"}`,

                        gen8 = Gen8.find(e => e.name.toLowerCase() === pokename),
                        form = Forms.find(e => e.name.toLowerCase() === pokename),
                        concept = Concept.find(e => e.name.toLowerCase() === pokename),
                        galarian = Galarians.find(e => e.name.toLowerCase() === pokename.replace("galarian-", "")),
                        mega = Mega.find(e => e.name.toLowerCase() === pokename.replace("mega-", "").toLowerCase()),
                        shadow = Shadow.find(e => e.name.toLowerCase() === pokename.replace("shadow-", "").toLowerCase()),
                        primal = Primal.find(e => e.name === pokename.replace("primal-", "").toLowerCase()),
                        pokemon = Pokemon.find(e => e.name.english.toLowerCase() === pokename),
                        gmax = Gmax.find(e => e.name.toLowerCase() === pokename.replace("gigantamax-", "").toLowerCase())

                    if (gen8) {
                        hpBase = gen8.hp,
                            atkBase = gen8.atk,
                            defBase = gen8.def,
                            spatkBase = gen8.spatk,
                            spdefBase = gen8.spdef,
                            speedBase = gen8.speed
                    } else if (form) {
                        hpBase = form.hp,
                            atkBase = form.atk,
                            defBase = form.def,
                            spatkBase = form.spatk,
                            spdefBase = form.spdef,
                            speedBase = form.speed
                    } else if (concept) {
                        hpBase = concept.hp,
                            atkBase = concept.atk,
                            defBase = concept.def,
                            spatkBase = concept.spatk,
                            spdefBase = concept.spdef,
                            speedBase = concept.speed
                    } else if (galarian && auction[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                        hpBase = galarian.hp,
                            atkBase = galarian.atk,
                            defBase = galarian.def,
                            spatkBase = galarian.spatk,
                            spdefBase = galarian.spdef,
                            speedBase = galarian.speed
                    } else if (mega && auction[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                        hpBase = mega.hp,
                            atkBase = mega.atk,
                            defBase = mega.def,
                            spatkBase = mega.spatk,
                            spdefBase = mega.spdef,
                            speedBase = mega.speed
                    } else if (shadow && auction[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                        hpBase = shadow.hp,
                            atkBase = shadow.atk,
                            defBase = shadow.def,
                            spatkBase = shadow.spatk,
                            spdefBase = shadow.spdef,
                            speedBase = shadow.speed
                    } else if (primal && auction[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                        hpBase = primal.hp,
                            atkBase = primal.atk,
                            defBase = primal.def,
                            spatkBase = primal.spatk,
                            spdefBase = primal.spdef,
                            speedBase = primal.speed
                    } else if (gmax && auction[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                        hpBase = gmax.hp,
                            atkBase = gmax.atk,
                            defBase = gmax.def,
                            spatkBase = gmax.spatk,
                            spdefBase = gmax.spdef,
                            speedBase = gmax.speed
                    } else if (pokemon) {
                        hpBase = pokemon.base.hp,
                            atkBase = pokemon.base.attack,
                            defBase = pokemon.base.defense,
                            spatkBase = pokemon.base.spatk,
                            spdefBase = pokemon.base.spdef,
                            speedBase = pokemon.base.speed
                    } else {

                        if (pokename.startsWith("alolan")) {
                            pokename = pokename.replace("alolan-", "").toLowerCase().trim()
                            pokename = `${pokename}-alola`.toLowerCase().trim()
                        }

                        console.log(pokename)
                        let t = await get({
                            url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                            json: true
                        }).catch((err) => {
                            return interaction.channel.send({ content: "An error occured to info the pokemon. Please contact the developers of the bot!" })
                        })
                        if (t) {
                            hpBase = t.stats[0].base_stat,
                                atkBase = t.stats[1].base_stat,
                                defBase = t.stats[2].base_stat,
                                spatkBase = t.stats[3].base_stat,
                                spdefBase = t.stats[4].base_stat,
                                speedBase = t.stats[5].base_stat
                        }
                    }

                    hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                        atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                        defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                        spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                        spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                        speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

                    let Embed1 = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Auction Details__", `**ID**: ${num + 1}\n**Bid**: ${bid}`).setFooter(`Displaying Auction Pokémon: ${num + 1}/${s.length}\nUse "${prefix}auction buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)

                    return msg.edit({ embeds: [Embed1] })
                } else if (i.customId === 'backward') {
                    num -= 1
                    if (num <= -1) num = s.length - 1
                    level = auction[num].pokemon.level,
                        hp = auction[num].pokemon.hp,
                        atk = auction[num].pokemon.atk,
                        def = auction[num].pokemon.def,
                        spatk = auction[num].pokemon.spatk,
                        spdef = auction[num].pokemon.spdef,
                        speed = auction[num].pokemon.speed,
                        nb = auction[num].pokemon._nb,
                        types = `${auction[num].pokemon.rarity}`,
                        nature = auction[num].pokemon.nature,
                        totalIV = auction[num].pokemon.totalIV,
                        pokename = auction[num].pokemon.name.replace(" ", "-").toLowerCase().trim(),
                        name = `${auction[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
                        xp = `${auction[num].pokemon.xp}/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 + 51 * level - 140}`,
                        url = auction[num].pokemon.url,
                        bid = `${auction[num].bid.toLocaleString()}  ${auction[num].bid == 1 ? "credit" : "credits"}`,

                        gen8 = Gen8.find(e => e.name.toLowerCase() === pokename),
                        form = Forms.find(e => e.name.toLowerCase() === pokename),
                        concept = Concept.find(e => e.name.toLowerCase() === pokename),
                        galarian = Galarians.find(e => e.name.toLowerCase() === pokename.replace("galarian-", "")),
                        mega = Mega.find(e => e.name.toLowerCase() === pokename.replace("mega-", "").toLowerCase()),
                        shadow = Shadow.find(e => e.name.toLowerCase() === pokename.replace("shadow-", "").toLowerCase()),
                        primal = Primal.find(e => e.name === pokename.replace("primal-", "").toLowerCase()),
                        pokemon = Pokemon.find(e => e.name.english.toLowerCase() === pokename),
                        gmax = Gmax.find(e => e.name.toLowerCase() === pokename.replace("gigantamax-", "").toLowerCase())

                    if (gen8) {
                        hpBase = gen8.hp,
                            atkBase = gen8.atk,
                            defBase = gen8.def,
                            spatkBase = gen8.spatk,
                            spdefBase = gen8.spdef,
                            speedBase = gen8.speed
                    } else if (form) {
                        hpBase = form.hp,
                            atkBase = form.atk,
                            defBase = form.def,
                            spatkBase = form.spatk,
                            spdefBase = form.spdef,
                            speedBase = form.speed
                    } else if (concept) {
                        hpBase = concept.hp,
                            atkBase = concept.atk,
                            defBase = concept.def,
                            spatkBase = concept.spatk,
                            spdefBase = concept.spdef,
                            speedBase = concept.speed
                    } else if (galarian && auction[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                        hpBase = galarian.hp,
                            atkBase = galarian.atk,
                            defBase = galarian.def,
                            spatkBase = galarian.spatk,
                            spdefBase = galarian.spdef,
                            speedBase = galarian.speed
                    } else if (mega && auction[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                        hpBase = mega.hp,
                            atkBase = mega.atk,
                            defBase = mega.def,
                            spatkBase = mega.spatk,
                            spdefBase = mega.spdef,
                            speedBase = mega.speed
                    } else if (shadow && auction[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                        hpBase = shadow.hp,
                            atkBase = shadow.atk,
                            defBase = shadow.def,
                            spatkBase = shadow.spatk,
                            spdefBase = shadow.spdef,
                            speedBase = shadow.speed
                    } else if (primal && auction[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                        hpBase = primal.hp,
                            atkBase = primal.atk,
                            defBase = primal.def,
                            spatkBase = primal.spatk,
                            spdefBase = primal.spdef,
                            speedBase = primal.speed
                    } else if (gmax && auction[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                        hpBase = gmax.hp,
                            atkBase = gmax.atk,
                            defBase = gmax.def,
                            spatkBase = gmax.spatk,
                            spdefBase = gmax.spdef,
                            speedBase = gmax.speed
                    } else if (pokemon) {
                        hpBase = pokemon.base.hp,
                            atkBase = pokemon.base.attack,
                            defBase = pokemon.base.defense,
                            spatkBase = pokemon.base.spatk,
                            spdefBase = pokemon.base.spdef,
                            speedBase = pokemon.base.speed
                    } else {

                        if (pokename.startsWith("alolan")) {
                            pokename = pokename.replace("alolan-", "").toLowerCase().trim()
                            pokename = `${pokename}-alola`.toLowerCase().trim()
                        }

                        let t = await get({
                            url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                            json: true
                        }).catch((err) => {
                            return interaction.channel.send({ content: "An error occured to info the pokemon. Please contact the developers of the bot!" })
                        })
                        if (t) {
                            hpBase = t.stats[0].base_stat,
                                atkBase = t.stats[1].base_stat,
                                defBase = t.stats[2].base_stat,
                                spatkBase = t.stats[3].base_stat,
                                spdefBase = t.stats[4].base_stat,
                                speedBase = t.stats[5].base_stat
                        }
                    }

                    hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                        atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                        defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                        spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                        spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                        speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

                    let Embed2 = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Auction Details__", `**ID**: ${num + 1}\n**Bid**: ${bid}`).setFooter(`Displaying auction Pokémon: ${num + 1}/${s.length}\nUse "${prefix}auction bid ${num + 1}" to bid on this Pokémon.`).setImage(url).setColor(color)

                    return msg.edit({ embeds: [Embed2] })
                }
            })

            collector.on('end', async (i) => {
                return interaction.editReply({ components: [buttonx] })
            })

        } else if (subcommand == "list") {

            let id = interaction.options.getInteger('id')
            let buyout = interaction.options.getInteger('buyout')
            if (isNaN(id) || isNaN(buyout)) return interaction.followUp({ content: `Failed to convert \`Parametre\` to \`Int\`.` })
            if (buyout < 0) return interaction.followUp(`\`${buyout}\` is not a valid integer !`)

            num = id - 1
            if (!user.pokemons[num]) return interaction.followUp({ content: `Unable to find pokémon N\`${id}\` in your collection !` })

            let time = interaction.options.getString('timeout')
            let Time = ["24h", "24hour", "24hours", "3d", "3day", "3days"]
            if (!Time.includes(time)) return interaction.followUp(`Invalid \`Timeout\` provided, try e.g. "24h" or "3days".`)
            if (time.includes('h')) time = 86400000
            else if (time.includes("d")) time = 259200000
            else return interaction.followUp(`Invalid \`Timeout\` provided, try e.g. "24h" or "3days".`)

            let embed = new MessageEmbed()
                .setAuthor(`${client.user.username} Auctions`)
                .setDescription(`${interaction.user.tag}\nAre you sure you want to list your **Level ${user.pokemons[num].level} ${user.pokemons[num].name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}**  ( \`${user.pokemons[num].totalIV}\`% Iv ) on the auctions ?\n**Timeout**: ${time}\n**Buyout**: ${buyout == 0 ? "None" : buyout} credits`)
                .setColor(color)

            let msg = await interaction.followUp({ embeds: [embed], components: [row] })

            const collector = msg.createMessageComponentCollector({
                filter, max: 1, time: 30000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'yes') {
                    let newDoc = new Auction({
                        time: Date.now() + time,
                        ownerId: interaction.user.id,
                        buyout: buyout,
                        pokemon: user.pokemons[num],
                    })
                    user.pokemons.splice(num, 1)
                    user.markModified("pokemons")
                    let userQuest = await Quests.findOne({ id: interaction.user.id })
                    if (userQuest) {
                        if (userQuest.auctions.listings >= 10) {
                            userQuest.auctions.listings = 0
                            user.balance += 1000
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the auctions quest ( **list 10 pokémons on auctions** ) and you were rewarded with \`1,000\` credits !`)
                        } else userQuest.auctions.listings += 1
                        await userQuest.save().catch(() => { })
                    }
                    await user.save().catch(() => { })
                    await newDoc.save().catch(() => { })
                    return interaction.channel.send({ content: "Success!" })
                } else if (i.customId === 'no') {
                    return interaction.channel.send({ content: "Ok Aborted!" })
                } else {
                    collector.stop()
                }
            })

            collector.on('end', () => {
                return interaction.editReply({ components: [rowx] })
            })

        } else if (subcommand == "listings") {

            let n = args.join().slice(8)
            if (interaction.options.getString('arguments')) n = interaction.options.getString('arguments')

            let a = auction,
                s = a.map((r, num) => {
                    r.num = num + 1
                    return r
                }).filter(r => r.ownerId === user.id), zbc = {}
            n = n.split(/--|—/gmi).map(x => {
                if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true
            })

            let validOptions = ["legendary", "legend", "l", "mythical", "mythic", "myth", "m", "starter", "starters", "ultrabeast", "ub", "mega", "gigantamaxable", "primal", "megable", "alolan", "a", "galarian", "g", "gmax", "gigantamax", "shad", "shadow", "shiny", "s", "sh", "name", "n", "type", "level", "hpiv", "atkiv", "defiv", "spatkiv", "spdefiv", "speediv", "region","type"]

            for (const [key, value] of Object.entries(zbc)) {
                if (!validOptions.find(r => r == key)) return interaction.followUp(`\`--${key}\` is not a valid argument !`)
            }

            if (zbc["legendary"] || zbc["legend"] || zbc["l"]) {
                s = s.filter(e => legends.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))) || legends2.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["mythical"] || zbc["mythic"] || zbc["m"]) {
                s = s.filter(e => mythics.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["starter"] || zbc["starters"]) {
                s = s.filter(e => starters.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["ultrabeast"] || zbc["ub"]) {
                s = s.filter(e => ub.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["mega"]) {
                s = s.filter(e => (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) || (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("primal")))
            }
            if (zbc["gigantamaxable"]) {
                s = s.filter(e => gigantamaxable.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["primal"]) {
                s = s.filter(e => (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("primal")))
            }
            if (zbc["megable"]) {
                s = s.filter(e => megable.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["alolan"] || zbc["a"]) {
                s = s.filter(e => alolans.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["galarian"] || zbc["g"]) {
                s = s.filter(e => galarians.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["gmax"] || zbc["gigantamax"]) {
                s = s.filter(e => gmax.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["shad"] || zbc["shadow"]) {
                s = s.filter(e => shadow.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["shiny"] || zbc["s"]) {
                s = s.filter(e => e.pokemon.shiny)
            }
            if (zbc["name"] || zbc["n"]) s = s.filter(e => {
                if (e && (zbc['name'] || zbc["n"]) == e.pokemon.name.toLowerCase().replace(/-+/g, ' ')) return e
            })
            if (zbc['type']) s = s.filter(e => {
                if (e.pokemon.rarity.toLowerCase().split(" | ").includes(zbc['type'])) return e
            })
            if (zbc['level']) {
                let a = zbc["level"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.level == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.level < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.level == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.level > a[1])
                    }
                }
            }
            if (zbc['hpiv']) {
                let a = zbc["hpiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.hp == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.hp < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.hp == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.hp > a[1])
                    }
                }
            }
            if (zbc['atkiv']) {
                let a = zbc["atkiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.atk == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.atk < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.atk == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.atk > a[1])
                    }
                }
            }
            if (zbc['defiv']) {
                let a = zbc["defiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.def == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.def < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.def == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.def > a[1])
                    }
                }
            }
            if (zbc['spatkiv']) {
                let a = zbc["spatkiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.spatk == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.spatk < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.spatk == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.spatk > a[1])
                    }
                }
            }
            if (zbc['spdefiv']) {
                let a = zbc["spdefiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.spdef == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.spdef < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.spdef == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.spdef > a[1])
                    }
                }
            }
            if (zbc['speediv']) {
                let a = zbc["speediv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.speed == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.speed < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.speed == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.speed > a[1])
                    }
                }
            }
            if (zbc["region"]) {
                let a = zbc["region"].toLowerCase().split(" ")
                if (a[0] === "kanto") {
                    s = s.filter(e => kanto.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "johto") {
                    s = s.filter(e => johto.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "hoenn") {
                    s = s.filter(e => hoenn.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "sinnoh") {
                    s = s.filter(e => sinnoh.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "unova") {
                    s = s.filter(e => unova.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "kalos") {
                    s = s.filter(e => kalos.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "alola") {
                    s = s.filter(e => alola.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else if (a[0] === "galar") {
                    s = s.filter(e => galar.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                } else {
                    return interaction.followUp(`\`${a[0]}\` region doesnt exist !`)
                }
            }

            if (zbc['order'] || zbc['o']) {
                let order = zbc['order'] || zbc['o']
                if (order == "price a") {
                    s = s.sort((a, b) => { return parseFloat(a.pokemon.price) - parseFloat(b.pokemon.price) });
                }
                else if (order == "price d") {
                    s = s.sort((a, b) => { return parseFloat(b.pokemon.price) - parseFloat(a.pokemon.price) });
                }
                else if (order == "iv") {
                    s = s.sort((a, b) => { return parseFloat(b.pokemon.totalIV) - parseFloat(a.pokemon.totalIV) });
                }
                else if (order == "alphabet") {
                    s = s.sort((a, b) => {
                        if (a.pokemon.name < b.pokemon.name) return -1
                        if (a.pokemon.name > b.pokemon.name) return 1
                        return 0
                    })
                }
            }
            let x = 0, y = 15
            let txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Bid: ${item.bid.toLocaleString()} ${item.bid == 1 ? "credit" : "credits"} | Buyout: ${item.buyout <= 0 ? "None" : buyout.toLocaleString()} credits`).slice(x, y).join("\n")

            if (txt.length == 0) txt = "Found no auction pokémons matching this search !"

            let embed = new MessageEmbed()
                .setAuthor(`💰 ・ ${client.user.username} Auctions`)
                .setDescription(txt)
                .setColor(color)

            let msg = await interaction.followUp({ embeds: [embed], components: [button] })

            const collector = await msg.createMessageComponentCollector({
                filter, time: 60000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'forward') {
                    x += 15, y += 15
                    if (!auction[x]) return interaction.channel.send({ content: `<@${interaction.user.id}> , your auction listings doesn't have any more pokémons !`, ephemeral: true })
                    txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Bid: ${item.bid.toLocaleString()} ${item.bid == 1 ? "credit" : "credits"} | Buyout: ${item.buyout <= 0 ? "None" : buyout.toLocaleString()} credits`).slice(x, y).join("\n")
                    if (txt.length == 0) {
                        return interaction.channel.send({ content: `<@${interaction.user.id}> , your auction listings doesn't have any more pokémons !`, ephemeral: true })
                    }

                    let Embed = new MessageEmbed()
                        .setAuthor(`💰 ・ ${client.user.username} Auctions`)
                        .setDescription(txt)
                        .setColor(color)

                    msg.edit({ embeds: [Embed] })
                }
                if (i.customId === 'backward') {
                    x -= 15, y -= 15
                    if (!auction[x]) return interaction.channel.send({ content: `<@${interaction.user.id}> , your auction listings doesn't have any less pokémons !`, ephemeral: true })
                    txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Bid: ${item.bid.toLocaleString()} ${item.bid == 1 ? "credit" : "credits"} | Buyout: ${item.buyout <= 0 ? "None" : buyout.toLocaleString()} credits`).slice(x, y).join("\n")
                    if (txt.length == 0) return interaction.channel.send({ content: `<@${interaction.user.id}> , your auction listings doesn't have any less pokémons !`, ephemeral: true })

                    let Embed = new MessageEmbed()
                        .setAuthor(`💰 ・ ${client.user.username} Auctions`)
                        .setDescription(txt)
                        .setColor(color)

                    msg.edit({ embeds: [Embed] })
                }

                if (i.customId == "pageTravel") {
                    let msgx = await interaction.channel.send(`<@${interaction.user.id}>, you have 30 seconds, send __numbers__ in chat to navigate to pages, simply type \`end\` to exit from **Page Travelling** !`)

                    const filterx = (message) => message.author.id == interaction.user.id
                    const collectorx = interaction.channel.createMessageCollector({ filter: filterx, time: 30000 })

                    collectorx.on('collect', async (m) => {
                        let c = m.content
                        if (c.toLowerCase() == "end") {
                            return collectorx.stop()
                        }
                        if (!isNaN(c)) {
                            c = parseInt(c)
                        } else {
                            return
                        }
                    })
                    collectorx.on('end', () => {
                        msgx.delete()
                    })
                }
            })
            collector.on('end', () => {
                msg.edit({ components: [buttonx] }).catch(() => { })
            })
        } else if (subcommand == "remove") {

            let auction = await Auction.find()
            auction = auction.map((r, i) => {
                r.num = i + 1
                return r
            }).filter(r => r.ownerId === user.id)

            let id = parseInt(args[1])
            if (isNaN(id)) return interaction.followUp({ content: `Failed to convert \`Parametre\` to \`Int\`.` })

            if (!auction.find(r => r.num === id)) return interaction.followUp({ content: `You can't remove this pokémon because it isn't present in your **auction** listings!` })

            num = id
            let data = auction.find(r => r.num === id)
            if (data.bid != 0) return interaction.followUp("You can't remove your pokemon from the **Auctions** once someone has already placed a bid on it.")


            if (data) {

                let embed = new MessageEmbed()
                    .setDescription(`${interaction.user.tag}\nAre you sure you want to remove your **Level ${data.pokemon.level} ${data.pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${data.pokemon.totalIV}\`% Iv ) from the auctions ?`)
                    .setColor(color)

                let msg = await interaction.followUp({ embeds: [embed], components: [row] })

                const collector = await msg.createMessageComponentCollector({
                    filter, max: 1
                })

                collector.on('collect', async i => {
                    await i.deferUpdate()
                    if (i.customId === 'yes') {
                        user.pokemons.push(data.pokemon)
                        await user.markModified(`pokemons`)
                        await user.save()
                        await Auction.deleteOne({ id: data.id, pokemon: data.pokemon, bid: data.bid })
                        return interaction.channel.send({ content: "Success!" })
                    }

                    if (i.customId === 'no') {
                        return interaction.channel.send({ content: "Ok Aborted!" })
                    }
                })

                collector.on('end', () => {
                    return interaction.editReply({ components: [rowx] })
                })
            } else {
                return interaction.followUp({ content: `You can't remove this Pokémon because it isn't present in your **auction** listings.` })
            }


        } else if (subcommand == "search") {

            let n = args.join().slice(6)
            if (interaction.options.getString('arguments')) n = interaction.options.getString('arguments')

            let a = auction,
                s = a.map((r, num) => {
                    r.pokemon.num = num + 1
                    return r
                }), zbc = {}
            n = n.split(/--|—/gmi).map(x => {
                if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true
            })

            let validOptions = ["legendary", "legend", "l", "mythical", "mythic", "myth", "m", "starter", "starters", "ultrabeast", "ub", "mega", "gigantamaxable", "primal", "megable", "alolan", "a", "galarian", "g", "gmax", "gigantamax", "shad", "shadow", "shiny", "s", "sh", "name", "n", "type", "level", "hpiv", "atkiv", "defiv", "spatkiv", "spdefiv", "speediv", "region","type"]

            for (const [key, value] of Object.entries(zbc)) {
                if (!validOptions.find(r => r == key)) return interaction.followUp(`\`--${key}\` is not a valid argument!`)
            }

            if (zbc["legendary"] || zbc["legend"] || zbc["l"]) {
                s = s.filter(e => legends.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))) || legends2.includes(capitalize(e.name.replace(/-+/g, " "))))
            }
            if (zbc["mythical"] || zbc["mythic"] || zbc["m"]) {
                s = s.filter(e => mythics.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["starter"] || zbc["starters"]) {
                s = s.filter(e => starters.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["ultrabeast"] || zbc["ub"]) {
                s = s.filter(e => ub.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["mega"]) {
                s = s.filter(e => (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) || (capitalize(e.name.toLowerCase().replace(/ +/g, "-")).startsWith("primal")))
            }
            if (zbc["gigantamaxable"]) {
                s = s.filter(e => gigantamaxable.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["primal"]) {
                s = s.filter(e => (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("primal")))
            }

            if (zbc["megable"]) {
                s = s.filter(e => megable.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["alolan"] || zbc["a"]) {
                s = s.filter(e => alolans.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["galarian"] || zbc["g"]) {
                s = s.filter(e => galarians.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["gmax"] || zbc["gigantamax"]) {
                s = s.filter(e => gmax.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["shad"] || zbc["shadow"]) {
                s = s.filter(e => shadow.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
            }
            if (zbc["shiny"] || zbc["s"]) {
                s = s.filter(e => e.pokemon.shiny)
            }
            if (zbc["name"] || zbc["n"]) s = s.filter(e => {
                if (e && (zbc['name'] || zbc["n"]) == e.pokemon.name.toLowerCase().replace(/-+/g, ' ')) return e
            })
            if (zbc["nick"] || zbc["nickname"]) s = s.filter(e => {
                if (e.nick && (zbc['nick'] || zbc["nickname"]) == e.pokemon.nick.toLowerCase().replace(/-+/g, ' ')) return e
            })
            if (zbc['type']) s = s.filter(e => {
                if (e.pokemon.rarity.toLowerCase().split(" | ").includes(zbc['type'])) return e
            })
            if (zbc['level']) {
                let a = zbc["level"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.level == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.level < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.level == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.level > a[1])
                    }
                }
            }
            if (zbc['hpiv']) {
                let a = zbc["hpiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.hp == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.hp < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.hp == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.hp > a[1])
                    }
                }
            }
            if (zbc['atkiv']) {
                let a = zbc["atkiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.atk == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.atk < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.atk == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.atk > a[1])
                    }
                }
            }
            if (zbc['defiv']) {
                let a = zbc["defiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.def == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.def < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.def == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.def > a[1])
                    }
                }
            }
            if (zbc['spatkiv']) {
                let a = zbc["spatkiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.spatk == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.spatk < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.spatk == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.spatk > a[1])
                    }
                }
            }
            if (zbc['spdefiv']) {
                let a = zbc["spdefiv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.spdef == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.spdef < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.spdef == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.spdef > a[1])
                    }
                }
            }
            if (zbc['speediv']) {
                let a = zbc["speediv"].split(" ")
                if (a.length === 1) {
                    s = s.filter(e => e.pokemon.speed == a[0])
                } else if (a.length > 1) {
                    if (a[0] === "<") {
                        s = s.filter(e => e.pokemon.speed < a[1])
                    }
                    if (a[0] === "=") {
                        s = s.filter(e => e.pokemon.speed == a[1])
                    }
                    if (a[0] === ">") {
                        s = s.filter(e => e.pokemon.speed > a[1])
                    }
                }
            }
            if (zbc["region"]) {
                let a = zbc["region"].split(" ")
                if (a[0] === "kanto") {
                    s = s.filter(e => kanto.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                }
                if (a[0] === "johto") {
                    s = s.filter(e => johto.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                }
                if (a[0] === "hoenn") {
                    s = s.filter(e => hoenn.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                }
                if (a[0] === "sinnoh") {
                    s = s.filter(e => sinnoh.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                }
                if (a[0] === "unova") {
                    s = s.filter(e => unova.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                }
                if (a[0] === "kalos") {
                    s = s.filter(e => kalos.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                }
                if (a[0] === "alola") {
                    s = s.filter(e => alola.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                }
                if (a[0] === "galar") {
                    s = s.filter(e => galar.includes(capitalize(e.pokemon.name.replace(/-+/g, " "))))
                }
            }

            if (zbc['order'] || zbc['o']) {
                let order = zbc['order'] || zbc['o']
                if (order == "price a") {
                    s = s.sort((a, b) => { return parseFloat(a.pokemon.price) - parseFloat(b.pokemon.price) });
                }
                else if (order == "price d") {
                    s = s.sort((a, b) => { return parseFloat(b.pokemon.price) - parseFloat(a.pokemon.price) });
                }
                else if (order == "iv") {
                    s = s.sort((a, b) => { return parseFloat(b.pokemon.totalIV) - parseFloat(a.pokemon.totalIV) });
                }
                else if (order == "alphabet") {
                    s = s.sort((a, b) => {
                        if (a.pokemon.name < b.pokemon.name) { return -1 }
                        if (a.pokemon.name > b.pokemon.name) { return 1 }
                        return 0;
                    })
                }
            }
            let x = 0, y = 15
            let txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Bid: ${item.bid.toLocaleString()} ${item.bid == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")

            if (txt.length == 0) txt = "Found no auction pokémons matching this search !"

            let embed = new MessageEmbed()
                .setAuthor(`💰 ・ ${client.user.username} Auctions`)
                .setDescription(txt)
                .setColor(color)

            let msg = await interaction.followUp({ embeds: [embed], components: [button] })

            const collector = await msg.createMessageComponentCollector({
                filter, time: 60000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'forward') {
                    x += 15, y += 15
                    if (!auction[x]) return interaction.channel.send({ content: `<@${interaction.user.id}> , auction doesn't have any more pokémons !`, ephemeral: true })
                    txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Bid: ${item.bid.toLocaleString()} ${item.bid == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")
                    if (txt.length == 0) {
                        return interaction.channel.send({ content: `<@${interaction.user.id}> , auction doesn't have any more pokémons !`, ephemeral: true })
                    }

                    let Embed = new MessageEmbed()
                        .setAuthor(`💰 ・ ${client.user.username} Auctions`)
                        .setDescription(txt)
                        .setColor(color)

                    msg.edit({ embeds: [Embed] })
                }
                if (i.customId === 'backward') {
                    x -= 15, y -= 15
                    if (!auction[x]) return interaction.channel.send({ content: `<@${interaction.user.id}> , auction doesn't have any less pokémons !`, ephemeral: true })
                    txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Bid: ${item.bid.toLocaleString()} ${item.bid == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")
                    if (txt.length == 0) return interaction.channel.send({ content: `<@${interaction.user.id}> , auction doesn't have any less pokémons !`, ephemeral: true })

                    let Embed = new MessageEmbed()
                        .setAuthor(`💰 ・ ${client.user.username} Auctions`)
                        .setDescription(txt)
                        .setColor(color)

                    msg.edit({ embeds: [Embed] })
                }

                if (i.customId == "pageTravel") {
                    let msgx = await interaction.channel.send(`<@${interaction.user.id}>, you have 30 seconds, send __numbers__ in chat to navigate to pages, simply type \`end\` to exit from **Page Travelling** !`)

                    const filterx = (message) => message.author.id == interaction.user.id
                    const collectorx = interaction.channel.createMessageCollector({ filter: filterx, time: 30000 })

                    collectorx.on('collect', async (m) => {
                        let c = m.content
                        if (c.toLowerCase() == "end") {
                            return collectorx.stop()
                        }
                        if (!isNaN(c)) {
                            c = parseInt(c)
                        } else {
                            return
                        }
                    })
                    collectorx.on('end', () => {
                        msgx.delete()
                    })
                }
            })
            collector.on('end', () => {
                msg.edit({ components: [buttonx] }).catch(() => { })
            })



        } else {
            return
        }
    }
}