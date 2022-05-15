const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const Discord = require('discord.js')
const User = require('../../models/user.js')
const { get } = require('request-promise-native')
const { classToPlain } = require("class-transformer")
const gen8 = require("../../db/gen8.js")
var pokemon = require("../../db/pokemon.js")
const ms = require("ms")
const Pokemon = require("../../Classes/Pokemon")
let starters = ["bulbasaur", "charmander", "squirtle",
    "chikorita", "cyndaquil", "totodile",
    "treecko", "torchic", "mudkip",
    "turtwig", "chimchar", "piplup",
    "snivy", "tepig", "oshawott",
    "chespin", "fennekin", "froakie",
    "rowlet", "litten", "popplio",
    "pikachu", "eevee", "umbreon", "espeon"]
let gen8Starters = ["grookey", "scorbunny", "sobble"]
const randomNumber = (min, max) => {
    const t = Math.random() * (max - min) + min
    return t.toFixed(2)
}

module.exports = {
    name: "start",
    description: "Pick your starter pokémon and start your journey!",
    options: [
        {
            name: "pokémon",
            description: "Provide the name of pokémon which you want to choose as your starter!",
            type: 3,
            required: false
        }
    ],
    run: async (client, interaction, args, color, prefix) => {


        let user = await User.findOne({ id: interaction.user.id })

        let embed = new MessageEmbed()
            .setAuthor("Professor Oak | Starter Pokémons", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
            .addField("Generation I (Kanto)", "Bulbasaur • Charmander • Squirtle\nPikachu • Eevee")
            .addField(`Generation II (Johto | Orre)`, `Chikorita • Cyndaquil • Totodile\nUmbreon • Espeon`)
            .addField(`Generation III (Hoenn)`, `Treecko • Torchic • Mudkip`)
            .addField(`Generation IV (Sinnoh)`, `Turtwig • Chimchar • Piplup`)
            .addField(`Generation V (Unova)`, `Snivy • Tepig • Oshawott`)
            .addField(`Generation VI (Kalos)`, `Chespin • Fennekin • Froakie`)
            .addField(`Generation VII (Alola)`, `Rowlet • Litten • Popplio`)
            .addField(`Generation VIII (Galar)`, `Grookey • Scorbunny • Sobble`)
            .setColor(color)

        if (!args[0]) return interaction.followUp({ embeds: [embed] })


        let name = args[0].split(" ").join("-").toLowerCase();
        if (user) return interaction.followUp({ content: `You've already picked your **starter** !` })
        if (gen8Starters.includes(name)) {
            let find = gen8.find(r => r.name === name)
            let url, shiny
            if (randomNumber(0, 100) < 1) {
                shiny = true
                url = find.url
            } else if (randomNumber(0, 100) > 1) {
                shiny = false
                url = find.url
            }
            const type = find.type
            let poke = new Pokemon({ name: find.name, shiny: shiny, rarity: type, url: url })
            // poke = await classToPlain(poke)
            await new User({ id: interaction.user.id }).save()
            user = await User.findOne({ id: interaction.user.id })
            user.selected = null
            await user.pokemons.push(poke)
            await user.markModified(`pokemons`)
            await user.save()

            let embed = new MessageEmbed()
                .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                .setTitle(`Ahh , ${user.pokemons[0].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}! A fine choice, It has joined your team.`)
                .addField("Name", user.pokemons[0].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()), true)
                .addField("Type", user.pokemons[0].rarity.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()), true)
                .addField("Stats", `Level ${user.pokemons[0].level} | ${user.pokemons[0].totalIV}% IV`, true)
                .addField("Weight", `6 Kg`, true)
                .addField("Height", `0.6m`, true)
                .setThumbnail(user.pokemons[0].url)
                .setColor(color)
                .setFooter(`Use "/help" to learn how to use this bot, make sure you join ${client.user.username} official server to stay updated.`)
            return interaction.followUp({ embeds: [embed] })
        } else if (starters.includes(name)) {
            const t = await get({
                url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                json: true
            })
            let url,
                shiny,
                re
            let check = t.id.toString().length

            if (randomNumber(0, 100) < 1) shiny = true
            if (randomNumber(0, 100) > 1) shiny = false
            if (!shiny) {
                if (check === 1) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
                } else if (check === 2) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
                } else if (check === 3) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
                }
            } else {
                let get = shinyDb.find(r => r.name === name)
                if (get) url = get.url
                if (!get) url = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name}.gif`
            }
            const type = t.types.map(r => {
                if (r !== r) re = r
                if (re == r) return
                return `${r.type.name}`
            }).join(" | ")
            let poke = new Pokemon({ name: t.name, shiny: shiny, rarity: type, url: url })
            // poke = await classToPlain(poke)
            await new User({ id: interaction.user.id }).save()
            user = await User.findOne({ id: interaction.user.id })
            await user.pokemons.push(poke)
            await user.markModified(`pokemons`)
            await user.save()

            let embed = new MessageEmbed()
                .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                .setTitle(`Ohh , ${user.pokemons[0].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}! A fine choice, It has joined your team.`)
                .addField("Name", user.pokemons[0].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()), true)
                .addField("Type", user.pokemons[0].rarity.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()), true)
                .addField("Stats", `Level ${user.pokemons[0].level} | ${user.pokemons[0].totalIV}% IV`, true)
                .addField("Weight", `${t.weight / 10} Kg`, true)
                .addField("Height", `${t.height / 10}m`, true)
                .setThumbnail(user.pokemons[0].url)
                .setColor(color)
                .setFooter(`Use "/help" to learn how to use this bot, make sure you join ${client.user.username} official server to stay updated.`)


            return interaction.followUp({ embeds: [embed] })
        } else {
            return interaction.followUp({ content: `\`${name}\` doesn't exist or is the wrong starter choice! ` })
        }

    }
}
