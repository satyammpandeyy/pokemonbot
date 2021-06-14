const Discord = require("discord.js");
const pagination = require('discord.js-pagination');
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const { capitalize } = require('../../functions.js');
const ms = require("ms");
const mega = require("../../db/mega.js");
let levelUp = require("../../db/levelup.js");

module.exports = {
    name: "shop",
    description: "Displays stuff available in shop",
    category: "Economy",
    args: false,
    usage: ["shop"],
    cooldown: 3,
    permissions: [],
    aliases: [""],
    execute: async (client, message, args, prefix, guild, color, channel) => {        
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");

        let embed = new MessageEmbed()
            .setColor(color)
            .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} cc`)
            .setDescription(`See a specific page of shop by using the shop ${prefix}shop <page number> command.`)
            .addField("Shop Page 1", 'XP Boosters & Rare Candies')
            .addField("Shop Page 2", 'Rare Stones & Evolution Items')
            .addField("Shop Page 3", 'Nature Mints Shop')
            .addField("Shop Page 4", 'Held Items Shop')
            .addField("Shop Page 5", 'Mega Evolutions Shop')
            .addField("Shop Page 6", 'Shards Shop')
            .addField("Shop Page 7", 'Upvotes Shop')
            .addField("Shop Page 8", 'Normal Pokemon Forms')
            .addField("Shop Page 9", 'Mythical & Legendary Pokemon Forms')
            .addField("Shop Page 10", 'Gigantamax Forms')
            .addField("Shop Page 11", 'Shadow Forms')


            .setThumbnail(client.user.displayAvatarURL())

        let embed1 = new MessageEmbed()
            .setColor(color)
            .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} \nShop 1 (1/2) - XP Boosters`)
            .setDescription("Get XP boosters to increase your XP gain from chatting and battling.")
            .addField("30 Mins - 2X Multiplier | Cost: 20 ", `**Usage**: \`${prefix}shopbuy 1 30min\``)
            .addField("1 Hour - 2X Multiplier | Cost: 40 ", `**Usage**: \`${prefix}shopbuy 1 1hour\``)
            .addField("2 Hours - 2X Multiplier | Cost: 70 ", `**Usage**: \`${prefix}shopbuy 1 2hour\``)
            .addField("3 Hours - 2X Multiplier | Cost: 90 ", `**Usage**: \`${prefix}shopbuy 1 3hour\``)
          

        let embed01 = new MessageEmbed()
            .setColor(color)
            .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ツ\nShop 1 (2/2) - Rare Candies`)
            .addField("Cost:  75 cc/Each", `Rare candies level up your selected pokémon by one level for each candy you feed it.`)
            .addField("Usage", `\`${prefix}shopbuy 1 candy <amount>\``)
            .setThumbnail(client.user.displayAvatarURL())


        let embed2 = new MessageEmbed()
            .setColor(color)
            .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} cc\nShop 2 - Rare Stones & Evolution Items`)
            .setDescription("Some pokémon don't evolve through leveling and need an evolution stone or high friendship to evolve. Here you can find all the evolution stones as well as a friendship bracelet for friendship evolutions.\n\n**All these items cost 150 cc.**")
            .addField("Dawn Stone", '-', true)
            .addField("Dusk Stone", '-', true)
            .addField("Fire Stone", '-', true)
            .addField("Ice Stone", '-', true)
            .addField("Leaf Stone", '-', true)
            .addField("Moon Stone", '-', true)
            .addField("Shiny Stone", '-', true)
            .addField("Sun Stone", '-', true)
            .addField("Thunder Stone", '-', true)
            .addField("Water Stone", '-', true)
            .addField("Friendship Bracelet", '-', true)


        let embed3 = new MessageEmbed()
            .setColor(color)
            .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} CC\nShop 3 - Nature Mints`)
            .setDescription("Nature modifiers change your selected pokémon's nature to a nature of your choice for cc. Use `p!shop 3 buy nature <nature>` to buy the nature you want!\n\nAll nature modifiers cost 50 cc")
            .addField("Adamant Mint", '+10% Attack\n-10% Sp. Atk', true)
            .addField("Bashful Mint", 'No Effect', true)
            .addField("Bold Mint", '+10% Defense\n-10% Attack', true)
            .addField("Brave Mint", '+10% Attack\n-10% Speed', true)
            .addField("Calm Mint", '+10% Sp. Def\n-10% Attack', true)
            .addField("Careful Mint", '+10% Sp. Def\n-10% Sp. Atk', true)
            .addField("Docile Mint", 'No effect', true)
            .addField("Gentle Mint", '+10% Sp. Def\n-10% Defense', true)
            .addField("Hardy Mint", 'No effect', true)
            .addField("Hasty Mint", '+10% Speed\n-10% Defense', true)
            .addField("Impish Mint", '+10% Defense\n-10% Sp. Atk', true)
            .addField("Jolly Mint", '+10% Speed\n-10% Sp. Atk', true)
            .addField("Lax Mint", '+10% Defense\n-10% Sp. Def', true)
            .addField("Lonely Mint", '+10% Attack\n-10% Defense', true)
            .addField("Mild Mint", '+10% Sp. Attack\n-10% Defense', true)
            .addField("Modest Mint", '+10% Sp. Attack\n-10% Sp. Atk', true)
            .addField("Naive Mint", '+10% Speed\n-10% Sp. Def', true)
            .addField("Naughty Mint", '+10% Attack\n-10% Sp. Def', true)
            .addField("Quiet Mint", '+10% Attack\n-10% Speed', true)
            .addField("Quirky Mint", 'No Effect', true)
            .addField("Rash Mint", '+10% Sp. Attack\n-10% Sp. Def', true)
            .addField("Relaxed Mint", '+10% Defense\n-10% Speed', true)
            .addField("Sassy Mint", '+10% Sp. Def\n-10% Speed', true)
            .addField("Serious Mint", 'No Effect', true)
            .addField("Timid Mint", '+10% Speed\n-10% Attack', true)

        let embed4 = new MessageEmbed()
            .setColor(color)
            .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} CC\nShop 4 - Held Items`)
            .setDescription("Buy items for your pokémon to hold using `shop 4 buy item <item name>`\n\n**All these items cost 75 cc**")
            .addField("King's Rock", 'Held item for your Pokémon.', true)
            .addField("Deep Sea Tooth", 'Held item for your Pokemon', true)
            .addField("Deep Sea Scale", 'Held item for your Pokemon', true)
            .addField("Metal Coat", 'Held item for your Pokemon', true)
            .addField("Dragon Scale", 'Held item for your Pokemon', true)
            .addField("Upgrade", 'Held item for your Pokemon', true)
            .addField("Protector", 'Held item for your Pokemon', true)
            .addField("Electirizer", 'Held item for your Pokemon', true)
            .addField("Magmarizer", 'Held item for your Pokemon', true)
            .addField("Dubious Disc", 'Held item for your Pokemon', true)
            .addField("Reaper Cloth", 'Held item for your Pokemon', true)
            .addField("Whipped Dream", 'Held item for your Pokemon', true)
            .addField("Sachet", 'Held item for your Pokemon', true)
            .addField("Everstone", 'Prevents pokémon from evolving.', true)
            .addField("XP Blocker", 'Prevents pokémon from gaining XP.', true)
            .addField("Prism Scale", 'Held item for your Pokemon', true)
            .setThumbnail(client.user.displayAvatarURL())

        let embed5 = new MessageEmbed()
            .setColor(color)
            .setAuthor(`Balance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} CC\nShop 5 - Mega Evolutions`)
            .setDescription("**All mega evolution costs 1000 cc.**")
            .addField("Regular Mega Evolution", `${prefix}shopbuy 5 mega`, true)
            .addField("X Mega Evolution", `${prefix}shopbuy 5 mega x`, true)
            .addField("Y Mega Evolution", `${prefix}shopbuy 5 mega y`, true)
            .setThumbnail(client.user.displayAvatarURL())

        let embed6 = new MessageEmbed()
            .setAuthor(`Shards: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} \nBalance: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} \nShop 6 (1/2) - Exchange Shards`)
            .setDescription("Incase you are not donator and you want Shards Premium currency , you can exchange your balance  with Shards.")
            .addField("5000 Balance cc - 3 Shards", `${prefix}shopbuy 6 3sh`)
            .addField("10000 Balance cc - 10 Shards", `${prefix}shopbuy 6 10sh`)
            .addField("20000 Balance cc - 25 Shards", `${prefix}shopbuy 6 25sh`)
            .addField("50000 Balance cc - 80 Shards", `${prefix}shopbuy 6 80sh`)
            .addField("100000 Balance cc - 150 Shards", `${prefix}shopbuy 6 150sh`)
            .setColor(color)
            .setFooter("Refer Shop 6 (2/2) to see items that can be bought with Shards")
            .setThumbnail(client.user.displayAvatarURL())


        let embed7 = new MessageEmbed()
            .setAuthor(`Shards: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nShop 6 (2/2) - Shards Buy Item`)
            .setDescription("We have a variety of items that you can purchase using shards.")
            .addField("Redeem - 200 Shards Each", `Get any spawnable Pokémon of your choice.\n\`${prefix}shopbuy 6 redeem <amount>\``)
            // .addField("Shiny Charm - 1000 shards", 'Increases the shiny catch rate by 20% for 1 week.\n`p!shop 7 buy shiny charm`')
            // .addField("Spawn Boost - 1000 shards", 'Increases Spawn Rate by 33.3% for 1 day.\n`p!shop 7 buy spawn boost`')
            .setColor(color)
            .setFooter("Shards are premium currency and can be obtained by Donating IRL Money or exchanging CC.")
            .setThumbnail(client.user.displayAvatarURL())


        let embed8 = new MessageEmbed()
            .setAuthor(`Upvotes: ${user.upvotes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nShop 7 - Upvotes Shop`)
            .setDescription("We have a variety of items that you can purchase using Upvotes.")
            .addField("Redeem - 30 Upvotes each", 'Get any spawnable pokémon of your choice.\n`p!shopbuy 7 redeem <amount>`')
            .setColor(color)
            .setFooter(`Upvotes are Vote Rewards and can be obtained only by Voting for the Bot every 12h ( 1 Vote = 1 Upvote ) \nRefer ${prefix}daily`)
            .setThumbnail(client.user.displayAvatarURL())


        let embed9 = new MessageEmbed()
            .setAuthor("Shop 8 - Normal Pokemon Forms")
            .setDescription("Some pokémon have different forms, you can buy them here to allow them to transform.")
            .addField("Castform", `\`${prefix}shop 8 forms castform\``, true)
            .addField("Wormadam", `\`${prefix}shop 8 forms wormadam\``, true)
            .addField("Basculin", `\`${prefix}shop 8 forms basculin\``, true)
            .addField("Greninja", `\`${prefix}shop 8 forms greninja\``, true)
            .addField("Aegislash", `\`${prefix}shop 8 forms aegislash\``, true)
            .addField("Oricorio", `\`${prefix}shop 8 forms oricorio\``, true)
            .addField("Lycanroc", `\`${prefix}shop 8 forms lycanroc\``, true)
            .addField("Rotom", `\`${prefix}shop 8 forms rotom\``, true)
            .addField("Cherrim", `\`${prefix}shop 8 forms cherrim\``, true)
            .addField("Wishiwashi", `\`${prefix}shop 8 forms wishiwashi\``, true)
            .addField("Pichu", `\`${prefix}shop 8 forms pichu\``, true)
            .addField("Deerling", `\`${prefix}shop 8 forms deerling\``, true)
            .addField("Sawsbuck", `\`${prefix}shop 8 forms sawsbuck\``, true)
            .addField("Floette", `\`${prefix}shop 8 forms floette\``, true)
            .addField("Flabébé", `\`${prefix}shop 8 forms flabébé\``, true)
            .addField("Florges", `\`${prefix}shop 8 forms florges\``, true)
            .addField("Furfrou", `\`${prefix}shop 8 forms furfrou\``, true)
            .addField("Minior", `\`${prefix}shop 8 forms minior\``, true)
            .addField("Cramorant", `\`${prefix}shop 8 forms cramorant\``, true)
            .addField("Eiscue", `\`${prefix}shop 8 forms eiscue\``, true)
            .addField("Morpeko", `\`${prefix}shop 8 forms morpeko\``, true)
            .setFooter("Legendary And Mythical Pokemon Forms on Shop 10")
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(color)

        if (args[0] == "8") {
            if (!args[1]) return message.channel.send(embed9)
            if (args[1].toLowerCase() == "forms") {
                if (!args[2]) return message.channel.send(`Please include the Pokemon#name whose Normal Pokemon form you want to see! \`${prefix}shop 9 forms <Pokemon#name>\``)
                if (args[2].toLowerCase() == "castform") {
                    let castform = new MessageEmbed()
                        .setAuthor("Castform Forms")
                        .setDescription("All Castform forms costs TBD Currency")
                        .addField("Snowy Castform Form", `\`${prefix}shopbuy 8 snowy castform\``)
                        .addField("Rainy Castform Form", `\`${prefix}shopbuy 8 rainy castform\``)
                        .addField("Sunny Castform Form", `\`${prefix}shopbuy 8 sunny castform\``)
                        .setColor(color)
                    message.channel.send(castform)
                }
                else if (args[2].toLowerCase() == "wormadam") {
                    let wormadam = new MessageEmbed()
                        .setAuthor("Wormadam Forms")
                        .setDescription("All Wormadam Form costs TBD Currency")
                        .addField("Sandy Wormadam Form", `\`${prefix}shopbuy 8 sandy wormadam\``)
                        .addField("Trash Wormadam Form", `\`${prefix}shopbuy 8 trash wormadam\``)
                        .setColor(color)
                    message.channel.send(wormadam)
                }
                else if (args[2].toLowerCase() == "basculin") {
                    let basculin = new MessageEmbed()
                        .setAuthor("Basculin Forms")
                        .setDescription("All Basculin Forms costs TBD Currency")
                        .addField("Blue Striped Basculin Form", `\`${prefix}shopbuy 8 blue striped basculin\``)
                        .setColor(color)
                    message.channel.send(basculin)
                }
                else if (args[2].toLowerCase() == "greninja") {
                    let greninja = new MessageEmbed()
                        .setAuthor("Greninja Forms")
                        .setDescription("All Greninja Forms costs TBD Currency")
                        .addField("Ash'S Greninja Form", `\`${prefix}shopbuy 8 ash's greninja\``)
                        .setColor(color)
                    message.channel.send(greninja)
                }
                else if (args[2].toLowerCase() == "aegislash") {
                    let aegislash = new MessageEmbed()
                        .setAuthor("Aegislash Forms")
                        .setDescription("All Aegislash Forms costs TBD Currency")
                        .addField("Blade Aegislash Form", `\`${prefix}shopbuy 8 blade aegislash\``)
                        .setColor(color)
                    message.channel.send(aegislash)
                }
                else if (args[2].toLowerCase() == "rotom") {
                    let rotom = new MessageEmbed()
                        .setAuthor("Rotom Forms Evolution")
                        .setDescription("All Rotom Forms costs TBD Currency")
                        .addField("Heat Rotom Form", `\`${prefix}shopbuy 8 heat rotom\``)
                        .addField("Wash Rotom Form", `\`${prefix}shopbuy 8 wash rotom\``)
                        .addField("Frost Rotom Form", `\`${prefix}shopbuy 8 frost rotom\``)
                        .addField("Fan Rotom Form", `\`${prefix}shopbuy 8 fan rotom\``)
                        .addField("Mow Rotom Form", `\`${prefix}shopbuy 8 mow rotom\``)
                        .setColor(color)
                    message.channel.send(rotom)
                }
                else if (args[2].toLowerCase() == "cherrim") {
                    let cherrim = new MessageEmbed()
                        .setAuthor("Cherrim Forms Evolution")
                        .setDescription("All Cherrim Forms costs TBD Currency")
                        .addField("Sunshine Cherrim Form", `\`${prefix}shopbuy 8 sunshine cherrim\``)
                        .setColor(color)
                    message.channel.send(cherrim)
                }
                else if (args[2].toLowerCase() == "wishiwashi") {
                    let wishiwashi = new MessageEmbed()
                        .setAuthor("Wishiwashi Forms Evolution")
                        .setDescription("All Wishiwashi Forms costs TBD Currency")
                        .addField("School Wishiwashi Form", `\`${prefix}shopbuy 8 school wishiwashi\``)
                        .setColor(color)
                    message.channel.send(wishiwashi)
                }
                else if (args[2].toLowerCase() == "pichu") {
                    let pichu = new MessageEmbed()
                        .setAuthor("Pichu Forms Evolution")
                        .setDescription("All Pichu Forms costs TBD Currency")
                        .addField("Spiky Eared Pichu Form", `\`${prefix}shopbuy 8 spiky eared pichu\``)
                        .setColor(color)
                    message.channel.send(pichu)
                }
                else if (args[2].toLowerCase() == "deerling") {
                    let deerling = new MessageEmbed()
                        .setAuthor("Deerling Forms Evolution")
                        .setDescription("All Deerling Forms costs TBD Currency")
                        .addField("Summer Deerling Form", `\`${prefix}shopbuy 8 summer deerling\``)
                        .addField("Autumn Deerling Form", `\`${prefix}shopbuy 8 autumn deerling\``)
                        .addField("Winter Deerling Form", `\`${prefix}shopbuy 8 winter deerling\``)
                        .setColor(color)
                    message.channel.send(deerling)
                }
                else if (args[2].toLowerCase() == "sawsbuck") {
                    let sawsbuck = new MessageEmbed()
                        .setAuthor("Sawsbuck Forms Evolution")
                        .setDescription("All Sawsbuck Forms costs TBD Currency")
                        .addField("Summer Sawsbuck Form", `\`${prefix}shopbuy 8 summer sawsbuck\``)
                        .addField("Autumn Sawsbuck Form", `\`${prefix}shopbuy 8 autumn sawsbuck\``)
                        .addField("Winter Sawsbuck Form", `\`${prefix}shopbuy 8 winter sawsbuck\``)
                        .setColor(color)
                    message.channel.send(sawsbuck)
                }
                else if (args[2].toLowerCase() == "floette") {
                    let floette = new MessageEmbed()
                        .setAuthor("Floette Forms Evolution")
                        .setDescription("All Floette Forms costs TBD Currency")
                        .addField("Yellow Flower Floette Form", `\`${prefix}shopbuy 8 yellow flower floette\``)
                        .addField("Orange Flower Floette Form", `\`${prefix}shopbuy 8 orange flower floette\``)
                        .addField("Blue Flower Floette Form", `\`${prefix}shopbuy 8 blue flower floette\``)
                        .addField("White Flower Floette Form", `\`${prefix}shopbuy 8 white flower floette\``)
                        .addField("Eternal Flower Floette Form", `\`${prefix}shopbuy 8 eternal flower floette\``)
                        .setColor(color)
                    message.channel.send(floette)
                }
                else if (args[2].toLowerCase() == "flabebe") {
                    let flabebe = new MessageEmbed()
                        .setAuthor("Flabebe Forms Evolution")
                        .setDescription("All Flabebe Forms costs TBD Currency")
                        .addField("Yellow Flower Flabebe Form", `\`${prefix}shopbuy 8 yellow flower flabebe\``)
                        .addField("Orange Flower Flabebe Form", `\`${prefix}shopbuy 8 orange flower flabebe\``)
                        .addField("Blue Flower Flabebe Form", `\`${prefix}shopbuy 8 blue flower flabebe\``)
                        .addField("White Flower Flabebe Form", `\`${prefix}shopbuy 8 white flower flabebe \``)
                        .setColor(color)
                    message.channel.send(flabebe)
                }
                else if (args[2].toLowerCase() == "morpeko") {
                    let morpeko = new MessageEmbed()
                        .setAuthor("Morpeko Forms Evolution")
                        .setDescription("All Morpeko Forms costs TBD Currency")
                        .addField("Hangry Mode Morpeko Form", `\`${prefix}shopbuy 8 hangry mode morpeko\``)
                        .setColor(color)
                    message.channel.send(morpeko)
                }
                else if (args[2].toLowerCase() == "eiscue") {
                    let eiscue = new MessageEmbed()
                        .setAuthor("Eiscue Forms Evolution")
                        .setDescription("All Eiscue Forms costs TBD Currency")
                        .addField("Noice Face Eiscue Form", `\`${prefix}shopbuy 8 noice face eiscue \``)
                        .setColor(color)
                    message.channel.send(eiscue)
                }
                else if (args[2].toLowerCase() == "cramorant") {
                    let cramorant = new MessageEmbed()
                        .setAuthor("Cramorant Forms Evolution")
                        .setDescription("All Cramorant Forms costs TBD Currency")
                        .addField("Gulping Cramorant Form", `\`${prefix}shopbuy 8 gulping cramorant\``)
                        .addField("Gorging Cramorant Form", `\`${prefix}shopbuy 8 gorging cramorant\``)
                        .setColor(color)
                    message.channel.send(cramorant)
                }
                else if (args[2].toLowerCase() == "oricorio") {
                    let oricorio = new MessageEmbed()
                        .setAuthor("Oricorio Forms Evolution")
                        .setDescription("All Oricorio Forms costs TBD Currency")
                        .addField("Pom Pom Oricorio Form", `\`${prefix}shopbuy 8 pom pom oricorio\``)
                        .addField("Pa’U Oricorio Form", `\`${prefix}shopbuy 8 pau oricorio\``)
                        .addField("Sensu Oricorio Form", `\`${prefix}shopbuy 8 sensu oricorio\``)
                        .setColor(color)
                    message.channel.send(oricorio)
                }
                else if (args[2].toLowerCase() == "florges") {
                    let florges = new MessageEmbed()
                        .setAuthor("Florges Forms Evolution")
                        .setDescription("All Florges Forms costs TBD Currency")
                        .addField("Yellow Flower Florges Form", `\`${prefix}shopbuy 8 yellow flower florges\``)
                        .addField("Orange Flower Florges Form", `\`${prefix}shopbuy 8 orange flower florges\``)
                        .addField("Blue Flower Florges Form", `\`${prefix}shopbuy 8 blue flower florges\``)
                        .addField("White Flower Florges Form", `\`${prefix}shopbuy 8 white flower florges\``)
                        .setColor(color)
                    message.channel.send(florges)
                }
                else if (args[2].toLowerCase() == "minior") {
                    message.channel.send("Minior Forms Are In Construction")
                }
                else if (args[2].toLowerCase() == "furfrou") {
                    message.channel.send("Furfrou Forms Are In Construction")
                }
                else {
                    return message.channel.send("That Normal Pokemon Form doesn't seem to Exist!")
                }
            }
        }




        let embed11 = new MessageEmbed()
            .setAuthor("Shop 10 - Gigantamax Evolutions")
            .setDescription("Some pokémon have different gigantamax evolutions, you can buy them here to allow them to transform.")
            .addField("Eternatus", `\`${prefix}shop 10  forms eternatus\``, true)
            .addField("Venusaur", `\`${prefix}shop 10 forms venusaur\``, true)
            .addField("Charizard", `\`${prefix}shop 10  forms charizard\``, true)
            .addField("Blastoise", `\`${prefix}shop 10  forms blastoise\``, true)
            .addField("Butterfree", `\`${prefix}shop 10 forms butterfree\``, true)
            .addField("Pikachu", `\`${prefix}shop 10 forms pikachu\``, true)
            .addField("Meowth", `\`${prefix}shop 10 forms meowth\``, true)
            .addField("Machamp", `\`${prefix}shop 10 forms machamp\``, true)
            .addField("Gengar", `\`${prefix}shop 10 forms gengar\``, true)
            .addField("Kingler", `\`${prefix}shop 10 forms kingler\``, true)
            .addField("Lapras", `\`${prefix}shop 10 forms lapras\``, true)
            .addField("Eevee", `\`${prefix}shop 10 forms eevee\``, true)
            .addField("Snorlax", `\`${prefix}shop 10 forms snorlax\``, true)
            .addField("Garbodor", `\`${prefix}shop 10 forms garbodor\``, true)
            .addField("Melmetal", `\`${prefix}shop 10 forms melmetal\``, true)
            .addField("Rillaboom", `\`${prefix}shop 10 forms rillaboom\``, true)
            .setFooter("Remaining Pokemon GMAX Forms on Shop 10 ( Page II )")
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(color)

        let embed12 = new MessageEmbed()
            .setAuthor("Shop 10 - Gigantamax Evolutions - Page II")
            .setDescription("Some pokémon have different gigantamax evolutions, you can buy them here to allow them to transform.")
            .addField("Cinderace", `\`${prefix}shop 10 forms cinderace\``, true)
            .addField("Inteleon", `\`${prefix}shop 10 forms inteleon\``, true)
            .addField("Corviknight", `\`${prefix}shop 10 forms corviknight\``, true)
            .addField("Orbeetle", `\`${prefix}shop 10 forms orbeetle\``, true)
            .addField("Drednaw", `\`${prefix}shop 10 forms drednaw\``, true)
            .addField("Coalossal", `\`${prefix}shop 10 forms coalossal\``, true)
            .addField("Flapple", `\`${prefix}shop 10 forms flapple\``, true)
            .addField("Sandaconda", `\`${prefix}shop 10 forms sandaconda\``, true)
            .addField("Toxtricity", `\`${prefix}shop 10 forms toxtricity\``, true)
            .addField("Centiskorch", `\`${prefix}shop 10 forms centiskorch\``, true)
            .addField("Hatterene", `\`${prefix}shop 10 forms hatterene\``, true)
            .addField("Grimmsnarl", `\`${prefix}shop 10 forms grimmsnarl\``, true)
            .addField("Alcremie", `\`${prefix}shop 10 forms alcremie\``, true)
            .addField("Copperajah", `\`${prefix}shop 10 forms copperajah\``, true)
            .addField("Duraludon", `\`${prefix}shop 10 forms duraludon\``, true)
            .addField("Urshifu", `\`${prefix}shop 10 forms urshifu\``, true)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(color)

        let embed012 = new MessageEmbed()
            .setAuthor("Shop 11 - Shadow Pokémon Transformations ")
            .setDescription("Some pokémon have different shadow evolutions, you can buy them here to allow them to transform.")
            .addField("Mew", `\`${prefix}shop 11 forms mew\``, true)
            .addField("Mewtwo", `\`${prefix}shop 11 forms mewtwo\``, true)
            .addField("Lugia", `\`${prefix}shop 11 forms lugia\``, true)
            .addField("Solgaleo", `\`${prefix}shop 11 forms solgaleo\``, true)
            .addField("Celebi", `\`${prefix}shop 11 forms celebi\``, true)
            .setColor(color)


        if (args[0] == "11") {
            if (!args[1]) return message.channel.send(embed012);
            if (args[1].toLowerCase() == "forms") {
                if (!args[2]) return message.channel.send(`Please include the Pokemon#name whose Shadow Pokemon form you want to see! \`${prefix}shop 11 forms <Pokemon#name>\``)
                if (args[2].toLowerCase() == "mew") {
                    let smew = new MessageEmbed()
                        .setAuthor("Mew Shadow Transformation")
        
                        .addField("Shadow Mew", `\`${prefix}shopbuy 10 form form shadow\``)
                        .setColor(color)
                
                    message.channel.send(smew)
                }
                else if (args[2].toLowerCase() == "mewtwo" || args[2].toLowerCase() == "mewtu") {
                    let smew2 = new MessageEmbed()
                        .setAuthor("Mewtwo Shadow Transformation")
                        .setDescription("All Shadow Pokémon costs 10,000 .")
                        .addField("Shadow Mewtwo", `\`${prefix}shopbuy 10 form form shadow\``)
                        .setColor(color)
                  
                    message.channel.send(smew2)
                }
                else if (args[2].toLowerCase() == "solgaleo") {
                    let ssolgaleo = new MessageEmbed()
                        .setAuthor("Solgaleo Shadow Transformation")
                        .setDescription("All Shadow Pokémon costs 10,000 .")
                        .addField("Shadow Solgaleo", `\`${prefix}shopbuy 10 form form shadow\``)
                        .setColor(color)
                        .setThumbnail("https://i.imgur.com/ww7RPnp.png")
                    message.channel.send(ssolgaleo)
                }
                else if (args[2].toLowerCase() == "celebi") {
                    let scelebi = new MessageEmbed()
                        .setAuthor("Celebi Shadow Transformation")
                        .setDescription("All Shadow Pokémon costs 10,000 .")
                        .addField("Shadow Celebi", `\`${prefix}shopbuy 10 form form shadow\``)
                        .setColor(color)
                        .setThumbnail("https://imgur.com/5R6fc2j.png")
                    message.channel.send(scelebi)
                }
                else if (args[2].toLowerCase() == "lugia") {
                    let slugia = new MessageEmbed()
                        .setAuthor("Lugia Shadow Transformation")
                        .setDescription("All Shadow Pokémon costs 10,000 .")
                        .addField("Shadow Lugia", `\`${prefix}shopbuy 10 form form shadow\``)
                        .setColor(color)
                        .setThumbnail("https://i.imgur.com/Lm5capk.png")
                    message.channel.send(slugia)
                }
                else {
                    message.channel.send(`\`${args[2]}\`'s Shadow form doesn't Exist!`)
                }
            }
        }



        if (args[0] == "10") {
            const pages = [
                embed11,
                embed12
            ]
            const emojilist = ["⏮", "⏭"];
            const timeout = '120000';

            if (!args[1]) return pagination(message, pages, emojilist, timeout);
            if (args[1].toLowerCase() == "forms") {
                if (!args[2]) return message.channel.send(`Please include the Pokemon#name whose Gmax form you want to see! \`${prefix}shop 10 forms <Pokemon#name>\``)
                if (args[2].toLowerCase() == "eternatus") {
                    let eternatus = new MessageEmbed()
                        .setAuthor("Eternatus Gigantamax Evolution")
                        .setDescription("All Eternatus Gigantamax costs 25,000 .")
                        .addField("Gigantamax Eternatus", `\`${prefix}shopbuy 10 form gigantamax\``)
                  
                        .setColor(color)
                    return message.channel.send(eternatus)
                }
                else if (args[2].toLowerCase() == "venusaur") {
                    let venusaur = new MessageEmbed()
                        .setAuthor("Venusaur Gigantamax Evolution")
                        .setDescription("All Venusaur Gigantamax costs 25,000 .")
                        .addField("Gigantamax Venusaur", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                     
                    return message.channel.send(venusaur)
                }
                else if (args[2].toLowerCase() == "charizard") {
                    let charizard = new MessageEmbed()
                        .setAuthor("Charizard Gigantamax Evolution")
                        .setDescription("All Charizard Gigantamax costs 25,000 .")
                        .addField("Gigantamax Charizard", `\`${prefix}shopbuy 10 form gigantamax\``)
                       
                        .setColor(color)
                    return message.channel.send(charizard)
                }
                else if (args[2].toLowerCase() == "blastoise") {
                    let blastoise = new MessageEmbed()
                        .setAuthor("Blastoise Gigantamax Evolution")
                        .setDescription("All Blastoise Gigantamax costs 25,000 .")
                        .addField("Gigantamax Blastoise", `\`${prefix}shopbuy 10 form gigantamax\``)
                     
                        .setColor(color)
                    return message.channel.send(blastoise)
                }
                else if (args[2].toLowerCase() == "butterfree") {
                    let butterfree = new MessageEmbed()
                        .setAuthor("Butterfree Gigantamax Evolution")
                        .setDescription("All Butterfree Gigantamax costs 25,000 .")
                        .addField("Gigantamax Butterfree", `\`${prefix}shopbuy 10 form gigantamax\``)
                      
                        .setColor(color)
                    return message.channel.send(butterfree)
                }
                else if (args[2].toLowerCase() == "pikachu") {
                    let pikachu = new MessageEmbed()
                        .setAuthor("Pikachu Gigantamax Evolution")
                        .setDescription("All Pikachu Gigantamax costs 25,000 .")
                        .addField("Gigantamax Pikachu", `\`${prefix}shopbuy 10 form gigantamax\``)
                   
                        .setColor(color)
                    return message.channel.send(pikachu)
                }
                else if (args[2].toLowerCase() == "meowth") {
                    let meowth = new MessageEmbed()
                        .setAuthor("Meowth Gigantamax Evolution") 
                        .setDescription("All Meowth Gigantamax costs 25,000 .")
                        .addField("Gigantamax Meowth", `\`${prefix}shopbuy 10 form gigantamax\``)
                  
                    return message.channel.send(meowth)
                }
                else if (args[2].toLowerCase() == "machamp") {
                    let machamp = new MessageEmbed()
                        .setAuthor("Machamp Gigantamax Evolution")
                        .setDescription("All Machamp Gigantamax costs 25,000 .")
                        .addField("Gigantamax Machamp", `\`${prefix}shopbuy 10 form gigantamax\``)
           
                        .setColor(color)
                    return message.channel.send(machamp)
                }
                else if (args[2].toLowerCase() == "gengar") {
                    let gengar = new MessageEmbed()
                        .setAuthor("Gengar Gigantamax Evolution")
                        .setDescription("All Gengar Gigantamax costs 25,000 .")
                        .addField("Gigantamax Gengar", `\`${prefix}shopbuy 10 form gigantamax\``)
        
                        .setColor(color)
                    return message.channel.send(gengar)
                }
                else if (args[2].toLowerCase() == "kingler") {
                    let kingler = new MessageEmbed()
                        .setAuthor("Kingler Gigantamax Evolution")
                        .setDescription("All Kingler Gigantamax costs 25,000 .")
                        .addField("Gigantamax Kingler", `\`${prefix}shopbuy 10 form gigantamax\``)
            
                        .setColor(color)
                    return message.channel.send(kingler)
                }
                else if (args[2].toLowerCase() == "lapras") {
                    let lapras = new MessageEmbed()
                        .setAuthor("Lapras Gigantamax Evolution")
                        .setDescription("All Lapras Gigantamax costs 25,000 .")
                        .addField("Gigantamax Lapras", `\`${prefix}shopbuy 10 form gigantamax\``)
                     
                    return message.channel.send(lapras)
                }
                else if (args[2].toLowerCase() == "eevee") {
                    let eevee = new MessageEmbed()
                        .setAuthor("Eevee Gigantamax Evolution")
                        .setDescription("All Eevee Gigantamax costs 25,000 .")
                        .addField("Gigantamax Eevee", `\`${prefix}shopbuy 10 form gigantamax\``)
               
                    return message.channel.send(eevee)
                }
                else if (args[2].toLowerCase() == "snorlax") {
                    let snorlax = new MessageEmbed()
                        .setAuthor("Snorlax Gigantamax Evolution")
                        .setDescription("All Snorlax Gigantamax costs 25,000 .")
                        .addField("Gigantamax Snorlax", `\`${prefix}shopbuy 10 form gigantamax\``)
             
                    return message.channel.send(snorlax)
                }
                else if (args[2].toLowerCase() == "garbodor") {
                    let garbodor = new MessageEmbed()
                        .setAuthor("Garbodor Gigantamax Evolution")
                        .setDescription("All Garbodor Gigantamax costs 25,000 .")
                        .addField("Gigantamax Garbodor", `\`${prefix}shopbuy 10 form gigantamax\``)
         
                        .setColor(color)
                    return message.channel.send(garbodor)
                }
                else if (args[2].toLowerCase() == "melmetal") {
                    let melmetal = new MessageEmbed()
                        .setAuthor("Melmetal Gigantamax Evolution")
                        .setDescription("All Melmetal Gigantamax costs 25,000 .")
                        .addField("Gigantamax Melmetal", `\`${prefix}shopbuy 10 form gigantamax\``)
  
                        .setColor(color)
                    return message.channel.send(melmetal)
                }
                else if (args[2].toLowerCase() == "rillaboom") {
                    let rillaboom = new MessageEmbed()
                        .setAuthor("Rillaboom Gigantamax Evolution")
                        .setDescription("All Rillaboom Gigantamax costs 25,000 .")
                        .addField("Gigantamax Rillaboom", `\`${prefix}shopbuy 10 form gigantamax\``)
                      
                        .setColor(color)
                    return message.channel.send(rillaboom)
                }
                if (args[2].toLowerCase() == "cinderace") {
                    let cinderace = new MessageEmbed()
                        .setAuthor("Cinderace Gigantamax Evolution")
                        .setDescription("All Cinderace Gigantamax costs 25,000 .")
                        .addField("Gigantamax Cinderace", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(cinderace)
                }
                else if (args[2].toLowerCase() == "inteleon") {
                    let inteleon = new MessageEmbed()
                        .setAuthor("Inteleon Gigantamax Evolution")
                        .setDescription("All Inteleon Gigantamax costs 25,000 .")
                        .addField("Gigantamax Inteleon", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(inteleon)
                }
                else if (args[2].toLowerCase() == "corviknight") {
                    let corviknight = new MessageEmbed()
                        .setAuthor("Corviknight Gigantamax Evolution")
                        .setDescription("All Corviknight Gigantamax costs 25,000 .")
                        .addField("Gigantamax Corviknight", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(corviknight)
                }
                else if (args[2].toLowerCase() == "orbeetle") {
                    let orbeetle = new MessageEmbed()
                        .setAuthor("Orbeetle Gigantamax Evolution")
                        .setDescription("All Orbeetle Gigantamax costs 25,000 .")
                        .addField("Gigantamax Orbeetle", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(orbeetle)
                }
                else if (args[2].toLowerCase() == "drednaw") {
                    let drednaw = new MessageEmbed()
                        .setAuthor("Drednaw Gigantamax Evolution")
                        .setDescription("All Drednaw Gigantamax costs 25,000 .")
                        .addField("Gigantamax Drednaw", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(drednaw)
                }
                else if (args[2].toLowerCase() == "coalossal") {
                    let coalossal = new MessageEmbed()
                        .setAuthor("Coalossal Gigantamax Evolution")
                        .setDescription("All Coalossal Gigantamax costs 25,000 .")
                        .addField("Gigantamax Coalossal", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(coalossal)
                }
                else if (args[2].toLowerCase() == "flapple") {
                    let flapple = new MessageEmbed()
                        .setAuthor("Flapple Gigantamax Evolution")
                        .setDescription("All Flapple Gigantamax costs 25,000 .")
                        .addField("Gigantamax Flapple", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(flapple)
                }
                else if (args[2].toLowerCase() == "sandaconda") {
                    let sandaconda = new MessageEmbed()
                        .setAuthor("Sandaconda Gigantamax Evolution")
                        .setDescription("All Sandaconda Gigantamax costs 25,000 .")
                        .addField("Gigantamax Sandaconda", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(sandaconda)
                }
                else if (args[2].toLowerCase() == "toxtricity") {
                    let toxtricity = new MessageEmbed()
                        .setAuthor("Toxtricity Gigantamax Evolution")
                        .setDescription("All Toxtricity Gigantamax costs 25,000 .")
                        .addField("Gigantamax Toxtricity", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(toxtricity)
                }
                else if (args[2].toLowerCase() == "centiskorch") {
                    let centiskorch = new MessageEmbed()
                        .setAuthor("Centiskorch Gigantamax Evolution")
                        .setDescription("All Centiskorch Gigantamax costs 25,000 .")
                        .addField("Gigantamax Centiskorch", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(centiskorch)
                }
                else if (args[2].toLowerCase() == "hatterene") {
                    let hatterene = new MessageEmbed()
                        .setAuthor("Hatterene Gigantamax Evolution")
                        .setDescription("All Hatterene Gigantamax costs 25,000 .")
                        .addField("Gigantamax Hatterene", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(hatterene)
                }
                else if (args[2].toLowerCase() == "grimmsnarl") {
                    let grimmsnarl = new MessageEmbed()
                        .setAuthor("Grimmsnarl Gigantamax Evolution")
                        .setDescription("All Grimmsnarl Gigantamax costs 25,000 .")
                        .addField("Gigantamax Grimmsnarl", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(grimmsnarl)
                }
                else if (args[2].toLowerCase() == "alcremie") {
                    let alcremie = new MessageEmbed()
                        .setAuthor("Alcremie Gigantamax Evolution")
                        .setDescription("All Alcremie Gigantamax costs 25,000 .")
                        .addField("Gigantamax Alcremie", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(alcremie)
                }
                else if (args[2].toLowerCase() == "copperajah") {
                    let copperajah = new MessageEmbed()
                        .setAuthor("Copperajah Gigantamax Evolution")
                        .setDescription("All Copperajah Gigantamax costs 25,000 .")
                        .addField("Gigantamax Copperajah", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(copperajah)
                }
                else if (args[2].toLowerCase() == "duraludon") {
                    let duraludon = new MessageEmbed()
                        .setAuthor("Duraludon Gigantamax Evolution")
                        .setDescription("All Duraludon Gigantamax costs 25,000 .")
                        .addField("Gigantamax Duraludon", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(duraludon)
                }
                else if (args[2].toLowerCase() == "urshifu") {
                    let urshifu = new MessageEmbed()
                        .setAuthor("Urshifu Gigantamax Evolution")
                        .setDescription("All Urshifu Gigantamax costs 25,000 .")
                        .addField("Gigantamax Urshifu", `\`${prefix}shopbuy 10 form gigantamax\``)
                        .setColor(color)
                    return message.channel.send(urshifu)
                }
                else {
                    return message.channel.send(`${args[2]}'s Gigantamax Form doesn't seem to Exist!`)
                }
            }
        }


        if (!args[0]) return message.channel.send(embed)
        if (args[0] === "1") {
            const pages = [
                embed1,
                embed01
            ]
            const emojilist = ["⏮", "⏭"];
            const timeout = '120000';
            pagination(message, pages, emojilist, timeout)
        }
        else if (args[0] === "2") return message.channel.send(embed2)
        else if (args[0] === "3") return message.channel.send(embed3)
        else if (args[0] === "4") return message.channel.send(embed4)
        else if (args[0] === "5") return message.channel.send(embed5)
        else if (args[0] === "6") {
            const pages = [
                embed6,
                embed7
            ]
            const emojilist = ["⏮", "⏭"];
            const timeout = '120000';
            pagination(message, pages, emojilist, timeout)
        }
        else if (args[0] === "7") return message.channel.send(embed8)
    }
}




