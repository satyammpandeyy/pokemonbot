const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const { readFileSync } = require('fs')
const User = require('../../models/user.js');
const Auction = require('../../models/auctions.js');
const Guild = require('../../models/guild.js');
const legends = readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const legends2 = readFileSync("./db/legends2.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const starters = readFileSync("./db/starters.txt").toString().trim().split("\n").map(r => r.trim());
const ub = readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
const galarians = readFileSync("./db/galarians.txt").toString().trim().split("\n").map(r => r.trim());
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const Galarians = require('../../db/galarians.js');
const Concept = require('../../db/concept.js')
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const ms = require("ms");

module.exports = {
    name: "auction",
    description: "auction",
    category: "Economy",
    args: true,
    options: [""],
    cooldown: 3,
    permissions: [],
    aliases: ["a"],
    execute: async (client, message, args, prefix, guild, color, channel) => {

        const user = await User.findOne({ id: message.author.id });
        const embed = new Discord.MessageEmbed()
        if (!user) return message.channel.send(`Please pick a starter before using this command.`);

        if (message.content.includes(guild.prefix + "auction listings") || message.content.includes(guild.prefix + "a listings") || message.content.includes(guild.prefix + "a lt") || message.content.includes(guild.prefix + "auction lt") || message.content.includes(guild.prefix + `auction ${Number(args[0])} listings`) || message.content.includes(guild.prefix + `auction ${Number(args[0])} lt`) || message.content.includes(guild.prefix + `a ${Number(args[0])} listings`) || message.content.includes(guild.prefix + `a ${Number(args[0])} lt`)) {
            let all = await Auction.find({});
            all.map((r, i) => {
                r.num = i + 1;
                return r;
            });
            all = all.filter(r => r.id === user.id);
            let chunks = chunk(all, 20);

            if (all[0]) {
                if (Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}a`) || Number(args[0]) && all[20] && message.content.startsWith(`${guild.prefix}auction`)) {
                    //    if(args[0] == 0) args[0]; 
                    let chunks = chunk(all, 20);
                    let index = args[0] - 1;
                    //   if(index) index;
                    //   console.log(chunks[0]);
                    let ix = ((index % chunks.length) + chunks.length) % chunks.length;
                    //   const no = ((ix + 1)*20)-20
                    embed
                    let actualpage = index + 1
                    index = ((index % chunks.length) + chunks.length) % chunks.length;
                    if (args[0] > chunks.length) {
                        embed.setDescription(`There are No Item Listed in the Auctions!`)
                    }
                    else {
                        const no = ((index + 1) * 20) - 20
                        embed.setDescription(chunks[index].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${r.num} | IV: ${r.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(r.bid)} cc(s) `).join('\n') || "There is No Item Listed in the Auctions!")
                        embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${all.length} pokémon matching this search.`);
                    }
                    embed.setAuthor(`${message.author.tag}'s' Auction Listings`)
                    embed.setColor(color)
                    return message.channel.send(embed);
                }
                if (all[20] && message.content.endsWith(`${guild.prefix}a lt`) || all[20] && message.content.endsWith(`${guild.prefix}auction lt`) || all[20] && message.content.endsWith(`${guild.prefix}auction listings`) || all[20] && message.content.endsWith(`${guild.prefix}a listings`)) {
                    //    if(args[0] == 0) args[0]; 
                    let chunks = chunk(all, 20);
                    let index = 0;
                    //   if(index) index;
                    //   console.log(chunks[0]);
                    let ix = ((index % chunks.length) + chunks.length) % chunks.length;
                    //   const no = ((ix + 1)*20)-20
                    embed
                    let actualpage = index + 1
                    index = ((index % chunks.length) + chunks.length) % chunks.length;
                    const no = ((index + 1) * 20) - 20
                    embed.setAuthor(`${message.author.tag}'s Auction Listings`)
                    embed.setDescription(chunks[index].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${r.num} | IV: ${r.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(r.bid)} cc(s) | Time: ${ms(r.time - Date.now())}`).join('\n') || "There is No Item Listed in the Auctions!")
                    embed.setFooter(`Showing ${index + 1}-${chunks.length} of ${all.length} Pokémons matching this search.`)
                    embed.setColor(color)
                    return message.channel.send(embed);
                }
                else {
                    embed
                        .setAuthor(`${message.author.tag}'s Auction Listings`)
                        .setColor(color)
                        .setDescription(chunks[0].map((r, i) => `**Level ${r.pokemon.level} ${(r.pokemon.shiny ? "⭐" : "")}${r.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${r.num} | IV: ${r.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(r.bid)} cc(s) `).join('\n') || "There are No Item Listed in the Auctions!")
                        .setFooter(`Showing 1-1 of ${all.length} pokémon matching this search.`);
                    message.channel.send(embed)
                }
            }
            else {
                return message.channel.send("You haven't Listed any of your Pokémon on the Auction Hub.")
            }
        }
        else if (args[0] === "remove" || args[0] === "r") {
            let auction = await Auction.find({});

            auction = auction.map((r, i) => {
                r.num = i + 1;
                return r;
            }).filter(r => r.id === user.id);


            if (isNaN(args[1]) || !auction.find(r => r.num === parseInt(args[1]))) return message.channel.send(`Invalid Auction#ID Provided!`);

            let num = parseInt(args[1]) - 1;


            let data = auction.find(r => r.num === parseInt(args[1]));
            if (data.bid != 0) return message.channel.send("You can't remove your Pokemon from the Auctions once someone has Bidded on it!")


            if (data) {
                user.pokemons.push(data.pokemon);
                await user.markModified(`pokemons`);

                await user.save().catch(console.error);

                await Auction.deleteOne({ id: data.id, pokemon: data.pokemon, bid: data.bid });
                return message.channel.send(`Successfully removed your Pokemon from the Auctions`)
            }
            else {
                return message.channel.send(`You can't remove this Pokemon from the Auctions as it is Not present in your Auction Listings!`);
            }

        }

        else if (args[0] === "search" || args[0] === "s") {
            let auction = await Auction.find({});
            let e = message,
                n = args.slice(1).join(" "),
                a = auction,
                i = guild,
                s = a.map((r, num) => { r.pokemon.num = num + 1; return r }),
                zbc = {};
            console.log(n)
            n.split(/--|—/gmi).map(x => {
                if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
            });
            if (zbc["legendary"] || zbc["l"]) s = s.filter(e => { if (legends.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
            if (zbc["mythical"] || zbc["m"]) s = s.filter(e => { if (mythics.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
            if (zbc["ultrabeast"] || zbc["ub"]) s = s.filter(e => { if (ub.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
            if (zbc["mega"] || zbc["mg"]) s = s.filter(e => { if ((e.pokemon.name.toLowerCase().replace(/ +/g, "-")).startsWith("mega-")) return e });
            if (zbc["alolan"] || zbc["a"]) s = s.filter(e => { if (alolans.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e });
            if (zbc["galarian"]) s = s.filter(e => { if (galarians.includes(e.pokemon.name.capitalize().replace(/-+/g, " "))) return e; })
            if (zbc["shiny"] || zbc["s"]) s = s.filter(e => { if (e.pokemon.shiny) return e });
            if (zbc["name"] || zbc["n"]) s = s.filter(e => { if (e && (zbc['name'] || zbc['n']) == e.pokemon.name.toLowerCase().replace(/-+/g, ' ')) return e });
            if (zbc['type'] || zbc["tp"]) s = s.filter(e => { if (e.pokemon.rarity.match(new RegExp((zbc['type'] || zbc["tp"]), "gmi")) != null) return e });
            if (zbc['order'] || zbc['o']) {
                let order = zbc['order'] || zbc['o'];
                if (order == "time a") {
                    s = s.sort((a, b) => { return parseFloat(a.time) - parseFloat(b.time) });
                }
                else if (order == "time d") {
                    s = s.sort((a, b) => { return parseFloat(b.time) - parseFloat(a.time) });
                }
                else if (order == "iv") {
                    s = s.sort((a, b) => { return parseFloat(b.totalIV) - parseFloat(a.totalIV) });
                }
                else if (order == "alphabet") {
                    s = s.sort((a, b) => {
                        if (a.name < b.name) { return -1; }
                        if (a.name > b.name) { return 1; }
                        return 0;
                    })
                }
            }
            if (zbc["hpiv"]) {
                let a = zbc["hpiv"].split(" ")
                if (a[0] === ">") s = s.filter(e => { if (e.pokemon.hp > a[1]) return e });
                if (a[0] === "<") s = s.filter(e => { if (e.pokemon.hp < a[1]) return e });
                if (Number(a[0])) s = s.filter(e => { if (e.pokemon.hp == a[1]) return e });
            }
            if (zbc["atkiv"]) {
                let a = zbc["atkiv"].split(" ")
                if (a[0] === ">") s = s.filter(e => { if (e.pokemon.atk > a[1]) return e });
                if (a[0] === "<") s = s.filter(e => { if (e.pokemon.atk < a[1]) return e });
                if (Number(a[0])) s = s.filter(e => { if (e.pokemon.atk == a[1]) return e });
            }
            if (zbc["defiv"]) {
                let a = zbc["defiv"].split(" ")
                if (a[0] === ">") s = s.filter(e => { if (e.pokemon.def > a[1]) return e });
                if (a[0] === "<") s = s.filter(e => { if (e.pokemon.def < a[1]) return e });
                if (Number(a[0])) s = s.filter(e => { if (e.pokemon.def == a[1]) return e });
            }
            if (zbc["spatkiv"]) {
                let a = zbc["spatkiv"].split(" ")
                console.log(s.map(s => s.pokemon[0]))
                if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spatk > a[1]) return e });
                if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spatk < a[1]) return e });
                if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spatk == a[1]) return e });
            }
            if (zbc["spdefiv"]) {
                let a = zbc["spdefiv"].split(" ")
                console.log(s.map(s => s.pokemon[0]))
                if (a[0] === ">") s = s.filter(e => { if (e.pokemon.spdef > a[1]) return e });
                if (a[0] === "<") s = s.filter(e => { if (e.pokemon.spdef < a[1]) return e });
                if (Number(a[0])) s = s.filter(e => { if (e.pokemon.spdef == a[1]) return e });
            }
            if (zbc["speediv"]) {
                let a = zbc["speediv"].split(" ")
                console.log(s.map(s => s.pokemon[0]))
                if (a[0] === ">") s = s.filter(e => { if (e.pokemon.speed > a[1]) return e });
                if (a[0] === "<") s = s.filter(e => { if (e.pokemon.speed < a[1]) return e });
                if (Number(a[0])) s = s.filter(e => { if (e.pokemon.speed == a[1]) return e });
            }
            let txt;
            let num = 0
            let embed = new Discord.MessageEmbed()
            let array = [s];

            let chunks = chunk(s, 20)

            let index = 0;
            if (Number(args[1])) index = parseInt(args[1]) - 1
            let ix = ((index % chunks.length) + chunks.length) % chunks.length;
            let actualpage = index + 1
            index = ((index % chunks.length) + chunks.length) % chunks.length;
            if (isNaN(e[1])) txt = s.map((item, i) => `**Level ${item.pokemon.level} ${item.pokemon.shiny ? ":star: " : ""}${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** | ID: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(item.bid)} cc | Time Left: ${ms(item.time - Date.now())}`).slice(0, 15).join("\n")

            if (Number(args[1])) {
                if (txt == "") {
                    txt += "There is No Item Listed in the Auctions!"
                }
                if (chunks.length == 0) {
                    chunks.length = 1
                }

                embed
                    .setTitle(` Auction Hub`)
                    .setColor(color)
                    .setDescription((chunks[index].map((item, i) => { return `**${item.pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ${item.pokemon.shiny ? ":star:" : ""} | Level: ${item.pokemon.level} | Number: ${item.pokemon.num} | IV: ${item.pokemon.totalIV}% | Bid: ${new Intl.NumberFormat('en-IN').format(item.bid)} | cc` }).join("\n")))
                if (args[1] > chunks.length) {
                    embed.setDescription("There is No Item Listed in the Auctions!")
                }
                return e.channel.send(embed)
            }
            else {
                if (txt == "") {
                    txt += "There is No Item Listed in the Auctions!"
                }
                if (chunks.length == 0) {
                    chunks.length = 1
                }
                let embed = new Discord.MessageEmbed()
                    .setTitle(` Auction Hub`)
                    .setColor(color)
                    .setDescription(txt)
                    .setFooter(`Showing 1-${chunks.length} of ${s.length} pokémon matching this search.`);
                return e.channel.send(embed)
            }

        }
        else if (args[0] === "list" || args[0] === "l") {
            // return message.channel.send('Command is under development')
            if (isNaN(args[1])) return message.channel.send(`Invalid Pokémon#id provided. It should be in the form of \`${prefix}auction list <pokemon#id> <auction_timeout> [buyout]\``);
            let num = parseInt(args[1]) - 1;

            if (!user.pokemons[num]) return message.channel.send('Unable to find that Pokémon in your Pokedex Collection.');

            if (user.pokemons.length < 2) return message.channel.send('You cannot list your only Pokemon.');

            //if(isNaN(args[2])) {
            //return message.channel.send('Invalid Ricks amount provided. It should be in the form of \`${prefix}auction list <pokemon#id> <auction_timeout> [buyout]\`');
            //}
            let x = parseInt(ms(args[2]))
            if (!ms(args[2])) return message.channel.send('Provide the time in correct method')
            let t = Date.now() + ms(args[2]);
            if(x>259200000) return message.channel.send('You cannot place your pokemon more than 3 days in auction hub')
          
            let newDoc = new Auction({
                id: message.author.id,
                pokemon: user.pokemons[num],
                time: t,
                bid: 0,
                user: user.id
            });

            user.pokemons.splice(args[1] - 1, 1);

            await user.save().catch(e => console.log(e));

            await newDoc.save().catch(e => console.log(e));

            return message.channel.send(`Successfully Listed the pokemon on Auction Hub`);

        }

        else if (args[0].toLowerCase() === "bid") {
            let auction = await Auction.find({});
            let bid = parseInt(args[2]);
            let user1 = User.findOne({id: message.author.id})
            if (isNaN(args[1]) || !auction[parseInt(args[1]) - 1]) return message.channel.send(`Invalid auction number provided`);

            let num = parseInt(args[1]) - 1;

            let check = await Auction.findOne({ id: user.id, pokemon: auction[num].pokemon, bid: auction[num].bid });

            if (check) return message.channel.send(`You can't bid your own pokemon`);
            if (auction[num].bid >= bid) return message.channel.send("You cannot bid lower than current")
            // if(auction[num].user = user.id) return message.channel.send('You cannot bid until someone bids more than you')
            let userD = client.users.cache.get(auction[num].user)
            let userx = await User.findOne({ id: auction[num].user })
            userx.balance = userx.balance + auction[num].bid
            if(!auction[num].bid === 0)        await userD.send(`You bid has been outbidded on ${num} auction id`)
            await userx.save()
           
            user1.balance = user1.balance - bid
            await user.save()
         
            await Auction.findOneAndUpdate({ id: auction[num].id }, { bid: bid }, { user: user1.id });
            return message.channel.send(`Successfully Bidded`);
          }
        if(args[0].toLowerCase()==='info'||"i"){
          let auction = await Auction.find({});
          //let user = await auction.find({id: user.id}); 
          if (isNaN(args[1]) || !auction[parseInt(args[1]) - 1]) return message.channel.send(`Invalid auction number provided`);
    
          let num = parseInt(args[1]) - 1;
          var name = auction[num].pokemon.name
          let level = auction[num].pokemon.level
          var nb = auction[num].pokemon._nb
          //var tp = user.pokemons[selected].rarity;
          var stat1 = auction[num].pokemon.hp
          var stat2 = auction[num].pokemon.atk
          var stat3 = auction[num].pokemon.def
          var stat4 = auction[num].pokemon.spatk
          var stat5 = auction[num].pokemon.spdef
          var stat6 = auction[num].pokemon.speed
          const g8 = Gen8.find(e => e.name.toLowerCase() === auction[num].pokemon.name.toLowerCase())
          if (g8) {
            let hpBase = g8.hp;
            let atkBase = g8.atk;
            let defBase = g8.def;
            let spatkBase = g8.spatk;
            let spdefBase = g8.spdef;
            let speedBase = g8.speed;
            let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
            let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
            let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
            let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
            let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
            let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
            let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
            const totalivs = Math.floor(Math.round(totaliv))
    
            const finaliv = (totaliv.toFixed(2))
            name = auction[num].pokemon.name.toLowerCase();
            var tp = g8.type.capitalize()
    // 
            const Embed = embed
            Embed.setColor('#05f5fc')
            Embed.setTitle(`Level ${auction[num].pokemon.level} ${(auction[num].pokemon.shiny ? "⭐" : "")} ${g8.name.capitalize()}\nID: ${num + 1}\nTime remaining: ${ms(auction[num].time - Date.now())}\n Current bid: ${new Intl.NumberFormat('en-IN').format(auction[num].bid)} cc`)
            Embed.setDescription(`${(auction[num].pokemon.nick != null ? `**Nickname:** ${auction[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
            Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
            Embed.setFooter(`Use ${guild.prefix}auction buy ${num + 1} to buy this pokemon`)
            let url
            const s = shiny.find(e => e.name === auction[num].pokemon.name.toLowerCase())
            if (auction[num].pokemon.shiny && s) {
              url = s.url
            }
            else {
              url = g8.url
            }
            Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
              .setImage("attachment://" + "Pokemon.png")
            return message.channel.send(Embed);
          }
          const mg = Mega.find(e => e.name.toLowerCase() === auction[num].pokemon.name.replace("mega-", "").toLowerCase())
          if (mg && auction[num].pokemon.name.toLowerCase().startsWith("mega-")) {
            let f = mg
            let hpBase = f.hp;
            let atkBase = f.atk;
            let defBase = f.def;
            let spatkBase = f.spatk;
            let spdefBase = f.spdef;
            let speedBase = f.speed;
            let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10);
            let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level / 100 + 5) * 0.9);
            let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0 / 4)) * level / 100 + 5) * 1);
            let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0 / 4)) * level / 100 + 5) * 1.1);
            let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0 / 4)) * level / 100 + 5) * 1);
            let fspeed = Math.floor(Math.floor((2 * speedBase + stat6 + (0 / 4)) * level / 100 + 5) * 1);
            let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
            const totalivs = Math.floor(Math.round(totaliv))
    
            const finaliv = (totaliv.toFixed(2))
            name = auction[num].pokemon.name.toLowerCase();
            var tp = f.type.capitalize()
            if (isNaN(auction[num].pokemon.xp)) {
              auction[num].pokemon.xp = auction[num].pokemon.level * 100
              await user.save()
            }
            if (auction[num].pokemon.xp > auction[num].pokemon.level * 100 + 101) {
              auction[num].pokemon.xp = auction[num].pokemon.level * 100
              await auction[num].pokemon.save()
            }
            const Embed = embed
            Embed.setColor('#05f5fc')
            Embed.setTitle(`${(auction[num].pokemon.shiny ? "⭐" : "")} Mega ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
            Embed.setDescription(`${(auction[num].pokemon.nick != null ? `**Nickname:** ${auction[num].pokemon.nick}` : "")}\n**Level:**  ${auction[num].pokemon.level} | **XP:** ${auction[num].pokemon.xp}\n**Type:** ${tp}\n**Nature:** ${auction[num].pokemon.nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
            Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
            let url = f.url
            const mgs = megashiny.find(e => e.name === auction[num].pokemon.name.replace("mega-", "").toLowerCase())
            if (auction[num].pokemon.shiny && mgs) url = mgs.url
            Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
              .setImage("attachment://" + "Pokemon.png")
            Embed.setFooter(`Use ${guild.prefix}auction buy ${num + 1} to buy this pokemon`)
            return message.channel.send(Embed);
          }
          const cp = Concept.find(e => e.name.toLowerCase() === auction[num].pokemon.name.toLowerCase())
          if (cp) {
            let f = cp
            let hpBase = f.hp;
            let atkBase = f.atk;
            let defBase = f.def;
            let spatkBase = f.spatk;
            let spdefBase = f.spdef;
            let speedBase = f.speed;
            let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10);
            let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level / 100 + 5) * 0.9);
            let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0 / 4)) * level / 100 + 5) * 1);
            let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0 / 4)) * level / 100 + 5) * 1.1);
            let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0 / 4)) * level / 100 + 5) * 1);
            let fspeed = Math.floor(Math.floor((2 * speedBase + stat6 + (0 / 4)) * level / 100 + 5) * 1);
            let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
            const totalivs = Math.floor(Math.round(totaliv))
    
            const finaliv = (totaliv.toFixed(2))
            name = auction[num].pokemon.name.toLowerCase();
            var tp = f.type.capitalize()
            if (isNaN(auction[num].pokemon.xp)) {
              auction[num].pokemon.xp = auction[num].pokemon.level * 100
              await user.save()
            }
            if (auction[num].pokemon.xp > auction[num].pokemon.level * 100 + 101) {
              auction[num].pokemon.xp = auction[num].pokemon.level * 100
              await auction[num].pokemon.save()
            }
            const Embed = embed
            Embed.setColor('#05f5fc')
            Embed.setTitle(`${(auction[num].pokemon.shiny ? "⭐" : "")} ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
            Embed.setDescription(`${(auction[num].pokemon.nick != null ? `**Nickname:** ${auction[num].pokemon.nick}` : "")}\n**Level:**  ${auction[num].pokemon.level} | **XP:** ${auction[num].pokemon.xp}\n**Type:** ${tp}\n**Nature:** ${auction[num].pokemon.nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
            Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
            let url = f.url
            Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
              .setImage("attachment://" + "Pokemon.png")
            Embed.setFooter(`Use ${guild.prefix}auction buy ${num + 1} to buy this pokemon`)
            return message.channel.send(Embed);
          }
          const sm = Shadow.find(e => e.name.toLowerCase() === auction[num].pokemon.name.replace("shadow-", "").toLowerCase())
          if (sm && name.toLowerCase().startsWith("shadow")) {
            let f = sm
            let hpBase = f.hp;
            let atkBase = f.atk;
            let defBase = f.def;
            let spatkBase = f.spatk;
            let spdefBase = f.spdef;
            let speedBase = f.speed;
            let fhp = Math.floor(Math.floor((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10);
            let fatk = Math.floor(Math.floor((2 * atkBase + stat2 + 0) * level / 100 + 5) * 0.9);
            let fdef = Math.floor(Math.floor((2 * defBase + stat3 + (0 / 4)) * level / 100 + 5) * 1);
            let fspatk = Math.floor(Math.floor((2 * spatkBase + stat4 + (0 / 4)) * level / 100 + 5) * 1.1);
            let fspdef = Math.floor(Math.floor((2 * spdefBase + stat5 + (0 / 4)) * level / 100 + 5) * 1);
            let fspeed = Math.floor(Math.floor((2 * speedBase + stat6 + (0 / 4)) * level / 100 + 5) * 1);
            let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
            const totalivs = Math.floor(Math.round(totaliv))
    
            const finaliv = (totaliv.toFixed(2))
            name = auction[num].pokemon.name.toLowerCase();
            var tp = f.type.capitalize()
            if (isNaN(auction[num].pokemon.xp)) {
              auction[num].pokemon.xp = auction[num].pokemon.level * 100
              await auction[num].pokemon.save()
            }
            if (auction[num].pokemon.xp > auction[num].pokemon.level * 100 + 101) {
              auction[num].pokemon.xp = auction[num].pokemon.level * 100
              await auction[num].pokemon.save()
            }
            const Embed = new embed
            Embed.setColor('#05f5fc')
            Embed.setTitle(`${(auction[num].pokemon.shiny ? "⭐" : "")} Shadow ${f.name.capitalize().replace(/-+/g, " ")}'s info`)
            Embed.setDescription(`${(auction[num].pokemon.nick != null ? `**Nickname:** ${auction[num].pokemon.nick}` : "")}\n**Level:**  ${auction[num].pokemon.level} | **XP:** ${auction[num].pokemon.xp}\n**Type:** ${tp}\n**Nature:** ${auction[num].pokemon.nature}\n\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
            Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
            let url = f.url
            const s = shiny.find(e => e.name === auction[num].pokemon.name.toLowerCase())
            if (auction[num].pokemon.shiny && s) url = s.url
            Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
              .setImage("attachment://" + "Pokemon.png")
            Embed.setFooter(`Use ${guild.prefix}auction buy ${num + 1} to buy this pokemon`)
            return message.channel.send(Embed);
          }
          const f = Forms.find(e => e.name.toLowerCase() === auction[num].pokemon.name.toLowerCase())
          if (f) {
            let hpBase = f.hp;
            let atkBase = f.atk;
            let defBase = f.def;
            let spatkBase = f.spatk;
            let spdefBase = f.spdef;
            let speedBase = f.speed;
            let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
            let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
            let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
            let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
            let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
            let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
            let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
            const totalivs = Math.floor(Math.round(totaliv))
    
            const finaliv = (totaliv.toFixed(2))
            name = auction[num].pokemon.name.toLowerCase();
            var tp = f.type.capitalize()
            const Embed = embed
            Embed.setColor('#05f5fc')
            Embed.setTitle(`Level ${auction[num].pokemon.level} ${(auction[num].pokemon.shiny ? "⭐" : "")} ${f.name.capitalize()}\nID: ${num + 1}\nTime remaining: ${ms(auction[num].time - Date.now())}\n Current bid: ${new Intl.NumberFormat('en-IN').format(auction[num].bid)} cc`)
            Embed.setDescription(`${(auction[num].pokemon.nick != null ? `**Nickname:** ${auction[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
            Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
            Embed.setFooter(`Use ${guild.prefix}auction buy ${num + 1} to buy this pokemon`)
            let url
            const s = shiny.find(e => e.name === auction[num].pokemon.name.toLowerCase())
            if (auction[num].pokemon.shiny && s) {
              url = s.url
            }
            else {
              url = f.url
            }
            Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
              .setImage("attachment://" + "Pokemon.png")
            return message.channel.send(Embed);
          }
          const pk = Pokemon.find(e => e.name === auction[num].pokemon.name.toLowerCase())
          if (pk) {
            let hpBase = pk.hp;
            let atkBase = pk.atk;
            let defBase = pk.def;
            let spatkBase = pk.spatk;
            let spdefBase = pk.spdef;
            let speedBase = pk.speed;
            let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
            let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
            let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
            let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
            let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
            let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
            let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
            const totalivs = Math.floor(Math.round(totaliv))
    
            const finaliv = (totaliv.toFixed(2))
            name = auction[num].pokemon.name.toLowerCase();
            var tp = pk.type.capitalize()
    
            const Embed = embed
            Embed.setColor('#05f5fc')
            Embed.setTitle(`Level ${auction[num].pokemon.level} ${(auction[num].pokemon.shiny ? "⭐" : "")} ${pk.name.capitalize()}\nID: ${num + 1}\nTime remaining: ${ms(auction[num].time - Date.now())}\n Current bid: ${new Intl.NumberFormat('en-IN').format(auction[num].bid)} cc`)
            Embed.setDescription(`${(auction[num].pokemon.nick != null ? `**Nickname:** ${auction[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
            Embed.setThumbnail(message.author.avatarURL({ dynamic: true }))
            Embed.setFooter(`Use ${guild.prefix}auction buy ${num + 1} to buy this pokemon`)
            let url
            const s = shiny.find(e => e.name === auction[num].pokemon.name.toLowerCase())
            if (auction[num].pokemon.shiny && s) {
              url = s.url
            }
            if (auction[num].pokemon.shiny && auction[num].pokemon.name.toLowerCase() == "eternatus" || url == "https://imgur.com/TUtkb2v.png") {
              url = "https://i.imgur.com/lkx7zZ3.png"
            }
            else {
              url = pk.url
              if (auction[num].pokemon.shiny && auction[num].pokemon.name.toLowerCase() == "eternatus" || url == "https://imgur.com/TUtkb2v.png") {
                url = "https://i.imgur.com/lkx7zZ3.png"
              }
            }
            Embed.attachFiles([{ name: "Pokemon.png", attachment: url }])
              .setImage("attachment://" + "Pokemon.png")
            return message.channel.send(Embed);
          }
          else {
            name = auction[num].pokemon.name.toLowerCase();
            if (auction[num].pokemon.name.startsWith("alolan")) {
              name = name.replace("alolan", "").trim().toLowerCase();
              name = `${name}-alola`.toLowerCase();
            }
            P.getPokemonByName(name).then(async function (response) {
              let hpBase = response.stats[0].base_stat;
              let atkBase = response.stats[1].base_stat;
              let defBase = response.stats[2].base_stat;
              let spatkBase = response.stats[3].base_stat;
              let spdefBase = response.stats[4].base_stat;
              let speedBase = response.stats[5].base_stat;
              let fhp = ((2 * hpBase + stat1 + (0 / 4) * level) / 100) + level + 10;
              let fatk = (((2 * atkBase + stat2 + (0 / 4) * level) / 100) + 5) * 1;
              let fdef = (((2 * defBase + stat3 + (0 / 4) * level) / 100) + 5) * 1;
              let fspatk = (((2 * spatkBase + stat4 + (0 / 4) * level) / 100) + 5) * 1;
              let fspdef = (((2 * spdefBase + stat5 + (0 / 4) * level) / 100) + 5) * 1;
              let fspeed = (((2 * speedBase + stat6 + (0 / 4) * level) / 100) + 5) * 1;
              let totaliv = ((stat1 + stat2 + stat3 + stat4 + stat5 + stat6) / 186) * 100
              const totalivs = Math.floor(Math.round(totaliv))
              const finaliv = (totaliv.toFixed(2))
              const options = {
                url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                json: true
              };
              let bdy = await get(options)
              let id;
              if (bdy.id < 10) id = `00${bdy.id}`
              else if (bdy.id > 9 && bdy.id < 100) id = `0${bdy.id}`
              else if (bdy.id > 99) id = bdy.id
              if (name.endsWith('-alola')) {
                name = name.replace("-alola", "").trim().toLowerCase();
                const t = await P.getPokemonByName(name);
                id = `${t.id}_f2`
                const ch = getlength(t.id);
                if (ch === 1) {
                  id = `00${t.id}_f2`
                } else if (ch === 2) {
                  id = `0${t.id}_f2`
                } else if (ch === 3) {
                  id = `${t.id}_f2`
                }
              }
              name = auction[num].pokemon.name.toLowerCase();
              var tp = bdy.types[0].type.name.capitalize()
              embed
                .setColor('#05f5fc')
                .setTitle(`Level ${auction[num].pokemon.level} ${(auction[num].pokemon.shiny ? "⭐" : "")} ${auction[num].pokemon.name.capitalize()}\nID: ${num + 1}\nTime remaining: ${ms(auction[num].time - Date.now())}\n Current bid: ${new Intl.NumberFormat('en-IN').format(auction[num].bid)} ツ`)
                .setDescription(`${(auction[num].pokemon.nick != null ? `**Nickname:** ${auction[num].pokemon.nick}` : "")}\n**Type:** ${tp}\n**HP:** ${Math.floor(Math.round(fhp))} - IV : ${stat1}/31\n**Attack:** ${Math.floor(Math.round(fatk))} - IV: ${stat2}/31\n**Defense:** ${Math.floor(Math.round(fdef))} - IV: ${stat3}/31\n**Sp. Atk:** ${Math.floor(Math.round(fspatk))} - IV: ${stat4}/31\n**Sp. Def:** ${Math.floor(Math.round(fspdef))} - IV: ${stat5}/31\n**Speed:** ${Math.floor(Math.round(fspeed))} - IV: ${stat6}/31\n**Total IV %:** ${finaliv}%`)
                .setFooter(`Use ${guild.prefix}auction buy ${num + 1} to buy this pokemon`)
                .setThumbnail(message.author.avatarURL({ dynamic: true }))
              var uri = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`
              const fm = Forms.find(e => e.name === name.toLowerCase())
              const mg = Mega.find(e => e.name === name.toLowerCase())
              const pm = Primal.find(e => e.name === name.toLowerCase())
              if (fm) {
                uri = fm.url
                name = "Pokemon.png"
              }
              if (mg && name.toLowerCase().startsWith("mega-")) {
                uri = mg.url
                name = "Pokemon.png"
              }
              if (pm && name.toLowerCase().startsWith("primal")) {
                uri = pm.url
                name = "Pokemon.png"
              }
              if (auction[num].pokemon.name.toLowerCase() === "giratina-origin" && !auction[num].pokemon.shiny) uri = "https://imgur.com/UHVxS2q.png"
              if (auction[num].pokemon.shiny) {
                uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name.toLowerCase()}.gif`
                const pokemon = shiny.find(e => e.name === name)
                const mgs = megashiny.find(e => e.name === name.toLowerCase())
                if (!pokemon) {
                  uri = `https://play.pokemonshowdown.com/sprites/xyani-shiny/${name.toLowerCase()}.gif`
                  name = "Pokemon.gif"
                }
                if (pokemon) {
                  uri = pokemon.url
                  name = "Pokemon.png"
                }
                if (mgs && name.toLowerCase().startsWith("mega-")) {
                  uri = mgs.url
                  name = "Pokemon.png"
                }
                if (name.toLowerCase() == "giratina-origin") {
                  uri = `https://imgur.com/UHVxS2q.png`
                }
                let p;
                if (name.toLowerCase() === "primal-kyogre") {
                  p = primal[0]
                  uri = "https://i.imgur.com/XdZwD0s.png"
                }
                if (name.toLowerCase() === "primal-groudon") {
                  p = primal[1]
                  uri = "https://i.imgur.com/Xzm1FDn.png"
                }
                embed.attachFiles([{ name: name, attachment: uri }])
                  .setImage("attachment://" + name)
              }// Fixed
              let imgname = "Pokemon.png";
              if (uri.endsWith(".gif")) imgname = "Pokemon.gif"
              embed.attachFiles([{ name: imgname, attachment: uri }])
                .setImage("attachment://" + imgname)
              embed.setFooter(`Use ${guild.prefix}auction bid ${num + 1} to bid on this pokemon`)
              message.channel.send(embed);
            }).catch((err) => {
              message.reply(`${err}`)
            })
          }
        }
        
    }
}
function chunk(array, chunkSize) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
}