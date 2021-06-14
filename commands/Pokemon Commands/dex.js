const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize, getlength } = require("../../functions.js");
const { readFileSync } = require('fs')
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const legends = readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const legends2 = readFileSync("./db/legends2.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const ub = readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
const galarians = readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());
const dex = readFileSync("./db/dex.txt").toString().trim().split("\n").map(r => r.trim());
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Gmax = require('../../db/gmax.js');
const Primal = require('../../db/primal.js');
const Altnames = require('../../db/altnames.js');
const Levelup = require('../../db/levelup.js');
const Pokemon = require('../../db/pokemon.js');
const Concept = require('../../db/concept.js');
const Attacks = require('../../db/attacks.js');
const ms = require("ms");

module.exports = {
    name: "dex",
    description: "Displays Pokedex!",
    category: "Pokemon Commands",
    args: false,
    usage: ["pokedex [pageNo.] [filters]"],
    cooldown: 3,
    permissions: [],
    aliases: ["d"],
    execute: async (client, message, args, prefix, guild, color, channel) => {
        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        let user = await User.findOne({ id: message.author.id });
        if (!user) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");

        for (var x = 0; x < user.caught.length; x++) {
            if (!user.caught[x].name) {
                user.caught.splice(user.caught.indexOf(user.caught[x]), 1);
                await user.markModified(`caught`);
                await user.save();
            }
        }
        user.caught = getUnique(user.caught);

        if (!args[0]) {
            let chunks = 0,
                n = user.caught.length || 0;
            const embeddex = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}'s Pokedex`)
                .setColor(color)
                .setDescription(`**Total Pokemon **: ${dex.length}\n**Caught Pokemon's**: ${n}\n\n*Nothing to show in this page.*`)
            let txt = []
            for (let i = 0; i < dex.length; i++) {
                for (let a = 0; a < user.caught.length; a++) {
                    if (dex[i].toLowerCase() == user.caught[a].name.toLowerCase()) {
                        txt.push({ name: capitalize(dex[i]), caught: true })
                    } else {
                        txt.push({ name: capitalize(dex[i]), caught: false })
                    }
                }
            }
            let txt2 = txt;
            txt = [...new Set(txt.map(r => r.name))];
            // console.log(txt[2])
            n = user.caught.length || 0
            chunks = n / 18
            if (chunks > chunks.toFixed(0)) {
                chunks += 1
            }
            if (chunks < 1) {
                chunks = 1
            }

            for (let a = 0; a < txt.length && a < 18; a++) {
                if (user.caught.find(r => r.name.replace(/-+/g, "-").toLowerCase() == txt[a].replace(/-+/g, "-").toLowerCase())) {
                    embeddex
                        .addField(`${txt[a]}`, '< | Caught', true)
                        .setDescription(`**Dex Count**: ${dex.length}\n**Dex Entries**: ${n}`);
                    await true;
                } else {
                    embeddex
                        .addField(`${txt[a]}`, ' | Not caught yet ', true)
                        .setDescription(`**Dex Count**: ${dex.length}\n**Dex Entries**: ${n}`);
                }
            }
            embeddex.setFooter(`Showing Page (1 of ${Math.floor(dex.length / 18)}) of Total (${dex.length}) Pokémons.\n`);
            embeddex.setThumbnail(message.author.avatarURL({ dynamic: true }))
            return message.channel.send(embeddex)
        } else {
            if (args.length === 1 && Number(args[0])) {
                let chunks = 0,
                    n = 0,
                    txt = [];
                for (let i = 0; i < dex.length; i++) {
                    for (let a = 0; a < user.caught.length; a++) {
                        if (dex[i].toLowerCase() == user.caught[a].name.toLowerCase()) {
                            txt.push({ name: dex[i], caught: true })
                        } else {
                            txt.push({ name: dex[i], caught: false })
                        }
                    }
                }
                let txt2 = txt;
                txt = [...new Set(txt.map(r => r.name))];
                let page = 0;
                let msw = 0;
                n = user.caught.length || 0;

                chunks = n / 18;
                if (chunks > chunks.toFixed(0)) {
                    chunks += 1
                }
                if (chunks < 1) {
                    chunks = 1
                }
                if (args[0] == 1) {
                    page = 0
                    msw = 0
                } else {
                    page = args[0] - 1
                    msw = (args[0] - 1) * 18 - 1
                }
                chunks = chunk(txt2, 18)
                const embeddex = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}'s Pokedex`)
                    .setColor(color)
                    .setDescription(`**Dex Count**: ${dex.length}\n**Dex Entries**: ${n}\n\n*Nothing to show in this page.*`)
                for (let a = msw; a < txt.length && a < msw + 18; a++) {
                    if (user.caught.find(r => r.name.replace(/-+/g, "-").toLowerCase() == txt[a].replace(/-+/g, "-").toLowerCase())) {
                        embeddex
                            .addField(`${txt[a]}`, '| Caught', true)
                            .setDescription(`**Dex Count**: ${dex.length}\n**Dex Entries**: ${n}`);
                        await true;
                    } else {
                        embeddex
                            .addField(`${txt[a]}`, ' | Not caught yet', true)
                            .setDescription(`**Dex Count**: ${dex.length}\n**Dex Entries**: ${n}`);
                    }
                }
                embeddex
                    .setFooter(`Showing Page (${page+1} of ${Math.floor(dex.length / 18)}) of Total ${dex.length} Pokémons.\n`)
                    .setThumbnail(message.author.avatarURL({ dynamic: true }));
                return message.channel.send(embeddex)
            }
            else if (args[0].startsWith(("--" || "—")) && !Number(args[0])) {
                let chunks = 0,
                    n = 0,
                    txt = [];
                let n2 = args.join(" "),
                    zbc = {};
                n2.split(/--|—/gmi).map(x => {
                    if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
                })

                for (let i = 0; i < dex.length; i++) {
                    for (let a = 0; a < user.caught.length; a++) {
                        if (dex[i].toLowerCase() == user.caught[a].name.toLowerCase()) {
                            txt.push({ name: dex[i], caught: true })
                        } else {
                            txt.push({ name: dex[i], caught: false })
                        }
                    }
                }
                //console.log(txt[2])
                if (zbc["caught"]) {
                    txt = txt.filter(r => r.caught == true);
                }
                if (zbc["uncaught"]) {
                    txt = txt.filter(r => r.caught == false);


                }
                let txt2 = txt;
                txt = [...new Set(txt.map(r => r.name))];
                let page = 0;
                let msw = 0;
                n = user.caught.length || 0;

                chunks = n / 18;
                if (chunks > chunks.toFixed(0)) {
                    chunks += 1
                }
                if (chunks < 1) {
                    chunks = 1
                }
                if (1 == 1) {
                    page = 0
                    msw = 0
                } else {
                    page = 1 - 1
                    msw = (1 - 1) * 18 - 1
                }
                chunks = chunk(txt2, 18)
                const embeddex = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}'s Pokedex`)
                    .setColor(color)
                    .setDescription(`**Dex Count**: ${dex.length}\n**Dex Entries**: ${n}\n\n*Nothing to show in this page.*`)
                for (let a = msw; a < txt.length && a < msw + 18; a++) {
                    if (user.caught.find(r => r.name.replace(/-+/g, "-").toLowerCase() == txt[a].replace(/-+/g, "-").toLowerCase())) {
                        embeddex
                            .addField(`${txt[a]}`, '| Caught', true)
                            .setDescription(`**Dex Count**: ${dex.length}\n**Dex Entries**: ${n}`);
                        await true;
                    } else {
                        embeddex
                            .addField(`${txt[a]}`, ' | Not caught yet', true)
                            .setDescription(`**Dex Count**: ${dex.length}\n**Dex Entries**: ${n}`);
                    }
                }
                embeddex
                    .setFooter(`Showing Page (1 of ${Math.floor(dex.length / 18)}) of Total (${dex.length}) Pokémons.\n`)
                    .setThumbnail(message.author.avatarURL({ dynamic: true }));
                return message.channel.send(embeddex)
            } else if (!args[0].startsWith(("--" || "—")) && !Number(args[0])) {
                let arg = args.join('-'),
                    dexsrc = arg.replace(/-+/g, " "),
                    altjp = Altnames.find(e => e.jpname.toLowerCase() === arg.toLowerCase().replace("shiny-", "")),
                    altfr = Altnames.find(e => e.frname.toLowerCase() === arg.toLowerCase().replace("shiny-", "")),
                    altde = Altnames.find(e => e.dename.toLowerCase() === arg.toLowerCase().replace("shiny-", ""));

                for (var i = 0; i < Altnames.length; i++) {
                    let org = []
                    Altnames[i].jpname.toLowerCase().split(" | ").forEach(name => {
                        org.push(name.replace(" ", "-"))
                    })
                    for (let a = 0; a < org.length; a++) {
                        if (org[a] == arg.toLowerCase().replace(" ", "-")) {
                            let og = `${org[0]} | ${org[1]} | ${org[2]}`
                            //arg = arg.replace(arg, og.toLowerCase().replace("-", " "))
                        }
                    }
                }
                if (altfr) arg = arg.toLowerCase().replace(altfr.frname.toLowerCase(), altfr.name.toLowerCase());
                if (altjp) arg = arg.toLowerCase().replace(altjp.jpname.toLowerCase(), altjp.name.toLowerCase());
                if (altde) arg = arg.toLowerCase().replace(altde.dename.toLowerCase(), altde.name.toLowerCase());

                let alt = Altnames.find(e => e.name.toLowerCase() === arg.toLowerCase().replace("shiny-", "")),
                    finder = "",
                    vf = false,
                    dexs,
                    num = 0;
                if (Number(args[0])) {
                    dexs = dexsrc.replace(" ", "-")
                    dexs = dexsrc.replace(`${Number(args[0])} `, ``)
                } else {
                    dexs = dexsrc.replace(" ", "-")
                }
                for (var i = 0; i < Altnames.length; i++) {
                    if (Altnames[i].name.toLowerCase().includes(dexs.toLowerCase()) && Altnames[i].name.toLowerCase() !== dexs.toLowerCase()) {
                        finder += Altnames[i].name.capitalize() + "\n"
                        vf = true
                        if (dexs.toLowerCase() == "mew") vf = false;
                        num += parseInt(1);
                    }
                }
                if (arg.toLowerCase().startsWith("shiny-shadow-")) arg = arg.toLowerCase().replace("shiny-", "");
                if (arg.toLowerCase().startsWith("shiny-mega-")) arg = arg.toLowerCase().replace("shiny-", "");
                //console.log(arg)
                let pokemon = Pokemon.find(e => e.name === arg.toLowerCase().replace("shiny-", "")),
                    forms = Forms.find(e => e.name === arg.toLowerCase().replace("shiny-", "")),
                    gen8 = Gen8.find(e => e.name === arg.toLowerCase().replace("shiny-", "")),
                    galarians = Galarians.find(e => e.name === arg.toLowerCase().replace("galarian-", "").replace("shiny-", "")),
                    shadow = Shadow.find(e => e.name === arg.toLowerCase().replace("shadow-", "")),
                    gmax = Gmax.find(e => e.name === arg.toLowerCase().replace("gmax-", "")) || Gmax.find(e => e.name === arg.toLowerCase().replace("gigantamax-", "")),
                    concept = Concept.find(e => e.name.toLowerCase() === arg.toLowerCase().replace("shiny-", "")),
                    attacks = Attacks.find(e => e.Name.toLowerCase() === arg.toLowerCase().replace("shiny-", "")),
                    levelup = Levelup.find(e => e.name.toLowerCase() === arg.toLowerCase().replace("shiny-", ""));

                if (galarians && arg.toLowerCase().startsWith("galarian")) {
                    let pokemon = galarians
                    let Embed = new Discord.MessageEmbed()
                        .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                        .setTitle(`${pokemon.id ? `#${pokemon.id} ` : "#000"} Galarian ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                        .setDescription(
                            `${attacks ? `${attacks.Description}\n\n` : ""}`
                            + `${levelup ? `**Evolves into ${capitalize(levelup.evo)} at level ${levelup.levelup}**` : ""}`)
                        .attachFiles([{ name: "Pokemon.png", attachment: pokemon.url }])
                        .setImage("attachment://Pokemon.png")
                        .setColor(color);

                    alt ? Embed.addField("**Alternative Names**",
                        `:flag_us: ${capitalize(pokemon.name.replace(/-+/g, " "))}\n`
                        + `:flag_de: ${capitalize(alt.dename)}\n`
                        + `:flag_fr: ${capitalize(alt.frname)}\n`
                        + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                    attacks ? Embed.addField("**Appearance**",
                        `**Height:** ${attacks.Height.Maximum}\n`
                        + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                    pokemon ? Embed.addField("**Base Stats**",
                        `**HP:** ${pokemon.hp}\n`
                        + `**Attack:** ${pokemon.atk}\n`
                        + `**Defense:** ${pokemon.def}\n`
                        + `**Sp. Atk:** ${pokemon.spatk}\n`
                        + `**Sp. Def:** ${pokemon.spdef}\n`
                        + `**Speed:** ${pokemon.speed}`) : ""
                    return message.channel.send(Embed)
                }
                if (concept) {
                    let pokemon = concept
                    let Embed = new Discord.MessageEmbed()
                        .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                        .setTitle(`${pokemon.id ? `#${pokemon.id} ` : "#000"} ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                        .setDescription(
                            `${attacks ? `${attacks.Description}\n\n` : ""}`
                            + `Donator Pokémons dont Evolve.`)
                        .attachFiles([{ name: "Pokemon.png", attachment: pokemon.url }])
                        .setImage("attachment://Pokemon.png")
                        .setColor(color);

                    alt ? Embed.addField("**Alternative Names**",
                        `:flag_de: ${capitalize(alt.dename)}\n`
                        + `:flag_fr: ${capitalize(alt.frname)}\n`
                        + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                    attacks ? Embed.addField("**Appearance**",
                        `**Height:** ${attacks.Height.Maximum}\n`
                        + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                    pokemon ? Embed.addField("**Base Stats**",
                        `**HP:** ${pokemon.hp}\n`
                        + `**Attack:** ${pokemon.atk}\n`
                        + `**Defense:** ${pokemon.def}\n`
                        + `**Sp. Atk:** ${pokemon.spatk}\n`
                        + `**Sp. Def:** ${pokemon.spdef}\n`
                        + `**Speed:** ${pokemon.speed}`) : ""
                    return message.channel.send(Embed)
                }
                if (arg.toLowerCase().startsWith(("mega" || "shiny-mega"))) {
                    let real = arg.replace("mega-", ""),
                        ar = real.replace("shiny-", ""),
                        pkmn = ar.toLowerCase()
                    let pokemon;
                    let Embed = new Discord.MessageEmbed();

                    for (var i = 0; i < Mega.length; i++) {
                        if (ar == Mega[i].name.toLowerCase()) {
                            if (arg.startsWith("mega-")) {
                                pokemon = mega[i]
                                Embed.setTitle(`${pokemon.id ? `#${pokemon.id} ` : "#000"} ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                            }
                            if (arg.startsWith("shiny-mega")) {
                                pokemon = ShinyMega[i]
                                Embed.setTitle(`${pokemon.id ? `#${pokemon.id} ` : "#000"}⭐ Mega ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                            }
                        }
                    }

                    Embed
                        .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                        .setDescription(
                            `${attacks ? `${attacks.Description}\n\n` : ""}`
                            + `${levelup ? `**Evolves into ${capitalize(levelup.evo)} at level ${levelup.levelup}**` : ""}`)
                        .attachFiles([{ name: "Pokemon.png", attachment: pokemon.url }])
                        .setImage("attachment://Pokemon.png")
                        .setColor(color);

                    alt ? Embed.addField("**Alternative Names**",
                        `:flag_us: ${capitalize(pokemon.name.replace(/-+/g, " "))}\n`
                        + `:flag_de: ${capitalize(alt.dename)}\n`
                        + `:flag_fr: ${capitalize(alt.frname)}\n`
                        + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                    attacks ? Embed.addField("**Appearance**",
                        `**Height:** ${attacks.Height.Maximum}\n`
                        + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                    pokemon ? Embed.addField("**Base Stats**",
                        `**HP:** ${pokemon.hp}\n`
                        + `**Attack:** ${pokemon.atk}\n`
                        + `**Defense:** ${pokemon.def}\n`
                        + `**Sp. Atk:** ${pokemon.spatk}\n`
                        + `**Sp. Def:** ${pokemon.spdef}\n`
                        + `**Speed:** ${pokemon.speed}`) : ""
                    return message.channel.send(Embed)
                }
                if (arg.toLowerCase().startsWith("primal")) {
                    let pokemon;
                    if (arg.toLowerCase() === "primal-kyogre") pokemon = Primal[0];
                    else if (arg.toLowerCase() === "primal-groudon") pokemon = Primal[1];
                    else return message.channel.send("This pokemon doesnt exist!")
                    let Embed = new Discord.MessageEmbed()
                        .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                        .setTitle(`${pokemon.id ? `#${pokemon.id} ` : "#000"} ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                        .setDescription(
                            `${attacks ? `${attacks.Description}\n\n` : ""}`
                            + `Primal Form Pokémons don't Evolve.`)
                        .attachFiles([{ name: "Pokemon.png", attachment: pokemon.url }])
                        .setImage("attachment://Pokemon.png")
                        .setColor(color);

                    alt ? Embed.addField("**Alternative Names**",
                        `:flag_us: ${capitalize(pokemon.name.replace(/-+/g, " "))}\n`
                        + `:flag_de: ${capitalize(alt.dename)}\n`
                        + `:flag_fr: ${capitalize(alt.frname)}\n`
                        + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                    attacks ? Embed.addField("**Appearance**",
                        `**Height:** ${attacks.Height.Maximum}\n`
                        + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                    pokemon ? Embed.addField("**Base Stats**",
                        `**HP:** ${pokemon.hp}\n`
                        + `**Attack:** ${pokemon.atk}\n`
                        + `**Defense:** ${pokemon.def}\n`
                        + `**Sp. Atk:** ${pokemon.spatk}\n`
                        + `**Sp. Def:** ${pokemon.spdef}\n`
                        + `**Speed:** ${pokemon.speed}`) : ""
                    return message.channel.send(Embed)
                }
                if (arg.toLowerCase().startsWith("shiny")) {
                    var ar = arg.toLowerCase().replace("shiny-", "")
                    var realname = ar
                    ar = realname.replace("alolan-", "");
                    if (message.content.includes("alolan")) {
                        ar = `${ar.toLowerCase()}-alola`
                    }

                    let pokemon = await get({
                        url: `https://pokeapi.co/api/v2/pokemon/${ar}`,
                        json: true
                    })
                    let shiny = Shiny.find(e => e.name.replace(" ", "-") === arg.toLowerCase().replace("shiny-", ""));
                    if (!pokemon || !shiny) return message.channel.send("This pokemon has not been added to the Database. Contact Dev to get it added!")
                    let url = shiny.url;

                    if (arg.toLowerCase() === "primal-kyogre") {
                        pokemon = Primal[0];
                        pokemon.url = "https://i.imgur.com/XdZwD0s.png";
                    }
                    if (arg.toLowerCase() === "primal-groudon") {
                        pokemon = Primal[1];
                        pokemon.url = "https://i.imgur.com/Xzm1FDn.png";
                    }
                    pokemon.id.toString().length == 1 ? pokemon.id = `00${pokemon.id}` : "";
                    pokemon.id.toString().length == 2 ? pokemon.id = `0${pokemon.id}` : "";

                    let Embed = new Discord.MessageEmbed()
                        .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                        .setTitle(`${pokemon.id ? `#${pokemon.id} ` : "#000"} ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                        .setDescription(
                            `${attacks ? `${attacks.Description}\n\n` : ""}`
                            + `${levelup ? `**Evolves into ${capitalize(levelup.evo)} at level ${levelup.levelup}**` : ""}`)
                        .attachFiles([{ name: "Pokemon.png", attachment: url }])
                        .setImage("attachment://Pokemon.png")
                        .setColor(color);

                    alt ? Embed.addField("**Alternative Names**",
                        `:flag_us: ${capitalize(pokemon.name.replace(/-+/g, " "))}\n`
                        + `:flag_de: ${capitalize(alt.dename)}\n`
                        + `:flag_fr: ${capitalize(alt.frname)}\n`
                        + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                    attacks ? Embed.addField("**Appearance**",
                        `**Height:** ${attacks.Height.Maximum}\n`
                        + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                    pokemon ? Embed.addField("**Base Stats**",
                        `**HP:** ${pokemon.stats[0].base_stat}\n`
                        + `**Attack:** ${pokemon.stats[1].base_stat}\n`
                        + `**Defense:** ${pokemon.stats[2].base_stat}\n`
                        + `**Sp. Atk:** ${pokemon.stats[3].base_stat}\n`
                        + `**Sp. Def:** ${pokemon.stats[4].base_stat}\n`
                        + `**Speed:** ${pokemon.stats[5].base_stat}`) : ""
                    return message.channel.send(Embed)
                } else {
                    if (gen8) {
                        let pokemon = gen8;

                        let Embed = new Discord.MessageEmbed()
                            .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                            .setTitle(`${gen8.id ? `#${gen8.id} ` : "#000"} ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                            .setDescription(
                                `${attacks ? `${attacks.Description}\n\n` : ""}`
                                + `${levelup ? `**Evolves into ${capitalize(levelup.evo)} at level ${levelup.levelup}**` : ""}`)
                            .attachFiles([{ name: "Pokemon.png", attachment: pokemon.url }])
                            .setImage("attachment://Pokemon.png")
                            .setColor(color);

                        alt ? Embed.addField("**Alternative Names**",
                            `:flag_us: ${capitalize(pokemon.name.replace(/-+/g, " "))}\n`
                            + `:flag_de: ${capitalize(alt.dename)}\n`
                            + `:flag_fr: ${capitalize(alt.frname)}\n`
                            + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                        attacks ? Embed.addField("**Appearance**",
                            `**Height:** ${attacks.Height.Maximum}\n`
                            + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                        pokemon ? Embed.addField("**Base Stats**",
                            `**HP:** ${pokemon.hp}\n`
                            + `**Attack:** ${pokemon.atk}\n`
                            + `**Defense:** ${pokemon.def}\n`
                            + `**Sp. Atk:** ${pokemon.spatk}\n`
                            + `**Sp. Def:** ${pokemon.spdef}\n`
                            + `**Speed:** ${pokemon.speed}`) : ""
                        return message.channel.send(Embed)
                    }
                    if (forms) {
                        let pokemon = forms;

                        let Embed = new Discord.MessageEmbed()
                            .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                            .setTitle(`${forms.id ? `#${forms.id} ` : "#000"} ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                            .setDescription(
                                `${attacks ? `${attacks.Description}\n\n` : ""}`
                                + `Pokémon Forms don't Evolve.`)
                            .attachFiles([{ name: "Pokemon.png", attachment: pokemon.url }])
                            .setImage("attachment://Pokemon.png")
                            .setColor(color);

                        alt ? Embed.addField("**Alternative Names**",
                            `:flag_de: ${capitalize(alt.dename)}\n`
                            + `:flag_fr: ${capitalize(alt.frname)}\n`
                            + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                        attacks ? Embed.addField("**Appearance**",
                            `**Height:** ${attacks.Height.Maximum}\n`
                            + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                        pokemon ? Embed.addField("**Base Stats**",
                            `**HP:** ${pokemon.hp}\n`
                            + `**Attack:** ${pokemon.atk}\n`
                            + `**Defense:** ${pokemon.def}\n`
                            + `**Sp. Atk:** ${pokemon.spatk}\n`
                            + `**Sp. Def:** ${pokemon.spdef}\n`
                            + `**Speed:** ${pokemon.speed}`) : ""
                        return message.channel.send(Embed)
                    }
                    if (shadow && arg.toLowerCase().startsWith("shadow")) {
                        let pokemon = shadow
                        //      let Embed = new Discord.MessageEmbed()
                        let Embed = new Discord.MessageEmbed()
                            .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                            .setTitle(`${shadow.id ? `#${shadow.id} ` : "#000"} Shadow ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                            .setDescription(
                                `${attacks ? `${attacks.Description}\n\n` : ""}`
                                + `**Shadow Pokémons don't Evolve.**`)
                            .attachFiles([{ name: "Pokemon.png", attachment: pokemon.url }])
                            .setImage("attachment://Pokemon.png")
                            .setColor(color);

                        alt ? Embed.addField("**Alternative Names**",
                            `:flag_us: ${capitalize(pokemon.name.replace(/-+/g, " "))}\n`
                            + `:flag_de: ${capitalize(alt.dename)}\n`
                            + `:flag_fr: ${capitalize(alt.frname)}\n`
                            + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                        attacks ? Embed.addField("**Appearance**",
                            `**Height:** ${attacks.Height.Maximum}\n`
                            + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                        pokemon ? Embed.addField("**Base Stats**",
                            `**HP:** ${pokemon.hp}\n`
                            + `**Attack:** ${pokemon.atk}\n`
                            + `**Defense:** ${pokemon.def}\n`
                            + `**Sp. Atk:** ${pokemon.spatk}\n`
                            + `**Sp. Def:** ${pokemon.spdef}\n`
                            + `**Speed:** ${pokemon.speed}`) : ""
                        return message.channel.send(Embed)
                    }
                    if (gmax && (arg.toLowerCase().startsWith("gmax") || arg.toLowerCase().startsWith("gigantamax"))) {
                        let pokemon = gmax
                        //      let Embed = new Discord.MessageEmbed()
                        let Embed = new Discord.MessageEmbed()
                            .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                            .setTitle(`${gmax.id ? `#${gmax.id} ` : "#000"} Gigantamax ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                            .setDescription(
                                `${attacks ? `${attacks.Description}\n\n` : ""}`
                                + `Gigantamax Pokémons don't Evolve.`)
                            .attachFiles([{ name: "Pokemon.png", attachment: pokemon.url }])
                            .setImage("attachment://Pokemon.png")
                            .setColor(color);

                        alt ? Embed.addField("**Alternative Names**",
                            `:flag_us: ${capitalize(pokemon.name.replace(/-+/g, " "))}\n`
                            + `:flag_de: ${capitalize(alt.dename)}\n`
                            + `:flag_fr: ${capitalize(alt.frname)}\n`
                            + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                        attacks ? Embed.addField("**Appearance**",
                            `**Height:** ${attacks.Height.Maximum}\n`
                            + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                        pokemon ? Embed.addField("**Base Stats**",
                            `**HP:** ${pokemon.hp}\n`
                            + `**Attack:** ${pokemon.atk}\n`
                            + `**Defense:** ${pokemon.def}\n`
                            + `**Sp. Atk:** ${pokemon.spatk}\n`
                            + `**Sp. Def:** ${pokemon.spdef}\n`
                            + `**Speed:** ${pokemon.speed}`) : ""
                        return message.channel.send(Embed)
                    }

                    if (pokemon) {
                        let options = {
                            url: `https://pokeapi.co/api/v2/pokemon/${arg.toLowerCase()}`,
                            json: true
                        };
                        let body = await get(options);
                        let Embed = new Discord.MessageEmbed()
                            .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                            .setTitle(`#${body.id} ${capitalize(pokemon.name.replace(/-+/g, " "))}`)
                            .setDescription(
                                `${attacks ? `${attacks.Description}\n\n` : ""}`
                                + `${levelup ? `**Evolves into ${capitalize(levelup.evo)} at level ${levelup.levelup}**` : ""}`)
                            .attachFiles([{ name: "Pokemon.png", attachment: pokemon.url }])
                            .setImage("attachment://Pokemon.png")
                            .setColor(color);

                        alt ? Embed.addField("**Alternative Names**",
                            `:flag_de: ${capitalize(alt.dename)}\n`
                            + `:flag_fr: ${capitalize(alt.frname)}\n`
                            + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                        attacks ? Embed.addField("**Appearance**",
                            `**Height:** ${attacks.Height.Maximum}\n`
                            + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                        pokemon ? Embed.addField("**Base Stats**",
                            `**HP:** ${pokemon.hp}\n`
                            + `**Attack:** ${pokemon.atk}\n`
                            + `**Defense:** ${pokemon.def}\n`
                            + `**Sp. Atk:** ${pokemon.spatk}\n`
                            + `**Sp. Def:** ${pokemon.spdef}\n`
                            + `**Speed:** ${pokemon.speed}`) : ""
                        return message.channel.send(Embed)
                    }

                    let nm = arg;
                    if (arg.toLowerCase().startsWith("alolan-")) {
                        arg = arg.toLowerCase().replace("alolan-", "");
                        arg = `${arg.toLowerCase()}-alola`
                    }
                    let options = {
                        url: `https://pokeapi.co/api/v2/pokemon/${arg.toLowerCase()}`,
                        json: true
                    };
                    if (arg.toLowerCase() === "giratina") options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered";
                    if (arg.toLowerCase() === "deoxys") options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal";
                    if (arg.toLowerCase() === "shaymin") options.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land";
                    if (arg.toLowerCase() === "nidoran") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
                    if (arg.toLowerCase().startsWith("nidoran-m")) options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
                    if (arg.toLowerCase().startsWith("nidoran-f")) options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f";
                    if (arg.toLowerCase().startsWith(("porygon z") || "porygon-z")) options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z";
                    let er = false
                    let body = await get(options).catch(() => er = true);
                    if (er) return message.channel.send(`${dexsrc} doesn't seem to appear in the Pokedex or maybe you spelled it wrong!`);
                    let stats = Math.round(
                        (body.stats[5].base_stat +
                            body.stats[4].base_stat +
                            body.stats[3].base_stat +
                            body.stats[2].base_stat +
                            body.stats[1].base_stat +
                            body.stats[0].base_stat)
                    ),
                        uri,
                        id = getlength(body.id);
                    if (id === 1) uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${body.id}.png`;
                    if (id === 2) uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${body.id}.png`;
                    if (id === 3) uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${body.id}.png`;
                    let Embed = new Discord.MessageEmbed()
                        .setAuthor("Professor Oak", "https://media.discordapp.net/attachments/811830543061876757/811848174033305640/Professor_Oak.jpg")
                        .setTitle(`#${body.id} ${capitalize(body.name.replace(/-+/g, " "))}`)
                        .setDescription(
                            `${attacks ? `${attacks.Description}\n\n` : ""}`
                            + `${levelup ? `**Evolves into ${capitalize(levelup.evo)} at level ${levelup.levelup}**` : ""}`)
                        .attachFiles([{ name: "Pokemon.png", attachment: uri }])
                        .setImage("attachment://Pokemon.png")
                        .setColor(color);

                    alt ? Embed.addField("**Alternative Names**",
                        `:flag_de: ${capitalize(alt.dename)}\n`
                        + `:flag_fr: ${capitalize(alt.frname)}\n`
                        + `:flag_jp: ${capitalize(alt.jpname)}`) : "";
                    attacks ? Embed.addField("**Appearance**",
                        `**Height:** ${attacks.Height.Maximum}\n`
                        + `**Weight:** ${attacks.Weight.Maximum}`) : "";
                    body.stats ? Embed.addField("**Base Stats**",
                        `**HP:** ${body.stats[0].base_stat}\n`
                        + `**Attack:** ${body.stats[1].base_stat}\n`
                        + `**Defense:** ${body.stats[2].base_stat}\n`
                        + `**Sp. Atk:** ${body.stats[3].base_stat}\n`
                        + `**Sp. Def:** ${body.stats[4].base_stat}\n`
                        + `**Speed:** ${body.stats[5].base_stat}`) : "";


                    console.log(id, arg.toLowerCase().startsWith("giratina-origin"))
                    if (id === 5 && arg.toLowerCase().startsWith("giratina-origin")) uri = `https://imgur.com/UHVxS2q.png`;
                    if (arg.toLowerCase() == "shellos") uri = "https://imgur.com/0TNMAHQ.png"
                    if (arg.toLowerCase() == "jellicent") uri = "https://imgur.com/tMspIRX.png"

                    if (id > 3 && arg.endsWith("-alola")) {
                        let c = await get({
                            url: `https://pokeapi.co/api/v2/pokemon/${arg.replace("-alola", "")}`,
                            json: true
                        })
                        id = getlength(c.id);
                        if (id === 1) {
                            uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${c.id}_f2.png`
                        }
                        if (id === 2) {
                            uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${c.id}_f2.png`
                        }
                        if (id === 3) {
                            uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${c.id}_f2.png`
                        }
                        Embed.setTitle(`#${c.id} ${capitalize(arg)}`)
                    }

                    Embed
                        .attachFiles([{ name: "Pokemon.png", attachment: uri }])
                        .setImage("attachment://Pokemon.png");
                    return message.channel.send(Embed)
                }
            }
        }
    }
}

function getUnique(array) {
    var uniqueArray = [];
    for (var value of array) {
        if (!uniqueArray.find(r => r.name.toLowerCase() === value.name.toLowerCase())) {
            uniqueArray.push(value)
        }
    }
    return uniqueArray;
}

function chunk(array, chunkSize) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
}










































/*
if (arg.toLowerCase().startsWith("shiny")) {
      var ar = arg.toLowerCase().replace("shiny-", "")
      var realname = ar
      ar = realname.replace("alolan-", "");
      if (message.content.includes("alolan")) {
        ar = `${ar.toLowerCase()}-alola`
      }
      let p;
      if (ar.toLowerCase() === "primal-kyogre") {
        p = primal[0]
        const Embed = new Discord.MessageEmbed()
        Embed.setTitle(`⭐ Primal ${p.name.capitalize().replace(/-+/g, " ")}'s info`)
        Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**` : "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}` : "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}` : "")}\n\n**⚡ Type:** ${p.type}\n\n__**Base Stats**__\n**HP:** ${p.hp}\n**Attack:** ${p.atk}\n**Defense:** ${p.def}\n**Sp.Atk:** ${p.spatk}\n**Sp.Def:** ${p.spdef}\n**Speed:** ${p.speed}`)
        Embed.setColor("#05f5fc")
        name = "Pokemon.png"
        Embed.attachFiles([{ name: name, attachment: "https://i.imgur.com/XdZwD0s.png" }])
          .setImage("attachment://" + name)
        return message.channel.send(Embed)
      }
      if (ar.toLowerCase() === "primal-groudon") {
        p = primal[1]
        const Embed = new Discord.MessageEmbed()
        Embed.setTitle(`⭐ Primal ${p.name.capitalize().replace(/-+/g, " ")}'s info`)
        Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**` : "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}` : "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}` : "")}\n\n**⚡ Type:** ${p.type}\n\n__**Base Stats**__\n**HP:** ${p.hp}\n**Attack:** ${p.atk}\n**Defense:** ${p.def}\n**Sp.Atk:** ${p.spatk}\n**Sp.Def:** ${p.spdef}\n**Speed:** ${p.speed}`)
        Embed.setColor("#05f5fc")
        name = "Pokemon.png"
        Embed.attachFiles([{ name: name, attachment: "https://i.imgur.com/Xzm1FDn.png" }])
          .setImage("attachment://" + name)
        return message.channel.send(Embed)
      }
      if (pm && arg.toLowerCase() === `shiny-${pm.name}`) {
        let pms = pm
        const s = shiny.find(e => e.name === arg.replace("shiny-", "").toLowerCase())
        if (pms) {
          const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`⭐ ${pms.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**` : "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}` : "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}` : "")}\n\n**⚡ Type:** ${pms.type}\n\n__**Base Stats**__\n**HP:** ${pms.hp}\n**Attack:** ${pms.atk}\n**Defense:** ${pms.def}\n**Sp.Atk:** ${pms.spatk}\n**Sp.Def:** ${pms.spdef}\n**Speed:** ${pms.speed}`)
          Embed.setColor("#05f5fc")
          name = "Pokemon.png"
          url = s.url
          Embed.attachFiles([{ name: name, attachment: url }])
            .setImage("attachment://" + name)
          return message.channel.send(Embed)
        }
      }
      if (g && arg.toLowerCase() === `shiny-galarian-${g.name}`) {
        let pms = g
        const s = shiny.find(e => e.name === arg.replace("shiny-", "").toLowerCase())
        if (pms) {
          const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`⭐ Galarian ${pms.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**` : "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}` : "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}` : "")}\n\n**⚡ Type:** ${pms.type}\n\n__**Base Stats**__\n**HP:** ${pms.hp}\n**Attack:** ${pms.atk}\n**Defense:** ${pms.def}\n**Sp.Atk:** ${pms.spatk}\n**Sp.Def:** ${pms.spdef}\n**Speed:** ${pms.speed}`)
          Embed.setColor("#05f5fc")
          name = "Pokemon.png"
          url = s.url
          if (!url.endsWith(".png")) {
            url = s.url + ".png"
          }
          Embed.attachFiles([{ name: name, attachment: url }])
            .setImage("attachment://" + name)
          return message.channel.send(Embed)
        }
      }
      if (fm && arg.toLowerCase() === `shiny-${fm.name}`) {
        let fms = fm
        const s = shiny.find(e => e.name === arg.replace("shiny-", "").toLowerCase())
        if (fms) {
          const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`⭐ ${fms.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**` : "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}` : "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}` : "")}\n\n**⚡ Type:** ${fms.type}\n\n__**Base Stats**__\n**HP:** ${fms.hp}\n**Attack:** ${fms.atk}\n**Defense:** ${fms.def}\n**Sp.Atk:** ${fms.spatk}\n**Sp.Def:** ${fms.spdef}\n**Speed:** ${fms.speed}`)
          Embed.setColor("#05f5fc")
          name = "Pokemon.png"
          url = s.url
          Embed.attachFiles([{ name: name, attachment: url }])
            .setImage("attachment://" + name)
          return message.channel.send(Embed)
        }
      }
      if (g8 && arg.toLowerCase() === `shiny-${g8.name}`) {
        let gs = g8
        const s = shiny.find(e => e.name === arg.replace("shiny-", "").toLowerCase())
        if (gs) {
          const Embed = new Discord.MessageEmbed()
          Embed.setTitle(`⭐ ${gs.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**` : "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}` : "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}` : "")}\n\n**⚡ Type:** ${gs.type}\n\n__**Base Stats**__\n**HP:** ${gs.hp}\n**Attack:** ${gs.atk}\n**Defense:** ${gs.def}\n**Sp.Atk:** ${gs.spatk}\n**Sp.Def:** ${gs.spdef}\n**Speed:** ${gs.speed}`)
          Embed.setColor("#05f5fc")
          name = "Pokemon.png"
          url = s.url
          Embed.attachFiles([{ name: name, attachment: url }])
            .setImage("attachment://" + name)
          return message.channel.send(Embed)
        }
      }
      const options1 = {
        url: `https://pokeapi.co/api/v2/pokemon/${ar.toLowerCase()}`,
        json: true
      };
      if (ar.toLowerCase() === "giratina") options1.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered"
      if (ar.toLowerCase() === "deoxys") options1.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal"
      if (ar.toLowerCase() === "nidoran") options1.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
      if (ar.toLowerCase().startsWith("nidoran-m")) options1.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
      if (ar.toLowerCase().startsWith("nidoran-f")) options1.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f"
      get(options1).then(async body => {
        const Embed = new Discord.MessageEmbed()
        if (!message.content.includes("alolan")) {
          Embed.setTitle(`⭐ ${body.name.capitalize().replace(/-+/g, " ")}'s info`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**` : "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}` : "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}` : "")}\n\n**⚡ Type:** ${body.types[0].type.name.capitalize()}\n\n__**BASE STATS**__\n**HP:** ${body.stats[0].base_stat}\n**Attack:** ${body.stats[1].base_stat}\n**Defense:** ${body.stats[2].base_stat}\n**Sp.Atk:** ${body.stats[3].base_stat}\n**Sp.Def:** ${body.stats[4].base_stat}\n**Speed:** ${body.stats[5].base_stat}`)
        } else {
          Embed.setTitle(`⭐ Alolan ${args.slice(2).join(' ').capitalize()}`)
          Embed.setDescription(`${(lu ? `\n\n**<:LevelUp:741342545594024016> Evolves into ${lu.evo.capitalize()} at level ${lu.levelup}**` : "")}${(alt ? `\n\n**Alternative Names**\n:flag_de: ${alt.dename.capitalize()}\n:flag_fr: ${alt.frname.capitalize()}\n:flag_jp: ${alt.jpname.capitalize()}` : "")}${(ai ? `\n\n**Measurements**\n**🇭 Height:** ${ai.Height.Minimum}-${ai.Height.Maximum}\n**🇼 Weight:** ${ai.Weight.Minimum}-${ai.Weight.Maximum}` : "")}\n\n**⚡ Type:** ${body.types[0].type.name.capitalize()}\n\n__**BASE STATS**__\n**HP:** ${body.stats[0].base_stat}\n**Attack:** ${body.stats[1].base_stat}\n**Defense:** ${body.stats[2].base_stat}\n**Sp.Atk:** ${body.stats[3].base_stat}\n**Sp.Def:** ${body.stats[4].base_stat}\n**Speed:** ${body.stats[5].base_stat}`)
        }
        Embed.setColor("#05f5fc")
        Embed.attachFiles([{ name: "Pokemon.gif", attachment: `https://play.pokemonshowdown.com/sprites/xyani-shiny/${ar.toLowerCase()}.gif` }])
          .setThumbnail("attachment://" + "Pokemon.gif")
        var name; //= "Pokemon.gif";
        if (realname.toLowerCase() === "nidoran") realname = "nidoran-m"
        if (realname.toLowerCase().startsWith("nidoran-m")) realname = "nidoran-m"
        if (realname.toLowerCase().startsWith("nidoran-f")) realname = "nidoran-f"
        var url;
        const pokemon = shiny.find(e => e.name === realname.toLowerCase())
        if (!pokemon) {
          url = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${ar.toLowerCase()}.gif`
          name = "Pokemon.gif"
        }
        if (pokemon) {
          url = pokemon.url
          name = "Pokemon.png"
        }
        Embed.attachFiles([{ name: name, attachment: url }])
          .setImage("attachment://" + name)
        message.channel.send(Embed)
      }).catch(() =>
        message.channel.send(`${dexsrc} doesn't seem to appear in the Pokedex!`)
      )
    }
		*/