const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const Guild = require('../../models/guild.js')
module.exports = {
    name: "redirect",
    description: "Redirect your pokemon spawns to specific channels.",
    options: [
        {
            name: "channel_1",
            description: "Mention Channel 1",
            type: "CHANNEL",
            channelTypes: ['GUILD_TEXT'],
            required: true
        },
        {
            name: "channel_2",
            description: "Mention Channel 2",
            type: "CHANNEL",
            channelTypes: ['GUILD_TEXT'],
            required: false
        },
        {
            name: "channel_3",
            description: "Mention Channel 3",
            type: "CHANNEL",
            channelTypes: ['GUILD_TEXT'],
            required: false
        },
        {
            name: "channel_4",
            description: "Mention Channel 4",
            type: "CHANNEL",
            channelTypes: ['GUILD_TEXT'],
            required: false
        },
        {
            name: "channel_5",
            description: "Mention Channel 5",
            type: "CHANNEL",
            channelTypes: ['GUILD_TEXT'],
            required: false
        }
    ],
    run: async (client, interaction, args, prefix, color) => {

        let guild = await Guild.findOne({ id: interaction.guild.id })
        if (!guild) {
            guild = new Guild({ id: interaction.guild.id })
            await guild.save()
        }
        guild = await Guild.findOne({ id: interaction.guild.id })

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.followUp('You need "**MANAGE_MESSAGES**" permission to use this command.')

        let channel1 = interaction.options.getChannel("channel_1")
        let channel2 = interaction.options.getChannel("channel_2")
        let channel3 = interaction.options.getChannel("channel_3")
        let channel4 = interaction.options.getChannel("channel_4")
        let channel5 = interaction.options.getChannel("channel_5")

        let a = []

        if (channel1) a.push(channel1.id)
        if (channel2) a.push(channel2.id)
        if (channel3) a.push(channel3.id)
        if (channel4) a.push(channel4.id)
        if (channel5) a.push(channel5.id)

        a = removeDuplicateArrayValues(a)
        guild.spawnchannel = [...a]
        await guild.save().catch(() => { })

        return interaction.followUp({ content: `Spawn ${a.length == 1 ? "channel has" : "channels have"} been set to ${a.map(x => `<#${x}>`)}.` })
    }
}

function removeDuplicateArrayValues(arr) {
    return arr.filter((value, index) => (
        arr.indexOf(value) === index
    ));
}