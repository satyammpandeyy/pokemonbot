const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");
const db = require("mongoose");
module.exports = {
	name: "leaderboard",
    description: "leaderboard",
    category: "Economy",
    args: false,
    usage: ["lb <args>"],
    cooldown: 3,
    permissions: [],
    aliases: ["lb"],

	execute: async (client, message, args, prefix, guild, color, channel) => {
    let userx = await User.findOne({ id: message.author.id });
    if (!userx) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
  


 let embed = new MessageEmbed()
.setAuthor(`${client.user.username} Top Player's Leaderboard`)
.addField("Get the craft coins Leaderboard",`Usage: \`${prefix}leaderboard cc\``)
.addField("Get the Shards Leaderboard",`Usage: \`${prefix}leaderboard shards\``)
.addField("Get the Redeems Leaderboard",`Usage: \`${prefix}leaderboard redeems\``)
.addField("Get the Pokemons Caught Leaderboard",`Usage: \`${prefix}leaderboard caught\``)
.addField("Get the Pokemons Released Leaderboard",`Usage: \`${prefix}leaderboard released\``)
.addField("Get the Total Shinies Leaderboard",`Usage: \`${prefix}leaderboard shiny\``)


.setColor("RED")
 if (!args[0]) return message.channel.send(embed);

else if (args[0].toLowerCase() ==="cc"){
   await User.find({
        
    }).sort([
        ['balance', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("cc Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor(message.guild.me.displayHexColor);
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';

                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **Unknown User#0000** • \`${res[i].balance} \`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}.\` • **${user.tag}** • \`${res[i].balance} \`\n`);
                }
            }
           leaderboardEmbed.setColor(message.guild.me.displayHexColor);
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';
                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **Unknown User#0000** • \`${res[i].balance} \`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].balance} \`\n`);
                }
            }
            leaderboardEmbed.setColor(message.guild.me.displayHexColor);
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}


        
     else   if (args[0].toLowerCase() ==="caught"){
  
         await User.find({
        
    }).sort([
        ['lbcaught', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Pokemons Caught Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor(message.guild.me.displayHexColor);
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';

                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • ${user.tag} • \`${res[i].lbcaught++} Caught\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • ${user.tag} • \`${res[i].lbcaught++} Caught\`\n`);
                }
            }
           leaderboardEmbed.setColor(message.guild.me.displayHexColor);
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';
                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].lbcaught++} Caught\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].lbcaught++} Caught\`\n`);
                }
            }
            leaderboardEmbed.setColor("#FF7F50");
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}



      else  if (args[0].toLowerCase() ==="released"){
   await User.find({
        
    }).sort([
        ['released', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Pokemons Released Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor('RED');
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';

                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].released} Released\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].released} Released\`\n`);
                }
            }
           leaderboardEmbed.setColor("RED");
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';
                if (user === "User Left"){
                   leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].released} Released\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].released} Released\`\n`);
                }
            }
            leaderboardEmbed.setColor("RED");
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
    else      if (args[0].toLowerCase() ==="votes"){
   await User.find({
        
    }).sort([
        ['streak', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Vote Streaks Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor('#FF0000');
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';

                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].streak} Votes\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].streak} Votes\`\n`);
                }
            }
           leaderboardEmbed.setColor("RED");
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';
                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].streak} Votes\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].streak} Votes\`\n`);
                }
            }
            leaderboardEmbed.setColor("#FF7F50");
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}

   else     if (args[0].toLowerCase() ==="shards"){
   await User.find({
        
    }).sort([
        ['shards', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Shards Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor('RED');
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';

                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].shards} Shards\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].shards} Shards\`\n`);
                }
            }
           leaderboardEmbed.setColor("RED");
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';
                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].shards} Shards\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].shards} Shards\`\n`);
                }
            }
            leaderboardEmbed.setColor("RED");
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
else if (args[0].toLowerCase() ==="upvotes"){
   await User.find({
        
    }).sort([
        ['upvotes', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Upvotes Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor('RED');
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';

                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].upvotes} Upvs\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].upvotes} Upvs\`\n`);
                }
            }
           leaderboardEmbed.setColor("#FF7F50");
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';
                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].upvotes} Upvs\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • **${user.tag}** • \`${res[i].upvotes} Upvs\`\n`);
                }
            }
            leaderboardEmbed.setColor("RED");
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
else if (args[0].toLowerCase() ==="redeems" || args[0].toLowerCase() ==="redeem"){
   await User.find({
        
    }).sort([
        ['redeems', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Redeems's Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor('RED');
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';

                if (user === "User Left"){
                    leaderboard.push(`\`${i + 1}\` • ${user.tag} • \`${res[i].redeems} Redeems\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • ${user.tag} • \`${res[i].redeems} Redeems\`\n`);
                }
            }
           leaderboardEmbed.setColor("RED");
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';
                if (user === "User Left"){
                   leaderboard.push(`\`${i + 1}\` • ${user.tag} • \`${res[i].redeems} Redeems\`\n`);
                }else{
                    leaderboard.push(`\`${i + 1}\` • ${user.tag} • \`${res[i].redeems} Redeems\`\n`);
                }
            }
            leaderboardEmbed.setColor("#FF7F50");
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
else if (args[0].toLowerCase() ==="shiny" || args[0].toLowerCase() ==="shinies"){
   await User.find({
        
    }).sort([
        ['shinies', 'descending']
    ]).exec((err, res) => {
        if (err) console.log(err);

        let leaderboardEmbed = new MessageEmbed()
            .setTitle("Shiny's Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor('#FF0000');
            leaderboardEmbed.setDescription('No results were found!')
        }
        else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';

                if (user === "User Left"){
                    leaderboard.push(`**${i + 1}.) ${user.tag} | ${res[i].pokemons.filter(r => r.shiny).length} Shinies**\n`);
                }else{
                    leaderboard.push(`**${i + 1}.) ${user.tag} | ${res[i].pokemons.filter(r => r.shiny).length} Shinies**\n`);
                }
            }
           leaderboardEmbed.setColor("#FF7F50");
            leaderboardEmbed.setDescription(leaderboard);
        }
        else{
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let user =  client.users.cache.get(res[i].id)|| 'User Left';
                if (user === "User Left"){
                    leaderboard.push(`**${i + 1}.) ${user.tag} | ${res[i].pokemons.filter(r => r.shiny).length} Shinies**\n`);
                }else{
                    leaderboard.push(`**${i + 1}.) ${user.tag} | ${res[i].pokemons.filter(r => r.shiny).length} Shinies**\n`);
                }
            }
            leaderboardEmbed.setColor("#FF7F50");
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
}
//${user.pokemons.filter(r => r.shiny).length}

 else return message.channel.send(embed);
  
    }
    }