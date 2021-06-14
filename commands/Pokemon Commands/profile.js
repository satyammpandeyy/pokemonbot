const Discord = require('discord.js')
const Canvas = require('canvas');
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "profile",
  description: "Displays your Profile Trainer Card",
  category: "Pokemon Commands",
  args: false,
  usage: ["profile"],
  cooldown: 3,
  permissions: [],
  aliases: ["pf"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });

    if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
      
      let e = message,
      n = args.join(" "),
      a = user,
      s = a.pokemons.map((r, i) => { r.num = i + 1; return r }),
      zbc = {};
    n.split(/--|—/gmi).map(x => {
      if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
    })


    if (!user.createdAt || !isNaN(user.createdAt)) user.createdAt = new Date();
    await user.save();
    var time = user.createdAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    time = new Date(time).toISOString()
    time = time.replace("-", "T")
    time = time.replace("-", "T")
    time = time.split("T")
    time = `${time[2]}/${time[1]}/${time[0]}`;

    
var selected = user.selected;
var name = user.pokemons[selected].name;
if(name){
pokeurl = user.pokemons[selected].url;
}
if(!name) {
pokeurl = "https://cdn.discordapp.com/attachments/826403535776251935/846337919374983178/asasdaaa-removebg-preview.png";
}

const canvas = Canvas.createCanvas(1080,640);
const context = canvas.getContext('2d');
let url1 = 
"https://cdn.discordapp.com/attachments/840106525371793451/852501452617678878/IMG_20210610_162615.jpg"
const background = await Canvas.loadImage(url1);
context.drawImage(background,0,0,canvas.width,canvas.height);

context.font = '22px Acumin Pro ExtraCondensed Bold';
context.fillStyle = '#ffffff';
context.fillText(user.lbcaught, 930,146);
context.fillText(user.shinyCaught, 870,206);
context.fillText(user.released, 959,269);
context.fillText(s.length, 909,329);
context.fillText(user.balance.toString().substr(0,12), 810,391);


context.beginPath();
context.font = '22px Acumin Pro ExtraCondensed Bold';
context.fillStyle = '#ffffff';
context.fillText(`Selected:-`, 699,451.5);

let m = await Canvas.loadImage(pokeurl)
context.drawImage(m,698.5,460,118,118)
context.arc(256.5, 323, 128, 0, Math.PI * 2);
context.closePath();
context.clip();
const avatar = await Canvas.loadImage(message.author.displayAvatarURL({format:"png"}));
context.drawImage(avatar, 128.5,195,256, 256);
    let embed = new Discord.MessageEmbed()
      .attachFiles([{ name: "new.png", attachment: canvas.toBuffer() }])
      
     
      .setImage("attachment://new.png")
   
      .setColor('CYAN')
    return message.channel.send(embed)
  }
}






















/*const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const { capitalize } = require("../../functions.js");
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "profile",
  description: "Displays stuff available in shop",
  category: "Pokemon Commands",
  args: false,
  usage: ["profile"],
  cooldown: 3,
  permissions: [],
  aliases: ["pf"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });

    if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");


    if (!user.createdAt || !isNaN(user.createdAt)) user.createdAt = new Date();
    await user.save();
    var time = user.createdAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    time = new Date(time).toISOString()
    time = time.replace("-", "T")
    time = time.replace("-", "T")
    time = time.split("T")
    time = `${time[2]}/${time[1]}/${time[0]}`;

    let e = message,
      n = args.join(" "),
      a = user,
      s = a.pokemons.map((r, i) => { r.num = i + 1; return r }),
      zbc = {};
    n.split(/--|—/gmi).map(x => {
      if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
    })
    let psinfo;
    if (!user.pokemons[selected]) {
      psinfo = 'Not Selected'
    }
    else {
      var selected = user.selected;
      var name = user.pokemons[selected].name;
      var Name = name;
      psinfo = `Lvl ${user.pokemons[user.selected].level} ${user.pokemons[selected].shiny ? "⭐ " : ""}${capitalize(user.pokemons[user.selected].name)}`
    }


    let embed = new MessageEmbed()
      .setColor("#fff200")
      .setAuthor(`${message.author.username}'s Profile`)
      .setDescription(
        ` **Balance:** ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  \n`
        + ` | **Redeems:** ${user.redeems}\n`
        + `✨ | **Shards**: ${user.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n`
        + ` | **Pokemons Caught:** ${user.caught.length || 0} \n`
        + ` | **Shinies Caught**: ${user.shinyCaught || 0}\n`
        + ` | **Total Shinies:** ${user.pokemons.filter(r => r.shiny).length}\n`
        + ` | **Pokemons Released**: ${user.released}\n`
        + ` | **Total Pokémons**: ${s.length}\n`
        + ` | **Selected Pokemon**: ${psinfo}\n`
        + ` | **Vote Streak**: ${user.streak}\n`
        + ` | **Upvotes:**: ${user.upvotes}\n`
        + ` | **XP Booster**: -\n`
        + ` | **Shiny Charm Expires**: -`)

      .setThumbnail(message.author.displayAvatarURL())
      .setFooter("Started " + client.user.username + " On | " + time)
    message.channel.send(embed)



  }
}

//









*/

