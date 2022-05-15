const { MessageEmbed } = require('discord.js')
const Pokemon = require("../../Classes/Pokemon")
let Guild = require('../../models/guild.js')
let User = require("../../models/user.js")
const { get } = require('request-promise-native')
const { random, legend, mythical, ub, galarian, gen8, shadow, getRandomNumberBetween } = require("../../functions.js")
let Spawn = require("../../models/spawn.js")
const Gen8 = require('../../db/gen8.js')
const Galarians = require('../../db/galarians.js')
const Shadow = require('../../db/shadow.js')
const Discord = require('discord.js')

module.exports = {
    name: 'spawn',
    description: 'Spawn a pokémon for yourself !',
    cooldown: 5,
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        let error = [
            `**${interaction.user.username}**, spawn unsuccessful , better luck next time !`,
            `**${interaction.user.username}**, spawn unsuccessful , try again later !`,
            `**${interaction.user.username}**, spawn unsuccessful , please wait and try again !`,
            `**${interaction.user.username}**, spawn unsuccessful , retry later !`,
            `**${interaction.user.username}**, spawn unsuccessful , try back later !`,
            `**${interaction.user.username}**, spawn unsuccessful , give it another shot !`,
            `**${interaction.user.username}**, spawn unsuccessful , give it another attempt !`,
            `**${interaction.user.username}**, spawn unsuccessful , keep trying !`,
            `**${interaction.user.username}**, spawn unsuccessful , dial it a second chance !`,
            `**${interaction.user.username}**, spawn unsuccessful , dial again !`,
            `**${interaction.user.username}**, spawn unsuccessful , redo !`,
        ]
        let spawnChance = getRandomNumberBetween(1, 10)
        if (spawnChance < 4) return interaction.followUp({ content: error[~~(Math.random() * error.length)] })

        let guild = await Guild.findOne({ id: interaction.guild.id })
        if (!guild) await new Guild({ id: interaction.guild.id }).save()
        guild = await Guild.findOne({ id: interaction.guild.id })

        let channel = interaction.channel
        if (!channel) return

        if (guild.spawnchannel.length > 1 && !guild.spawnchannel.includes(interaction.channel.id)) return interaction.followUp({ content: `**${interaction.user.username}**, spawns have been disabled in this channel !` })

        let rarityChance = getRandomNumberBetween(1, 1000), name
        if (rarityChance > 995) {
            if (rarityChance === 996) name = legend()
            else if (rarityChance === 997) name = mythical()
            else if (rarityChance === 998) name = ub()
            else if (rarityChance === 999) name = galarian()
            else if (rarityChance === 1000) name = shadow()
            else name = legend()
        } else {
            name = random()
        }

        name = name.toLowerCase().replace(/ /g, "-")
        const g8 = Gen8.find(r => r.name === name)
        const gg = Galarians.find(r => r.name === name.replace("galarian-", ""))
        const shad = Shadow.find(r => r.name === name.replace("shadow-", ""))

        let lvl = Math.floor(Math.random() * 50)
        let shinyChance = getRandomNumberBetween(1, 4000), shiny = false
        if (shinyChance == 3999) shiny = true, Type, poke, url

        if (g8) {
            Type = g8.type
            url = g8.url
            poke = new Pokemon({ name: name, rarity: Type, url: url, shiny: shiny }, lvl)
        } else if (gg && name.startsWith('galarian')) {
            Type = gg.type
            url = gg.url
            poke = new Pokemon({ name: name, rarity: Type, url: url, shiny: shiny }, lvl)
        } else if (shad && name.startsWith('shadow')) {
            Type = shad.type
            url = shad.url
            poke = new Pokemon({ name: name, rarity: Type, url: url, shiny: shiny }, lvl)
        } else if (!g8 || !gg || !shad) {

            const options = {
                url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                json: true
            }
            if (name.startsWith("zacian")) options.url = "https://pokeapi.co/api/v2/pokemon/zacian-hero"
            if (name.startsWith("giratina")) options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered"
            if (name.startsWith("deoxys")) options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal"
            if (name.startsWith("shaymin")) options.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land"
            if (name === "nidoran") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
            if (name === "nidoran-m") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
            if (name === "nidoran-f") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f"
            if (name.startsWith("porygon-z")) options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z"
            if (name.startsWith("landorus")) options.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate"
            if (name.startsWith("thundurus")) options.url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate"
            if (name.startsWith("tornadus")) options.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate"
            if (name.includes("mr.mime")) options.url = "https://pokeapi.co/api/v2/pokemon/mr-rime"
            if (name.startsWith("pumpkaboo")) options.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average"
            if (name.startsWith("meowstic")) options.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male"
            if (name.startsWith("toxtricity")) options.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped"
            if (name.startsWith("mimikyu")) options.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised"

            await get(options).then(async t => {

                let check = t.id.toString().length
                if (check === 1) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
                } else if (check === 2) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
                } else if (check === 3) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
                }

                let re
                Type = t.types.map(r => {
                    if (r !== r) re = r
                    if (re == r) return
                    return `${r.type.name}`
                }).join(" | ")

                poke = new Pokemon({ name: name, id: t.id, rarity: Type, url: url, shiny: shiny }, lvl)
            }).catch(err => {
                if (err.message.includes(`404 - "Not Found"`)) return interaction.followUp(`ERROR, unable to spawn this pokemon\nName: **${name}**`)
                if (err.message.toLowerCase().startsWith(`VersionError`)) return
            })

        } else return interaction.followUp(`Spawn **Unsuccessful**.`)


        if (poke.url.length > 2) {

            let embed = new Discord.MessageEmbed()
                .setAuthor("Fellow Trainers, you have discovered a wild pokémon !")
                .setDescription(`Use \`${prefix}catch <name>\` to catch the pokémon.`)
                .setImage(poke.url)
                .setColor(color)

            let spawn = await Spawn.findOne({ id: interaction.channel.id })
            if (!spawn) await new Spawn({ id: interaction.channel.id }).save()
            spawn = await Spawn.findOne({ id: interaction.channel.id })
            spawn.pokemon = poke
            await spawn.save().catch(() => { })
            return interaction.followUp({ embeds: [embed] })

        } else return interaction.followUp({ content: `Spawn **Unsuccessful**.` })
    }
}