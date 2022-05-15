const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native')
const fs = require("fs");
const { classToPlain } = require("class-transformer");
const { getlength } = require("../../functions");
const Pokemon = require("./../../Classes/Pokemon");
const Canvas = require('canvas')
const canvas = Canvas.createCanvas(1192,670);
          const ctx = canvas.getContext('2d')



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
  name: "shiny-spawn",
  description: "spawn a shiny pokemon",
  category: "dev",
  args: true,
  usage: ["shiny-spawn <pokemon>"],
  cooldown: 3,
  permissions: [],
  aliases: ["ss", 'shinyspawn'],
  execute: async (client,message, args, prefix, guild, color, channel) => {
    let name = args.join('-')
    
    let ab = {
    url: `https://pokeapi.co/api/v2/pokemon/${name}`,
      json: true
    }
    let embedx;
    await get(ab).then(async x => {
       let idk = x.id.toString().length

       let url = `https://assets.poketwo.net/shiny/${x.id}.png?v=26`

       let lvl = Math.floor(Math.random()*69) + 1
       let pokemon = new Pokemon({ name: name, id: x.id, shiny: true,  url: url }, lvl);

       pokemon = await classToPlain(pokemon)

       let imgname = 'new.png'
       let spawn = await Spawn.findOne({id: message.channel.id})
       if (!spawn) await new Spawn({ id: message.channel.id }).save();
       spawn = await Spawn.findOne({id: message.channel.id})
       spawn.pokemon = []
       spawn.pokemon.push(pokemon)
       spawn.time = 259200000 + Date.now()
       await spawn.save()

     
        let bg = "https://media.discordapp.net/attachments/858427227250753556/866661956218912768/pokemon_swsh___route_3__sunset__by_phoenixoflight92_de2uhfy-pre.png?width=875&height=492";
       
         
          const background = await Canvas.loadImage(bg)
          ctx.drawImage(background,0,0,canvas.width,canvas.height)
          const pk = await Canvas.loadImage(pokemon.url)
          ctx.drawImage(pk,300,100,550,550)
           embed1 = new Discord.MessageEmbed()
            .setAuthor(`A Wild pokémon has Appeared!`)
            .setDescription(`Guess the Pokémon аnd type \`${guild.prefix}catch <pokémon name>\` to cаtch it!`)
             .setColor('#add8e6')
             .attachFiles([{ name: "new.png", attachment: canvas.toBuffer() }])
            .setImage("attachment://" + "new.png")
    })
    return message.channel.send(embed1)
  }
}    