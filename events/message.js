const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const config = require('../config.js')
const { get } = require('request-promise-native')
const fs = require("fs");
const { classToPlain } = require("class-transformer");
const { getlength, log } = require("../functions");
const Pokemon = require("./../Classes/Pokemon");
let scool = new Set();
let Guild = require('../models/guild.js');
let User = require("../models/user.js");
let Pokemons = require("../models/pokemons");
let levelUp = require("../db/levelup.js");
let Spawn = require("../models/spawn.js");
let pokemon = require("../db/pokemon.js");
let forms = require("../db/forms.js");
let primal = require("../db/primal.js");
let shinyDb = require("../db/shiny");
let Gen8 = require('../db/gen8.js')
let altnames = require("../db/altnames.js");
const spawn = require("../models/spawn.js");
const { set } = require("mongoose");
let color = '#00ffff';

const common = fs.readFileSync("./db/common.txt").toString().trim().split("\n").map(r => r.trim());
const alolan = fs.readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const mythic = fs.readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const legend = fs.readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const ub = fs.readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
const galarian = fs.readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;
    let channel = client.channels.cache.get(client.config.channel);
    let prefix = [client.config.prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`]
    let guild = await Guild.findOne({ id: message.guild.id });
    if (!guild) await new Guild({ id: message.guild.id }).save();
    guild = await Guild.findOne({ id: message.guild.id })
    prefix = [guild.prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`]
    let prefixs = prefix;

    let user = await User.findOne({ id: message.author.id });

    if (!message.channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) return;
    if (!message.channel.permissionsFor(client.user.id).has("VIEW_CHANNEL")) return;
    if (!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return;
    if (!message.channel.permissionsFor(client.user.id).has("ATTACH_FILES")) return;


    let spawn = Spawn.findOne({ id: message.channel.id })
    if (guild.spawnbtn && !message.content.toLowerCase().startsWith(prefix[0].toLowerCase())) {
        if (!scool.has(message.channel.id)) await spawnPokemon(message, client)
        if (user) await leveling(message, client).catch(err => {
            if (err.message.toLowerCase().startsWith(`VersionError`)) return;
        })
    }

    if (message.content.startsWith(prefix[1])) prefix = prefix[1];
    else if (message.content.startsWith(prefix[2])) prefix = prefix[2];
    else prefix = prefix[0];

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(message.content) && !args[0]) {
        if (guild.blacklist == true) return message.channel.send("This server has been blacklisted. Join support server to appeal  https://discord.gg/q9uJ7zA6gb .");
        if (user && user.blacklist == true) return message.channel.send("You have been blacklisted. Join support server to appeal https://discord.gg/q9uJ7zA6gb .");
        let embed = new MessageEmbed()
        
            .addField("Bot Prefix", `The current prefix for this server is \`${prefixs[0]}\``)
            .addField("Invite The Bot", `**[Click Here!](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2147871809&scope=bot)**`)
            .addField("Support Server:", `**[Click Here!](https://discord.gg/fEb4Rfkmjp)**`)
            .setColor(color)
        return message.channel.send(embed)
    }

    if (!args[0]) return;
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    if (message.content.startsWith(prefix) && guild.blacklist == true) return message.channel.send("This server has been blacklisted. Join support server to appeal.");
    if (user && user.blacklist == true && message.content.startsWith(prefix)) return message.channel.send("You have been blacklisted. Join support server to appeal https://discord.gg/q9uJ7zA6gb .");
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    if (cmd) {
        prefix = prefixs[0]
        if (cmd.category.toLowerCase() == "dev" && !client.config.owners.includes(message.author.id)) return message.reply(`<a:bsdk:851712017503879198> you are not my owner idiot`)
        if (cmd.category.toLowerCase() === "Dev2" && !client.config.asliMalik.includes(message.author.id)) return message.channel.reply(`This command can only be used by ${client.user.username} Owners.`);
        if (cmd.category == "Testing" && !client.config.owners.includes(message.author.id)) return message.reply("This command is under maintenance. Please check back later");
        if (cmd.args && !args.length) return message.channel.send(`See \`${capitalize(prefix)}help ${capitalize(cmd.name)}\` for more information on how to use the ${capitalize(cmd.name)} Command.`);
        if (cmd.permissions[0] && !message.channel.permissionsFor(message.author.id).has(cmd.permissions)) return message.channel.send(`You don't have enough permissions to use this command.`);


        cmd.execute(client, message, args, prefix, guild, color, channel).catch(err => {
            if ([`versionerror`, `no matching document`, `missing permissions`].includes(err.message.toLowerCase())) return;
            /* if (err.message.includes(`404 - "Not Found"`)) return message.channel.send("This Pokémon doesn't seem to appear in the Pokedex or maybe you spelled it wrong!"); */
      
            //message.reply('There Was An Error While Trying To Execute ' + command + ' Command!```xl\n' + err + '```**Report This Error To Devs**');
        })
         log(`[${message.guild.name}/#${message.channel.name}] ${message.author.username} (${message.author.id}): ${prefix}${command} ${args.join(" ")}`)
    }


}




