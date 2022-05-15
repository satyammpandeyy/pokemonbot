const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const Guild = require('../../models/guild.js')
module.exports = {
    name: "prefix",
    description: "Check the current prefix or change your guild prefix.",
    run: async (client, interaction, args, color, prefix) => {

        let guild = await Guild.findOne({ id: interaction.guild.id })
        if (!guild) {
            await new Guild({ id: interaction.guild.id }).save();
            guild = await Guild.findOne({ id: interaction.guild.id })
        }
        

        let embed = new MessageEmbed()
            .addField(`Heyy , I am ${client.user.username}!`, "The current prefix for this server is `" + guild.prefix || prefix + "`")
            .setColor(color)

        let newPrefix = interaction.options.getString('new_prefix')
        if (!newPrefix) return interaction.followUp({ embeds: [embed] })
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.followUp('You need "**MANAGE_MESSAGES**" permission to use this command.')

        const row = new MessageActionRow()
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
        const rowx = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("YES")
                    .setStyle("SUCCESS")
                    .setCustomId("yes")
                    .setDisabled(),
                new MessageButton()
                    .setLabel("NO")
                    .setStyle("DANGER")
                    .setCustomId("no")
                    .setDisabled()
            )

        let msg = await interaction.followUp({ content: `Do you Confirm to Set New Prefix to \`${newPrefix}\` ?`, components: [row] })
        client.collector.push(interaction.user.id)

        const filter = async (inter) => {
            if (interaction.user.id == inter.user.id) return true
            else {
                await inter.deferUpdate()
                inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                return false
            }
        }

        const collector = await msg.createMessageComponentCollector({
            filter, max: 1, time: 30000
        })

        collector.on('collect', async i => {
            await i.deferUpdate()
            if (i.customId === 'yes') {
                guild.prefix = newPrefix
                await guild.save().catch(() => { })
                return interaction.channel.send({ content: "Success!" })
            } else if (i.customId === 'no') {
                return interaction.channel.send({ content: "Ok Aborted!" })
            } else return
        })

        collector.on('end', () => {
            interaction.editReply({ components: [rowx] })
            client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
            return
        })
    }
}