const Market = require('../../models/market.js')
const Quests = require('../../models/quests.js')
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const Discord = require('discord.js')
const User = require('../../models/user.js')
const { readFileSync } = require('fs')
const { get } = require('request-promise-native')
const kanto = readFileSync("./db/kanto.txt").toString().trim().split("\n").map(r => r.trim())
const johto = readFileSync("./db/johto.txt").toString().trim().split("\n").map(r => r.trim())
const hoenn = readFileSync("./db/hoenn.txt").toString().trim().split("\n").map(r => r.trim())
const sinnoh = readFileSync("./db/sinnoh.txt").toString().trim().split("\n").map(r => r.trim())
const unova = readFileSync("./db/unova.txt").toString().trim().split("\n").map(r => r.trim())
const kalos = readFileSync("./db/kalos.txt").toString().trim().split("\n").map(r => r.trim())
const alola = readFileSync("./db/alola.txt").toString().trim().split("\n").map(r => r.trim())
const galar = readFileSync("./db/galar.txt").toString().trim().split("\n").map(r => r.trim())
const legends = readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim())
const legends2 = readFileSync("./db/legends2.txt").toString().trim().split("\n").map(r => r.trim())
const mythics = readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim())
const alolans = readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim())
const starters = readFileSync("./db/starters.txt").toString().trim().split("\n").map(r => r.trim())
const ub = readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim())
const galarians = readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim())
const gmax = readFileSync("./db/gmax.txt").toString().trim().split("\n").map(r => r.trim())
const shadow = readFileSync("./db/shadow.txt").toString().trim().split("\n").map(r => r.trim())
const megable = readFileSync("./db/megable.txt").toString().trim().split("\n").map(r => r.trim())
const Shiny = require('../../db/shiny.js')
const Gen8 = require('../../db/gen8.js')
const Forms = require('../../db/forms.js')
const Galarians = require('../../db/galarians.js')
const Mega = require('../../db/mega.js')
const Gmax = require('../../db/gmax.js')
const ShinyMega = require('../../db/mega-shiny.js')
const Shadow = require('../../db/shadow.js')
const Primal = require('../../db/primal.js')
const Concept = require('../../db/concept.js')
const Pokemons = require('../../db/pokemons.js')
const shinydb = require('../../db/shiny.js')
const megashinydb = require('../../db/mega-shiny.js')
const { capitalize } = require("../../functions.js")


