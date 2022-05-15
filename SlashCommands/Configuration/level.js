const Guild = require('../../models/guild.js')

module.exports = {
    name: "level",
    description: "Configure Level Ups in your guild.",
    options: [
        {
            type: 'SUB_COMMAND',
            name: "enable",
            description: "Enable Level up in your guild."
        },
        {
            type: 'SUB_COMMAND',
            name: "disable",
            description: "Disable Level up in your guild."
        },
        {
            type: 'SUB_COMMAND',
            name: "redirect",
            description: "Redirect Level up in your guild.",
            options: [
                {
                    name: "channel",
                    description: "Mention the channel to redirect level ups to.",
                    type: "CHANNEL",
                    channelTypes: ['GUILD_TEXT'],
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "redirect_reset",
            description: "Reset redirected channelled level up in your guild."
        },
    ],
    run: async (client, interaction, args, color, prefix) => {

        const guild = await Guild.findOne({ id: interaction.guild.id })
        if (!guild) {
            await new Guild({ id: interaction.guild.id }).save()
            guild = await Guild.findOne({ id: interaction.guild.id })
        }

        let [subcommand] = args
        if (subcommand == "enable") {
            guild.levelupbtn = true
            await guild.save().catch(() => { })
            return interaction.followUp({ content: `Success, Level ups have been enabled in **${interaction.guild.name}** !` })
        } else if (subcommand == "disable") {
            guild.levelupbtn = false
            await guild.save().catch(() => { })
            return interaction.followUp({ content: `Success, Level ups have been disabled in **${interaction.guild.name}** !` })
        } else if (subcommand == "redirect") {
            let channel = interaction.options.getChannel('channel')
            guild.levelupchannel = channel.id
            guild.levelupbtn = true
            await guild.save().catch(() => { })
            return interaction.followUp({ content: `Success, Level ups have been redirected to <#${channel.id}> !` })
        } else if (subcommand == "redirect_reset") {
            guild.levelupchannel = null
            guild.levelupbtn = true
            await guild.save().catch(() => { })
            return interaction.followUp({ content: `Success, Level ups have been resetted !` })           
        } else {
            return interaction.followUp({
                content: `**Wrong** command usage, cannot use all parameters at once!\n\`\`\`\n${prefix}level [enable]/[disable]/[redirect]\n\`\`\``
            })
        }
    }
}