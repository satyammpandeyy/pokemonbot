const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const Commands = require('../../models/commands.js')
const User = require('../../models/user.js')

module.exports = {
    name: "command",
    description: "Disable/Enable Commands in specific channel.",
    options: [
        {
            name: "enable",
            description: "Provide command name that needs to be enabled.",
            type: 3,
            required: false
        },
        {
            name: "disable",
            description: "Provide command name that needs to be disabled.",
            type: 3,
            required: false
        },
    ],
    run: async (client, interaction, args, color, prefix) => {

        let userx = await User.findOne({ id: interaction.user.id })
        if (!userx) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        let cmd = await Commands.findOne({ channelId: interaction.channel.id })
        if (!cmd) await new Commands({ channelId: interaction.channel.id }).save()
        cmd = await Commands.findOne({ channelId: interaction.channel.id })

        let enableCmdName = interaction.options.getString('enable')?.toLowerCase().trim().replace(/ /g, "-")
        let disableCmdName = interaction.options.getString('disable')?.toLowerCase().trim().replace(/ /g, "-")

        if (disableCmdName && enableCmdName) {
            return interaction.followUp({
                content: `**Wrong** command usage, cannot use both parameters at once!\n\`\`\`\n${prefix}command [enable]/[disable]\n\`\`\``
            })
        } else if (enableCmdName) {
            if (enableCmdName == 'all') {
                cmd.disabledCommands = []
                await cmd.markModified("disabledCommands")
                await cmd.save().catch(() => { })
                return interaction.followUp({ content: `Success, all commands have been enabled in <#${interaction.channel.id}> !` })
            } else {
                if (!client.slashCommands.get(enableCmdName)) return interaction.followUp('This command does **not exist** in the bot or maybe you made a typo !')
                if ((cmd.disabledCommands.indexOf(enableCmdName)) == -1) return interaction.followUp({ content: `Error, **${enableCmdName}** is already enabled in this channel !` })
                cmd.disabledCommands.splice(cmd.disabledCommands.indexOf(enableCmdName), 1)
                await cmd.markModified("disabledCommands")
                await cmd.save().catch(() => { })
                return interaction.followUp({ content: `Success, **${enableCmdName}** command has been enabled in <#${interaction.channel.id}> !` })
            }
        } else if (disableCmdName) {
            if (disableCmdName == 'all') {
                client.slashCommands.forEach((c) => {
                    cmd.disabledCommands.push(c.name)
                })
                await cmd.markModified("disabledCommands")
                await cmd.save().catch(() => { })
                return interaction.followUp({ content: `Success, all commands have been disabled in <#${interaction.channel.id}> !` })
            } else {
                if (!client.slashCommands.get(disableCmdName)) return interaction.followUp('This command does **not exist** in the bot or maybe you made a typo !')
                if ((cmd.disabledCommands.indexOf(disableCmdName)) > -1) return interaction.followUp({ content: `Error, **${disableCmdName}** is already disabled in this channel !` })
                cmd.disabledCommands.push(disableCmdName)
                await cmd.markModified("disabledCommands")
                await cmd.save().catch(() => { })
                return interaction.followUp({ content: `Success, **${disableCmdName}** command has been disabled in <#${interaction.channel.id}> !` })
            }
        } else if (!(disableCmdName && enableCmdName)) {

            let abc = []
            cmd.disabledCommands.map((x) => {
                abc.push(x)
            })
            abc.splice(abc.indexOf("command"), 1)

            let embed = new MessageEmbed()
                .setAuthor(`Channel Command Overwrites for ${interaction.channel.name}`)
                .setDescription(`Enable/Disable a specific command using \`${prefix}command [enable]/[disabled]\`.`)
                .addFields(
                    {
                        name: "Disabled Commands",
                        value: `\`\`\`\n${abc.length === 0 ? "None" : abc.join(", ").slice(0, 1020)}\n\`\`\``
                    }
                )
                .setColor(color)

            return interaction.followUp({ embeds: [embed] })

        } else {
            return interaction.followUp({
                content: `**Wrong** command usage, cannot use both parameters at once!\n\`\`\`\n${prefix}command [enable]/[disable]\n\`\`\``
            })
        }
    }
} 