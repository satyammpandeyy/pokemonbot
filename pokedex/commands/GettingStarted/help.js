const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
    name: "help",
    description: "Display the help menu!",
    category: "GettingStarted",
    args: false,
    usage: ["help <command>", "help ban", "help adas"],
    cooldown: 3,
    permissions: [],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {
        let embed = new MessageEmbed()
            .setAuthor(client.user.username + " Commands")
            .setDescription(`To see a page, just add the page number after the \`${prefix}help\` command.\nLike this: \`${prefix}help 2\`\n\n${client.user.username}'s Support Server: https://discord.gg/hFKYVFx3qG `)
            .addField("Page 1 | Getting Started!", `What you'll need to know to start using ${client.user.username}`)
            .addField("Page 2 | Pokémon Commands!", `The core commands of the bot.`)
            .addField("Page 3 | Pokémon Commands II!", `The core commands of the bot.`)
            .addField("Page 4 | Shop, Market, Auction & Trading", `Commands to do with the shop and buying items.`)
            .addField("Page 5 | Settings", `Help configuring ${client.user.username} in your server.`)
            .addField("Page 6 | Miscellaneous", `Commands that don't really fit in anywhere else.`)
            .addField("Page 7 | Filters", 'Commands that help filter your Pokémons.')
            .addField("Page 8 | Aliases", 'All Shortforms for Above commands.')
            .setFooter("Help Commands will be send to your DM.")

            .setColor(color)

        let embed1 = new MessageEmbed()
            .setAuthor(client.user.username + " Help | Getting Started")
            .setDescription(`Welcome to ${client.user.username}! If you haven't already, try using \`${prefix}start\` to find out how to get your first pokémon, then come back here and check out the other commands!\n${client.user.username}'s Support Server: https://www.google.com`)
            .addField(`${prefix}start`, 'Find out how to get your first Pokemon!')
            .addField(`${prefix}pick <Pokemon>`, 'Pick your starter Pokémon!')
            .addField(`${prefix}help [Command name]`, 'Displays the help message about the specific command.')
            .setColor(color)

        let embed2 = new MessageEmbed()
            .setAuthor(client.user.username + " Help | Pokémon Commands I")
            .setDescription(`If you need more information about a specific command, type \`${prefix}help <command>\``)
            .addField(`${prefix}info <pokemon>`, 'View info of your pokemon')
            .addField(`${prefix}select <pokemon>`, 'Selects a specific Pokemon')
            .addField(`${prefix}catch <Pokemon Name>`, 'Catch a spawned Pokemon.')
            .addField(`${prefix}profile`, 'Displays your profile.')
            .addField(`${prefix}pokemon [pageNo.] [filters]`, `Displays your pokemon collection`)
            .addField(`${prefix}pokedex [pageNo.] [filters]`, `Displays Pokedex`)
            .addField(`${prefix}nickname <nickname>`, 'Change nickname for your pokemon.')
            .addField(`${prefix}duel <@user>`, 'Duel with another trainer.')
            .addField(`${prefix}weak <pokemon>`, 'Displays Weakness of a pokemon.')
            .addField(`${prefix}gamble <@user> <amount>`, 'Gamble Pokemon Balance with another trainer.')
            .setColor(color)

        let embed3 = new MessageEmbed()
            .setAuthor(client.user.username + " Help | Pokémon Commands II")
            .setDescription(`If you need more information about a specific command, type \`${prefix}help <command>\`.`)
            // .addField(`${prefix}dropitem <pokemon>`, 'Drops a held item by your Pokemon')
            // .addField(`${prefix}moveinfo <move>`, 'Shows info about a move.')
            .addField(`${prefix}daily`, 'Vote for the bot every 12h and get rewards.')
            .addField(`${prefix}leaderboard <type>`, 'Displays top trainers on leaderboards for specific category.')
            .addField(`${prefix}release <Pokemon spot>`, 'Release your Pokemon into the wild.')
            .addField(`${prefix}moves `, 'Displays all moves that Pokemon can learn.')
            // .addField(`${prefix}tms <Pokemon name>`, 'Displays all TMs that Pokeman can learn.')
            .setColor(color)

        let embed4 = new MessageEmbed()
            .setAuthor(client.user.username + " Help | Shop, Market, Auction & Trading")
            .setDescription(`If you need more information about a specific command, type \`${prefix}help <command>\`.`)
            .addField(`${prefix}market`, 'Pokemon Market.')
            .addField(`${prefix}auction`, 'Auction your pokemon.')
            .addField(`${prefix}trade <@user>`, 'Trade your stuff with another trainer.')
            .addField(`${prefix}shop <page>`, 'Shows different Items available on shop.')
            .addField(`${prefix}balance`, 'Shows your Balance.')
            .setColor(color)

        let embed5 = new MessageEmbed()
            .setAuthor(client.user.username + " Server Settings")
            .setDescription(`If you need more information about a specific command, type \`${prefix}help <command>\`.`)
            .addField(`${prefix}redirect #channel`, 'Redirect spawns to a specific channel.')
            .addField(`${prefix}redirect reset`, 'Disables Spawn redirect.')
            .addField(`${prefix}enablespawn`, 'Disable Pokemon Spawns of the Server.')
            // .addField(`${prefix}commands`, 'Enables/Disables specific commands in current channel.')
            .addField(`${prefix}setprefix <prefix>`, 'Change prefix of bot commands for your server.')
            .setColor(color)

        let embed6 = new MessageEmbed()
            .setAuthor(client.user.username + " Miscellaneous")
            .addField(`${prefix}support`, `Join support server`)
            .addField(`${prefix}invite`, `Invite the bot`)
            .addField(`${prefix}donate`, `Donate us`)
            .addField(`${prefix}stats`, `Displays stats of the bot`)
            .addField(`${prefix}ping`, `Dispalys websocket latency`)
            .addField(`${prefix}send`, `Send message to the Official Bot Server`)
            .addField(`${prefix}claim`, `Claim the Premium Code`)
            .setColor(color)

        let embed7 = new MessageEmbed()
            .setAuthor(client.user.username + " Filters")
            .setDescription(`These are filters that can be used to order and find out your pokemons easily. \nNote: Only most used filters are specified here, if you wanna know all filters, Join support server by doing \`${prefix}support\`, we will help you out.`)
            .addField(`Filters`,
                `\`--shiny\` | Search for shiny Pokémon\n` +
                `\`--name <Pokémon#name>\` | Search for a certain Pokémon\n` +
                `\`--nick <Nickname>\` | Displays a Pokémon with a certain nickname\n` +
                `\`--level >/< <Level>\` | Search for Pokémon with a certain level\n` +
                `\`--type <Type>\` | Search for Pokémon with a certain type\n` +
                // `\`--price <Price>\` | Search for Pokémon with a certain price\n` +
                // `\`--mega\` | Search for mega Pokémon\n` +
                `\`--iv >/< <IV>\` | Search Pokémon with sum of their IVs\n` +
                `\`--legendary\` | Search for legendary Pokémon\n` +
                `\`--mythical\` | Search for mythical Pokémon\n` +
                `\`--ub\` | Search for Ultra Beast Pokémon\n` +
                `\`--alolan\` | Search for Alolan Pokémon\n` +
                `\`--starters\` | Search for starter Pokémon\n` +
                `\`--galarian\` | Search for galarian Pokémon\n` +
                `\`--alolan\` | Search for alolan Pokémon\n\n` +
                `Example: ${prefix}pk --spdef > 10\n\n` +
                `**${client.user.username}'s Support Server**: https://discord.gg/FK3BcWn3Wd`)
            .setColor(color)

        let embed8 = new MessageEmbed()
            .setAuthor("Gamble Help")
            .setDescription(`Gamble with other trainer. \n\n**Note: Gamble At Your own risk, if you lose high amount of money the ${client.user.username} PokéMania Team won't be responsible for that and ricks won't be returned.**`)
            .addField("Usage", `${prefix}gamble <@user> <amount>`)
            .setColor(color)


        let embed9 = new MessageEmbed()
            .setAuthor("Trading")
            .setDescription("Trade Pokémons/Balance/Redeems with other Trainers!")
            .addField("Usage", `${prefix}trade <@user>`)
            .addField(`${prefix}p add <pokemon#id>`, 'Add Pokemons to the ongoing Trade')
            .addField(`${prefix}p remove <pokemon#id>`, 'Removes added Pokemon from the ongoing Trade')
            .addField(`${prefix}cc add <amount>`, 'Add Balance to the ongoing Trade')
            .addField(`${prefix}cc remove <amount>`, 'Removes Balance from the ongoing Trade')
            .addField(`${prefix}r add <amount>`, 'Add Redeem(s) to the ongoing Trade')
            .addField(`${prefix}r remove <amount>`, 'Remove Redeem(s) from the ongoing Trade')
            .addField(`${prefix}confirm`, 'Confirms the Trade')
            .addField(`${prefix}cancel`, 'Cancels the Trade')
            
            .setColor(color)



        let embed10 = new MessageEmbed()
            .setAuthor("Market Commands")
            .setDescription(`${client.user.username} Market`)
            .addField("Usage", `${prefix}market`)
            .addField(`${prefix}market info <marketid>`, 'Display info about Pokemon listed in market')
            .addField(`${prefix}market remove <marketid>`, 'Removes your listed Pokemon from market')
            .addField(`${prefix}market buy <marketid>`, 'Buy a Pokemon from the market')
            .addField(`${prefix}market search <--filter>`, 'Seach market for a Pokémon')
            .addField(`${prefix}market listings`, 'Shows all Pokemons you listed in market')
            .addField(`${prefix}market list <Pokemon> <price>`, 'Lists your Pokémon in market')
            .setColor(color)
        
        let embed11 = new MessageEmbed()
        .setAuthor("Server Configuration")
        .setDescription("Enable/Disable Commands")
        .addField("Prefix", `${prefix}prefixset <new prefix>`, true)
        .addField("Level Up Messages", `${prefix}serversilence`)
        .addField("All Commands",'Start, Pick, Daily, Gamble/Bet, Pokemon/pk, Info/i, Profile/pf, Pokedex/dex, Trade/t, Market/m, Auction/a, Moves, Weak, Team, Shop, Hint, Nickname/nick, Shiny hunt/sh, Select, Balance/bal, Back/b, Next/n, Redeem, Buy, Release, Order, Levelup message, Leaderboard/lb, moveinfo/mi and Duel')
        .setFooter(`You can toggle them by ${prefix}enable <command name> or ${prefix}disable <command name> `)
        .setColor("#fff200")

        let auction = new MessageEmbed()
        .setAuthor("Äuction Command")
        .setDescription("Äuction your Pokemon and Let other trainers Bid for it.")
        .addField("Usage",`${prefix}auction`)
        .addField(`${prefix}auction list <pokemon#id> <auction_time>`,'List your Pokémon in the Auctions.')
        .addField(`${prefix}auction listings`,'Shows all Your Listings in the Auctions.')
        .addField(`${prefix}auction remove <pokemon#id>`,'Remove your Pokémon from the Auctions.')
        .addField(`${prefix}auction info <auction#id>`,'Get The info of Pokemon listed in the Auctions.')
        .addField(`${prefix}auction bid <auction#id> <amount>`,'Bid for a specific Pokémon in the Auctions.')
        .addField(`${prefix}auction search [page] [filters]`,'Search for Pokémon in the Auctions.')
        .setColor("#fff200")

        if (!args[0]) {
            message.channel.send(embed)
        } else {
            if (args[0] === "1") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed1).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else if (args[0] === "2") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed2).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled, kindly allow me to send DM's.")
                })
            } else if (args[0] === "3") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed3).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else if (args[0] === "4") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed4).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else if (args[0] === "5") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed5).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else if (args[0] === "6") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed6).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else if (args[0] === "7") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed7).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else if (args[0] === "gamble") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed8).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else if (args[0] === "trade") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed9).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else if (args[0] === "config") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed11).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else if (args[0] === "market") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed10).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
                } else if (args[0] === "auction") {
                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(auction).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            } else {
                let cmd = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
                if ((!cmd) || (cmd.category == "Dev" && !client.config.owners.includes(message.author.id))) return message.channel.send("That's not a valid command!")

                let embed3 = new MessageEmbed()
                    .setAuthor(client.user.username + " Help | " + prefix + cmd.name)
                    .addField("Description:", cmd.description)
                    .setColor("#fff200")
                    // .setFooter("When using options in a command, don't include \"<\" and \">\"!")
                cmd.options ? embed3.addField("Options:", cmd.options.join("\n")) : embed3.addField("Usage:", usage = cmd.usage.join("\n"));

                message.channel.send("Sent you a DM containing the help message!")
                return message.author.send(embed3).catch(e => {
                    if (e.message.toLowerCase() === "cannot send messages to this user") return message.channel.send("Your DM's are disabled kindly allow me to send DM's.")
                })
            }
        }
    }
}