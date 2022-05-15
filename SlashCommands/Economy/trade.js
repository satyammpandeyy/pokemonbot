const User = require('../../models/user.js')
const Trade = require('../../models/trade.js')
const Quests = require('../../models/quests.js')
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const { get } = require('request-promise-native');
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const shinydb = require('../../db/shiny.js');
const megashinydb = require('../../db/mega-shiny.js');
const Forms = require('../../db/forms.js');
const Concept = require('../../db/concept.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemons = require('../../db/pokemons.js');
const Gmax = require('../../db/gmax.js')
const { readFileSync } = require('fs')

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
const megable = readFileSync("./db/megable.txt").toString().trim().split("\n").map(r => r.trim())
const gigantamaxable = readFileSync("./db/gigantamaxable.txt").toString().trim().split("\n").map(r => r.trim())
const event = require('../../db/events.js')

module.exports = {
    name: 'trade',
    description: 'Trade your items with another trainers !',
    options: [
        {
            type: 'SUB_COMMAND',
            name: "start",
            description: "Start a trade with another trainer !",
            options: [
                {
                    name: 'user',
                    description: "Mention the user whom you want to trade with !",
                    type: 'USER',
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "add",
            description: "Add items to ongoing trade !",
            options: [
                {
                    name: 'type',
                    description: "Select the type of item to add !",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Credit(s)',
                            value: 'c'
                        },
                        {
                            name: "Redeem(s)",
                            value: 'r'
                        },
                        {
                            name: "Pokémon(s)",
                            value: 'p'
                        }
                    ]
                },
                {
                    name: 'value',
                    description: 'Provide the value !',
                    type: 3,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "addall",
            description: "Add all items to ongoing trade !",
            options: [
                {
                    name: 'type',
                    description: "Select the type of item to add !",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Credit(s)',
                            value: 'c'
                        },
                        {
                            name: "Redeem(s)",
                            value: 'r'
                        },
                        {
                            name: "Pokémon(s)",
                            value: 'p'
                        }
                    ]
                },
                {
                    name: 'filters',
                    description: 'Provide valid filters to narrow down pokemon addall.',
                    type: 3,
                    required: false
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "info",
            description: "Info a pokemon added to the trade !",
            options: [
                {
                    name: 'number',
                    description: "Provide the number of the pokemon to info!",
                    type: 4,
                    required: true
                }
            ]
        },
        // {
        //     type: 'SUB_COMMAND',
        //     name: "remove",
        //     description: "Remove items from ongoing trade !",
        //     options: [
        //         {
        //             name: 'type',
        //             description: "Select the type of item to remove !",
        //             type: 3,
        //             required: true,
        //             choices: [
        //                 {
        //                     name: 'Credit(s)',
        //                     value: 'c'
        //                 },
        //                 {
        //                     name: "Redeem(s)",
        //                     value: 'r'
        //                 },
        //                 {
        //                     name: "Pokémon(s)",
        //                     value: 'p'
        //                 }
        //             ]
        //         },
        //         {
        //             name: 'value',
        //             description: 'Provide the value !',
        //             type: 3,
        //             required: true
        //         }
        //     ]
        // },
        {
            type: 'SUB_COMMAND',
            name: "clear",
            description: "Clear all items from ongoing trade ! ",
        },
        {
            type: 'SUB_COMMAND',
            name: "check",
            description: "Check your ongoing trade !",
        },
        {
            type: 'SUB_COMMAND',
            name: "cancel",
            description: "Cancel your ongoing trade !",
        },
        {
            type: 'SUB_COMMAND',
            name: "confirm",
            description: "Confirm your ongoing trade !",
        }
    ],
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        let trade = await Trade.findOne({
            $or: [
                { user1id: interaction.user.id },
                { user2id: interaction.user.id }
            ]
        })

        let user1, user2
        if (trade) {
            user1 = client.users.cache.get(trade.user1id)
            user2 = client.users.cache.get(trade.user2id)
            if (!user1 || !user2) {
                await trade.delete()
                return interaction.followUp({ content: `Error, another user in trade is unavailable, trade has been cancelled !` })
            }
            function returnEmbed() {
                (async () => {
                    let x = 0, y = 0
                    let user1emoji = "🔴"
                    if (trade.user1confirm == true) user1emoji = "🟢"
                    let user2emoji = "🔴"
                    if (trade.user2confirm == true) user2emoji = "🟢"

                    let Embed = new MessageEmbed()
                        .setAuthor({ name: `Trade between ${user1.username} & ${user2.username}` })
                        .setDescription(`To see more information about trading, use \`${prefix}help trade\` command !`)
                        .addFields(
                            {
                                name: `${user1emoji} | ${user1.username}`,
                                value: `\`\`\`\n${trade.user1credits < 1 ? "Credit" : "Credits"}: ${trade.user1credits.toLocaleString()}\n${trade.user1redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user1redeems.toLocaleString()}\n${trade.user1pokemons.map(x => `${trade.user1pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(x, x + 20).join("\n")}\n\`\`\``,
                                inline: true
                            },
                            {
                                name: `${user2emoji} | ${user2.username}`,
                                value: `\`\`\`\n${trade.user2credits < 1 ? "Credit" : "Credits"}: ${trade.user2credits.toLocaleString()}\n${trade.user2redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user2redeems.toLocaleString()}\n${trade.user2pokemons.map(x => `${trade.user2pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(y, y + 20).join("\n")}\n\`\`\``,
                                inline: true
                            }
                        )
                        .setColor(color)

                    let rowx = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("⬅")
                                .setStyle("SUCCESS")
                                .setCustomId("backwardx"),
                            new MessageButton()
                                .setLabel("➡")
                                .setStyle("SUCCESS")
                                .setCustomId("forwardx")
                        )
                    let rowxdisabled = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("⬅")
                                .setStyle("SUCCESS")
                                .setCustomId("backwardxdisabled")
                                .setDisabled(),
                            new MessageButton()
                                .setLabel("➡")
                                .setStyle("SUCCESS")
                                .setCustomId("forwardxdisabled")
                                .setDisabled()
                        )
                    let rowy = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("⬅")
                                .setStyle("PRIMARY")
                                .setCustomId("backwardy"),
                            new MessageButton()
                                .setLabel("➡")
                                .setStyle("PRIMARY")
                                .setCustomId("forwardy")
                        )
                    let rowydisabled = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("⬅")
                                .setStyle("PRIMARY")
                                .setCustomId("backwardydisabled")
                                .setDisabled(),
                            new MessageButton()
                                .setLabel("➡")
                                .setStyle("PRIMARY")
                                .setCustomId("forwardydisabled")
                                .setDisabled()
                        )

                    let msg = await interaction.followUp({ embeds: [Embed], components: [rowx, rowy] })

                    const filter = async (inter) => {
                        if (inter.user.id == user1.id || inter.user.id == user2.id) return true
                        else {
                            await inter.deferUpdate()
                            inter.followUp({ content: `<@${inter.user.id}> Only **Trade Authors** can interact with buttons!`, ephemeral: true })
                            return false
                        }
                    }

                    const collector = await msg.createMessageComponentCollector({
                        filter, time: 60000
                    })

                    collector.on('collect', async i => {
                        await i.deferUpdate()
                        if (i.customId == "forwardx") {
                            if (!trade.user1pokemons[x + 20]) return i.followUp({ content: `**${user1.tag}** has not added any more pokémons !`, ephemeral: true })
                            x += 20
                            let embed = new MessageEmbed()
                                .setAuthor({ name: `Trade between ${user1.username} & ${user2.username}` })
                                .setDescription(`To see more information about trading, use \`${prefix}help trade\` command !`)
                                .addFields(
                                    {
                                        name: `${user1emoji} | ${user1.username}`,
                                        value: `\`\`\`\n${trade.user1credits < 1 ? "Credit" : "Credits"}: ${trade.user1credits.toLocaleString()}\n${trade.user1redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user1redeems.toLocaleString()}\n${trade.user1pokemons.map(x => `${trade.user1pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(x, x + 20).join("\n")}\n\`\`\``,
                                        inline: true
                                    },
                                    {
                                        name: `${user2emoji} | ${user2.username}`,
                                        value: `\`\`\`\n${trade.user2credits < 1 ? "Credit" : "Credits"}: ${trade.user2credits.toLocaleString()}\n${trade.user2redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user2redeems.toLocaleString()}\n${trade.user2pokemons.map(x => `${trade.user2pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(y, y + 20).join("\n")}\n\`\`\``,
                                        inline: true
                                    }
                                )
                                .setColor(color)
                            return msg.edit({ embeds: [embed] })

                        } else if (i.customId == "forwardy") {
                            if (!trade.user2pokemons[y + 20]) return i.followUp({ content: `**${user2.tag}** has not added any more pokémons !`, ephemeral: true })
                            y += 20
                            let embed = new MessageEmbed()
                                .setAuthor({ name: `Trade between ${user1.username} & ${user2.username}` })
                                .setDescription(`To see more information about trading, use \`${prefix}help trade\` command !`)
                                .addFields(
                                    {
                                        name: `${user1emoji} | ${user1.username}`,
                                        value: `\`\`\`\n${trade.user1credits < 1 ? "Credit" : "Credits"}: ${trade.user1credits.toLocaleString()}\n${trade.user1redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user1redeems.toLocaleString()}\n${trade.user1pokemons.map(x => `${trade.user1pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(x, x + 20).join("\n")}\n\`\`\``,
                                        inline: true
                                    },
                                    {
                                        name: `${user2emoji} | ${user2.username}`,
                                        value: `\`\`\`\n${trade.user2credits < 1 ? "Credit" : "Credits"}: ${trade.user2credits.toLocaleString()}\n${trade.user2redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user2redeems.toLocaleString()}\n${trade.user2pokemons.map(x => `${trade.user2pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(y, y + 20).join("\n")}\n\`\`\``,
                                        inline: true
                                    }
                                )
                                .setColor(color)
                            return msg.edit({ embeds: [embed] })

                        } else if (i.customId == "backwardx") {
                            if (!trade.user1pokemons[x - 20]) return i.followUp({ content: `**${user1.tag}** has not added any less pokémons !`, ephemeral: true })
                            x -= 20
                            let embed = new MessageEmbed()
                                .setAuthor({ name: `Trade between ${user1.username} & ${user2.username}` })
                                .setDescription(`To see more information about trading, use \`${prefix}help trade\` command !`)
                                .addFields(
                                    {
                                        name: `${user1emoji} | ${user1.username}`,
                                        value: `\`\`\`\n${trade.user1credits < 1 ? "Credit" : "Credits"}: ${trade.user1credits.toLocaleString()}\n${trade.user1redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user1redeems.toLocaleString()}\n${trade.user1pokemons.map(x => `${trade.user1pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(x, x + 20).join("\n")}\n\`\`\``,
                                        inline: true
                                    },
                                    {
                                        name: `${user2emoji} | ${user2.username}`,
                                        value: `\`\`\`\n${trade.user2credits < 1 ? "Credit" : "Credits"}: ${trade.user2credits.toLocaleString()}\n${trade.user2redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user2redeems.toLocaleString()}\n${trade.user2pokemons.map(x => `${trade.user2pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(y, y + 20).join("\n")}\n\`\`\``,
                                        inline: true
                                    }
                                )
                                .setColor(color)
                            return msg.edit({ embeds: [embed] })
                        } else if (i.customId == "backwardy") {
                            if (!trade.user2pokemons[y - 20]) return i.followUp({ content: `**${user2.tag}** has not added any less pokémons !`, ephemeral: true })
                            y -= 20
                            let embed = new MessageEmbed()
                                .setAuthor({ name: `Trade between ${user1.username} & ${user2.username}` })
                                .setDescription(`To see more information about trading, use \`${prefix}help trade\` command !`)
                                .addFields(
                                    {
                                        name: `${user1emoji} | ${user1.username}`,
                                        value: `\`\`\`\n${trade.user1credits < 1 ? "Credit" : "Credits"}: ${trade.user1credits.toLocaleString()}\n${trade.user1redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user1redeems.toLocaleString()}\n${trade.user1pokemons.map(x => `${trade.user1pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(x, x + 20).join("\n")}\n\`\`\``,
                                        inline: true
                                    },
                                    {
                                        name: `${user2emoji} | ${user2.username}`,
                                        value: `\`\`\`\n${trade.user2credits < 1 ? "Credit" : "Credits"}: ${trade.user2credits.toLocaleString()}\n${trade.user2redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user2redeems.toLocaleString()}\n${trade.user2pokemons.map(x => `${trade.user2pokemons.indexOf(x) + 1} | L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).slice(y, y + 20).join("\n")}\n\`\`\``,
                                        inline: true
                                    }
                                )
                                .setColor(color)
                            return msg.edit({ embeds: [embed] })
                        } else return collector.stop()
                    })

                    collector.on('end', () => {
                        return msg.edit({ components: [rowxdisabled, rowydisabled] })
                    })

                })()
            }
        }

        const [subcommand] = args
        if (subcommand === 'start') {

            if (trade) return interaction.followUp({ content: `You are already present in a trade, either **complete** or **cancel** that trade !` })

            let mention = interaction.options.getUser('user')
            if (mention.id == interaction.user.id) return interaction.followUp(`Strange! You wanna trade your own items to your own self ?!`)

            let userx = await User.findOne({ id: mention.id })
            if (!userx) return interaction.followUp({ content: `**${mention.tag}** must pick his starter pokémon using \`${prefix}start\` !` })

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("ACCEPT")
                        .setStyle("SUCCESS")
                        .setCustomId("accept"),
                    new MessageButton()
                        .setLabel("REJECT")
                        .setStyle("DANGER")
                        .setCustomId("disabledReject")
                )
            const rowx = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("ACCEPT")
                        .setStyle("SUCCESS")
                        .setCustomId("disabledAccept")
                        .setDisabled(),
                    new MessageButton()
                        .setLabel("REJECT")
                        .setStyle("DANGER")
                        .setCustomId("disabledReject")
                        .setDisabled()
                )

            const filter = async (inter) => {
                if (mention.id == inter.user.id) return true
                else {
                    await inter.deferUpdate()
                    inter.followUp({ content: `<@${inter.user.id}> Only **Mentioned Author** can interact with buttons!`, ephemeral: true })
                    return false
                }
            }

            let msg = await interaction.followUp({ content: `<@${mention.id}> , ${interaction.user.username} has invited you to a Trade ! `, components: [row] })
            client.collector.push(interaction.user.id)

            let embed = new MessageEmbed()
                .setAuthor(`Trade between ${interaction.user.username} & ${mention.username}`)
                .setDescription(`To see more information about trading, use \`${prefix}help trade\` command !`)
                .addFields(
                    {
                        name: `🔴 | ${interaction.user.username}`,
                        value: `\`\`\`\nCredit: 0\nRedeem: 0\n\`\`\``,
                        inline: true
                    },
                    {
                        name: `🔴 | ${mention.username}`,
                        value: `\`\`\`\nCredit: 0\nRedeem: 0\n\`\`\``,
                        inline: true
                    }
                )
                .setColor(color)

            const collector = await msg.createMessageComponentCollector({
                filter, max: 1, time: 30000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'accept') {
                    let newDoc = new Trade({
                        id: Trade.length + 1,
                        user1id: interaction.user.id,
                        user2id: mention.id
                    })
                    await newDoc.save().catch(() => { })
                    return interaction.channel.send({ embeds: [embed] })
                } else if (i.customId === 'reject') {
                    return interaction.channel.send({ content: "Trade Request Rejected !" })
                }
            })

            collector.on('end', () => {
                client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                return interaction.editReply({ components: [rowx] })
            })


        } else if (subcommand === 'add') {

            if (trade == undefined || trade == null) return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            let type = interaction.options.getString('type')

            if (trade.user1id == interaction.user.id) {
                let value = interaction.options.getString('value')

                if (type == "c") {
                    if (isNaN(value)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`." })
                    value = parseInt(value)
                    if (value <= 0) return interaction.followUp(`\`${value}\` is not a valid integer !`)
                    if (value > user.balance) return interaction.followUp(`You don't have enough stuff to add \`${value}\` ${value == 1 ? "credit" : "credits"} ! `)
                    trade.user1credits += value
                    if (trade.user1credits > user.balance) return interaction.followUp(`You don't have enough stuff to add \`${value}\` ${value == 1 ? "credit" : "credits"} ! `)
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else if (type == "r") {
                    if (isNaN(value)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`." })
                    value = parseInt(value)
                    if (value <= 0) return interaction.followUp(`\`${value}\` is not a valid integer !`)
                    if (value > user.redeems) return interaction.followUp(`You don't have enough stuff to add \`${value}\` ${value == 1 ? "redeem" : "redeems"} ! `)
                    trade.user1redeems += value
                    if (trade.user1redeems > user.redeems) return interaction.followUp(`You don't have enough stuff to add \`${value}\` ${value == 1 ? "credit" : "credits"} ! `)
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else if (type == "p") {
                    let num
                    for (let x = 0; x < value.split(" ").length; x++) {
                        if (!isNaN(value.split(" ")[x])) {
                            num = parseInt(value.split(" ")[x]) - 1
                            if (num >= user.pokemons.length) return interaction.followUp({ content: "ERROR, you don't have a pokémon with `" + (num + 1) + "` number !" })
                            if (trade.user1pokemons.find(x => x == user.pokemons[num])) return interaction.followUp({ content: `That pokémon is already added to the trade !` })
                            trade.user1pokemons.push(user.pokemons[num])
                            if (trade.user1pokemons.length > 100) return interaction.followUp({ content: `<@${user1.id}>, you cannot add more than 100 pokémons in the trade !` })
                        }
                    }
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.markModified("user1pokemons")
                    await trade.save().catch(() => { })
                    await returnEmbed()
                } else {
                    return
                }
            } else if (trade.user2id == interaction.user.id) {
                let value = interaction.options.getString('value')

                if (type == "c") {
                    if (isNaN(value)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`." })
                    value = parseInt(value)
                    if (value <= 0) return interaction.followUp(`\`${value}\` is not a valid integer !`)
                    if (value > user.balance) return interaction.followUp(`You don't have enough stuff to add \`${value}\` ${value == 1 ? "credit" : "credits"} ! `)
                    trade.user2credits += value
                    if (trade.user2credits > user.balance) return interaction.followUp(`You don't have enough stuff to add \`${value}\` ${value == 1 ? "credit" : "credits"} ! `)
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else if (type == "r") {
                    if (isNaN(value)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`." })
                    value = parseInt(value)
                    if (value <= 0) return interaction.followUp(`\`${value}\` is not a valid integer !`)
                    if (value > user.redeems) return interaction.followUp(`You don't have enough stuff to add \`${value}\` ${value == 1 ? "redeem" : "redeems"} ! `)
                    trade.user2redeems += value
                    if (trade.user2redeems > user.redeems) return interaction.followUp(`You don't have enough stuff to add \`${value}\` ${value == 1 ? "credit" : "credits"} ! `)
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else if (type == "p") {
                    let num
                    for (let x = 0; x < value.split(" ").length; x++) {
                        if (!isNaN(value.split(" ")[x])) {
                            num = parseInt(value.split(" ")[x]) - 1
                            if (num >= user.pokemons.length) return interaction.followUp({ content: "ERROR, you don't have a pokémon with `" + (num + 1) + "` number !" })
                            if (trade.user1pokemons.find(x => x == user.pokemons[num])) return interaction.followUp({ content: `That pokémon is already added to the trade !` })
                            trade.user2pokemons.push(user.pokemons[num])
                            if (trade.user2pokemons.length > 100) return interaction.followUp({ content: `<@${user2.id}>, you cannot add more than 100 pokémons in the trade !` })
                        }
                    }
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.markModified("user2pokemons")
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else {
                    return
                }
            } else {
                return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            }


        } else if (subcommand === 'addall') {

            if (trade == undefined || trade == null) return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            let type = interaction.options.getString('type')
            if (trade.user1id == interaction.user.id) {

                if (type == "c") {
                    if (user.balance == 0) return interaction.followUp(`You have \`0\` credit in your account ! `)
                    trade.user1credits = user.balance
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else if (type == "r") {
                    if (user.redeems == 0) return interaction.followUp(`You have \`0\` redeem in your account ! `)
                    trade.user1redeems = user.redeems
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else if (type == "p") {
                    if (user.pokemons.length == 0) return interaction.followUp(`You have \`0\` pokémon in your account ! `)

                    let n = interaction.options.getString('filters')
                    if (!n) n = ""

                    let a = user,
                        s = a.pokemons.map((r, i) => {
                            r.num = i + 1
                            return r
                        }), zbc = {}
                    n = n.split(/--|—/gmi).map(x => {
                        if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true
                    })

                    let validOptions = ["legendary", "legend", "l", "mythical", "mythic", "myth", "m", "starter", "starters", "ultrabeast", "ub", "mega", "gigantamaxable", "gmaxable", "primal", "megable", "alolan", "a", "galarian", "g", "gmax", "gigantamax", "shad", "shadow", "shiny", "s", "sh", "name", "n", "nick", "nickname", "fav", "favourite", "level", "hpiv", "atkiv", "defiv", "spatkiv", "spdefiv", "speediv", "region", "type", "event"]

                    for (const [key, value] of Object.entries(zbc)) {
                        if (!validOptions.find(r => r == key)) return interaction.followUp(`\`--${key}\` is not a valid argument!`)
                    }

                    if (zbc["legendary"] || zbc["legend"] || zbc["l"]) {
                        s = s.filter(e => legends.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())) || legends2.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["mythical"] || zbc["mythic"] || zbc["m"]) {
                        s = s.filter(e => mythics.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["ultrabeast"] || zbc["ub"]) {
                        s = s.filter(e => ub.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["alolan"] || zbc["a"]) {
                        s = s.filter(e => alolans.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["galarian"] || zbc["g"]) {
                        s = s.filter(e => galarians.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["starter"] || zbc["starters"]) {
                        s = s.filter(e => starters.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["primal"]) {
                        s = s.filter(e => e.name.toLowerCase().replace(/ +/g, "-").startsWith("primal-"))
                    }
                    if (zbc["megable"]) {
                        s = s.filter(e => megable.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["mega"]) {
                        s = s.filter(e => e.name.toLowerCase().replace(/ +/g, "-").startsWith("mega-"))
                    }
                    if (zbc["gmaxable"] || zbc["gigantamaxable"]) {
                        s = s.filter(e => gigantamaxable.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["gmax"] || zbc["gigantamax"]) {
                        s = s.filter(e => gmax.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["event"]) {
                        s = s.filter((e) => { return event.includes(e.name) })
                    }
                    if (zbc["shad"] || zbc["shadow"]) {
                        s = s.filter(e => e.name.toLowerCase().replace(/ +/g, "-").startsWith("shadow-"))
                    }
                    if (zbc["shiny"] || zbc["s"]) {
                        s = s.filter(e => e.shiny)
                    }
                    if (zbc["name"] || zbc["n"]) s = s.filter(e => {
                        if (e && (zbc['name'] || zbc["n"]) == e.name.toLowerCase().replace(/-+/g, ' ')) return e
                    })
                    if (zbc["nick"] || zbc["nickname"]) s = s.filter(e => {
                        if (e.nickname && (zbc['nick'] || zbc["nickname"]) == e.nickname.toLowerCase().replace(/-+/g, ' ')) return e
                    })
                    if (zbc['type']) s = s.filter(e => {
                        if (e.rarity.toLowerCase().split(" | ").includes(zbc['type'])) return e
                    })
                    if (zbc['level']) {
                        let a = zbc["level"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.level == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.level < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.level == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.level > a[1])
                            }
                        }
                    }
                    if (zbc['hpiv']) {
                        let a = zbc["hpiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.hp == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.hp < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.hp == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.hp > a[1])
                            }
                        }
                    }
                    if (zbc['atkiv']) {
                        let a = zbc["atkiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.atk == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.atk < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.atk == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.atk > a[1])
                            }
                        }
                    }
                    if (zbc['defiv']) {
                        let a = zbc["defiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.def == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.def < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.def == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.def > a[1])
                            }
                        }
                    }
                    if (zbc['spatkiv']) {
                        let a = zbc["spatkiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.spatk == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.spatk < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.spatk == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.spatk > a[1])
                            }
                        }
                    }
                    if (zbc['spdefiv']) {
                        let a = zbc["spdefiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.spdef == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.spdef < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.spdef == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.spdef > a[1])
                            }
                        }
                    }
                    if (zbc['speediv']) {
                        let a = zbc["speediv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.speed == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.speed < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.speed == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.speed > a[1])
                            }
                        }
                    }
                    if (zbc["region"]) {
                        let a = zbc["region"].split(" ")
                        if (a[0] === "kanto") {
                            s = s.filter(e => kanto.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "johto") {
                            s = s.filter(e => johto.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "hoenn") {
                            s = s.filter(e => hoenn.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "sinnoh") {
                            s = s.filter(e => sinnoh.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "unova") {
                            s = s.filter(e => unova.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "kalos") {
                            s = s.filter(e => kalos.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "alola") {
                            s = s.filter(e => alola.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "galar") {
                            s = s.filter(e => galar.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                    }

                    if (trade.user1pokemons.length + s.length > 240) return interaction.followUp({ content: `<@${user1.id}>, you cannot add more than 240 pokémons in the trade !` })

                    trade.user1confirm = false
                    trade.user2confirm = false
                    trade.user1pokemons.push(...s)
                    await trade.markModified("user1pokemons")
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else {
                    return
                }

            } else if (trade.user2id == interaction.user.id) {
                if (type == "c") {
                    if (user.balance == 0) return interaction.followUp(`You have \`0\` credit in your account ! `)
                    trade.user2credits = user.balance
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else if (type == "r") {
                    if (user.redeems == 0) return interaction.followUp(`You have \`0\` redeem in your account ! `)
                    trade.user2redeems = user.redeems
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else if (type == "p") {
                    if (user.pokemons.length == 0) return interaction.followUp(`You have \`0\` pokémon in your account ! `)

                    let n = interaction.options.getString('filters')
                    if (!n) n = ""

                    let a = user,
                        s = a.pokemons.map((r, i) => {
                            r.num = i + 1
                            return r
                        }), zbc = {}
                    n = n.split(/--|—/gmi).map(x => {
                        if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true
                    })

                    let validOptions = ["legendary", "legend", "l", "mythical", "mythic", "myth", "m", "starter", "starters", "ultrabeast", "ub", "mega", "gigantamaxable", "gmaxable", "primal", "megable", "alolan", "a", "galarian", "g", "gmax", "gigantamax", "shad", "shadow", "shiny", "s", "sh", "name", "n", "nick", "nickname", "fav", "favourite", "level", "hpiv", "atkiv", "defiv", "spatkiv", "spdefiv", "speediv", "region", "type", "event"]

                    for (const [key, value] of Object.entries(zbc)) {
                        if (!validOptions.find(r => r == key)) return interaction.followUp(`\`--${key}\` is not a valid argument!`)
                    }

                    if (zbc["legendary"] || zbc["legend"] || zbc["l"]) {
                        s = s.filter(e => legends.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())) || legends2.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["mythical"] || zbc["mythic"] || zbc["m"]) {
                        s = s.filter(e => mythics.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["ultrabeast"] || zbc["ub"]) {
                        s = s.filter(e => ub.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["alolan"] || zbc["a"]) {
                        s = s.filter(e => alolans.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["galarian"] || zbc["g"]) {
                        s = s.filter(e => galarians.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["starter"] || zbc["starters"]) {
                        s = s.filter(e => starters.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["primal"]) {
                        s = s.filter(e => e.name.toLowerCase().replace(/ +/g, "-").startsWith("primal-"))
                    }
                    if (zbc["megable"]) {
                        s = s.filter(e => megable.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["mega"]) {
                        s = s.filter(e => e.name.toLowerCase().replace(/ +/g, "-").startsWith("mega-"))
                    }
                    if (zbc["gmaxable"] || zbc["gigantamaxable"]) {
                        s = s.filter(e => gigantamaxable.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["gmax"] || zbc["gigantamax"]) {
                        s = s.filter(e => gmax.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                    }
                    if (zbc["event"]) {
                        s = s.filter((e) => { return event.includes(e.name) })
                    }
                    if (zbc["shad"] || zbc["shadow"]) {
                        s = s.filter(e => e.name.toLowerCase().replace(/ +/g, "-").startsWith("shadow-"))
                    }
                    if (zbc["shiny"] || zbc["s"]) {
                        s = s.filter(e => e.shiny)
                    }
                    if (zbc["name"] || zbc["n"]) s = s.filter(e => {
                        if (e && (zbc['name'] || zbc["n"]) == e.name.toLowerCase().replace(/-+/g, ' ')) return e
                    })
                    if (zbc["nick"] || zbc["nickname"]) s = s.filter(e => {
                        if (e.nickname && (zbc['nick'] || zbc["nickname"]) == e.nickname.toLowerCase().replace(/-+/g, ' ')) return e
                    })
                    if (zbc['type']) s = s.filter(e => {
                        if (e.rarity.toLowerCase().split(" | ").includes(zbc['type'])) return e
                    })
                    if (zbc['level']) {
                        let a = zbc["level"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.level == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.level < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.level == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.level > a[1])
                            }
                        }
                    }
                    if (zbc['hpiv']) {
                        let a = zbc["hpiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.hp == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.hp < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.hp == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.hp > a[1])
                            }
                        }
                    }
                    if (zbc['atkiv']) {
                        let a = zbc["atkiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.atk == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.atk < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.atk == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.atk > a[1])
                            }
                        }
                    }
                    if (zbc['defiv']) {
                        let a = zbc["defiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.def == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.def < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.def == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.def > a[1])
                            }
                        }
                    }
                    if (zbc['spatkiv']) {
                        let a = zbc["spatkiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.spatk == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.spatk < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.spatk == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.spatk > a[1])
                            }
                        }
                    }
                    if (zbc['spdefiv']) {
                        let a = zbc["spdefiv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.spdef == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.spdef < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.spdef == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.spdef > a[1])
                            }
                        }
                    }
                    if (zbc['speediv']) {
                        let a = zbc["speediv"].split(" ")
                        if (a.length === 1) {
                            s = s.filter(e => e.speed == a[0])
                        } else if (a.length > 1) {
                            if (a[0] === "<") {
                                s = s.filter(e => e.speed < a[1])
                            }
                            if (a[0] === "=") {
                                s = s.filter(e => e.speed == a[1])
                            }
                            if (a[0] === ">") {
                                s = s.filter(e => e.speed > a[1])
                            }
                        }
                    }
                    if (zbc["region"]) {
                        let a = zbc["region"].split(" ")
                        if (a[0] === "kanto") {
                            s = s.filter(e => kanto.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "johto") {
                            s = s.filter(e => johto.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "hoenn") {
                            s = s.filter(e => hoenn.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "sinnoh") {
                            s = s.filter(e => sinnoh.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "unova") {
                            s = s.filter(e => unova.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "kalos") {
                            s = s.filter(e => kalos.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "alola") {
                            s = s.filter(e => alola.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                        if (a[0] === "galar") {
                            s = s.filter(e => galar.includes(e.name.toLowerCase().replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())))
                        }
                    }

                    if (trade.user2pokemons.length + s.length > 240) return interaction.followUp({ content: `<@${user2.id}>, you cannot add more than 240 pokémons in the trade !` })

                    trade.user2pokemons.push(...s)
                    trade.user1confirm = false
                    trade.user2confirm = false
                    await trade.markModified("user2pokemons")
                    await trade.save().catch(() => { })
                    returnEmbed()
                } else {
                    return
                }

            } else {
                return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            }

        } else if (subcommand == "info") {

            if (trade == undefined || trade == null) return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            let id = interaction.options.getInteger('number'), num = id - 1

            if (trade.user1id == interaction.user.id) {
                if (trade.user2pokemons.length == 0) return interaction.followUp({ content: `No pokémon has been added to the **trade** !` })
                if (!trade.user2pokemons[num]) return interaction.followUp({ content: `No pokémon with \`${id}\` has been added to the **trade** !` })

                let poke = trade.user2pokemons[num]
                let gen8 = Gen8.find(e => e.name.toLowerCase() === poke.name.toLowerCase())
                let form = Forms.find(e => e.name.toLowerCase() === poke.name.toLowerCase())
                let concept = Concept.find(e => e.name.toLowerCase() === poke.name.toLowerCase())
                let galarian = Galarians.find(e => e.name.toLowerCase() === poke.name.toLowerCase().replace("galarian-", ""))
                let mega = Mega.find(e => e.name.toLowerCase() === poke.name.replace("mega-", "").toLowerCase())
                let shadow = Shadow.find(e => e.name.toLowerCase() === poke.name.replace("shadow-", "").toLowerCase())
                let primal = Primal.find(e => e.name === poke.name.replace("primal-", "").toLowerCase())
                let pokemon = Pokemons.find(e => e.name.english === poke.name.toLowerCase())
                let gmax = Gmax.find(e => e.name.toLowerCase() === poke.name.replace("gigantamax-", "").toLowerCase())

                let level = poke.level
                let hp = poke.hp
                let atk = poke.atk
                let def = poke.def
                let spatk = poke.spatk
                let spdef = poke.spdef
                let speed = poke.speed
                let url = poke.url
                let helditem = poke?.helditem.join(" | ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                if (helditem.length == 0) helditem = undefined

                let name = `${poke.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`

                if (poke.shiny == true) {
                    name = `⭐ ${poke.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
                    if (poke.name.toLowerCase().startsWith("mega-")) {
                        let mg = megashinydb.find(e => e.name === poke.name.toLowerCase().replace(/ +/g, "-").replace("mega-", ""))
                        if (mg) url = mg.url
                    } else {
                        let sh = shinydb.find(e => e.name.toLowerCase() === poke.name.toLowerCase().replace(/ +/g, "-"))
                        if (sh) url = sh.url
                    }
                    if (url == "" || url == " " || url == undefined) url = poke.url
                }
                let types = `${poke.rarity}`
                let nature = poke.nature.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                let totalIV = poke.totalIV
                let pokename = poke.name.toLowerCase().replace(/ +/g, "-")

                if (pokename.startsWith("alolan-")) {
                    pokename = pokename.replace("alolan-", "");
                    pokename = `${pokename}-alola`
                }
                let xp = `${poke.xp}/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 * level - 89}`
                let hpBase, atkBase, defBase, spatkBase, spdefBase, speedBase

                if (gen8) {
                    hpBase = gen8.hp
                    atkBase = gen8.atk
                    defBase = gen8.def
                    spatkBase = gen8.spatk
                    spdefBase = gen8.spdef
                    speedBase = gen8.speed
                } else if (form) {
                    hpBase = form.hp
                    atkBase = form.atk
                    defBase = form.def
                    spatkBase = form.spatk
                    spdefBase = form.spdef
                    speedBase = form.speed
                } else if (concept) {
                    hpBase = concept.hp
                    atkBase = concept.atk
                    defBase = concept.def
                    spatkBase = concept.spatk
                    spdefBase = concept.spdef
                    speedBase = concept.speed
                } else if (galarian && poke.name.toLowerCase().startsWith("galarian")) {
                    hpBase = galarian.hp
                    atkBase = galarian.atk
                    defBase = galarian.def
                    spatkBase = galarian.spatk
                    spdefBase = galarian.spdef
                    speedBase = galarian.speed
                } else if (mega && poke.name.toLowerCase().startsWith("mega-")) {
                    hpBase = mega.hp
                    atkBase = mega.atk
                    defBase = mega.def
                    spatkBase = mega.spatk
                    spdefBase = mega.spdef
                    speedBase = mega.speed
                } else if (shadow && poke.name.toLowerCase().startsWith("shadow-")) {
                    hpBase = shadow.hp
                    atkBase = shadow.atk
                    defBase = shadow.def
                    spatkBase = shadow.spatk
                    spdefBase = shadow.spdef
                    speedBase = shadow.speed
                } else if (primal && poke.name.toLowerCase().startsWith("primal-")) {
                    hpBase = primal.hp
                    atkBase = primal.atk
                    defBase = primal.def
                    spatkBase = primal.spatk
                    spdefBase = primal.spdef
                    speedBase = primal.speed
                } else if (gmax && poke.name.toLowerCase().startsWith("gigantamax-")) {
                    hpBase = gmax.hp
                    atkBase = gmax.atk
                    defBase = gmax.def
                    spatkBase = gmax.spatk
                    spdefBase = gmax.spdef
                    speedBase = gmax.speed
                } else if (pokemon) {
                    hpBase = pokemon.hp
                    atkBase = pokemon.atk
                    defBase = pokemon.def
                    spatkBase = pokemon.spatk
                    spdefBase = pokemon.spdef
                    speedBase = pokemon.speed
                } else if (!(gen8 || form || concept || galarian || mega || shadow || primal || gmax || pokemon)) {
                    let t = true
                    t = await get({
                        url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                        json: true
                    }).catch((err) => {
                        t = false
                        return
                    })

                    if (t) {

                        let re
                        Type = t.types.map(r => {
                            if (r !== r) re = r
                            if (re == r) return
                            return `${r.type.name}`
                        }).join(" | ")

                        hpBase = t.stats[0].base_stat
                        atkBase = t.stats[1].base_stat
                        defBase = t.stats[2].base_stat
                        spatkBase = t.stats[3].base_stat
                        spdefBase = t.stats[4].base_stat
                        speedBase = t.stats[5].base_stat
                    }
                } else {
                    hpBase = ~~(Math.random() * 50)
                    atkBase = ~~(Math.random() * 50)
                    defBase = ~~(Math.random() * 50)
                    spatkBase = ~~(Math.random() * 50)
                    spdefBase = ~~(Math.random() * 50)
                    speedBase = ~~(Math.random() * 50)
                }

                let hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1)
                let atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9)
                let defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1)
                let spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1)
                let spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1)
                let speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

                let Embed = new MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types.toString().replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\n**Nature**: ${nature}\n${helditem == undefined ? "" : `**Held Item**: ${helditem}`}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).setFooter(`Displaying Pokémon: ${id}/${trade.user2pokemons.length}\nOwner: ${user2.tag}`).setImage(url).setColor(color).setThumbnail(user2.displayAvatarURL())

                return interaction.followUp({ embeds: [Embed] })
            } else if (trade.user2id == interaction.user.id) {
                if (trade.user1pokemons.length == 0) return interaction.followUp({ content: `No pokémon has been added to the **trade** !` })
                if (!trade.user1pokemons[num]) return interaction.followUp({ content: `No pokémon with \`${id}\` number has been added to the **trade** !` })

                let poke = trade.user1pokemons[num]
                let gen8 = Gen8.find(e => e.name.toLowerCase() === poke.name.toLowerCase())
                let form = Forms.find(e => e.name.toLowerCase() === poke.name.toLowerCase())
                let concept = Concept.find(e => e.name.toLowerCase() === poke.name.toLowerCase())
                let galarian = Galarians.find(e => e.name.toLowerCase() === poke.name.toLowerCase().replace("galarian-", ""))
                let mega = Mega.find(e => e.name.toLowerCase() === poke.name.replace("mega-", "").toLowerCase())
                let shadow = Shadow.find(e => e.name.toLowerCase() === poke.name.replace("shadow-", "").toLowerCase())
                let primal = Primal.find(e => e.name === poke.name.replace("primal-", "").toLowerCase())
                let pokemon = Pokemons.find(e => e.name.english === poke.name.toLowerCase())
                let gmax = Gmax.find(e => e.name.toLowerCase() === poke.name.replace("gigantamax-", "").toLowerCase())


                let level = poke.level
                let hp = poke.hp
                let atk = poke.atk
                let def = poke.def
                let spatk = poke.spatk
                let spdef = poke.spdef
                let speed = poke.speed
                let url = poke.url
                let helditem = poke?.helditem.join(" | ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                if (helditem.length == 0) helditem = undefined

                let name = `${poke.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
                if (poke.shiny == true) {
                    name = `⭐ ${poke.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
                    if (poke.name.toLowerCase().startsWith("mega-")) {
                        let mg = megashinydb.find(e => e.name === poke.name.toLowerCase().replace(/ +/g, "-").replace("mega-", ""))
                        if (mg) url = mg.url
                    } else {
                        let sh = shinydb.find(e => e.name.toLowerCase() === poke.name.toLowerCase().replace(/ +/g, "-"))
                        if (sh) url = sh.url
                    }
                    if (url == "" || url == " " || url == undefined) url = poke.url
                }
                let types = `${poke.rarity}`
                let nature = poke.nature.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                let totalIV = poke.totalIV
                let pokename = poke.name.toLowerCase().replace(/ +/g, "-")

                if (pokename.startsWith("alolan-")) {
                    pokename = pokename.replace("alolan-", "");
                    pokename = `${pokename}-alola`
                }
                let xp = `${poke.xp}/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 * level - 89}`
                let hpBase, atkBase, defBase, spatkBase, spdefBase, speedBase

                if (gen8) {
                    hpBase = gen8.hp
                    atkBase = gen8.atk
                    defBase = gen8.def
                    spatkBase = gen8.spatk
                    spdefBase = gen8.spdef
                    speedBase = gen8.speed
                } else if (form) {
                    hpBase = form.hp
                    atkBase = form.atk
                    defBase = form.def
                    spatkBase = form.spatk
                    spdefBase = form.spdef
                    speedBase = form.speed
                } else if (concept) {
                    hpBase = concept.hp
                    atkBase = concept.atk
                    defBase = concept.def
                    spatkBase = concept.spatk
                    spdefBase = concept.spdef
                    speedBase = concept.speed
                } else if (galarian && poke.name.toLowerCase().startsWith("galarian")) {
                    hpBase = galarian.hp
                    atkBase = galarian.atk
                    defBase = galarian.def
                    spatkBase = galarian.spatk
                    spdefBase = galarian.spdef
                    speedBase = galarian.speed
                } else if (mega && poke.name.toLowerCase().startsWith("mega-")) {
                    hpBase = mega.hp
                    atkBase = mega.atk
                    defBase = mega.def
                    spatkBase = mega.spatk
                    spdefBase = mega.spdef
                    speedBase = mega.speed
                } else if (shadow && poke.name.toLowerCase().startsWith("shadow-")) {
                    hpBase = shadow.hp
                    atkBase = shadow.atk
                    defBase = shadow.def
                    spatkBase = shadow.spatk
                    spdefBase = shadow.spdef
                    speedBase = shadow.speed
                } else if (primal && poke.name.toLowerCase().startsWith("primal-")) {
                    hpBase = primal.hp
                    atkBase = primal.atk
                    defBase = primal.def
                    spatkBase = primal.spatk
                    spdefBase = primal.spdef
                    speedBase = primal.speed
                } else if (gmax && poke.name.toLowerCase().startsWith("gigantamax-")) {
                    hpBase = gmax.hp
                    atkBase = gmax.atk
                    defBase = gmax.def
                    spatkBase = gmax.spatk
                    spdefBase = gmax.spdef
                    speedBase = gmax.speed
                } else if (pokemon) {
                    hpBase = pokemon.hp
                    atkBase = pokemon.atk
                    defBase = pokemon.def
                    spatkBase = pokemon.spatk
                    spdefBase = pokemon.spdef
                    speedBase = pokemon.speed
                } else if (!(gen8 || form || concept || galarian || mega || shadow || primal || gmax || pokemon)) {
                    let t = true
                    t = await get({
                        url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                        json: true
                    }).catch((err) => {
                        t = false
                        return
                    })

                    if (t) {

                        let re
                        Type = t.types.map(r => {
                            if (r !== r) re = r
                            if (re == r) return
                            return `${r.type.name}`
                        }).join(" | ")

                        hpBase = t.stats[0].base_stat
                        atkBase = t.stats[1].base_stat
                        defBase = t.stats[2].base_stat
                        spatkBase = t.stats[3].base_stat
                        spdefBase = t.stats[4].base_stat
                        speedBase = t.stats[5].base_stat
                    }
                } else {
                    hpBase = ~~(Math.random() * 50)
                    atkBase = ~~(Math.random() * 50)
                    defBase = ~~(Math.random() * 50)
                    spatkBase = ~~(Math.random() * 50)
                    spdefBase = ~~(Math.random() * 50)
                    speedBase = ~~(Math.random() * 50)
                }

                let hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1)
                let atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9)
                let defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1)
                let spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1)
                let spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1)
                let speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

                let Embed = new MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types.toString().replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\n**Nature**: ${nature}\n${helditem == undefined ? "" : `**Held Item**: ${helditem}`}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).setFooter(`Displaying Pokémon: ${id}/${trade.user1pokemons.length}\nOwner: ${user1.tag}`).setImage(url).setColor(color).setThumbnail(user1.displayAvatarURL())

                return interaction.followUp({ embeds: [Embed] })

            } else {
                return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            }

        } else if (subcommand === 'clear') {

            if (trade == undefined || trade == null) return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })

            if (trade.user1id == interaction.user.id) {
                trade.user1confirm = false
                trade.user2confirm = false
                trade.user1credits = 0
                trade.user1redeems = 0
                trade.user1pokemons = []
                await trade.save().catch(() => { })
                returnEmbed()
            } else if (trade.user2id == interaction.user.id) {
                trade.user1confirm = false
                trade.user2confirm = false
                trade.user2credits = 0
                trade.user2redeems = 0
                trade.user2pokemons = []
                await trade.save().catch(() => { })
                returnEmbed()
            } else {
                return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            }

        } else if (subcommand === 'check') {
            if (trade == undefined || trade == null) return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            returnEmbed()
        } else if (subcommand === 'cancel') {

            if (trade == undefined || trade == null) return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            await trade.delete()
            return interaction.followUp({ content: `Trade **cancelled** !` })
        } else if (subcommand === 'confirm') {

            if (trade == undefined || trade == null) return interaction.followUp({ content: `ERROR , you are not in a **trade** !` })
            if (trade.user1credits == 0 && trade.user1redeems == 0 && trade.user1pokemons.length == 0 && trade.user2credits == 0 && trade.user2redeems == 0 && trade.user2pokemons.length == 0) return interaction.followUp({ content: `Error, cannot confirm an **empty** trade !` })

            if (trade.user1confirm == false && trade.user2confirm == false) {

                if (trade.user1id == interaction.user.id) {
                    trade.user1confirm = true
                    await trade.save().catch(() => { })
                    return interaction.followUp({ content: `Trade **confirmed** from your side , waiting for another user to confirm!` })
                } else if (trade.user2id == interaction.user.id) {
                    trade.user2confirm = true
                    await trade.save().catch(() => { })
                    return interaction.followUp({ content: `Trade **confirmed** from your side , waiting for another user to confirm!` })
                } else return

            } else if (trade.user1confirm && !trade.user2confirm) {

                if (trade.user1id == interaction.user.id) {
                    return interaction.followUp({ content: `Trade is already **confirmed** from your side , waiting for another user to confirm!` })
                } else if (trade.user2id == interaction.user.id) {

                    let author1 = await User.findOne({ id: user1.id })
                    let author2 = await User.findOne({ id: user2.id })
                    if (!author1 || !author2) {
                        await trade.delete()
                        return interaction.followUp({ content: `ERROR, another user in trade is unavailable, trade has been cancelled !` })
                    }
                    author1.balance -= trade.user1credits
                    author2.balance -= trade.user2credits
                    author1.balance += trade.user2credits
                    author2.balance += trade.user1credits

                    author1.redeems -= trade.user1redeems
                    author2.redeems -= trade.user2redeems
                    author1.redeems += trade.user2redeems
                    author2.redeems += trade.user1redeems

                    for (var z = 0; z < trade.user1pokemons.length; z++) {
                        if (author1.pokemons.find(r => JSON.stringify(r) === JSON.stringify(trade.user1pokemons[z]))) {
                            let index = author1.pokemons.findIndex(x => JSON.stringify(x) == JSON.stringify(trade.user1pokemons[z]))
                            if (index > -1) {
                                await author1.pokemons.splice(index, 1)
                                await author2.pokemons.push(trade.user1pokemons[z])
                            } else {
                                return
                            }
                        }
                    }

                    for (var z = 0; z < trade.user2pokemons.length; z++) {
                        if (author2.pokemons.find(r => JSON.stringify(r) === JSON.stringify(trade.user2pokemons[z]))) {
                            let index = author2.pokemons.findIndex(x => JSON.stringify(x) == JSON.stringify(trade.user2pokemons[z]))
                            if (index > -1) {
                                await author2.pokemons.splice(index, 1)
                                await author1.pokemons.push(trade.user2pokemons[z])
                            } else {
                                return
                            }
                        }
                    }
                    let Embed = new MessageEmbed()
                        .setAuthor(`Your last trade: Trade between ${user1.username} & ${user2.username}`)
                        .setDescription(`To see more information about trading, use \`${prefix}help trade\` command !`)
                        .addFields(
                            {
                                name: `🔴 | ${user1.username}`,
                                value: `\`\`\`\n${trade.user1credits < 1 ? "Credit" : "Credits"}: ${trade.user1credits.toLocaleString().toLocaleString()}\n${trade.user1redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user1redeems.toLocaleString()}\n${trade.user1pokemons.map(x => `L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).join("\n")}\n\`\`\``,
                                inline: true
                            },
                            {
                                name: `🔴 | ${user2.username}`,
                                value: `\`\`\`\n${trade.user2credits < 1 ? "Credit" : "Credits"}: ${trade.user2credits.toLocaleString().toLocaleString()}\n${trade.user2redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user2redeems.toLocaleString()}\n${trade.user2pokemons.map(x => `L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).join("\n")}\n\`\`\``,
                                inline: true
                            }
                        )
                        .setColor(color)

                    let userQuest1 = await Quests.findOne({ id: user1.id })
                    let userQuest2 = await Quests.findOne({ id: user2.id })
                    if (userQuest1) {
                        // Total Trade
                        if (userQuest1.trade.total >= 10) {
                            interaction.channel.send(`<@${user1.id}>, you completed your one of the trading quest ( **complete 10 trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest1.trade.total = 0
                            author1.balance += 10000
                        } else if (userQuest1.trade.total <= 8) {
                            userQuest1.trade.total += 1
                        }

                        // Exchanged Credits
                        if (userQuest1.trade.credits >= 1000000) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10,00,000\` credits in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest1.trade.credits = 0
                            author1.balance += 10000
                        } else if (userQuest1.trade.credits <= 999999) {
                            userQuest1.trade.credits += trade.user1credits
                        }

                        // Exchanged Redeems
                        if (userQuest1.trade.redeems >= 10) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10\` redeems in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest1.trade.redeems = 0
                            author1.balance += 10000
                        } else if (userQuest1.trade.redeems <= 9) {
                            userQuest1.trade.redeems += trade.user1redeems
                        }

                        // Exchanged Pokemons
                        if (userQuest1.trade.pokemons >= 10) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10\` pokémons in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest1.trade.pokemons = 0
                            author1.balance += 10000
                        } else if (userQuest1.trade.pokemons <= 9) {
                            userQuest1.trade.pokemons += trade.user1pokemons.length
                        }
                        await userQuest1.save().catch(() => { })
                    }
                    if (userQuest2) {
                        // Total Trade
                        if (userQuest2.trade.total >= 10) {
                            interaction.channel.send(`<@${user1.id}>, you completed your one of the trading quest ( **complete 10 trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest2.trade.total = 0
                            author2.balance += 10000
                        } else if (userQuest2.trade.total <= 8) {
                            userQuest2.trade.total += 1
                        }

                        // Exchanged Credits
                        if (userQuest2.trade.credits >= 1000000) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10,00,000\` credits in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest2.trade.credits = 0
                            author2.balance += 10000
                        } else if (userQuest2.trade.credits <= 999999) {
                            userQuest2.trade.credits += trade.user2credits
                        }

                        // Exchanged Redeems
                        if (userQuest2.trade.redeems >= 10) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10\` redeems in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest2.trade.redeems = 0
                            author2.balance += 10000
                        } else if (userQuest2.trade.redeems <= 9) {
                            userQuest2.trade.redeems += trade.user2redeems
                        }

                        // Exchanged Pokemons
                        if (userQuest2.trade.pokemons >= 10) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10\` pokémons in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest2.trade.pokemons = 0
                            author2.balance += 10000
                        } else if (userQuest2.trade.pokemons <= 9) {
                            userQuest2.trade.pokemons += trade.user2pokemons.length
                        }
                        await userQuest2.save().catch(() => { })
                    }

                    await author1.markModified("pokemons")
                    await author1.save().catch(() => { })
                    await author2.markModified("pokemons")
                    await author2.save().catch(() => { })
                    await trade.delete()
                    user1.send({ embeds: [Embed] }).catch(() => { })
                    user2.send({ embeds: [Embed] }).catch(() => { })
                    return interaction.followUp({ content: `Trade **confirmed**, receipt has been sent to both user's Dm !` })
                } else return

            } else if (!trade.user1confirm && trade.user2confirm) {

                if (trade.user2id == interaction.user.id) {
                    return interaction.followUp({ content: `Trade is already **confirmed** from your side , waiting for another user to confirm!` })
                } else if (trade.user1id == interaction.user.id) {

                    let author1 = await User.findOne({ id: user1.id })
                    let author2 = await User.findOne({ id: user2.id })
                    if (!author1 || !author2) {
                        await trade.delete()
                        return interaction.followUp({ content: `ERROR, another user in trade is unavailable, trade has been cancelled !` })
                    }
                    author1.balance -= trade.user1credits
                    author2.balance -= trade.user2credits
                    author1.balance += trade.user2credits
                    author2.balance += trade.user1credits

                    author1.redeems -= trade.user1redeems
                    author2.redeems -= trade.user2redeems
                    author1.redeems += trade.user2redeems
                    author2.redeems += trade.user1redeems

                    for (var z = 0; z < trade.user1pokemons.length; z++) {
                        if (author1.pokemons.find(r => JSON.stringify(r) === JSON.stringify(trade.user1pokemons[z]))) {
                            let index = author1.pokemons.findIndex(x => JSON.stringify(x) == JSON.stringify(trade.user1pokemons[z]))
                            if (index > -1) {
                                author1.pokemons.splice(index, 1)
                                author2.pokemons.push(trade.user1pokemons[z])
                            } else {
                                return
                            }
                        }
                    }

                    for (var z = 0; z < trade.user2pokemons.length; z++) {
                        if (author2.pokemons.find(r => JSON.stringify(r) === JSON.stringify(trade.user2pokemons[z]))) {
                            let index = author2.pokemons.findIndex(x => JSON.stringify(x) == JSON.stringify(trade.user2pokemons[z]))
                            if (index > -1) {
                                author2.pokemons.splice(index, 1)
                                author1.pokemons.push(trade.user2pokemons[z])
                            } else {
                                return
                            }
                        }
                    }
                    let Embed = new MessageEmbed()
                        .setAuthor(`Your last trade: Trade between ${user1.username} & ${user2.username}`)
                        .setDescription(`To see more information about trading, use \`${prefix}help trade\` command !`)
                        .addFields(
                            {
                                name: `🔴 | ${user1.username}`,
                                value: `\`\`\`\n${trade.user1credits < 1 ? "Credit" : "Credits"}: ${trade.user1credits.toLocaleString().toLocaleString()}\n${trade.user1redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user1redeems.toLocaleString()}\n${trade.user1pokemons.map(x => `L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).join("\n")}\n\`\`\``,
                                inline: true
                            },
                            {
                                name: `🔴 | ${user2.username}`,
                                value: `\`\`\`\n${trade.user2credits < 1 ? "Credit" : "Credits"}: ${trade.user2credits.toLocaleString().toLocaleString()}\n${trade.user2redeems < 1 ? "Redeem" : "Redeems"}: ${trade.user2redeems.toLocaleString()}\n${trade.user2pokemons.map(x => `L${x.level} ${x.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${x.totalIV}% IV)`).join("\n")}\n\`\`\``,
                                inline: true
                            }
                        )
                        .setColor(color)

                    let userQuest1 = await Quests.findOne({ id: user1.id })
                    let userQuest2 = await Quests.findOne({ id: user2.id })
                    if (userQuest1) {
                        // Total Trade
                        if (userQuest1.trade.total >= 10) {
                            interaction.channel.send(`<@${user1.id}>, you completed your one of the trading quest ( **complete 10 trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest1.trade.total = 0
                            author1.balance += 10000
                        } else if (userQuest1.trade.total <= 8) {
                            userQuest1.trade.total += 1
                        }

                        // Exchanged Credits
                        if (userQuest1.trade.credits >= 1000000) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10,00,000\` credits in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest1.trade.credits = 0
                            author1.balance += 10000
                        } else if (userQuest1.trade.credits <= 999999) {
                            userQuest1.trade.credits += trade.user1credits
                        }

                        // Exchanged Redeems
                        if (userQuest1.trade.redeems >= 10) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10\` redeems in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest1.trade.redeems = 0
                            author1.balance += 10000
                        } else if (userQuest1.trade.redeems <= 9) {
                            userQuest1.trade.redeems += trade.user1redeems
                        }

                        // Exchanged Pokemons
                        if (userQuest1.trade.pokemons >= 10) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10\` pokémons in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest1.trade.pokemons = 0
                            author1.balance += 10000
                        } else if (userQuest1.trade.pokemons <= 9) {
                            userQuest1.trade.pokemons += trade.user1pokemons.length
                        }
                        await userQuest1.save().catch(() => { })
                    }
                    if (userQuest2) {
                        // Total Trade
                        if (userQuest2.trade.total >= 10) {
                            interaction.channel.send(`<@${user1.id}>, you completed your one of the trading quest ( **complete 10 trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest2.trade.total = 0
                            author2.balance += 10000
                        } else if (userQuest2.trade.total <= 8) {
                            userQuest2.trade.total += 1
                        }

                        // Exchanged Credits
                        if (userQuest2.trade.credits >= 1000000) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10,00,000\` credits in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest2.trade.credits = 0
                            author2.balance += 10000
                        } else if (userQuest2.trade.credits <= 999999) {
                            userQuest2.trade.credits += trade.user2credits
                        }

                        // Exchanged Redeems
                        if (userQuest2.trade.redeems >= 10) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10\` redeems in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest2.trade.redeems = 0
                            author2.balance += 10000
                        } else if (userQuest2.trade.redeems <= 9) {
                            userQuest2.trade.redeems += trade.user2redeems
                        }

                        // Exchanged Pokemons
                        if (userQuest2.trade.pokemons >= 10) {
                            interaction.channel.send(`<@${interaction.user.id}>, you completed your one of the trading quest ( **exchange \`10\` pokémons in trades** ) and you were rewarded with \`10,000\` credits !`)
                            userQuest2.trade.pokemons = 0
                            author2.balance += 10000
                        } else if (userQuest2.trade.pokemons <= 9) {
                            userQuest2.trade.pokemons += trade.user2pokemons.length
                        }
                        await userQuest2.save().catch(() => { })
                    }

                    await author1.markModified("pokemons")
                    await author1.save().catch(() => { })
                    await author2.markModified("pokemons")
                    await author2.save().catch(() => { })
                    await trade.delete()
                    user1.send({ embeds: [Embed] }).catch(() => { })
                    user2.send({ embeds: [Embed] }).catch(() => { })
                    return interaction.followUp({ content: `Trade **confirmed**, receipt has been sent to both user's Dm !` })
                } else return

            } else { }

        } else {
            return
        }
    }
}

