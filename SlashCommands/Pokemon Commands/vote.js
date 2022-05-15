const User = require('../../models/user.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const ms = require('ms')


module.exports = {
    name: "vote",
    description: "Get credit rewards every day for just clicking a button!",
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!")

        // let expire = 86400000 * 2 // 48 Hours
        // user.vote.votedAt = Date.now() - expire
        // if (expire - (Date.now() - user.vote.votedAt) < 0) {
        //     user.vote.votedAt = 0
        //     user.vote.totalVotes = 0
        //     await user.save().catch(() => { })
        // }

        let timeout = 86400000 / 2 // 12 Hours
        let time = ms(timeout - (Date.now() - user.vote.votedAt))
        if (time < 0) time = "12h"


        let streak = "❌❌❌❌❌❌❌"
        if (user.vote.totalVotes == 1) streak = "🔥❌❌❌❌❌❌"
        if (user.vote.totalVotes == 2) streak = "🔥🔥❌❌❌❌❌"
        if (user.vote.totalVotes == 3) streak = "🔥🔥🔥❌❌❌❌"
        if (user.vote.totalVotes == 4) streak = "🔥🔥🔥🔥❌❌❌"
        if (user.vote.totalVotes == 5) streak = "🔥🔥🔥🔥🔥❌❌"
        if (user.vote.totalVotes == 6) streak = "🔥🔥🔥🔥🔥🔥❌"
        if (user.vote.totalVotes > 6) streak = "🔥🔥🔥🔥🔥🔥🔥"

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("VOTE LINK")
                    .setStyle("LINK")
                    .setURL(`https://top.gg/bot/${client.user.id}/vote`)
            )

        client.topgg.hasVoted(interaction.user.id).then(c => {
            if (c) {
                vtimer = `You have already voted, come back later !`
            } else {
                vtimer = `You haven't voted, [vote now !](https://top.gg/bot/${client.user.id}/vote)`
            }

            let embed = new MessageEmbed()
                .setTitle("Voting Rewards")
                .setDescription(`${interaction.user.tag}\n[Vote for the bot every 12 hours to gain rewards.](https://top.gg/bot/${client.user.id}/vote) Voting for the bot multiple days in a row will increase your streak and give you a chance at better rewards!`)
                .addField("Voting Streak", `${streak}\nCurrent Voting Streak: ${user.vote.totalVotes} Days`)
                .addField("Vote Timer", `${vtimer}`)
                .addField("Available Reward Chests", `<:pokesoul_bronze_crate:930883156578558012> **Bronze**: ${user.crates.bronzecrate}\n<:pokesoul_silver_crate:930883002974744656> **Silver**: ${user.crates.silvercrate}\n<:pokesoul_golden_crate:930883033345687562>  **Golden**: ${user.crates.goldencrate} \n <:pokesoul_diamond_crate:930883114065080320> **Diamond**: ${user.crates.diamondcrate}\n<:pokesoul_crystal_crate:930883070373023874> **Deluxe**: ${user.crates.deluxecrate}`)
                .addField("Claiming  Rewards", `Use \`${prefix}crate open <name> [amount]\` to open your reward crates.`)
                .setColor(color)

            return interaction.followUp({ embeds: [embed], components: [row] })
        })
    }
} 