const Discord = require('discord.js')

module.exports = {
    name: "termsofservice",
    description: `Pokesoul - Terms of Service.`,
    run: async (client, interaction, args, color, prefix) => {

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Terms Of Service`)
            .setDescription(`The client agrees to follow the contract by accessing provider's site and communicating with Discord. Violation of the ToS results into a punishment. Headings in this agreement, are labeled completely capitalized, bold lettering, and any adjacent ones shall not be of legal enforcement nor any effect to the contract. May the same apply to Sub-Headings which are of bold and semi capitalized lettering.\nMay any definition within the agreement be of equal affect in the adjacent documents, Privacy Policy, Terms of Service, Acceptable Use Policy, Service Level Agreement, Discord Rules.`)
            .addFields(
                {
                    name: `Goverment Laws`,
                    value: `The governing factor of this agreement hereby is India.`
                },
                {
                    name: `Must Follow Rules`,
                    value: `You must be above 13 of age to play the bot.\nDo not fight with other people who play this bot.`
                },
                {
                    name: "Donation Refund request",
                    value: "After you have donated you can create a ticket at create - ticket and claim you rewards and if you want Refund you should again Create a ticket for refund under 2 working days of The staff Team"
                },
                {
                    name: "Our Rights",
                    value: "We have rights to change our TOS anytime, Suspend your account, ban you from our server, add / remove stuffs from your account, Delete your account from our database."
                },
                {
                    name: "Your Rights",
                    value: "if you have started playing the bot and you want your data to be deleted then you can contact developers."
                },
                {
                    name: "Data we Collect and uses of that data",
                    value: "We collect message ids of each message on the server for pokemon spawns, leveling, and raids.\nWe collect channel IDs And server ids for it too. User id are required once to create a new account for you in our database.\nIf you visit our website, then we collect your IP Address to protect us from fraud and DDoSing\n**We do not store any data on our systems.**"
                },
                {
                    name: "Date we Store and uses",
                    value: "Pokesoul Bot runs on a virtual private server (VPS) located in Europe. Copies of this in-game bot data might be made only for backup purposes or for Test environments and also for planning of future bot updates. These copies are volatile in nature and are discarded within the minimum time span possible as soon as they serve their purpose. Also to note, no data other than the in-game bot data is stored. **Also to note, none of the user or server specific data is publicly available.**"
                },
                {
                    name: "Data Sharing",
                    value: "None of the data, either collected actively or passively, through the use of Bot will ever be shared with third-parties for any reasons. In the event of a legal or law enforcement request, we are obligated to turn over what information the jurisdiction has requested under applicable law after confirming that we have information that may be relevant to an investigation."
                },
                {
                    name: 'Statistic',
                    value: 'For improvisation, better monitoring and rectifications, aggregate data for the bot commands is collected. For example, our Bot collects data like the enumeration of commands (globally) executed, while maintaining the anonymity of the user. Also to note, none of this data is user or server specific.'
                },
                {
                    name: "COPPA AND DMCA",
                    value: "You / your company don't have any rights to file DMCA to bot if you have used a single command of bot or joined this server.\nIf there is any thing that you have complain against us, before taking any action kindly dm any one from the ones mentioned in the following list:\n<@636158569338634272>\n<@778911797054930955>\n<@644226338798043146>\n<@881491259095654420>\n<@474529598504304641>\n<@909404290244808734>"
                },
            )
            .setFooter(`${client.user.username} TOS - Last Updated: 21 January, 2022`)
            .setColor(color)
        return interaction.followUp({ embeds: [embed] })
    }
}