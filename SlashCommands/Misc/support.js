const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")


module.exports = {
    name: 'support',
    description: 'All Links for the Bot !',
    run: (client, interaction, args, color, prefix) => {

        let embed = new MessageEmbed()
            .addFields(
                {
                    name: 'Invite Link',
                    value: `[Click Here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`
                },
                {
                    name: 'Support Server',
                    value: `[Click Here](https://discord.gg/N9sPtTQ48a)`
                }
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(`Use " ${prefix}help " to check out all commands .`)
            .setColor(color)


        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Support Server")
                    .setStyle("LINK")
                    .setURL('https://discord.gg/N9sPtTQ48a'),
                new MessageButton()
                    .setLabel("Invite Bot")
                    .setStyle("LINK")
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
            )

        return interaction.followUp({ embeds: [embed], components: [row] })
    }
} 