async function spawnPokemon(message, client) {

    let guild = await Guild.findOne({ id: message.guild.id });
    let channel = client.channels.cache.get(message.channel.id);
    if (!guild) await new Guild({ id: message.guild.id }).save();
    guild = await Guild.findOne({ id: message.guild.id })

    if (!guild.spawnbtn) return;
    if (guild.disabledChannels.includes(message.channel.id)) return;
    if (guild.spawnchannel !== null) channel = client.channels.cache.get(guild.spawnchannel);
    if (!channel) return;


    let spawn = await Spawn.findOne({ id: channel.id });
    if (!spawn) await new Spawn({ id: channel.id }).save();
    spawn = await Spawn.findOne({ id: channel.id })

    // if (spawn.pokemon[0]) return;// console.log(spawn.pokemon[0].name);
    if (guild.spawnchannel && scool.has(message.channel.id)) return;
    if (!guild.spawnchannel && scool.has(message.channel.id)) return;

    var gen = pickRandom();
    var type = common;
    if (gen == "common") type = common;
    if (gen == "alolan") type = alolan;
    if (gen == "mythic") type = mythic;
    if (gen == "legend") type = legend;
    if (gen == "ub") type = ub;
    if (gen == "galarian") type = galarian;
    var shiny = false
    //type = galarian
    gen = Math.floor(Math.random() * 100000) + 1;
    if (gen <= 10) shiny = true;
    const random = type[Math.floor(Math.random() * type.length)];
    var name = random.trim().split(/ +/g).join("-").toLowerCase();
    var findGen8 = Gen8.find(r => r.name === name);
    var Name = name;
    if (name.startsWith("alolan-")) {
        name = name.replace("alolan-", "");
        Name = `${name}-alola`
        name = random;
    };
    const options = {
        url: `https://pokeapi.co/api/v2/pokemon/${Name}`,
        json: true
    };
    if (name.toLowerCase().startsWith("giratina")) options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered";
    if (name.toLowerCase().startsWith("deoxys")) options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal";
    if (name.toLowerCase().startsWith("shaymin")) options.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land";
    //if (name.toLowerCase() === "nidoran") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
    if (name.toLowerCase().startsWith("nidoran-m")) options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
    if (name.toLowerCase().startsWith("nidoran-f")) options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f";
    if (name.toLowerCase().startsWith(("porygon z") || "porygon-z")) options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z";
    if (name.toLowerCase().startsWith("landorus")) options.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate";
    if (name.toLowerCase().startsWith("thundurus")) options.url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate";
    if (name.toLowerCase().startsWith("tornadus")) options.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate";
    if (name.toLowerCase().startsWith("mr.mime")) options.url = "https://pokeapi.co/api/v2/pokemon/mr-rime";
    if (name.toLowerCase().startsWith("pumpkaboo")) options.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average";
    if (name.toLowerCase().startsWith("meowstic")) options.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male";
    if (name.toLowerCase().startsWith("toxtricity")) options.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped";
    if (name.toLowerCase().startsWith("mimikyu")) options.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised  ";
    await get(options).then(async t => {
        let check = t.id.toString().length
        let url;

        if (!shiny) {
            if (check === 1) {
                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
            } else if (check === 2) {
                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
            } else if (check === 3 && !Name.endsWith("-alola")) {
                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
            } else if (check > 3 && Name.endsWith("-alola")) {

                let t2 = await get({
                    url: `https://pokeapi.co/api/v2/pokemon/${Name.replace("-alola", "")}`,
                    json: true
                })

                let check2 = t2.id.toString().length
                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t2.id}_f2.png`

                if (check2 === 1) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t2.id}_f2.png`
                } else if (check2 === 2) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t2.id}_f2.png`
                } else if (check2 === 3) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t2.id}_f2.png`
                }
            }
        } else {
            let get = shinyDb.find(r => r.name === Name);
            if (get) url = get.url;
            if (!get) url = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${random.toLowerCase()}.gif`;
        }
        if (findGen8) uri = findGen8.url;

        var re;
        const Type = t.types.map(r => {
            if (r !== r) re = r;
            if (re == r) return;
            return `${capitalize(r.type.name)}`
        }).join(" | ");
        let lvl = Math.floor(Math.random() * 50)
        let poke = new Pokemon({ name: random, id: t.id, shiny: shiny, rarity: Type, url: url }, lvl);
        poke = await classToPlain(poke);
        if (shiny == true && Name.endsWith("alola")) {
            if (shinyDb.find(r => r.name.toLowerCase() === Name.toLowerCase())) url = shinyDb.find(r => r.name === Name).url;
        }
      
   let x=100,y=100;
        let bg;
        let shadow = true;
        if (Type.toLowerCase().startsWith("bug")) bg = "https://media.discordapp.net/attachments/853522935364321284/853570523263270932/new.png", shadow = false;
        if (Type.toLowerCase().startsWith("water")) bg = "https://cdn.discordapp.com/attachments/849927302468599808/851826672185770034/IMG_20210608_194442.jpg", shadow = false;
        if (Type.toLowerCase().startsWith("rock")) bg = "https://cdn.discordapp.com/attachments/844390398687707157/845875885865041930/mike-blank-JWa5jZ1LkJY-unsplash.jpg",y=120, shadow = false;
        if (Type.toLowerCase().startsWith("flying")) bg = "https://cdn.discordapp.com/attachments/845193133100105756/845193150695079976/rffw88nr-1354076846.png", shadow = false;
        if (Type.toLowerCase().startsWith("grass")) bg = "https://media.discordapp.net/attachments/853522935364321284/853570523263270932/new.png", shadow = false;
        if (Type.toLowerCase().startsWith("normal")) bg = "https://media.discordapp.net/attachments/853522935364321284/853570523263270932/new.png", shadow = false;
        if (Type.toLowerCase().startsWith("steel")) bg = "https://cdn.discordapp.com/attachments/844390398687707157/845875885865041930/mike-blank-JWa5jZ1LkJY-unsplash.jpg";
        if (Type.toLowerCase().startsWith("ice")) bg = "https://cdn.discordapp.com/attachments/849927302468599808/851826207649169418/IMG_20210608_194256.jpg", shadow = false;
        if (Type.toLowerCase().startsWith("electric")) bg = "https://cdn.discordapp.com/attachments/844390398687707157/846372312352948244/lightning.jpg";
        if (Type.toLowerCase().startsWith("ground")) bg = "https://cdn.discordapp.com/attachments/849927302468599808/851825385469116457/IMG_20210608_193934.jpg", shadow = false;
        if (Type.toLowerCase().startsWith("fairy")) bg = "https://i.imgur.com/Rb6aOwO.jpg";
        if (Type.toLowerCase().startsWith("bug")) bg = "https://media.discordapp.net/attachments/853522935364321284/853570523263270932/new.png", shadow = false;
        if (Type.toLowerCase().startsWith("ghost")) bg = "https://cdn.discordapp.com/attachments/849927302468599808/851827081800318986/IMG_20210608_194625.jpg", shadow = false;
        if (Type.toLowerCase().startsWith("fire")) bg = "https://cdn.discordapp.com/attachments/844390398687707157/845876368737828904/ed037afd6a9c1c8c93e4bf8048e34603fe02ed11r1-1024-671v2_hq.jpg";
        if (Type.toLowerCase().startsWith("psychic")) bg = "https://cdn.discordapp.com/attachments/849927302468599808/851829360117415936/IMG_20210608_195515.jpg", shadow = false;
        if (Type.toLowerCase().startsWith("figthing")) bg = "https://cdn.discordapp.com/attachments/845192128208699452/845192151675174932/fight.png", shadow = false;
        if (Type.toLowerCase().startsWith("dark")) bg = "https://cdn.discordapp.com/attachments/844390398687707157/845878462613815306/jr-korpa-tzQkuviIuHU-unsplash.jpg", shadow = false;
        if (Type.toLowerCase().startsWith("dragon")) bg = "https://cdn.discordapp.com/attachments/844390398687707157/845878295622713364/a043bc570949f5f039c3dec5dea65d39.jpg";
        if (Type.toLowerCase().startsWith("poison")) bg = "https://cdn.discordapp.com/attachments/844390398687707157/846368819588104242/dapo-oni-64tVc0A2_xQ-unsplash.jpg", shadow = false;
       
        
        
        const Canvas = require('canvas');
        const canvas = Canvas.createCanvas(512, 512);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(bg);
        context.drawImage(background, 0, 0, canvas.width, canvas.height)
        if (shadow) {
            let shad = "https://cdn.discordapp.com/attachments/844789985424703569/844986800015540234/iuqEeA-shadow-png-pic-controlled-drugs-cabinets-from-pharmacy.png"
            const shadow = await Canvas.loadImage(shad);
            context.drawImage(shadow, x, y+10, 400, 400);
        }
      
        const pk = await Canvas.loadImage(poke.url);
        context.drawImage(pk, x, y, 400, 400);
        
        let tx = "https://cdn.discordapp.com/attachments/844789985424703569/844984267109040138/day.png"
        const time = await Canvas.loadImage(tx);
        context.drawImage(time, 0, 0, canvas.width, canvas.height)
     // message.channel.send("Oh Ho You were Traveling And It Seems Like You have found a Pokemon")
        let embed = new MessageEmbed()
.setAuthor("A Wild Pokémon appeared")
          
    .setDescription(`Guess the pokémon and type ${guild.prefix}catch to catch it!`)
            .attachFiles([{ name: "new.png", attachment: canvas.toBuffer() }])
            .setImage("attachment://"+ "new.png")
        .setColor(message.guild.me.displayHexColor)
       
        
        
     if (scool.has(message.channel.id)) return;
        await channel.send(embed);
        spawn.pokemon = []
        spawn.pokemon.push(poke)
        scool.add(message.channel.id)
        spawn.time = Date.now() + 259200000
        await spawn.save()
        setTimeout(async () => {
            await scool.delete(message.channel.id)
        }, 60000)

    }).catch(err => {
        if (err.message.includes(`404 - "Not Found"`)) return; // channel.send(`Unable to spawn this pokemon due to no availability of this pokemon.\nName: ${random}`);
        if (err.message.toLowerCase().startsWith(`VersionError`)) return;
        // if(err.message.startsWith(`No matching document found for id`)) return;
    });//jb error aaye and no solution u have so return :)
}

//
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function pickRandom() {
    if ((Math.floor(Math.random() * 10000) + 1) <= 7) return 'ub';
    if ((Math.floor(Math.random() * 10000) + 1) <= 5) return 'legends';
    if ((Math.floor(Math.random() * 10000) + 1) <= 10) return 'mythics';
    if ((Math.floor(Math.random() * 10000) + 1) <= 100) return 'galarian';
    if ((Math.floor(Math.random() * 1000) + 1) <= 10) return 'alolans';

    return 'common';

}


async function leveling(message, client) {
    let user = await User.findOne({ id: message.author.id });
    if (!user) return;
    if (user.blacklist) return;
    let selected = user.selected;
    let poke = user.pokemons[selected];
    if (!poke) return console.log("No poke found");
    //if (xpCooldown.has(message.author.id)) return;
    const guild = await Guild.findOne({ id: message.guild.id });
    let prefix = guild.prefix;
    if (message.content.startsWith(`${prefix}`)) return;
    if (poke.level == 100) return;
    let curxp = poke.xp;
    if (poke.level < 20) {
        x = Math.floor((Math.random() * 10)) + 20
    }
    if (poke.level > 10 && poke.level < 50) {
        x = Math.floor((Math.random() * 200)) + 50
    }
    if (poke.level > 51) {
        x = Math.floor((Math.random() * 300)) + 50
    }
    let newXp = curxp + x;
    let lvl = poke.level;
    let embed9 = new MessageEmbed()
        .setAuthor(`Congratulations ${message.author.username}!`)
        .setDescription(`Your ${user.pokemons[selected].shiny ? "⭐" : ""} ${capitalize(user.pokemons[user.selected].name)} has Leveled up to ${poke.level + 1}.`)
        .setThumbnail(user.pokemons[selected].url)
        .setColor(color)

    var n = parseInt(poke.level)
    let neededXp = (1.2 * n ^ 3) - (15 * n ^ 2) + (100 * n) - 140;
    if (user.blacklist) return;
    if (newXp > neededXp) {
        poke.level = lvl + 1;
        poke.xp = 0;
        user.pokemons[selected] = poke;
        await user.markModified(`pokemons`);
        await user.save();



        for (var i = 0; i < levelUp.length; i++) {
            if (poke.name.toLowerCase() == levelUp[i].name.toLowerCase() && poke.level > levelUp[i].levelup) {
                msg = `Congratulations ${message.author}! Your \`${capitalize(poke.name)}\` has just Leveled up to ${poke.level + 1} and Evolved into ${capitalize(levelUp[i].evo)}`;
                poke.name = capitalize(levelUp[i].evo);
                poke.xp = newXp;
                user.pokemons[selected] = poke;
                await user.markModified(`pokemons`);
                await user.save();
            }
        }
        //   setTimeout(() => xpCooldown.delete(message.author.id), 30000)
        return message.channel.send(embed9)
    } else {
        poke.xp = newXp;
        user.pokemons[selected] = poke;
        await user.markModified(`pokemons`);
        await user.save();
    }
}

//
//