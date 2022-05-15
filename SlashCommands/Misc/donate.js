const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require("discord.js");

module.exports = {
    name: "donate",
    description: "Support the bot and it's development.",
    run: async (client, interaction, args, color, prefix) => {
        let homepage = new MessageEmbed()
            .setAuthor({ name: `${client.user.username} - Donator Perks` })
            .setColor(color)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription("Support the bot and it's development.")
            .addFields(
                {
                    name: 'Paypal',
                    value: '[Click Here](https://paypal.me/)',
                    inline: true
                },
                {
                    name: 'Patreon',
                    value: `[Click Here](https://patreon.com/)`,
                    inline: true
                }
            )
            .setColor(color)
            .setFooter({ text: `Click buttons below to check out different donator tiers.` })

        let donationpage = new MessageEmbed()
            .setAuthor({ name: `${client.user.username} - Donator Perks` })
            .setColor(color)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription("Support the bot and it's development.")

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('donate-menu-' + interaction.id)
                    .setPlaceholder('Choose Tier Options')
                    .addOptions([
                        {
                            label: 'Home Page',
                            value: 'Home Donate Page',
                            description: 'Home Page',
                        },
                        {
                            label: 'Turtwig | 1$',
                            value: 'First Donate Page',
                            description: 'Get the list of perks you would get on joining 1$ Tier!',
                        },
                        {
                            label: 'Eevee | 5$',
                            value: 'Second Donate Page',
                            description: 'Get the list of perks you would get on joining 5$ Tier!',
                        },
                        {
                            label: 'Charizard | 10$',
                            value: 'Third Donate Page',
                            description: 'Get the list of perks you would get on joining 10$ Tier!',
                        },
                        {
                            label: 'Celebi | 25$',
                            value: 'Fourth Donate Page',
                            description: 'Get the list of perks you would get on joining 25$ Tier!',
                        },
                        {
                            label: 'Guzzlord | 50$',
                            value: 'Fifth Donate Page',
                            description: 'Get the list of perks you would get on joining 50$ Tier!',
                        },
                        {
                            label: 'Groudon | 75$',
                            value: 'Sixth Donate Page',
                            description: 'Get the list of perks you would get on joining 75$ Tier!',
                        },
                        {
                            label: 'Pokemon-Master | 100$',
                            value: 'Seventh Donate Page',
                            description: 'Get the list of perks you would get on joining 100$ Tier!',
                        }
                    ])
            )

        const rowx = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setDisabled()
                    .setCustomId('disabled-shop-menu')
                    .setPlaceholder('Choose Tier Options')
            )

        let msg = await interaction.followUp({ embeds: [homepage], components: [row] })

        const filter = async (inter) => {
            if (inter.isSelectMenu() && interaction.user.id == inter.user.id) return true
            else {
                await inter.deferUpdate()
                inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with menu!`, ephemeral: true })
                return false
            }
        }

        const collector = msg.createMessageComponentCollector({
            filter, time: 45000
        })

        collector.on('collect', async i => {
            await i.deferUpdate()
            if (i.values[0] == "Home Donate Page") {
                msg.edit({ embeds: [homepage] })
            } else if (i.values[0] == "First Donate Page") {
                donationpage.fields = [];
                donationpage
                    .addField('Bot Perks - 1$', `**->** 200 Shards\n**->** 3,000 Coins`, true)
                    .addField('Official Server Perks', `**->** Exclusive Donator Role\n**->** Access to Donator Only Text channels.\n**-> **Exclusive Giveaways`, true)

                msg.edit({ embeds: [donationpage] })
            } else if (i.values[0] == "Second Donate Page") {
                donationpage.fields = [];
                donationpage
                    .addField('Bot Perks - 5$', `**->** 600 Shards\n**->** 10,000 Coins\n**->** 1 Random Mythic`, true)
                    .addField('Official Server Perks', `**->** Exclusive Donator Role\n**->** Access to Donator Only Text channels.\n**-> **Exclusive Giveaways`, true)

                msg.edit({ embeds: [donationpage] })
            } else if (i.values[0] == "Third Donate Page") {
                donationpage.fields = [];
                donationpage
                    .addField('Bot Perks - 10$', `**->** 1,200 Shards\n**->** 50,000 Coins\n**->** 2 Random Mythic\n**->** 1 Random Leggy`, true)
                    .addField('Official Server Perks', `**->** Exclusive Donator Role\n**->** Access to Donator Only Text channels.\n**-> **Exclusive Giveaways`, true)

                msg.edit({ embeds: [donationpage] })
            } else if (i.values[0] == "Fourth Donate Page") {
                donationpage.fields = [];
                donationpage
                    .addField('Bot Perks - 25$', `**->** 2,000 Shards\n**->** 200,000 Coins\n**->** 3 Random Mythic\n**->** 1 Random Leggy\n**->** 1 Random Skin`, true)
                    .addField('Official Server Perks', `**->** Exclusive Donator Role\n**->** Access to Donator Only Text channels.\n**-> **Exclusive Giveaways`, true)

                msg.edit({ embeds: [donationpage] })
            } else if (i.values[0] == "Fifth Donate Page") {
                donationpage.fields = [];
                donationpage
                    .addField('Bot Perks - 50$', `**->** 3,000 Shards\n**->** 555,000 Coins\n**->** 5 Random Mythic\n**->** 2 Random Leggy\n**->** 3 Random Skin\n**->** 2 Shiny (1 Leggy/Mythic Of Choice)`, true)
                    .addField('Official Server Perks', `**->** Exclusive Donator Role\n**->** Access to Donator Only Text channels.\n**-> **Exclusive Giveaways`, true)

                msg.edit({ embeds: [donationpage] })
            } else if (i.values[0] == "Sixth Donate Page") {
                donationpage.fields = [];
                donationpage
                    .addField('Bot Perks - 75$', `**->** 4,000 Shards\n**->** 1,000,000 Coins\n**->** 5 Random Mythic\n**->** 2 Random Leggy\n**->** 3 Random Skin\n**->** 3 Shiny (1 Leggy/Mythic Of Choice)`, true)
                    .addField('Official Server Perks', `**->** Exclusive Donator Role\n**->** Access to Donator Only Text channels.\n**-> **Exclusive Giveaways`, true)

                msg.edit({ embeds: [donationpage] })
            } else if (i.values[0] == "Seventh Donate Page") {
                donationpage.fields = [];
                donationpage
                    .addField('Bot Perks - 100$', `**->** 7,000 Shards\n**->** 3,000,000 Coins\n**->** 5 Random Mythic\n**->** 5 Random Leggy\n**->** 5 Random Skin\n**->** 6 Shiny (1 Leggy/UB/Mythic Of Choice)`, true)
                    .addField('Official Server Perks', `**->** Exclusive Donator Role\n**->** Access to Donator Only Text channels.\n**-> **Exclusive Giveaways`, true)

                msg.edit({ embeds: [donationpage] })
            } else {
                msg.edit({ embeds: [homepage] })
            }
        })

        collector.on('end', () => {
            return msg.edit({ components: [rowx] }).catch(() => { })
        })
    }
}