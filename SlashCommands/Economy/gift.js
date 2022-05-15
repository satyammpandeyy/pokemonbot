const { MessageEmbed } = require('discord.js')
const User = require('../../models/user.js')
const { MessageActionRow, MessageButton, MessageCollector } = require("discord.js");

module.exports = {
    name: "gift",
    description: "Gift your item(s) and stuff(s) to another trainers.",
    cooldown: 5,
    options: [
        {
            name: 'user',
            description: 'Mention the user whom you want to gift.',
            required: true,
            type: 'USER'
        },
        {
            name: "item",
            description: "Select the type of gift.",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Credits",
                    value: "balance"
                },
                {
                    name: 'Redeems',
                    value: "redeems"
                },
                {
                    name: 'Pokémon(s)',
                    value: 'pokemons'
                },
                {
                    name: 'Shards',
                    value: 'shards'
                }
            ]
        },
        {
            name: 'value',
            description: 'Example : Credits: 5000 / Redeems: 5 / Pokémons: 1 2 3',
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction, args, color, prefix) => {

        let userx = interaction.options.getUser('user')
        if (userx.id == interaction.user.id) return interaction.followUp(`**Strange**, you wanna gift your own items to your own self ?!`)

        let user = await User.findOne({ id: userx.id })
        if (!user) return interaction.followUp({ content: `**${userx.tag}** must pick his starter pokémon using \`${prefix}start\` !` })

        let author = await User.findOne({ id: interaction.user.id })
        if (!author) return interaction.followUp({ content: `You must pick your starter pokémon using \`${prefix}start\` before using this command !` })

        let item = interaction.options.getString('item'), value

        const row = new MessageActionRow().addComponents(
            new MessageButton().setLabel("YES").setStyle("SUCCESS").setCustomId("yes"),
            new MessageButton().setLabel("NO").setStyle("DANGER").setCustomId("no"))
        const rowx = new MessageActionRow().addComponents(
            new MessageButton().setLabel("YES").setStyle("SUCCESS").setCustomId("yes").setDisabled(),
            new MessageButton().setLabel("NO").setStyle("DANGER").setCustomId("no").setDisabled())

        const filter = async (inter) => {
            if (interaction.user.id == inter.user.id) return true
            else {
                await inter.deferUpdate()
                inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                return false
            }
        }

        if (item != "pokemons") {

            value = interaction.options.getString('value')
            if (isNaN(value)) return interaction.followUp(`\`${value}\` is not a valid integer !`)
            value = parseInt(value)
            if (value <= 0) return interaction.followUp(`\`${value}\` is not a valid integer !`)
            if (value > author[item]) return interaction.followUp(`Error, you don't have enough \`${value}\` ${value > 1 ? item : item.slice(0, 1)} to gift ! `)

            let msg = await interaction.followUp({ content: `Do you confirm to gift \`${value}\` ${value == 1 && item != "balance" ? item.slice(0, -1) : item} to ${userx.tag} ?`, components: [row] })
            client.collector.push(interaction.user.id)
            const collector = await msg.createMessageComponentCollector({
                filter, max: 1, time: 30000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'yes') {
                    console.log(value)
                    author[item] -= value
                    await author.save().catch(() => {
                        return interaction.followUp({ content: `There was an unexpected error while gifting your item ( deducting your balance failed ), try again !` })
                    })
                    user[item] += value
                    await user.save().catch(() => {
                        return interaction.followUp({ content: `There was an unexpected error while gifting your item ( adding balance to mentioned failed ), try again !` })
                    })
                    if (user.dm && userx) userx.send(`GIFT, you have been gifted \`${value}\` ${value == 1 && item != "balance" ? item.slice(0, -1) : item} by ${interaction.user.tag} ! `).catch(() => { return })
                    return interaction.channel.send({ content: "Success!" })
                } else if (i.customId === 'no') {
                    return interaction.channel.send({ content: "Ok Aborted!" })
                }
            })

            collector.on('end', () => {
                client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                return interaction.editReply({ components: [rowx] })
            })

        } else {

            value = interaction.options.getString('value')
            if (author.pokemons.length == 0) return interaction.followUp("Error, you don't have any pokémon **available** to gift !")
            let pokes = [], num

            for (var x = 0; x < value.split(" ").length; x++) {
                if (!isNaN(value.split(" ")[x])) {
                    num = parseInt(value.split(" ")[x]) - 1
                    if (!author.pokemons[num]) return interaction.followUp({ content: "You don't have a pokémon with `" + (num + 1) + "` number !" })
                    pokes.push(author.pokemons[num])
                }
            }

            if (pokes.length == 1) p = "pokémon"
            else p = "pokémons"

            let msg = await interaction.followUp({
                content: `Do you confirm to gift the following ${p} to **${userx.tag}** ? \`\`\`\n${pokes.map(r => `Level ${r.level}${r.shiny ? " Shiny " : ""}${r.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} ( ${r.totalIV}% IV )`).join("\n")}\`\`\``,
                components: [row]
            })
            client.collector.push(interaction.user.id)

            const collector = await msg.createMessageComponentCollector({
                filter, max: 1, time: 30000
            })

            collector.on('collect', async i => {
                if (i.customId === 'yes') {
                    await i.deferUpdate()
                    for (var z = 0; z < pokes.length; z++) {
                        if (author.pokemons.find(r => r === pokes[z])) {
                            let index = author.pokemons.indexOf(pokes[z])
                            if (index > -1) {
                                await author.pokemons.splice(index, 1)
                                await user.pokemons.push(pokes[z])
                            }
                        }
                    }
                    await author.markModified("pokemons")
                    await user.markModified("pokemons")
                    await author.save().catch(() => { })
                    await user.save().catch(() => { })
                    return interaction.channel.send({ content: "Success!" })
                } else if (i.customId === 'no') {
                    await i.deferUpdate()
                    return interaction.channel.send({ content: "Ok Aborted!" })
                }
            })

            collector.on('end', () => {
                client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                return interaction.editReply({ components: [rowx] })
            })

        }
    }
}