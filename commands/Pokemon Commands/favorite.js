const User = require("./../../models/user");
var pokemon = require("./../../db/pokemon.js");
const Discord = require("discord.js")
const hastebin = require("hastebin-gen");
const Guild = require('../../models/guild.js')
const fs = require("fs");
const legends = fs.readFileSync("./db/legends.txt").toString().trim().split("\n").map(r => r.trim());
const mythics = fs.readFileSync("./db/mythics.txt").toString().trim().split("\n").map(r => r.trim());
const alolans = fs.readFileSync("./db/alolans.txt").toString().trim().split("\n").map(r => r.trim());
const ub = fs.readFileSync("./db/ub.txt").toString().trim().split("\n").map(r => r.trim());
var forms = require("../../db/forms.js");
var mega = require("../../db/mega.js");
var shadow = require("../../db/shadow.js");
var megashiny = require("../../db/mega-shiny.js");
var primal = require("../../db/primal.js");
var shiny = require('../../db/shiny.js')
const { capitalize } = require("../../functions");


//const Mega = require('../../db/mega.js');




module.exports = {
	name: "favorite",
    description: "add favourite pokemon",
    category: "Pokemon Commands",
    args: false,
    usage: ["fav add/remove pk number"],
    cooldown: 3,
    permissions: [],
    aliases: ["fav"],
	
	execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });
    if (!user) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
     let e = message,
      n = args.join(" "),
      a = user,
      s = a.pokemons.map((r, i) => { r.num = i + 1; return r }),
      zbc = {};
    n.split(/--|—/gmi).map(x => {
      if (x && (x = x.split(" "))) zbc[x.splice(0, 1)] = x.join(" ").replace(/\s$/, '') || true;
    })
    if(!args[0]) return message.channel.send("Check your all Favorited Pokémon using Pokemon [--favorite] filter");
    if(args[0].toLowerCase()==='add'){
    if(isNaN(args[1])){
    return message.channel.send(`Give a correct pokemon number.`);
    }
    if(isNaN(!user.pokemons[args[0] - 1])) {
    return message.channel.send(`That Pokemon Doesn't exist in Your Pokedex Collection!`);
    }
    let num = args[1] - 1;
      
    if(user.pokemons[num].fav == true) {
      return message.channel.send(`\`N#${num + 1} ${user.pokemons[num].name}\`} is already present in your Favorite list!`)
    }else{

      user.pokemons[num].fav = true;
      await User.findOneAndUpdate({id: message.author.id}, {pokemons: user.pokemons}, {new: true});
    //  console.log(user.pokemons.filter(f=>f.fav === true))
      return message.channel.send(`Added \`N#${num + 1} ${user.pokemons[num].name}\` Pokemon in your Favorites List!`);
    }
  

   }

   if(args[0].toLowerCase()==='remove'){
    if(isNaN(args[1])){
    return message.channel.send(`Give a correct pokemon number.`);
    }
    if(isNaN(!user.pokemons[args[0] - 1])) {
    return message.channel.send(`That Pokemon Doesn't exist in Your Pokedex Collection!`);
    }
    let num = args[1] - 1;
      
    if(user.pokemons[num].fav == false) {
      return message.channel.send(`\`N#${num + 1} ${user.pokemons[num].name}\` is not present in your Favorite list!`)
    }else{
      user.pokemons[num].fav = false;
      await User.findOneAndUpdate({id: message.author.id}, {pokemons: user.pokemons}, {new: true});
   //   console.log(user.pokemons.filter(f=>f.fav === true))
      return message.channel.send(`Removed \`N#${num + 1} ${user.pokemons[num].name}\` Pokemon from your Favorites List!`);
    }
  

   }


}




}