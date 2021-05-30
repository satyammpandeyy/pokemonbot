const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { randomNumber, capitalize } = require("../../functions.js");
const { classToPlain } = require("class-transformer");
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const gen8 = require("../../db/gen8.js");
var pokemon = require("../../db/pokemon.js");
const ms = require("ms");
const Pokemon = require("../../Classes/Pokemon");
let starters = ["bulbasaur", "charmander", "squirtle",
    "chikorita", "cyndaquil", "totodile",
    "treecko", "torchic", "mudkip",
    "turtwig", "chimchar", "piplup",
    "snivy", "tepig", "oshawott",
    "chespin", "fennekin", "froakie",
    "rowlet", "litten", "popplio",
    "grookey", "scorbunny", "sobble"];
let gen8Starters = ["grookey", "scorbunny", "sobble"];

module.exports = {
    name: "pick",
    description: "Pick your starter pokémon!",
    category: "GettingStarted",
    args: true,
    usage: ["pick <pokemon>"],
    cooldown: 3,
    permissions: [],
    aliases: [],

    async execute(client, message, args, prefix, guild, color, channel) {
        let user = await User.findOne({ id: message.author.id });
        if (user) return message.channel.send("You've already chosen a starter Pokémon!");
        if (!starters.includes(args[0].toLowerCase())) return message.channel.send("That Pokémon doesn't seem to exist. Maybe you spelled it wrong?")

        let find = gen8.find(r => r.name === args.join("-").toLowerCase());
        if (gen8Starters.includes(args.join("-").toLowerCase())) {
            let url,
                shiny,
                re;
            if (randomNumber(0, 100) < 1) {
                shiny = true
                url = find.url
            } else if (randomNumber(0, 100) > 1) {
                shiny = false
                url = find.url
            }
            const type = find.type
            let poke = new Pokemon({ name: find.name, shiny: shiny, rarity: type, url: url });
            poke = await classToPlain(poke)
            await new User({ id: message.author.id }).save()
            user = await User.findOne({ id: message.author.id })
            user.pokemons.push(poke)
            await user.markModified(`pokemons`)
            await user.save()
            return message.channel.send(`Congratulations ${message.author.username}! ${user.pokemons[0].name} is your starter Pokémon. Type \`${prefix}info\` to get it's stats!`)
        } else {
            const t = await get({
                url: `https://pokeapi.co/api/v2/pokemon/${args.join("-").toLowerCase()}`,
                json: true
            })
            let url,
                shiny,
                re;
            let check = t.id.toString().length

            if (randomNumber(0, 100) < 1) shiny = true;
            if (randomNumber(0, 100) > 1) shiny = false;
            if (!shiny) {
                if (check === 1) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
                } else if (check === 2) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
                } else if (check === 3) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
                }
            } else {
                let get = shinyDb.find(r => r.name === args.join(" "));
                if (get) url = get.url;
                if (!get) url = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${args.join("-").toLowerCase()}.gif`;
            }
            const type = t.types.map(r => {
                if (r !== r) re = r;
                if (re == r) return;
                return `${capitalize(r.type.name)}`

            }).join(" | ")
            let poke = new Pokemon({ name: capitalize(args[0]), shiny: shiny, rarity: type, url: url })
            poke = await classToPlain(poke)
            await new User({ id: message.author.id }).save()
            user = await User.findOne({ id: message.author.id })
            user.pokemons.push(poke)
            await user.markModified(`pokemons`)
            await user.save()
            return message.channel.send(`Congratulations ${message.author.username}! ${user.pokemons[0].name} is your starter Pokémon. Type \`${prefix}info\` to get it's stats!`)
        }
    }
}