module.exports = {
    name: "market",
    description: "Buy items from Market!",
    options: [
        {
            type: 'SUB_COMMAND',
            name: "search",
            description: "Search market for a [specific] pokemon(s)!",
            options: [
                {
                    name: 'arguments',
                    description: "(IF) Provide valid arguments to narrow down search result !",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "info",
            description: "Take a look at the Pokémon's stats listed on markets.",
            options: [
                {
                    name: 'id',
                    description: "Provide market id of the pokémon which you would like to see!",
                    type: 4,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "buy",
            description: "Buy a Pokémon from the markets.",
            options: [
                {
                    name: 'id',
                    description: "Provide market id of the pokémon which you would like to buy!",
                    type: 4,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "list",
            description: "List your pokémon on the markets.",
            options: [
                {
                    name: 'id',
                    description: "Provide id of your pokémon which you would like to list!",
                    type: 4,
                    required: true
                },
                {
                    name: 'price',
                    description: "Provide price at which you would like to list you pokémon!",
                    type: 4,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'listings',
            description: 'Check all your pokémons listed on the markets.',
            options: [
                {
                    name: 'arguments',
                    description: "(IF) Provide valid arguments to narrow down search result !",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'remove',
            description: 'Remove your listed pokémon from the markets.',
            options: [
                {
                    name: "id",
                    description: 'Provide market id of the pokémon which you would like to remove!',
                    type: 4,
                    required: true
                }
            ]
        }
    ],
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        const [subcommand] = args

        if (subcommand == "remove") {

            let market = await Market.find()
            market = market.map((r, i) => {
                r.num = i + 1
                return r
            }).filter(r => r.id === user.id)

            let id = interaction.options.getInteger('id')
            if (!id) return

            if (!market.find(r => r.num === id)) return interaction.followUp({ content: `\`N${id}\` Unable to find that pokémon your market listings !` })

            num = id
            let data = market.find(r => r.num === id)

            if (data) {

                let embed = new MessageEmbed()
                    .setAuthor(`🛒 ・ ${client.user.username} Market`)
                    .setDescription(`${interaction.user.tag}\nAre you sure you want to remove your **Level ${data.pokemon.level} ${data.pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${data.pokemon.totalIV}\`% Iv ) from the markets ?`)
                    .setColor(color)

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
                            .setCustomId("disabledYes")
                            .setDisabled(),
                        new MessageButton()
                            .setLabel("NO")
                            .setStyle("DANGER")
                            .setCustomId("disabledNo")
                            .setDisabled()
                    )

                let msg = await interaction.followUp({ embeds: [embed], components: [row] })
                client.collector.push(interaction.user.id)

                const filter = async (inter) => {
                    if (interaction.user.id == inter.user.id) return true
                    else {
                        await inter.deferUpdate()
                        inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                        return false
                    }
                }

                const collector = msg.createMessageComponentCollector({
                    filter, max: 1, time: 30000
                })

                collector.on('collect', async i => {
                    await i.deferUpdate()
                    if (i.customId === 'yes') {
                        user.pokemons.push(data.pokemon)
                        await user.markModified(`pokemons`)
                        await user.save().catch(() => { })
                        await Market.deleteOne({ id: data.id, pokemon: data.pokemon, price: data.price })
                        return interaction.channel.send({ content: "Success!" })
                    }
                    if (i.customId === 'no') {
                        return interaction.channel.send({ content: "Ok Aborted!" })
                    }
                })

                collector.on('end', () => {
                    client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                    return interaction.editReply({ components: [rowx] }).catch(() => { })
                })

            } else {
                return interaction.followUp({ content: `\`N${id}\` Unable to find that pokémon in the your market listings !` })
            }

        } else if (subcommand == "list") {

            let id = interaction.options.getInteger('id')
            let price = interaction.options.getInteger('price')
            if (isNaN(id) || isNaN(price)) return interaction.followUp({ content: `Failed to convert \`Parametre\` to \`Int\`.` })
            if (price < 0) return interaction.followUp(`\`${price}\` is not a valid integer !`)

            if (!id || !price) return

            num = id - 1
            if (!user.pokemons[num]) return interaction.followUp({ content: `Unable to find pokémon N\`${id}\` in your collection !` })
            if (price > 10000000) return interaction.followUp({ content: `You cannot list your pokémon on the markets for more than **\`10,000,000\`** credits !` })

            let embed = new MessageEmbed()
                .setAuthor(`🛒 ・ ${client.user.username} Market`)
                .setDescription(`${interaction.user.tag}\nAre you sure you want to list your **Level ${user.pokemons[num].level} ${user.pokemons[num].name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}**  ( \`${user.pokemons[num].totalIV}\`% IV ) on the markets ?\n**Price**: ${price.toLocaleString()}`)
                .setColor(color)

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


            let msg = await interaction.followUp({ embeds: [embed], components: [row] })
            client.collector.push(interaction.user.id)

            const filter = async (inter) => {
                if (interaction.user.id == inter.user.id) return true
                else {
                    await inter.deferUpdate()
                    inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                    return false
                }
            }

            const collector = msg.createMessageComponentCollector({
                filter, max: 1, time: 30000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'yes') {
                    let newDoc = new Market({
                        id: interaction.user.id,
                        pokemon: user.pokemons[num],
                        price: price
                    })
                    user.pokemons.splice(num, 1)
                    await newDoc.save().catch(e => console.log(e))
                    let userQuest = await Quests.findOne({ id: interaction.user.id })
                    if (userQuest) {
                        if (userQuest.market.listings >= 10) {
                            userQuest.market.listings = 0
                            user.balance += 1000
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the market quest ( **list 10 pokémons on market** ) and you were rewarded with \`1,000\` credits !`)
                        } else userQuest.market.listings += 1
                        await userQuest.save().catch(() => { })
                    }
                    await user.save().catch(e => console.log(e))
                    return interaction.channel.send({ content: "Success!" })
                }

                if (i.customId === 'no') {
                    return interaction.channel.send({ content: "Ok Aborted!" })
                }
            })

            collector.on('end', () => {
                client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                interaction.editReply({ components: [rowx] })
                return
            })


        } else if (subcommand == "buy") {
            let market = await Market.find()
            let id = interaction.options.getInteger('id'), num = id - 1
            if (isNaN(id)) return interaction.followUp({ content: `Failed to convert \`Parametre\` to \`Int\`.` })
            if (!market[num]) return interaction.followUp({ content: `\`${id}\` Unable to find that pokémon in the markets !` })

            let check = await Market.findOne({ id: user.id, pokemon: market[num].pokemon, price: market[num].price })
            if (check) return interaction.followUp({ content: `**Strange** ! You wanna buy with your own pokémon ?!` })

            if (market[num].price > user.balance) return interaction.followUp({ content: `You don't have enough ${market[num].price == 1 ? "credit" : "credits"} to buy **Level ${market[num].pokemon.level} ${market[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** !` })


            let vmsg = `Your **Level ${market[num].pokemon.level} ${market[num].pokemon.name} ( \`${market[num].pokemon.totalIV}\`% Iv )** has been bought by ${interaction.user.tag} and you have received \`${market[num].price.toLocaleString()}\` ${market[num].price == 1 ? "credit" : "credits"} !`

            let embed = new MessageEmbed()
                .setAuthor(`🛒 ・ ${client.user.username} Market`)
                .setDescription(`${interaction.user.tag}\nAre you sure you want to buy **Level ${market[num].pokemon.level} ${market[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${market[num].pokemon.totalIV}\`% IV ) from the markets ?\n**Price**: ${market[num].price.toLocaleString()}  ${market[num].price == 1 ? "credit" : "credits"}`)
                .setColor(color)

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


            let msg = await interaction.followUp({ embeds: [embed], components: [row] })
            client.collector.push(interaction.user.id)

            const filter = async (inter) => {
                if (interaction.user.id == inter.user.id) return true
                else {
                    await inter.deferUpdate()
                    inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                    return false
                }
            }

            const collector = msg.createMessageComponentCollector({
                filter, max: 1, time: 30000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'yes') {
                    user.pokemons.push(market[num].pokemon)
                    user.balance = user.balance - market[num].price
                    await user.markModified(`pokemons`)
                    let userQuest = await Quests.findOne({ id: interaction.user.id })
                    if (userQuest) {
                        if (userQuest.market.buyings >= 10) {
                            userQuest.market.buyings = 0
                            user.balance += 1000
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the market quest ( **buy 10 pokémons on market** ) and you were rewarded with \`1,000\` credits !`)
                        } else userQuest.market.buyings += 1
                        await userQuest.save().catch(() => { })
                    }
                    await user.save().catch(() => { })
                    let userd = await User.findOne({ id: market[num].id })
                    await Market.deleteOne({ id: market[num].id, pokemon: market[num].pokemon, price: market[num].price })
                    interaction.channel.send({ content: "Success!" })
                    if (userd) {
                        userd.balance += market[num].price
                        await userd.save().catch(() => { })
                        let userDD = client.users.cache.get(market[num].id)
                        if (userDD) userDD.send(vmsg).catch(e => {
                            if (e.message.toLowerCase() === "cannot send messages to this user") return
                            return
                        })
                    }
                    return
                }

                if (i.customId === 'no') {
                    return interaction.channel.send({ content: "Ok Aborted!" })
                }
            })

            collector.on('end', () => {
                client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                interaction.editReply({ components: [rowx] })
                return
            })
        } else if (subcommand == "info") {

            let market = await Market.find()
            let id = interaction.options.getInteger('id'), num = id - 1
            if (!market[id]) return interaction.followUp({ content: `\`N${id}\` Unable to find that pokémon in the markets !` })

            let a = market, s = a.map((r, num) => { r.pokemon.num = num + 1; return r })

            let gen8 = Gen8.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase())
            let form = Forms.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase())
            let concept = Concept.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase())
            let galarian = Galarians.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase().replace("galarian-", ""))
            let mega = Mega.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("mega-", "").toLowerCase())
            let shadow = Shadow.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("shadow-", "").toLowerCase())
            let primal = Primal.find(e => e.name === market[num].pokemon.name.replace("primal-", "").toLowerCase())
            let pokemon = Pokemons.find(e => e.name.english === market[num].pokemon.name.toLowerCase())
            let gmax = Gmax.find(e => e.name.toLowerCase() === market[num].pokemon.name.replace("gigantamax-", "").toLowerCase())

            let level = market[num].pokemon.level
            let hp = market[num].pokemon.hp
            let atk = market[num].pokemon.atk
            let def = market[num].pokemon.def
            let spatk = market[num].pokemon.spatk
            let spdef = market[num].pokemon.spdef
            let speed = market[num].pokemon.speed
            let url = market[num].pokemon.url
            let helditem = []
            if (market[num].pokemon.helditem) helditem = market[num].pokemon.helditem.join(" | ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
            if (helditem.length == 0 || !helditem) helditem = undefined
            if (market[num].pokemon.shiny == true) {
                if (market[num].pokemon.name.toLowerCase().startsWith("mega-")) url = megashinydb.find(e => e.name === market[num].pokemon.name.replace("mega-", "").toLowerCase()).url
                else url = shinydb.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()).url
                if (url == undefined) url = market[num].pokemon.url
            }
            let types = `${market[num].pokemon.rarity}`
            let nature = market[num].pokemon.nature.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
            let totalIV = market[num].pokemon.totalIV
            let pokename = market[num].pokemon.name.toLowerCase().replace(" ", "-")

            if (pokename.startsWith("alolan-")) {
                pokename = pokename.replace("alolan-", "");
                pokename = `${pokename}-alola`
            }
            if (pokename.startsWith("mega-")) {
                pokename = pokename.replace("mega-", "");
                pokename = `${pokename}`
            }

            let name
            if (market[num].pokemon.shiny == true) name = `⭐ ${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
            else name = `${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`

            let xp = `${market[num].pokemon.xp}/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 * level - 89}`
            let hpBase, atkBase, defBase, spatkBase, spdefBase, speedBase
            let price = `${market[num].price.toLocaleString()}  ${market[num].price == 1 ? "credit" : "credits"}`

            if (gen8) {
                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = gen8.type
                await market[num].save().catch(() => { })

                type = market[num].pokemon.rarity
                hpBase = gen8.hp,
                    atkBase = gen8.atk,
                    defBase = gen8.def,
                    spatkBase = gen8.spatk,
                    spdefBase = gen8.spdef,
                    speedBase = gen8.speed
            } else if (form) {
                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = form.type
                await market[num].save().catch(() => { })


                type = market[num].pokemon.rarity
                hpBase = form.hp,
                    atkBase = form.atk,
                    defBase = form.def,
                    spatkBase = form.spatk,
                    spdefBase = form.spdef,
                    speedBase = form.speed
            } else if (concept) {
                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = concept.type
                await market[num].save().catch(() => { })


                type = market[num].pokemon.rarity
                hpBase = concept.hp,
                    atkBase = concept.atk,
                    defBase = concept.def,
                    spatkBase = concept.spatk,
                    spdefBase = concept.spdef,
                    speedBase = concept.speed
            } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = galarian.type
                await market[num].save().catch(() => { })


                type = market[num].pokemon.rarity
                hpBase = galarian.hp,
                    atkBase = galarian.atk,
                    defBase = galarian.def,
                    spatkBase = galarian.spatk,
                    spdefBase = galarian.spdef,
                    speedBase = galarian.speed
            } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = mega.type
                await market[num].save().catch(() => { })


                type = market[num].pokemon.rarity
                hpBase = mega.hp,
                    atkBase = mega.atk,
                    defBase = mega.def,
                    spatkBase = mega.spatk,
                    spdefBase = mega.spdef,
                    speedBase = mega.speed
            } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = shadow.type
                await market[num].save().catch(() => { })


                type = market[num].pokemon.rarity
                hpBase = shadow.hp,
                    atkBase = shadow.atk,
                    defBase = shadow.def,
                    spatkBase = shadow.spatk,
                    spdefBase = shadow.spdef,
                    speedBase = shadow.speed
            } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = primal.type
                await market[num].save().catch(() => { })

                type = market[num].pokemon.rarity
                hpBase = primal.hp,
                    atkBase = primal.atk,
                    defBase = primal.def,
                    spatkBase = primal.spatk,
                    spdefBase = primal.spdef,
                    speedBase = primal.speed
            } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = gmax.type
                await market[num].save().catch(() => { })


                type = market[num].pokemon.rarity
                hpBase = gmax.hp,
                    atkBase = gmax.atk,
                    defBase = gmax.def,
                    spatkBase = gmax.spatk,
                    spdefBase = gmax.spdef,
                    speedBase = gmax.speed
            } else if (pokemon) {
                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = pokemon.type
                await market[num].save().catch(() => { })


                type = market[num].pokemon.rarity
                hpBase = pokemon.hp,
                    atkBase = pokemon.atk,
                    defBase = pokemon.def,
                    spatkBase = pokemon.spatk,
                    spdefBase = pokemon.spdef,
                    speedBase = pokemon.speed
            } else {

                let t = await get({
                    url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                    json: true
                }).catch((err) => {
                    collector.stop()
                    return interaction.channel.send({ content: "An error occured in info*ing* the pokemon. Please contact the developers of the bot!" })
                })
                hpBase = t.stats[0].base_stat,
                    atkBase = t.stats[1].base_stat,
                    defBase = t.stats[2].base_stat,
                    spatkBase = t.stats[3].base_stat,
                    spdefBase = t.stats[4].base_stat,
                    speedBase = t.stats[5].base_stat
            }

            let hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1)
            let atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9)
            let defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1)
            let spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1)
            let spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1)
            let speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)


            let Embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num + 1}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${s.length}\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)


            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("⬅")
                        .setStyle("SUCCESS")
                        .setCustomId("backward"),
                    new MessageButton()
                        .setLabel("➡")
                        .setStyle("SUCCESS")
                        .setCustomId("forward"),
                    new MessageButton()
                        .setLabel("#")
                        .setStyle("SUCCESS")
                        .setCustomId("pageTravel")
                )

            let rowx = new MessageActionRow()
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
                    new MessageButton()
                        .setLabel("#")
                        .setStyle("SUCCESS")
                        .setCustomId("disabledPageTravel")
                        .setDisabled()
                )

            let msg = await interaction.followUp({ embeds: [Embed], components: [row] })

            const filter = async (inter) => {
                if (interaction.user.id == inter.user.id) return true
                if (interaction.user.id != inter.user.id) {
                    await inter.deferUpdate()
                    let m = await inter.channel.send({ content: "Only **Command Author** can interact with buttons!", ephermal: true })
                    setTimeout(() => m.delete(), 4000)
                    return false
                }
            }

            const collector = await msg.createMessageComponentCollector({
                filter, time: 60000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'forward') {

                    num += 1
                    if (num >= s.length - 1) num = 0

                    level = market[num].pokemon.level,
                        hp = market[num].pokemon.hp,
                        atk = market[num].pokemon.atk,
                        def = market[num].pokemon.def,
                        spatk = market[num].pokemon.spatk,
                        spdef = market[num].pokemon.spdef,
                        speed = market[num].pokemon.speed,
                        url = market[num].pokemon.url,
                        helditem = []
                    if (market[num].pokemon.helditem) helditem = market[num].pokemon.helditem.join(" | ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                    if (helditem.length == 0 || !helditem) helditem = undefined
                    if (market[num].pokemon.shiny == true) {
                        if (market[num].pokemon.name.toLowerCase().startsWith("mega-")) url = megashinydb.find(e => e.name === market[num].pokemon.name.replace("mega-", "").toLowerCase()).url
                        if (url == undefined) url = shinydb.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()).url
                        else url = market[num].pokemon.url
                    }
                    types = `${market[num].pokemon.rarity}`,
                        nature = market[num].pokemon.nature.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                        totalIV = market[num].pokemon.totalIV,
                        pokename = market[num].pokemon.name.toLowerCase().replace(" ", "-")

                    if (pokename.startsWith("alolan-")) {
                        pokename = pokename.replace("alolan-", "");
                        pokename = `${pokename}-alola`
                    }
                    if (pokename.startsWith("mega-")) {
                        pokename = pokename.replace("mega-", "");
                        pokename = `${pokename}`
                    }

                    if (market[num].pokemon.shiny == true) name = `⭐ ${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
                    else name = `${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`

                    xp = `${market[num].pokemon.xp}/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 * level - 89}`,
                        price = `${market[num].price.toLocaleString()}  ${market[num].price == 1 ? "credit" : "credits"}`

                    if (gen8) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = gen8.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = gen8.hp,
                            atkBase = gen8.atk,
                            defBase = gen8.def,
                            spatkBase = gen8.spatk,
                            spdefBase = gen8.spdef,
                            speedBase = gen8.speed
                    } else if (form) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = form.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = form.hp,
                            atkBase = form.atk,
                            defBase = form.def,
                            spatkBase = form.spatk,
                            spdefBase = form.spdef,
                            speedBase = form.speed
                    } else if (concept) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = concept.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = concept.hp,
                            atkBase = concept.atk,
                            defBase = concept.def,
                            spatkBase = concept.spatk,
                            spdefBase = concept.spdef,
                            speedBase = concept.speed
                    } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = galarian.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = galarian.hp,
                            atkBase = galarian.atk,
                            defBase = galarian.def,
                            spatkBase = galarian.spatk,
                            spdefBase = galarian.spdef,
                            speedBase = galarian.speed
                    } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = mega.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = mega.hp,
                            atkBase = mega.atk,
                            defBase = mega.def,
                            spatkBase = mega.spatk,
                            spdefBase = mega.spdef,
                            speedBase = mega.speed
                    } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = shadow.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = shadow.hp,
                            atkBase = shadow.atk,
                            defBase = shadow.def,
                            spatkBase = shadow.spatk,
                            spdefBase = shadow.spdef,
                            speedBase = shadow.speed
                    } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = primal.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = primal.hp,
                            atkBase = primal.atk,
                            defBase = primal.def,
                            spatkBase = primal.spatk,
                            spdefBase = primal.spdef,
                            speedBase = primal.speed
                    } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = gmax.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = gmax.hp,
                            atkBase = gmax.atk,
                            defBase = gmax.def,
                            spatkBase = gmax.spatk,
                            spdefBase = gmax.spdef,
                            speedBase = gmax.speed
                    } else if (pokemon) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = pokemon.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = pokemon.hp,
                            atkBase = pokemon.atk,
                            defBase = pokemon.def,
                            spatkBase = pokemon.spatk,
                            spdefBase = pokemon.spdef,
                            speedBase = pokemon.speed
                    } else {

                        let t = await get({
                            url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                            json: true
                        }).catch((err) => {
                            collector.stop()
                            return interaction.channel.send({ content: "An error occured in info*ing* the pokemon. Please contact the developers of the bot!" })
                        })
                        hpBase = t.stats[0].base_stat,
                            atkBase = t.stats[1].base_stat,
                            defBase = t.stats[2].base_stat,
                            spatkBase = t.stats[3].base_stat,
                            spdefBase = t.stats[4].base_stat,
                            speedBase = t.stats[5].base_stat
                    }

                    hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                        atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                        defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                        spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                        spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                        speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

                    let Embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num + 1}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${s.length}\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)

                    return interaction.editReply({ embeds: [Embed] })
                }

                if (i.customId === 'backward') {
                    num -= 1
                    if (num <= -1) num = s.length - 1

                    level = market[num].pokemon.level,
                        hp = market[num].pokemon.hp,
                        atk = market[num].pokemon.atk,
                        def = market[num].pokemon.def,
                        spatk = market[num].pokemon.spatk,
                        spdef = market[num].pokemon.spdef,
                        speed = market[num].pokemon.speed,
                        url = market[num].pokemon.url,
                        helditem = []
                    if (market[num].pokemon.helditem) helditem = market[num].pokemon.helditem.join(" | ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                    if (helditem.length == 0 || !helditem) helditem = undefined
                    if (market[num].pokemon.shiny == true) {
                        if (market[num].pokemon.name.toLowerCase().startsWith("mega-")) url = megashinydb.find(e => e.name === market[num].pokemon.name.replace("mega-", "").toLowerCase()).url
                        if (url == undefined) url = shinydb.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()).url
                        else url = market[num].pokemon.url
                    }
                    types = `${market[num].pokemon.rarity}`,
                        nature = market[num].pokemon.nature.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                        totalIV = market[num].pokemon.totalIV,
                        pokename = market[num].pokemon.name.toLowerCase().replace(" ", "-")

                    if (pokename.startsWith("alolan-")) {
                        pokename = pokename.replace("alolan-", "");
                        pokename = `${pokename}-alola`
                    }
                    if (pokename.startsWith("mega-")) {
                        pokename = pokename.replace("mega-", "");
                        pokename = `${pokename}`
                    }

                    if (market[num].pokemon.shiny == true) name = `⭐ ${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
                    else name = `${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`

                    xp = `${market[num].pokemon.xp}/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 * level - 89}`,
                        price = `${market[num].price.toLocaleString()}  ${market[num].price == 1 ? "credit" : "credits"}`

                    if (gen8) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = gen8.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = gen8.hp,
                            atkBase = gen8.atk,
                            defBase = gen8.def,
                            spatkBase = gen8.spatk,
                            spdefBase = gen8.spdef,
                            speedBase = gen8.speed
                    } else if (form) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = form.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = form.hp,
                            atkBase = form.atk,
                            defBase = form.def,
                            spatkBase = form.spatk,
                            spdefBase = form.spdef,
                            speedBase = form.speed
                    } else if (concept) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = concept.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = concept.hp,
                            atkBase = concept.atk,
                            defBase = concept.def,
                            spatkBase = concept.spatk,
                            spdefBase = concept.spdef,
                            speedBase = concept.speed
                    } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = galarian.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = galarian.hp,
                            atkBase = galarian.atk,
                            defBase = galarian.def,
                            spatkBase = galarian.spatk,
                            spdefBase = galarian.spdef,
                            speedBase = galarian.speed
                    } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = mega.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = mega.hp,
                            atkBase = mega.atk,
                            defBase = mega.def,
                            spatkBase = mega.spatk,
                            spdefBase = mega.spdef,
                            speedBase = mega.speed
                    } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = shadow.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = shadow.hp,
                            atkBase = shadow.atk,
                            defBase = shadow.def,
                            spatkBase = shadow.spatk,
                            spdefBase = shadow.spdef,
                            speedBase = shadow.speed
                    } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = primal.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = primal.hp,
                            atkBase = primal.atk,
                            defBase = primal.def,
                            spatkBase = primal.spatk,
                            spdefBase = primal.spdef,
                            speedBase = primal.speed
                    } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = gmax.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = gmax.hp,
                            atkBase = gmax.atk,
                            defBase = gmax.def,
                            spatkBase = gmax.spatk,
                            spdefBase = gmax.spdef,
                            speedBase = gmax.speed
                    } else if (pokemon) {
                        if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = pokemon.type
                        await market[num].save().catch(() => { })


                        type = market[num].pokemon.rarity
                        hpBase = pokemon.hp,
                            atkBase = pokemon.atk,
                            defBase = pokemon.def,
                            spatkBase = pokemon.spatk,
                            spdefBase = pokemon.spdef,
                            speedBase = pokemon.speed
                    } else {

                        let t = await get({
                            url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                            json: true
                        }).catch((err) => {
                            collector.stop()
                            return interaction.channel.send({ content: "An error occured in info*ing* the pokemon. Please contact the developers of the bot!" })
                        })
                        hpBase = t.stats[0].base_stat,
                            atkBase = t.stats[1].base_stat,
                            defBase = t.stats[2].base_stat,
                            spatkBase = t.stats[3].base_stat,
                            spdefBase = t.stats[4].base_stat,
                            speedBase = t.stats[5].base_stat
                    }

                    hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                        atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                        defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                        spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                        spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                        speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

                    let Embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num + 1}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${s.length}\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)

                    interaction.editReply({ embeds: [Embed] })
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
                            if (c <= 0 || c > s.length) return
                            num = c - 1
                            if (num <= -1 || num >= s.length) return interaction.channel.send({ content: "Market doesn't have a pokémon on that number!" })

                            level = market[num].pokemon.level,
                                hp = market[num].pokemon.hp,
                                atk = market[num].pokemon.atk,
                                def = market[num].pokemon.def,
                                spatk = market[num].pokemon.spatk,
                                spdef = market[num].pokemon.spdef,
                                speed = market[num].pokemon.speed,
                                url = market[num].pokemon.url,
                                helditem = []
                            if (market[num].pokemon.helditem) helditem = market[num].pokemon.helditem.join(" | ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                            if (helditem.length == 0 || !helditem) helditem = undefined
                            if (market[num].pokemon.shiny == true) {
                                if (market[num].pokemon.name.toLowerCase().startsWith("mega-")) url = megashinydb.find(e => e.name === market[num].pokemon.name.replace("mega-", "").toLowerCase()).url
                                if (url == undefined) url = shinydb.find(e => e.name.toLowerCase() === market[num].pokemon.name.toLowerCase()).url
                                else url = market[num].pokemon.url
                            }
                            types = `${market[num].pokemon.rarity}`,
                                nature = market[num].pokemon.nature.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                                totalIV = market[num].pokemon.totalIV,
                                pokename = market[num].pokemon.name.toLowerCase().replace(" ", "-")

                            if (pokename.startsWith("alolan-")) {
                                pokename = pokename.replace("alolan-", "");
                                pokename = `${pokename}-alola`
                            }
                            if (pokename.startsWith("mega-")) {
                                pokename = pokename.replace("mega-", "");
                                pokename = `${pokename}`
                            }
                            if (market[num].pokemon.shiny == true) name = `⭐ ${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
                            else name = `${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`

                            xp = `${market[num].pokemon.xp}/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 * level - 89}`,
                                price = `${market[num].price.toLocaleString()}  ${market[num].price == 1 ? "credit" : "credits"}`

                            if (gen8) {
                                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = gen8.type
                                await market[num].save().catch(() => { })


                                type = market[num].pokemon.rarity
                                hpBase = gen8.hp,
                                    atkBase = gen8.atk,
                                    defBase = gen8.def,
                                    spatkBase = gen8.spatk,
                                    spdefBase = gen8.spdef,
                                    speedBase = gen8.speed
                            } else if (form) {
                                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = form.type
                                await market[num].save().catch(() => { })


                                type = market[num].pokemon.rarity
                                hpBase = form.hp,
                                    atkBase = form.atk,
                                    defBase = form.def,
                                    spatkBase = form.spatk,
                                    spdefBase = form.spdef,
                                    speedBase = form.speed
                            } else if (concept) {
                                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = concept.type
                                await market[num].save().catch(() => { })


                                type = market[num].pokemon.rarity
                                hpBase = concept.hp,
                                    atkBase = concept.atk,
                                    defBase = concept.def,
                                    spatkBase = concept.spatk,
                                    spdefBase = concept.spdef,
                                    speedBase = concept.speed
                            } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = galarian.type
                                await market[num].save().catch(() => { })


                                type = market[num].pokemon.rarity
                                hpBase = galarian.hp,
                                    atkBase = galarian.atk,
                                    defBase = galarian.def,
                                    spatkBase = galarian.spatk,
                                    spdefBase = galarian.spdef,
                                    speedBase = galarian.speed
                            } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = mega.type
                                await market[num].save().catch(() => { })


                                type = market[num].pokemon.rarity
                                hpBase = mega.hp,
                                    atkBase = mega.atk,
                                    defBase = mega.def,
                                    spatkBase = mega.spatk,
                                    spdefBase = mega.spdef,
                                    speedBase = mega.speed
                            } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = shadow.type
                                await market[num].save().catch(() => { })


                                type = market[num].pokemon.rarity
                                hpBase = shadow.hp,
                                    atkBase = shadow.atk,
                                    defBase = shadow.def,
                                    spatkBase = shadow.spatk,
                                    spdefBase = shadow.spdef,
                                    speedBase = shadow.speed
                            } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = primal.type
                                await market[num].save().catch(() => { })


                                type = market[num].pokemon.rarity
                                hpBase = primal.hp,
                                    atkBase = primal.atk,
                                    defBase = primal.def,
                                    spatkBase = primal.spatk,
                                    spdefBase = primal.spdef,
                                    speedBase = primal.speed
                            } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = gmax.type
                                await market[num].save().catch(() => { })


                                type = market[num].pokemon.rarity
                                hpBase = gmax.hp,
                                    atkBase = gmax.atk,
                                    defBase = gmax.def,
                                    spatkBase = gmax.spatk,
                                    spdefBase = gmax.spdef,
                                    speedBase = gmax.speed
                            } else if (pokemon) {
                                if (market[num].pokemon.rarity == null || market[num].pokemon.rarity == undefined) market[num].pokemon.rarity = pokemon.type
                                await market[num].save().catch(() => { })


                                type = market[num].pokemon.rarity
                                hpBase = pokemon.hp,
                                    atkBase = pokemon.atk,
                                    defBase = pokemon.def,
                                    spatkBase = pokemon.spatk,
                                    spdefBase = pokemon.spdef,
                                    speedBase = pokemon.speed
                            } else {

                                let t = await get({
                                    url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                                    json: true
                                }).catch((err) => {
                                    collector.stop()
                                    return interaction.channel.send({ content: "An error occured in info*ing* the pokemon. Please contact the developers of the bot!" })
                                })
                                hpBase = t.stats[0].base_stat,
                                    atkBase = t.stats[1].base_stat,
                                    defBase = t.stats[2].base_stat,
                                    spatkBase = t.stats[3].base_stat,
                                    spdefBase = t.stats[4].base_stat,
                                    speedBase = t.stats[5].base_stat
                            }

                            hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

                            let Embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num + 1}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${s.length}\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)
                            return interaction.editReply({ embeds: [Embed] })

                        } else {
                            return
                        }
                    })
                    collectorx.on('end', () => {
                        msgx.delete()
                    })
                }
            })

            collector.on('end', async (i) => {
                return interaction.editReply({ components: [rowx] })
            })

        } else if (subcommand == "search") {

            let market = await Market.find()

            let n = args.join().slice(6)
            if (interaction.options.getString('arguments')) n = interaction.options.getString('arguments')

            let a = market,
                s = a.map((r, num) => {
                    r.pokemon.num = num + 1
                    return r
                }), zbc = {}
            n = n.split(/--|—/gmi).map(x => {
                if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true
            })

            let validOptions = ["legendary", "legend", "l", "mythical", "mythic", "myth", "m", "starter", "starters", "ultrabeast", "ub", "mega", "gigantamaxable", "primal", "megable", "alolan", "a", "galarian", "g", "gmax", "gigantamax", "shad", "shadow", "shiny", "s", "sh", "name", "n", "nick", "nickname", "fav", "favourite", "type", "level", "hpiv", "atkiv", "defiv", "spatkiv", "spdefiv", "speediv", "region", "order", "type"]

            for (const [key, value] of Object.entries(zbc)) {
                if (!validOptions.find(r => r == key)) return interaction.followUp(`\`--${key}\` is not a valid argument!`)
            }

            if (zbc["legendary"] || zbc["legend"] || zbc["l"]) {
                s = s.filter(e => legends.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())) || legends2.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
            }
            if (zbc["mythical"] || zbc["mythic"] || zbc["m"]) {
                s = s.filter(e => mythics.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
            }
            if (zbc["starter"] || zbc["starters"]) {
                s = s.filter(e => starters.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
            }
            if (zbc["ultrabeast"] || zbc["ub"]) {
                s = s.filter(e => ub.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
            }
            if (zbc["mega"]) {
                s = s.filter(e => (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) || (capitalize(e.name.toLowerCase().replace(/ +/g, "-")).startsWith("primal")))
            }
            if (zbc["gigantamaxable"]) {
                s = s.filter(e => gigantamaxable.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
            }
            if (zbc["primal"]) {
                s = s.filter(e => (capitalize(e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("primal")))
            }

            if (zbc["megable"]) {
                s = s.filter(e => megable.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
            }
            if (zbc["alolan"] || zbc["a"]) {
                s = s.filter(e => alolans.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
            }
            if (zbc["galarian"] || zbc["g"]) {
                s = s.filter(e => galarians.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
            }
            if (zbc["gmax"] || zbc["gigantamax"]) {
                s = s.filter(e => gmax.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
            }
            if (zbc["shad"] || zbc["shadow"]) {
                s = s.filter(e => shadow.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
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
                let a = zbc["region"].split(" ")
                if (a[0] === "kanto") {
                    s = s.filter(e => kanto.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                }
                if (a[0] === "johto") {
                    s = s.filter(e => johto.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                }
                if (a[0] === "hoenn") {
                    s = s.filter(e => hoenn.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                }
                if (a[0] === "sinnoh") {
                    s = s.filter(e => sinnoh.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                }
                if (a[0] === "unova") {
                    s = s.filter(e => unova.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                }
                if (a[0] === "kalos") {
                    s = s.filter(e => kalos.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                }
                if (a[0] === "alola") {
                    s = s.filter(e => alola.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                }
                if (a[0] === "galar") {
                    s = s.filter(e => galar.includes(e.pokemon.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
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
                        if (a.pokemon.name < b.pokemon.name) { return -1; }
                        if (a.pokemon.name > b.pokemon.name) { return 1; }
                        return 0;
                    })
                }
            }
            let x = 0, y = 15
            let txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${item.price.toLocaleString()} ${item.price == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")

            if (txt.length == 0) txt = "Found no market pokémons matching this search !"

            let embed = new MessageEmbed()
                .setAuthor(`🛒 ・ ${client.user.username} Market`)
                .setDescription(txt)
                .setColor(color)
                .setFooter(`Showing page 1 of ${~~(s.length / 15)} of total ${market.length} pokémons.\n`)

            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("⬅")
                        .setStyle("SUCCESS")
                        .setCustomId("backward"),
                    new MessageButton()
                        .setLabel("➡")
                        .setStyle("SUCCESS")
                        .setCustomId("forward"),
                    new MessageButton()
                        .setLabel("#")
                        .setStyle("SUCCESS")
                        .setCustomId("pageTravel")
                )

            let rowx = new MessageActionRow()
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
                    new MessageButton()
                        .setLabel("#")
                        .setStyle("SUCCESS")
                        .setCustomId("disabledPageTravel")
                        .setDisabled()
                )

            let msg = await interaction.followUp({ embeds: [embed], components: [row] })

            const filter = async (inter) => {
                if (interaction.user.id == inter.user.id) return true
                else {
                    await inter.deferUpdate()
                    inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                    return false
                }
            }

            const collector = await msg.createMessageComponentCollector({
                filter, time: 60000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'forward') {
                    x += 15, y += 15
                    if (!market[x]) x = 0, y = 15
                    txt = s.map((item, i) => `${item.pokemon.shiny ? ":star: " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${item.price.toLocaleString()} ${item.price == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")
                    if (txt.length == 0) {
                        return interaction.channel.send({ content: `<@${interaction.user.id}> , market doesn't have any more pokémons !`, ephemeral: true })
                    }

                    let Embed = new MessageEmbed()
                        .setAuthor(`🛒 ・ ${client.user.username} Market`)
                        .setDescription(txt)
                        .setColor(color)
                        .setFooter(`Showing page ${y / 15} of ${~~(s.length / 15)} of total ${market.length} pokémons.\n`)

                    msg.edit({ embeds: [Embed] })
                }
                if (i.customId === 'backward') {
                    x -= 15, y -= 15
                    if (!market[x]) y = market.length, x = y - 15
                    txt = s.map((item, i) => `${item.pokemon.shiny ? ":star: " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${item.price.toLocaleString()} ${item.price == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")
                    if (txt.length == 0) return interaction.channel.send({ content: `<@${interaction.user.id}> , market doesn't have any less pokémons !`, ephemeral: true })

                    let Embed = new MessageEmbed()
                        .setAuthor(`🛒 ・ ${client.user.username} Market`)
                        .setDescription(txt)
                        .setColor(color)
                        .setFooter(`Showing page ${y / 15} of ${~~(s.length / 15)} of total ${market.length} pokémons.\n`)

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

                            y = c * 15
                            x = y - 15
                            if (!market[y]) return
                            if (!market[x]) return
                            txt = s.map((item, i) => `${item.pokemon.shiny ? ":star: " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Price: ${item.price.toLocaleString()} ${item.price == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")
                            if (txt.length == 0) return interaction.channel.send({ content: `<@${interaction.user.id}> , market doesn't have any less pokémons !`, ephemeral: true })

                            let Embed = new MessageEmbed()
                                .setAuthor(`🛒 ・ ${client.user.username} Market`)
                                .setDescription(txt)
                                .setColor(color)
                                .setFooter(`Showing page ${y / 15} of ${~~(s.length / 15)} of total ${market.length} pokémons.\n`)

                            msg.edit({ embeds: [Embed] })
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
                msg.edit({ components: [rowx] }).catch(() => { })
            })



        } else if (subcommand == "listings") {
            let market = await Market.find()

            let n = args.join().slice(8)
            if (interaction.options.getString('arguments')) n = interaction.options.getString('arguments')

            let a = market,
                s = a.map((r, num) => {
                    r.num = num + 1
                    return r
                }).filter(r => r.id === user.id), zbc = {}
            n = n.split(/--|—/gmi).map(x => {
                if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true
            })

            let validOptions = ["legendary", "legend", "l", "mythical", "mythic", "myth", "m", "starter", "starters", "ultrabeast", "ub", "mega", "gigantamaxable", "primal", "megable", "alolan", "a", "galarian", "g", "gmax", "gigantamax", "shad", "shadow", "shiny", "s", "sh", "name", "n", "nick", "nickname", "fav", "favourite", "type", "level", "hpiv", "atkiv", "defiv", "spatkiv", "spdefiv", "speediv", "region", "type", "order"]

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
            let txt = s.map((item, i) => `${item.pokemon.shiny == true ? "⭐ " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${i + 1} |  IV: ${item.pokemon.totalIV}% | Price: ${item.price.toLocaleString()} ${item.price == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")

            if (txt.length == 0) txt = "Found no market pokémons matching this search !"

            let embed = new MessageEmbed()
                .setAuthor(`🛒 ・ ${client.user.username} Market`)
                .setDescription(txt)
                .setColor(color)

            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("⬅")
                        .setStyle("SUCCESS")
                        .setCustomId("backward"),
                    new MessageButton()
                        .setLabel("➡")
                        .setStyle("SUCCESS")
                        .setCustomId("forward"),
                    new MessageButton()
                        .setLabel("#")
                        .setStyle("SUCCESS")
                        .setCustomId("pageTravel")
                )

            let rowx = new MessageActionRow()
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
                    new MessageButton()
                        .setLabel("#")
                        .setStyle("SUCCESS")
                        .setCustomId("disabledPageTravel")
                        .setDisabled()
                )

            let msg = await interaction.followUp({ embeds: [embed], components: [row] })

            const filter = async (inter) => {
                if (interaction.user.id == inter.user.id) return true
                else {
                    await inter.deferUpdate()
                    inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                    return false
                }
            }

            const collector = await msg.createMessageComponentCollector({
                filter, time: 60000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'forward') {
                    x += 15, y += 15
                    if (!market[x]) return interaction.channel.send({ content: `<@${interaction.user.id}> , your market listings doesn't have any more pokémons !`, ephemeral: true })
                    txt = s.map((item, i) => `${item.pokemon.shiny ? ":star: " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${i + 1} | IV: ${item.pokemon.totalIV}% | Price: ${item.price.toLocaleString()} ${item.price == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")
                    if (txt.length == 0) {
                        return interaction.channel.send({ content: `<@${interaction.user.id}> , your market listings doesn't have any more pokémons !`, ephemeral: true })
                    }

                    let Embed = new MessageEmbed()
                        .setAuthor(`🛒 ・ ${client.user.username} Market`)
                        .setDescription(txt)
                        .setColor(color)

                    msg.edit({ embeds: [Embed] })
                }
                if (i.customId === 'backward') {
                    x -= 15, y -= 15
                    if (!market[x]) return interaction.channel.send({ content: `<@${interaction.user.id}> , your market listings doesn't have any less pokémons !`, ephemeral: true })
                    txt = s.map((item, i) => `${item.pokemon.shiny ? ":star: " : ""}**Level ${item.pokemon.level} ${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${i + 1} | IV: ${item.pokemon.totalIV}% | Price: ${item.price.toLocaleString()} ${item.price == 1 ? "credit" : "credits"}`).slice(x, y).join("\n")
                    if (txt.length == 0) return interaction.channel.send({ content: `<@${interaction.user.id}> , your market listings doesn't have any less pokémons !`, ephemeral: true })

                    let Embed = new MessageEmbed()
                        .setAuthor(`🛒 ・ ${client.user.username} Market`)
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
                msg.edit({ components: [rowx] }).catch(() => { })
            })
        } else {
            return
        }
    }
}
