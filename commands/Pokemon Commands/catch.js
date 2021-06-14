const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native')
const fs = require("fs");
const { classToPlain } = require("class-transformer");
const { capitalize, getlength } = require('../../functions.js');
const Pokemon = require("./../../Classes/Pokemon");

let Guild = require('../../models/guild.js');
let User = require("../../models/user.js");
let levelUp = require("../../db/levelup.js")
let Spawn = require("../../models/spawn.js");
let pokemon = require("../../db/pokemon.js");
let forms = require("../../db/forms.js");
let primal = require("../../db/primal.js");
let shinyDb = require("../../db/shiny");
let gen8 = require('../../db/gen8.js')
let altnames = require("../../db/altnames.js");

module.exports = {
    name: "catch",
    description: "Catch a wild pokemon when it appears in the chat.",
    category: "Pokemon Commands",
    args: false,
    usage: ["catch <pokemon>"],
    cooldown: 3,
    permissions: [],
    aliases: ["c"],
    execute: async (client, message, args, prefix, guild, color, channel) => {



        let spawn = await Spawn.findOne({ id: message.channel.id })
        if (!spawn.pokemon[0]) return;
        let user = await User.findOne({ id: message.author.id })



        // if (message.author.id === "681699145102131211" && !user) await new User({ id: "681699145102131211" }).save();
        // user = await User.findOne({ id: message.author.id })
        if (!user) return message.channel.send("You need to pick a starter pokémon using the `start` command before using this command!");
        let embed = new MessageEmbed()
        let name = args.join("-").toLowerCase()
        for (var i = 0; i < altnames.length; i++) {
            let org = []
            altnames[i].jpname.toLowerCase().split(" | ").forEach(nm => {
                org.push(nm.replace(" ", "-"))
            })
            for (let y = 0; y < org.length; y++) {
                if (org[y] == name.toLowerCase()) {
                    let og = `${org[0]} | ${org[1]} | ${org[2]}`
                    name = name.replace(name, og.toLowerCase().replace("-", " "))
                }
            }
        }
        const altjp = altnames.find(e => e.jpname.toLowerCase() === name.toLowerCase().replace("shiny-", "")),
            altfr = altnames.find(e => e.frname.toLowerCase() === name.toLowerCase().replace("shiny-", "")),
            altde = altnames.find(e => e.dename.toLowerCase() === name.toLowerCase().replace("shiny-", ""));
        if (altjp) name = name.toLowerCase().replace(altjp.jpname.toLowerCase(), altjp.name.toLowerCase());
        else if (altfr) name = name.toLowerCase().replace(altfr.frname.toLowerCase(), altfr.name.toLowerCase());
        else if (altde) name = name.toLowerCase().replace(altde.dename.toLowerCase(), altde.name.toLowerCase());

        let poke = spawn.pokemon[0];
        if (!poke) return;
        if (poke && name.toLowerCase() == poke.name.toLowerCase().split(/ +/g).join("-")) {
            spawn.pokemon = [];
            spawn.time = 0;
            spawn.hcool = false;
            await spawn.markModified(`pokemons`);
            await spawn.save();

            let lvl = poke.level;
            poke.xp = ((lvl - 1) + 80 * lvl + 100);
            await user.pokemons.push(poke);
            //if (!user.caught.find(r => r.name.toLowerCase() === poke.name.toLowerCase())) 
            await user.caught.push(poke);
            user.lbcaught = user.lbcaught + 1;
            await user.markModified(`pokemons`);
            user.balance = user.balance + 50
            if (poke.shiny) {
                user.shinyCaught = user.shinyCaught + 1;
                user.balance = user.balance + 50

            }
            await user.save();
            // user = await User.findOne({ id: message.author.id })
            let catchemb = new MessageEmbed()
            // .setTitle(message.author)
            .setDescription(`Congratulations! ${message.author}\nYou have caught a Level ${poke.level} ${poke.shiny ? "Shiny " : ""}${capitalize(poke.name.replace(/-+/g, " "))} ${poke.totalIV}% IV You Received 50 craft coins!`)
            .setFooter(`You Have Caught Total : ${user.lbcaught+1} Pokemons`)
            .setColor(color)
            message.channel.send(catchemb);

        } else {
            return message.channel.send("This is the wrong pokémon!")
        }

    }
}