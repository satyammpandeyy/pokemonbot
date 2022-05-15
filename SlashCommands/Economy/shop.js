const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require("discord.js");
const { species_by_name, get_image, get_types } = require('../../Utils/data.js')
const Discord = require('discord.js')
const User = require('../../models/user.js')
const Gmax = require("../../db/gmax.js");
const Mega = require("../../db/mega.js");
const Pokemon = require("../../Classes/Pokemon.js")
const { get } = require('request-promise-native')
const { classToPlain } = require("class-transformer")
const Form = require("../../db/forms.js")
let levelUp = require("../../db/levelup.js")

module.exports = {
    name: "shop",
    description: "Displays the Shop Menu!",
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'menu',
            description: "Displays the shop menu !"
        },
        {
            type: 'SUB_COMMAND',
            name: 'buy',
            description: "Buy items/stuffs from the shop !",
            options: [
                {
                    name: 'page',
                    description: 'Provide the shop page number !',
                    type: 4,
                    required: true
                },
                {
                    name: 'item_name',
                    description: 'Provide the item name !',
                    type: 3,
                    required: true
                },
                {
                    name: 'amount',
                    description: '(IF) Provide number of amount of items you want to buy !',
                    type: 4,
                    required: false
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'forms',
            description: "Check out the pokémon forms available on shop !",
            options: [
                {
                    name: 'name',
                    description: 'Provide the pokémon form name !',
                    type: 3,
                    required: true
                }
            ]
        }
    ],
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        const [subcommand] = args
        if (subcommand === "menu") {

            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('shop-menu')
                        .setPlaceholder('Choose')
                        .addOptions([
                            {
                                label: 'Home Page',
                                value: 'Home Shop Page',
                                description: 'Shop Menu',
                                emoji: '⏹'
                            },
                            {
                                label: 'Page 1 | XP Boosters & Rare Candies',
                                value: 'First Shop Page',
                                description: 'Get the list of items like XP Boosters and Rare Candies !',
                                emoji: '1️⃣'
                            },
                            {
                                label: 'Page 2 | Held Items',
                                value: 'Second Shop Page',
                                description: 'Get the list of items to hold for your pokemon !',
                                emoji: '2️⃣'
                            },
                            {
                                label: "Page 3 | Pokémon Forms",
                                value: 'Third Shop Page',
                                description: 'Get the list of forms of pokemons which you can buy to transform your pokemon !',
                                emoji: '3️⃣'
                            },
                            {
                                label: 'Page 4 | Gigantamax',
                                value: 'Fourth Shop Page',
                                description: 'Get the list of items which will allow your pokemon to transform into gigantamax !',
                                emoji: '4️⃣'
                            },
                            {
                                label: 'Page 5 |  Shards Shop',
                                value: 'Fifth Shop Page',
                                description: 'Get the list of items which you can buy using shards !',
                                emoji: '5️⃣'
                            },
                            {
                                label: 'Page 6 | Nature Modifiers',
                                value: 'Sixth Shop Page',
                                description: 'Get the list of natures for your pokemon !',
                                emoji: '6️⃣'
                            }
                        ])
                )

            const rowx = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setDisabled()
                        .setCustomId('shop-menu')
                        .setPlaceholder('Choose')
                        .addOptions([
                            {
                                label: 'Home Page',
                                value: 'Home Shop Page',
                                description: 'Shop Menu',
                                emoji: '🏠'
                            },
                            {
                                label: 'Page 1 | XP Boosters & Rare Candies',
                                value: 'First Shop Page',
                                description: 'Get the list of items like XP Boosters and Rare Candies !',
                                emoji: '1️⃣'
                            },
                            {
                                label: 'Page 2 | Held Items',
                                value: 'Second Shop Page',
                                description: 'Get the list of items to hold for your pokemon !',
                                emoji: '2️⃣'
                            },
                            {
                                label: "Page 3 | Pokémon Forms",
                                value: 'Third Shop Page',
                                description: 'Get the list of forms of pokemons which you can buy to transform your pokemon !',
                                emoji: '3️⃣'
                            },
                            {
                                label: 'Page 4 | Gigantamax',
                                value: 'Fourth Shop Page',
                                description: 'Get the list of items which will allow your pokemon to transform into gigantamax !',
                                emoji: '4️⃣'
                            },
                            {
                                label: 'Page 5 | Shards Shop',
                                value: 'Fifth Shop Page',
                                description: 'Get the list of items which you can buy using shards !',
                                emoji: '5️⃣'
                            },
                            {
                                label: 'Page 6 | Nature Modifiers',
                                value: 'Sixth Shop Page',
                                description: 'Get the list of natures for your pokemon !',
                                emoji: '6️⃣'
                            }
                        ])
                )


            let homepage = new MessageEmbed()
                .setColor(color)
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\n🛒 ・ ${client.user.username} Shop`)
                .addField("Page 1 | XP Boosters & Rare Candies", `\`Get the list of items like XP Boosters and Rare Candies !\``)
                .addField("Page 2 | Held Items", `\`Get the list of items to hold for your pokemon !\``)
                .addField("Page 3 | Pokémon Forms", `\`Get the list of forms of pokemons which you can buy to transform your pokemon !\``)
                .addField("Page 4 | Gigantamax Transformation", `\`Get the list of items which will allow your pokemon to transform into gigantamax !\``)
                .addField("Page 5 | Shards", `\`Get the list of items which you can buy using shards !\``)
                .addField("Page 6 | Nature Modifiers", `\`Get the list of natures that your pokemon can apply !\``)
                .setFooter('Use the given dropdown to go to your desired page to shop items.')
                .setThumbnail(client.user.displayAvatarURL())

            let firstpage = new MessageEmbed()
                .setColor(color)
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 1 - XP Boosters & Rare Candies\n🛒 ・ ${client.user.username} Shop`)
                .setDescription(`Get XP boosters to increase your XP gain from chatting and battling!`)
                // .addField("30 Minutes - 2X Multiplier | Cost:  20 Credits", `\`${prefix}buy shop: 1 item: 30m [amount:]\``)
                // .addField("1 Hour - 2X Multiplier | Cost:  40 Credits", `\`${prefix}buy shop: 1 item: 1h [amount:]\``)
                // .addField("2 Hours - 2X Multiplier | Cost:  70 Credits", `\`${prefix}buy shop: 1 item: 2h [amount:]\``)
                // .addField("3 Hours - 2X Multiplier | Cost:  90 Credits", `\`${prefix}buy shop: 1 item: 3h [amount:]\``)
                .addField("Rare Candy | Cost:  75 Credits/Each", `Rare candies level up your selected pokémon by one level for each candy you feed it.\n\`${prefix}shop buy 1 candy [amount]\``)
                .setThumbnail(client.user.displayAvatarURL())

            let secondpage = new MessageEmbed()
                .setColor(color)
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 2 - Held Items\n🛒 ・ ${client.user.username} Shop`)
                .setDescription(`Buy items for your pokémon to hold using \`${prefix}shop buy 4 [name]\`\n\n**All these items cost 75 credits.**`)
                .addField("Everstone", '\`Prevents pokémon from evolving.\`', true)
                .addField("XP Blocker", '\`Prevents pokémon from gaining XP.\`', true)
                .setThumbnail(client.user.displayAvatarURL())

            let thirdpage_home = new MessageEmbed()
                .setColor(color)
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 3 - Home - Pokémon Forms\n🛒 ・ ${client.user.username} Shop`)
                .addField("__Subpages in Shop 3__", `**1**.) Mega Transformations\n**2**.) Normal Pokémon Forms\n**3**.) Mythical Pokémon Forms\n**4**.) Legendary Pokémon Forms`)
                .setFooter("Gigantamax Forms on Shop 4.")
                .setThumbnail(client.user.displayAvatarURL())

            let thirdpage_1 = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nPage 3 - Pokémon Forms - Mega Forms\n🛒 ・ ${client.user.username} Shop`)
                .setDescription("**All Mega Transformations costs 1000 Credits.**")
                .addField("1) Regular Mega Transformation", `Transforms your pokémon into its mega form.\n\`${prefix}shop buy 5 mega\``)
                .addField("2) Mega X Transformation", `Transforms your pokémon into its Mega X form.\n\`${prefix}shop buy 5 mega x\``)
                .addField("3) Mega Y Transformation", `Transforms your pokémon into its Mega Y form.\n\`${prefix}shop buy 5 mega y\``)
                .setThumbnail(client.user.displayAvatarURL())

            let thirdpage_2 = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nPage 3 - Pokémon Forms - Normal Forms (1/2)\n🛒 ・ ${client.user.username} Shop`)
                .setDescription("Some pokémon have different forms, you can buy them here to allow them to transform.")
                .addField("Castform", `\`${prefix}shop forms castform\``, true)
                .addField("Wormadam", `\`${prefix}shop forms wormadam\``, true)
                .addField("Basculin", `\`${prefix}shop forms basculin\``, true)
                .addField("Greninja", `\`${prefix}shop forms greninja\``, true)
                .addField("Aegislash", `\`${prefix}shop forms aegislash\``, true)
                .addField("Oricorio", `\`${prefix}shop forms oricorio\``, true)
                .addField("Lycanroc", `\`${prefix}shop forms lycanroc\``, true)
                .addField("Rotom", `\`${prefix}shop forms rotom\``, true)
                .addField("Cherrim", `\`${prefix}shop forms cherrim\``, true)
                .addField("Wishiwashi", `\`${prefix}shop forms wishiwashi\``, true)
                .addField("Pichu", `\`${prefix}shop forms pichu\``, true)
                .addField("Deerling", `\`${prefix}shop forms deerling\``, true)
                .addField("Sawsbuck", `\`${prefix}shop forms sawsbuck\``, true)
                .addField("Floette", `\`${prefix}shop forms floette\``, true)
                .addField("Flabébé", `\`${prefix}shop forms flabébé\``, true)
                .addField("Florges", `\`${prefix}shop forms florges\``, true)
                .addField("Furfrou", `\`${prefix}shop forms furfrou\``, true)
                .addField("Minior", `\`${prefix}shop forms minior\``, true)
                .addField("Cramorant", `\`${prefix}shop forms cramorant\``, true)
                .addField("Eiscue", `\`${prefix}shop forms eiscue\``, true)
                .addField("Morpeko", `\`${prefix}shop forms morpeko\``, true)
                .addField("Squirtle", `\`${prefix}shop forms squirtle\``, true)
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(color)

            let thirdpage_3 = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nPage 3 - Pokémon Forms - Mythical Forms\n🛒 ・ ${client.user.username} Shop`)
                .addField("Hoopa", `\`${prefix}shop forms hoopa\``, true)
                .addField("Deoxys", `\`${prefix}shop forms deoxys\``, true)
                .addField("Meloetta", `\`${prefix}shop forms meloetta\``, true)
                .addField("Shaymin", `\`${prefix}shop forms shaymin\``, true)
                .addField("Keldeo", `\`${prefix}shop forms keldeo\``, true)
                .addField("Aeldeo", `\`${prefix}shop forms arceus\``, true)
                .addField("Marshadow", `\`${prefix}shop forms marshadow\``, true)

            let thirdpage_4 = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nPage 3 - Pokémon Forms - Legendary Forms\n🛒 ・ ${client.user.username} Shop`)
                .addField("Kyogre", `\`${prefix}shop forms kyogre\``, true)
                .addField("Groudon", `\`${prefix}shop forms groudon\``, true)
                .addField("Giratina", `\`${prefix}shop forms giratina\``, true)
                .addField("Tornadus", `\`${prefix}shop forms tornadus\``, true)
                .addField("Thundurus", `\`${prefix}shop forms thundurus\``, true)
                .addField("Landorus", `\`${prefix}shop forms landorus\``, true)
                .addField("Kyurem", `\`${prefix}shop forms kyurem\``, true)
                .addField("Zygarde", `\`${prefix}shop forms zygarde\``, true)
                .addField("Necrozma", `\`${prefix}shop forms necrozma\``, true)
                .addField("Zacian", `\`${prefix}shop forms zacian\``, true)
                .addField("Zamazenta", `\`${prefix}shop forms zamazenta\``, true)
                .addField("Calyrex", `\`${prefix}shop forms calyrex\``, true)
                .addField("Xerneas", `\`${prefix}shop forms xerneas\``, true)
                .addField("Solgaleo", `\`${prefix}shop forms solgaleo\``, true)
                .addField("Lunala", `\`${prefix}shop forms lunala\``, true)
                .addField("Urshifu", `\`${prefix}shop forms urshifu\``, true)

            let fourthpage_1 = new MessageEmbed()
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 4 - Page 1 - Gigantamax Transformation\n🛒 ・ ${client.user.username} Shop`)
                .setDescription("Some pokémon have different gigantamax evolutions, you can buy them here to allow transform.")
                .addField("Eternatus", `\`${prefix}shop buy 6 gigantamax eternatus\``, true)
                .addField("Venusaur", `\`${prefix}shop buy 6 gigantamax venusaur\``, true)
                .addField("Charizard", `\`${prefix}shop buy 6 gigantamax charizard\``, true)
                .addField("Blastoise", `\`${prefix}shop buy 6 gigantamax blastoise\``, true)
                .addField("Butterfree", `\`${prefix}shop buy 6 gigantamax butterfree\``, true)
                .addField("Pikachu", `\`${prefix}shop buy 6 gigantamax pikachu\``, true)
                .addField("Meowth", `\`${prefix}shop buy 6 gigantamax meowth\``, true)
                .addField("Machamp", `\`${prefix}shop buy 6 gigantamax machamp\``, true)
                .addField("Gengar", `\`${prefix}shop buy 6 gigantamax gengar\``, true)
                .addField("Kingler", `\`${prefix}shop buy 6 gigantamax kingler\``, true)
                .addField("Lapras", `\`${prefix}shop buy 6 gigantamax lapras\``, true)
                .addField("Eevee", `\`${prefix}shop buy 6 gigantamax eevee\``, true)
                .addField("Snorlax", `\`${prefix}shop buy 6 gigantamax snorlax\``, true)
                .addField("Garbodor", `\`${prefix}shop buy 6 gigantamax garbodor\``, true)
                .addField("Melmetal", `\`${prefix}shop buy 6 gigantamax melmetal\``, true)
                .addField("Rillaboom", `\`${prefix}shop buy 6 gigantamax rillaboom\``, true)
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(color)

            let fourthpage_2 = new MessageEmbed()
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 4 - Page 2 - Gigantamax Transformation\n🛒 ・ ${client.user.username} Shop`)
                .addField("Cinderace", `\`${prefix}shop buy 6 gigantamax cinderace\``, true)
                .addField("Inteleon", `\`${prefix}shop buy 6 gigantamax inteleon\``, true)
                .addField("Corviknight", `\`${prefix}shop buy 6 gigantamax corviknight\``, true)
                .addField("Orbeetle", `\`${prefix}shop buy 6 gigantamax orbeetle\``, true)
                .addField("Drednaw", `\`${prefix}shop buy 6 gigantamax drednaw\``, true)
                .addField("Coalossal", `\`${prefix}shop buy 6 gigantamax coalossal\``, true)
                .addField("Flapple", `\`${prefix}shop buy 6 gigantamax flapple\``, true)
                .addField("Sandaconda", `\`${prefix}shop buy 6 gigantamax sandaconda\``, true)
                .addField("Toxtricity", `\`${prefix}shop buy 6 gigantamax toxtricity\``, true)
                .addField("Centiskorch", `\`${prefix}shop buy 6 gigantamax centiskorch\``, true)
                .addField("Hatterene", `\`${prefix}shop buy 6 gigantamax hatterene\``, true)
                .addField("Grimmsnarl", `\`${prefix}shop buy 6 gigantamax grimmsnarl\``, true)
                .addField("Alcremie", `\`${prefix}shop buy 6 gigantamax alcremie\``, true)
                .addField("Copperajah", `\`${prefix}shop buy 6 gigantamax copperajah\``, true)
                .addField("Duraludon", `\`${prefix}shop buy 6 gigantamax duraludon\``, true)
                .addField("Urshifu", `\`${prefix}shop buy 6 gigantamax urshifu\``, true)
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(color)

            let fifthpage = new MessageEmbed()
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 5 - Shards Shop\n🛒 ・ ${client.user.username} Shop`)
                .setDescription("We have a variety of items that you can purchase using Shards.")
                .addField("Redeem - 200 Shards/Each", `Get any pokémon of your choice.\n\`${prefix}shop buy 7 redeem [amount]\``)
                // .addField("Incense - 1000 Shards/180n", `Increase Spawn Rate by 33.3% for 180 Spawns.\n\`${prefix}buy 7 incense \``)
                .addField("Pokémons - 100 Shards/10n", `Get 10 rare pokémons with random stats.\n\`${prefix}shop buy 7 pokemon\``)
                .setColor(color)
                .setFooter("Shards are premium currency and can be obtained by Donating IRL Money.")
                .setThumbnail(client.user.displayAvatarURL())

            let sixthpage = new MessageEmbed()
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 6 - Nature Modifiers\n🛒 ・ ${client.user.username} Shop`)
                .setDescription(`Nature modifiers change your selected pokémon's nature to a nature of your choice for credits. Use \`${prefix}buy 3 nature <name>\` to buy the nature you want!\n\n**All nature modifiers cost 50 credits**.`)
                .addField("Adamant Mint", '\`\`\`\n+10% Attack\n-10% Sp. Atk\n\`\`\`', true)
                .addField("Bashful Mint", '\`\`\`\nNo Effect\n\`\`\`', true)
                .addField("Bold Mint", '\`\`\`\n+10% Defense\n-10% Attack\n\`\`\`', true)
                .addField("Brave Mint", '\`\`\`\n+10% Attack\n-10% Speed\n\`\`\`', true)
                .addField("Calm Mint", '\`\`\`\n+10% Sp. Def\n-10% Attack\n\`\`\`', true)
                .addField("Careful Mint", '\`\`\`\n+10% Sp. Def\n-10% Sp. Atk\n\`\`\`', true)
                .addField("Docile Mint", '\`\`\`\nNo effect\n\`\`\`', true)
                .addField("Gentle Mint", '\`\`\`\n+10% Sp. Def\n-10% Defense\n\`\`\`', true)
                .addField("Hardy Mint", '\`\`\`\nNo effect\n\`\`\`', true)
                .addField("Hasty Mint", '\`\`\`\n+10% Speed\n-10% Defense\n\`\`\`', true)
                .addField("Impish Mint", '\`\`\`\n+10% Defense\n-10% Sp. Atk\n\`\`\`', true)
                .addField("Jolly Mint", '\`\`\`\n+10% Speed\n-10% Sp. Atk\n\`\`\`', true)
                .addField("Lax Mint", '\`\`\`\n+10% Defense\n-10% Sp. Def\n\`\`\`', true)
                .addField("Lonely Mint", '\`\`\`\n+10% Attack\n-10% Defense\n\`\`\`', true)
                .addField("Mild Mint", '\`\`\`\n+10% Sp. Attack\n-10% Defense\n\`\`\`', true)
                .addField("Modest Mint", '\`\`\`\n+10% Sp. Attack\n-10% Sp. Atk\n\`\`\`', true)
                .addField("Naive Mint", '\`\`\`\n+10% Speed\n-10% Sp. Def\n\`\`\`', true)
                .addField("Naughty Mint", '\`\`\`\n+10% Attack\n-10% Sp. Def\n\`\`\`', true)
                .addField("Quiet Mint", '\`\`\`\n+10% Attack\n-10% Speed\n\`\`\`', true)
                .addField("Quirky Mint", '\`\`\`\nNo Effect\n\`\`\`', true)
                .addField("Rash Mint", '\`\`\`\n+10% Sp. Attack\n-10% Sp. Def\n\`\`\`', true)
                .addField("Relaxed Mint", '\`\`\`\n+10% Defense\n-10% Speed\n\`\`\`', true)
                .addField("Sassy Mint", '\`\`\`\n+10% Sp. Def\n-10% Speed\n\`\`\`', true)
                .addField("Serious Mint", '\`\`\`\nNo Effect\n\`\`\`', true)
                .addField("Timid Mint", '\`\`\`\n+10% Speed\n-10% Attack\n\`\`\`', true)
                .setColor(color)

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
                filter, time: 60000
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.values[0] == "Home Shop Page") {
                    msg.edit({ embeds: [homepage] })
                } else if (i.values[0] == "First Shop Page") {
                    msg.edit({ embeds: [firstpage] })
                } else if (i.values[0] == "Second Shop Page") {
                    msg.edit({ embeds: [secondpage] })
                } else if (i.values[0] == "Third Shop Page") {

                    let button = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("MEGA")
                                .setStyle("SUCCESS")
                                .setCustomId("mega"),
                            new MessageButton()
                                .setLabel("NORMAL")
                                .setStyle("SUCCESS")
                                .setCustomId("normal"),
                            new MessageButton()
                                .setLabel("MYTHICAL")
                                .setStyle("SUCCESS")
                                .setCustomId("mythical"),
                            new MessageButton()
                                .setLabel("LEGENDARY")
                                .setStyle("SUCCESS")
                                .setCustomId("legendary")
                        )
                    let buttonx = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("MEGA")
                                .setStyle("SUCCESS")
                                .setCustomId("disabledMega")
                                .setDisabled(),
                            new MessageButton()
                                .setLabel("NORMAL")
                                .setStyle("SUCCESS")
                                .setCustomId("disabledNnormal")
                                .setDisabled(),
                            new MessageButton()
                                .setLabel("MYTHICAL")
                                .setStyle("SUCCESS")
                                .setCustomId("disabledMythical")
                                .setDisabled(),
                            new MessageButton()
                                .setLabel("LEGENDARY")
                                .setStyle("SUCCESS")
                                .setCustomId("disabledLegendary")
                                .setDisabled()
                        )

                    let msgx = await interaction.channel.send({ embeds: [thirdpage_home], components: [button] })
                    const filterx = async (inter) => {
                        if (interaction.user.id == inter.user.id) return true
                        else {
                            await inter.deferUpdate()
                            inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                            return false
                        }
                    }

                    const collectorx = msgx.createMessageComponentCollector({
                        filter: filterx, time: 30000
                    })

                    collectorx.on('collect', async i => {
                        await i.deferUpdate()
                        if (i.customId === 'mega') {
                            msgx.edit({ embeds: [thirdpage_1] })
                        }
                        if (i.customId === 'normal') {
                            msgx.edit({ embeds: [thirdpage_2] })
                        }
                        if (i.customId === 'mythical') {
                            msgx.edit({ embeds: [thirdpage_3] })
                        }
                        if (i.customId === 'legendary') {
                            msgx.edit({ embeds: [thirdpage_4] })
                        }
                    })

                    collectorx.on('end', () => {
                        return msgx.edit({ components: [buttonx] }).catch(() => { })
                    })

                } else if (i.values[0] == "Fourth Shop Page") {

                    let button = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("PAGE 1")
                                .setStyle("SUCCESS")
                                .setCustomId("yes"),
                            new MessageButton()
                                .setLabel("PAGE 2")
                                .setStyle("SUCCESS")
                                .setCustomId("no")
                        )
                    let buttonx = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("PAGE 1")
                                .setStyle("SUCCESS")
                                .setCustomId("disabledYes")
                                .setDisabled(),
                            new MessageButton()
                                .setLabel("PAGE 2")
                                .setStyle("SUCCESS")
                                .setCustomId("disabledNo")
                                .setDisabled()
                        )

                    let msgx = await interaction.channel.send({ embeds: [fourthpage_1], components: [button] })
                    const filterx = async (inter) => {
                        if (interaction.user.id == inter.user.id) return true
                        else {
                            await inter.deferUpdate()
                            inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                            return false
                        }
                    }

                    const collectorx = msgx.createMessageComponentCollector({
                        filter: filterx, time: 30000
                    })

                    collectorx.on('collect', async i => {
                        await i.deferUpdate()
                        if (i.customId === 'yes') {
                            msgx.edit({ embeds: [fourthpage_1] })
                        }
                        if (i.customId === 'no') {
                            msgx.edit({ embeds: [fourthpage_2] })
                        }
                    })

                    collectorx.on('end', () => {
                        return msgx.edit({ components: [buttonx] }).catch(() => { })
                    })

                } else if (i.values[0] == "Fifth Shop Page") {
                    msg.edit({ embeds: [fifthpage] })
                } else if (i.values[0] == "Sixth Shop Page") {
                    msg.edit({ embeds: [sixthpage] })
                } else {
                    return
                }
            })

            collector.on('end', () => {
                msg.edit({ components: [rowx] })
            })
        } else if (subcommand == "buy") {

            let page = interaction.options.getInteger('page')
            let item = interaction.options.getString('item_name')
            let amount = interaction.options.getInteger('amount')
            if (!amount) amount = 1
            if (amount <= 0) return interaction.followUp({ content: `\`${amount}\` is not a valid **amount** !` })

            let row = new MessageActionRow()
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
            let rowx = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("YES")
                        .setStyle("SUCCESS")
                        .setCustomId("disabledYes")
                        .setDisabled(),
                    new MessageButton()
                        .setLabel("NO")
                        .setStyle("DANGER")
                        .setCustomId("disabledNo")
                        .setDisabled()
                )
            const filter = async (inter) => {
                if (interaction.user.id == inter.user.id) return true
                else {
                    await inter.deferUpdate()
                    inter.followUp({ content: `<@${inter.user.id}> Only **Command Author** can interact with buttons!`, ephemeral: true })
                    return false
                }
            }

            if (page == 1) {

                if (item == "candy") {
                    if (user.selected == null || user.selected == undefined || !user.pokemons[user.selected]) return interaction.followUp({ content: "You don't have any active pokémon selected !" })
                    let poke = user.pokemons[user.selected]
                    let level = poke.level
                    if (amount > 15) return interaction.followUp("You cannot buy more than `15` candies at once !")
                    if (level + amount > 100) return interaction.followUp('You cannot level up your pokémon more than `100` !')
                    if (user.balance < amount * 75) return interaction.followUp(`You don't have enough balance to buy \`${amount}\` ${amount == 1 ? "**candy**" : "**candies**"} !`)

                    let msg = await interaction.followUp({ content: `Are you sure want to buy \`${amount}\` ${amount == 1 ? "**candy**" : "**candies**"} ?\n**Cost**: \`${amount * 75}\` credits`, components: [row] })
                    client.collector.push(interaction.user.id)

                    const collector = msg.createMessageComponentCollector({
                        filter, max: 1, time: 30000
                    })

                    collector.on('collect', async i => {
                        await i.deferUpdate()
                        if (i.customId === 'yes') {

                            let Evo = levelUp.find(x => x.name.toLowerCase() == poke.name.toLowerCase())
                            if (Evo && Evo.levelup <= poke.level) {
                                if (poke.helditem && poke.helditem.includes("everstone")) return
                                msg = `Your ${poke.shiny ? "⭐ " : ""}**${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** has just leveled up to ${poke.level + 1} and evolved into **${Evo.evo.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** !`
                                poke.name = Evo.evo.toLowerCase().replace(/ /g, "-")
                                let species = species_by_name(Evo.evo.toLowerCase())
                                if (species) {
                                    poke.url = get_image(species.species_id)
                                    poke.rarity = get_types(poke.name.toLowerCase()).join('\n')
                                }
                                poke.xp = 0
                                await user.markModified(`pokemons`)
                                await user.save()
                                return interaction.followUp(msg)
                            }

                            poke.level = poke.level + amount
                            user.balance = user.balance - amount * 75
                            await user.markModified("pokemons")
                            await user.save().catch(() => { })
                            return interaction.channel.send({ content: `Congratulations **${interaction.user.username}**, your pokémon has just leveled up to \`${poke.level}\` !` })
                        }
                        if (i.customId === 'no') {
                            return interaction.channel.send({ content: "Ok Aborted!" })
                        }
                    })

                    collector.on('end', () => {
                        client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                        return interaction.editReply({ components: [rowx] }).catch(() => { })
                    })

                } else {
                    return interaction.followUp(`Page \`${page}\` doesn't seem to have item: \`${item}\` !`)
                }
            } else if (page == 2) {

                item = item.replace(/ /g, "-")
                let option = ["xp-blocker", "everstone"]
                if (!option.includes(item)) return interaction.followUp(`Page \`${page}\` doesn't seem to have item: \`${item}\` !`)
                if (user.selected == null || user.selected == undefined || !user.pokemons[user.selected]) return interaction.followUp({ content: "You don't have any active pokémon selected !" })
                let poke = user.pokemons[user.selected]

                if (poke?.helditem && poke.helditem.length == 1) return interaction.followUp("Your pokémon is already holding an item!")
                if (user.balance < 100) interaction.followUp({ content: `You don't have enought balance to **buy** held item for your pokémon !` })
                if (item == "xp-blocker") {
                    poke.helditem.push("xp-blocker")
                    user.balance -= 100
                    interaction.followUp('Your pokémon is now holding a `XP Blocker` !')
                } else if (item == "everstone") {
                    user.balance -= 100
                    poke.helditem.push("everstone")
                    interaction.followUp('Your pokémon is now holding an `Everstone` !')
                } else {
                    return
                }
                await user.markModified("pokemons")
                await user.save()
                return

            } else if (page == 3) {

                item = item.replace(/ /g, "-").toLowerCase()
                if (user.selected == null || user.selected == undefined || !user.pokemons[user.selected]) return interaction.followUp({ content: "You don't have any active pokémon selected !" })
                let pokemon = user.pokemons[user.selected]
                let poke = user.pokemons[user.selected]
                let pokename = pokemon.name.replace(/ /g, "-").toLowerCase()

                if (item == "normal") {

                    if (user.balance < 1000) return interaction.followUp({ content: `You don't have enought balance to **detransform** your pokémon !` })

                    if (pokename.startsWith("mega")) {
                        if (pokename.split('-').pop() == ("x" || "y")) {
                            pokename = pokename.split("-")[1].toLowerCase()
                            let species = species_by_name(pokename)
                            if (!species) return interaction.followUp(`Your pokémon doesn't **transform** into **${pokename}** !`)

                            pokemon.name = species.names['9'].toLowerCase()
                            pokemon.url = get_image(species.species_id)
                            user.balance -= 1000
                            await user.markModified("pokemons")
                            await user.save().catch(() => { })
                            return interaction.followUp({ content: `Congratulations **${interaction.user.username}**, your pokémon has detransformed into **${pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** !` })
                        } else {
                            pokename = pokename.replace("mega-", "")
                            let species = species_by_name(pokename)
                            if (!species) return interaction.followUp(`Your pokémon doesn't **transform** into **${pokename}** !`)
                            pokemon.name = species.names['9'].toLowerCase()
                            pokemon.url = get_image(species.species_id)
                            user.balance -= 1000
                            await user.markModified("pokemons")
                            await user.save().catch(() => { })
                            return interaction.followUp({ content: `Congratulations **${interaction.user.username}**, your pokémon has detransformed into **${pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** !` })
                        }
                    } else {
                        let form = Form.find(x => x.name == pokename)
                        if (form == undefined) return interaction.followUp(`Your pokémon doesn't **detransform** !`)

                        pokename = pokename.split("-").pop().toLowerCase()
                        let species = species_by_name(pokename)
                        if (!species) return interaction.followUp(`Your pokémon doesn't **transform** !`)
                        pokemon.name = species.names['9'].toLowerCase()
                        pokemon.url = get_image(species.species_id)
                        user.balance -= 1000
                        await user.markModified("pokemons")
                        await user.save().catch(() => { })
                        return interaction.followUp({ content: `Congratulations **${interaction.user.username}**, your pokémon has detransformed into **${pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** !` })
                    }

                } else if (item.startsWith('mega')) {
                    if (user.balance < 1000) return interaction.followUp("You don't have enough credits for **Mega** transformation !")
                    if (item == "mega") {
                        let mega = Mega.find(x => x.name == pokename)
                        if (mega == undefined) return interaction.followUp("Your pokémon doesn't have a **Mega** transformation !")
                        poke.url = mega.url
                        poke.name = `mega-${pokename}`
                        poke.rarity = mega.type
                        user.balance = user.balance - 1000
                        await user.markModified("pokemons")
                        await user.save().catch(() => { })
                        return interaction.followUp(`Your pokémon just transformed into **${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** !`)
                    } else if (item == "mega-y") {
                        let mega = Mega.find(r => r.name.replace("-y", "") === pokename)
                        if (mega == undefined) return interaction.followUp("Your pokémon doesn't have a **Mega Y** transformation !")
                        poke.url = mega.url
                        poke.name = `mega-${pokename}-y`
                        poke.rarity = mega.type
                        user.balance = user.balance - 1000
                        await user.markModified("pokemons")
                        await user.save()
                        return interaction.followUp(`Your pokémon just transformed into **${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** !`)
                    } else if (item == "mega-x") {
                        mega = Mega.find(r => r.name.replace("-x", "") === pokename)
                        if (mega == undefined) return interaction.followUp("Your pokémon doesn't have a **Mega X** transformation !")
                        poke.url = mega.url
                        poke.name = `mega-${pokename}-x`
                        poke.rarity = mega.type
                        user.balance = user.balance - 1000
                        await user.markModified("pokemons")
                        await user.save()
                        return interaction.followUp(`Your pokémon just transformed into \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\``)
                    } else {
                        return interaction.followUp(`**${item}**: mega transformation not found !`)
                    }


                }

                let form = Form.find(x => x.name == item)
                if (form == undefined) return interaction.followUp(`Your pokémon doesn't **transform** into \`${item}\` !`)
                if (!form.name.endsWith(pokemon.name.replace(/ /g, "-").toLowerCase())) return interaction.followUp(`Your pokémon doesn't **transform** into \`${item}\` !`)

                if (user.balance < 1000) return interaction.followUp({ content: `You don't have enought balance to **transform** your pokémon !` })

                let msg = await interaction.followUp({ content: `Are you sure want to transform your pokémon into new form ?\n**Cost**: \`1000\` credits`, components: [row] })
                client.collector.push(interaction.user.id)

                const collector = msg.createMessageComponentCollector({
                    filter, max: 1, time: 30000
                })

                collector.on('collect', async i => {
                    await i.deferUpdate()
                    if (i.customId === 'yes') {
                        pokemon.name = form.name
                        pokemon.url = form.url
                        pokemon.rarity = form.type
                        user.balance = user.balance - 1000
                        await user.markModified("pokemons")
                        await user.save().catch(() => { })
                        return interaction.channel.send({ content: `Congratulations **${interaction.user.username}**, your pokémon has just transformed into \`${pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\` !` })
                    }
                    if (i.customId === 'no') {
                        return interaction.channel.send({ content: "Ok Aborted!" })
                    }
                })

                collector.on('end', () => {
                    client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                    return interaction.editReply({ components: [rowx] }).catch(() => { })
                })

            } else if (page == 4) {

                if (item.startsWith("gigantamax") || item.startsWith("gmax")) {

                    if (user.selected == null || user.selected == undefined || !user.pokemons[user.selected]) return interaction.followUp({ content: "You don't have any active pokémon selected!" })

                    let pokemon = user.pokemons[user.selected]
                    let gmax = Gmax.find(x => x.name == pokemon.name.toLowerCase().replace(/ /, "-"))
                    if (gmax == undefined) return interaction.followUp(`Your pokémon doesn't **transform** into \`${item}\` !`)

                    if (user.balance < 25000) return interaction.followUp({ content: `You don't have enought balance to **transform** your pokémon into gigantamax !` })

                    let msg = await interaction.followUp({ content: `Are you sure want to transform your pokemon into gigantamax form ?\n**Cost**: \`25000\` credits`, components: [row] })
                    client.collector.push(interaction.user.id)

                    const collector = msg.createMessageComponentCollector({
                        filter, max: 1, time: 30000
                    })

                    collector.on('collect', async i => {
                        await i.deferUpdate()
                        if (i.customId === 'yes') {
                            pokemon.name = `gigantamax-${pokemon.name}`
                            pokemon.url = gmax.url
                            pokemon.rarity = gmax.type
                            user.balance = user.balance - 25000
                            await user.markModified("pokemons")
                            await user.save().catch(() => { })
                            return interaction.channel.send({ content: `Congratulations **${interaction.user.username}**, your \`${pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\` has just transformed into gigantamax !` })
                        }
                        if (i.customId === 'no') {
                            return interaction.channel.send({ content: "Ok Aborted!" })
                        }
                    })

                    collector.on('end', () => {
                        client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                        return interaction.editReply({ components: [rowx] }).catch(() => { })
                    })

                } else {
                    return interaction.followUp({ content: `Page \`${page}\` doesn't seem to have item: \`${item}\` !` })
                }

            } else if (page == 5) {

                let option = ["redeem", "pokemons", "deluxe-crate"]
                item = item.replace(/ /g, "-").toLowerCase()
                if (!option.includes(item)) return interaction.followUp(`Page \`${page}\` doesn't seem to have item: \`${item}\` !`)

                if (item == "redeem") {
                    if (user.shards < amount * 200) return interaction.followUp(`You don't have enough shards to buy item: \`${item}\``)

                    let msg = await interaction.followUp({ content: `Are you sure want to buy \`${amount}\` redeem from shop?\n**Cost**: \`${200 * amount}\` shards`, components: [row] })
                    client.collector.push(interaction.user.id)

                    const collector = msg.createMessageComponentCollector({
                        filter, max: 1, time: 30000
                    })

                    collector.on('collect', async i => {
                        await i.deferUpdate()
                        if (i.customId === 'yes') {
                            user.redeems += amount
                            user.shards -= 200 * amount
                            await user.save().catch(() => { })
                            return interaction.channel.send(`Successfully bought \`${amount}\` redeem from the shop.`)
                        }
                        if (i.customId === 'no') {
                            return interaction.channel.send({ content: "Ok Aborted!" })
                        }
                    })

                    collector.on('end', () => {
                        client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                        return interaction.editReply({ components: [rowx] }).catch(() => { })
                    })

                } else if (item == "pokemons") {
                    if (user.shards < 100) return interaction.followUp(`You don't have enough shards to buy item: \`${item}\``)

                    let msg = await interaction.followUp({ content: `Are you sure want to buy rare pokémons from shop?\n**Cost**: \`100\` shards`, components: [row] })
                    client.collector.push(interaction.user.id)

                    const collector = msg.createMessageComponentCollector({
                        filter, max: 1, time: 30000
                    })

                    collector.on('collect', async i => {
                        await i.deferUpdate()
                        if (i.customId === 'yes') {
                            interaction.channel.send("Successfully bought, 10 rare pokémons will be redeemed to your account Within 60s.")
                        }
                        if (i.customId === 'no') {
                            interaction.channel.send({ content: "Ok Aborted!" })
                        }
                    })

                    collector.on('end', () => {
                        client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                        interaction.editReply({ components: [rowx] }).catch(() => { })
                    })

                    for (let i = 1; i < 11; i++) {
                        let items = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 366, 480, 481, 482, 483, 484, 485, 486, 488, 489, 490, 491, 492, 493, 494, 639, 639, 640, 641, 642, 643, 644, 645, 646, 649]
                        let itemx = items[Math.floor(Math.random() * items.length)]
                        let name = itemx, url
                        let a = {
                            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                            json: true
                        }

                        await get(a).then(async t => {

                            let re
                            const Type = t.types.map(r => {
                                if (r !== r) re = r
                                if (re == r) return
                                return `${r.type.name}`
                            }).join(" | ")
                            let check = t.id.toString().length

                            if (check === 1) {
                                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
                            } else if (check === 2) {
                                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
                            } else if (check === 3) {
                                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
                            }
                            let lvl = Math.floor(Math.random() * 50)
                            let poke = new Pokemon({ name: t.name, id: t.id, url: url, rarity: Type, nickname: null }, lvl)
                            poke = await classToPlain(poke)
                            user.pokemons.push(poke)
                        })
                    }
                    user.shards -= 100
                    await user.markModified("pokemons")
                    await user.save().catch(() => { })
                    return
                } else if (item == "deluxe-crate") {

                    if (user.shards < amount * 25) return interaction.followUp(`You don't have enough shards to buy item: \`${item}\``)
                    let msg = await interaction.followUp({ content: `Are you sure want to buy \`${amount}\` deluxe crates from shop?\n**Cost**: \`${25 * amount}\` shards`, components: [row] })
                    client.collector.push(interaction.user.id)

                    const collector = msg.createMessageComponentCollector({
                        filter, max: 1, time: 30000
                    })

                    collector.on('collect', async i => {
                        await i.deferUpdate()
                        if (i.customId === 'yes') {
                            user.crates.deluxecrate += amount
                            user.shards -= 25 * amount
                            await user.save().catch(() => { })
                            return interaction.channel.send(`Successfully bought \`${amount}\` deluxe crates from the shop.`)
                        }
                        if (i.customId === 'no') {
                            return interaction.channel.send({ content: "Ok Aborted!" })
                        }
                    })

                    collector.on('end', () => {
                        client.collector.splice(client.collector.indexOf(interaction.user.id), 1)
                        return interaction.editReply({ components: [rowx] }).catch(() => { })
                    })

                } else {
                    return
                }
            } else if (page == 6) {

                let option = ["adamant", "bashful", "brave", "bold", "calm", "careful", "docile", "gentle", "hardy", "hasty", "impish", "jolly", "lax", "lonely", "mild", "modest", "naive", "naughty", "quiet", "quicky", "rash", "relaxed", "sassy", "serious", "timid"]
                if (!option.includes(item)) return interaction.followUp(`Page \`${page}\` doesn't seem to have item: \`${item}\` !`)
                if (user.balance < 75) return interaction.followUp(`You don't have enough balance to buy item: \`${item}\` !`)

                if (user.selected == null || user.selected == undefined || !user.pokemons[user.selected]) return interaction.followUp({ content: "You don't have any **active** pokémon selected !" })
                let pokemon = user.pokemons[user.selected]
                pokemon.nature = item
                user.balance -= 75
                await user.markModified('pokemons')
                await user.save().catch(() => { })
                return interaction.followUp("You pokémon just converted it's nature to " + `\`${item.toLowerCase()}\` !`)
            } else {
                return interaction.followUp({ content: `Page \`${page}\` doesn't seem to exist or maybe you made a typo !` })
            }
        } else if (subcommand == "forms") {
            let name = interaction.options.getString('name').toLowerCase()
            let form = Form.filter(r => r.name.endsWith(name))
            if (form.length === 0) return interaction.followUp(`**${name}** doesn't have any form transformations or maybe you spelled it wrong !`)

            let embed = new Discord.MessageEmbed()
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\n🛒 ・ ${client.user.username} Shop`)
                .setDescription(`Some pokémon have different forms, you can buy them here to allow them to transform.\n\n**All ${name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} form costs \`1000\` Credits.**\n\`${prefix}shopbuy 3 [form]\``)
                .addField(`${name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} Forms`, "-> " + form.map(e => e.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())).join("\n-> "))
                .setColor(color)

            return interaction.followUp({ embeds: [embed] })
        }
    }
}

