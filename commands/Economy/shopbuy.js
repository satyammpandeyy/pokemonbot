const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const { capitalize } = require('../../functions.js');
const ms = require("ms");
const mega = require("../../db/mega.js");
const gmax = require("../../db/gmax.js");
const shadow = require("../../db/shadow.js");
let levelUp = require("../../db/levelup.js");


module.exports = {
  name: "shopbuy",
  description: "Buy items from shop.",
  category: "Economy",
  args: false,
  usage: ["shopbuy <item name>"],
  cooldown: 3,
  permissions: [],
  aliases: ["shopb"],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user1 = await User.findOne({ id: message.author.id });
    if (!user1) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
    if(!args[0]) return message.channel.send(`Please Use the Correct Shopbuy Format! Usage: \`${prefix}shopbuy <page#number> <item#name>\``)

    //SHOPBUY 1
    if (args[0].toLowerCase() == '1') {
      if(!args[1]) return message.channel.send(`Please specify the item you want to buy! Usage: \`${prefix}shopbuy 1 <item#name>\``)
      if (args[1].toLowerCase() == 'candy') {
        let amount = args[2];
        if (!Number(amount)) return message.channel.send(`${amount} is not a valid Number!`);
        if (amount>15) return message.channel.send(`Error! Cannot Level Up more than 15 at a Time!`);
        amount = parseInt(amount);
        let psinfo;
        if(!user1.selected) return message.channel.send("You Dont have any selected Pokemon!");
        let pokelvl = user1.pokemons[user1.selected].level
        if(pokelvl == 100) return message.channel.send('You can Not Level up your Pokémon more than 100!')
        if(pokelvl + amount > 100) return message.channel.send('You can Not Level up your Pokémon more than 100!')
        let embed = new MessageEmbed()
        .setAuthor("Shop Buy Candy")
        .setDescription(` ${message.author.username}\n\n\n**Your Cur. Balance**: ${user1.balance} \n**After Balance**: ${user1.balance} - ${amount} X 75 = ${user1.balance-amount*75} \n**Your Cur. Pokemon Level**: ${pokelvl}\n**After Pokemon Level**: ${pokelvl} + ${amount} = ${pokelvl + amount}\n\nPlease confirm if you would like to buy ${amount} Candies for ${amount*75} . React with ✅ to Confirm or ❌ to Cancel.`)
        .setColor(0x00f9ff)
        if (user1.balance <= amount*75) return message.channel.send(`You don't have enough Balance to buy ${amount} Candies!`);
        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });
        collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
            collector.stop();
        let selected = user1.selected; 
        if(!selected)  return message.channel.send("You Dont have any selected Pokemon!");
        let poke = user1.pokemons[selected];
        let lvl = poke.level;
        poke.level = lvl + amount; 
        user1.balance = user1.balance - amount*75;
        for (var i = 0; i < levelUp.length; i++) {
        if (poke.name.toLowerCase() == levelUp[i].name.toLowerCase() && poke.level >= levelUp[i].levelup) {
        let evomsg =  `Congratulations ${message.author}! Your \`${capitalize(poke.name)}\` has just Leveled up to ${poke.level+1} and Evolved into ${capitalize(levelUp[i].evo)}`;
        poke.name = capitalize(levelUp[i].evo);
        user1.pokemons[selected] = poke;
        await user1.markModified(`pokemons`);
        await user1.save();
        return message.channel.send(evomsg)}}
        await user1.markModified(`pokemons`);
        await user1.save();
        message.reactions.removeAll();
        msg.reactions.removeAll();
        return message.channel.send(`Congratulations ${message.author}! Your \`${capitalize(poke.name)}\` has just Leveled up to ${poke.level}`)}
        else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send("Cancelled.")}});
            collector.on('end', collected => {
          return;});
      }
      else if (args[1].toLowerCase() == '30min'||args[1].toLowerCase() == '30m') {
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        if(user.balance<20){ return message.channel.send("You Don't have enough Balance to Buy XP Booster for 30 Minutes.")}
        var selected = user.selected || 0;
        var name = user.pokemons[selected].name;
        var Name = name;
        user.balance = user.balance - 20;
        await user.save();
        return message.channel.send(`Your ${name}'s XP gain will now be multiplied by 2 for the next 30 Minutes.`)
      }
      else if (args[1].toLowerCase() == '1h'||args[1].toLowerCase() == '1hour'||args[1].toLowerCase() == '1hours') {
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        if(user.balance<40){ return message.channel.send("You Don't have enough Balance to Buy XP Booster for A Hour.")}
        var selected = user.selected || 0;
        var name = user.pokemons[selected].name;
        var Name = name;
        user.balance = user.balance - 40;
        await user.save();
        return message.channel.send(`Your ${name}'s XP gain will now be multiplied by 2 for the next Hour.`)
      }
      else if (args[1].toLowerCase() == '2h'||args[1].toLowerCase() == '2hour'||args[1].toLowerCase() == '2hours') {
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        if(user.balance<70){ return message.channel.send("You Don't have enough Balance to Buy XP Booster for A Hour.")}
        var selected = user.selected || 0;
        var name = user.pokemons[selected].name;
        var Name = name;
        user.balance = user.balance - 70;
        await user.save();
        return message.channel.send(`Your ${name}'s XP gain will now be multiplied by 2 for the next 2 Hours.`)
      }
      else if (args[1].toLowerCase() == '3h'||args[1].toLowerCase() == '3hour'||args[1].toLowerCase() == '3hours') {
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        if(user.balance<90){ return message.channel.send("You Don't have enough Balance to Buy XP Booster for A Hour.")}
        var selected = user.selected || 0;
        var name = user.pokemons[selected].name;
        var Name = name;
        user.balance = user.balance - 90;
        await user.save();
        return message.channel.send(`Your ${name}'s XP gain will now be multiplied by 2 for the next 3 Hours.`)
      }
    }

    //SHOPBUY 2
    if (args[0] =="2"){
      if(!args[1]) return message.channel.send("Please specify the Item you want to Buy!")
      if(args[2].toLowerCase()=="stone") return message.channel.send("Shopbuy 2 is Under Construction!")
    }

    //SHOPBUY 3
    if (args[0] =="3"){
      return message.channel.send("INVAILD")
    }
    

    //SHOPBUY 5
    if (args[0] == "5") {
      if(!args[1]) return message.channel.send("Please specify the Item you want to Buy!")
        if (args[1].toLowerCase() == "mega") {
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        var selected = user.selected || 0;
        var name = user.pokemons[selected].name;
        var Name = name;

        const mg = mega.find(e => e.name.toLowerCase().endsWith(name.toLowerCase()));
        const megay = mega.find(e => e.name.toLowerCase().endsWith("-y") && e.name.toLowerCase().startsWith(name.toLowerCase()));
        const megax = mega.find(e => e.name.toLowerCase().endsWith("-x") && e.name.toLowerCase().startsWith(name.toLowerCase()));

        if (user.pokemons[selected].name.startsWith("mega-")) return message.channel.send(`Your selected pokemon is already a mega.`);
        if (!mg && !megay && !megax) return message.channel.send("This Pokemon doesn't have any Mega form.");
        if (user.balance < 1000) return message.channel.send('You must need 1000 ツ to mega your Pokemon.');
        else {
        if (mg && (message.content.toLowerCase().endsWith("mega") || message.content.toLowerCase().endsWith("mg"))) {
            name = `mega-${capitalize(mg.name)}`}
        else if (megay && args[2].toLowerCase() == "y") {
            name = `mega-${megay.name.toLowerCase().replace("-x", "-y")}`.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()).replace(/ +/g, "-")}
        else if (megax && args[2].toLowerCase() == "x") {
            name = `mega-${megay.name.toLowerCase().replace("-y", "-x")}`.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()).replace(/ +/g, "-")}
        else {
        if (message.content.endsWith("mega") || message.content.endsWith("mg")) {
              return message.reply(`This pokemon can either become Mega ${capitalize(name.toLowerCase().replace("mega-", "").replace(/-+/g, " "))} X or Mega ${capitalize(name.toLowerCase().replace("mega-", "").replace(/-+/g, " "))} Y.`)}
        else {
              return message.reply(`This pokemon can only become Mega ${capitalize(name.toLowerCase().replace("mega-", "").replace(/-+/g, " "))}.`)
            }
          }
        user.balance = user.balance - 1000;
        user.pokemons[selected].name = name;
        await user.markModified('pokemons');
        await user.save();
        return message.channel.send(`Congratulations ${message.author}! Your \`${capitalize(Name).replace(/-+/g, " ")}\` has just evolved into \`${capitalize(name).replace(/-+/g, " ")}\``)
        }
      }
    }

    //SHOPBUY 6
    if (args[0].toLowerCase() == "6") {
      if(!args[1]) return message.channel.send("Please specify the Item you want to Buy!")
      if (args[1].toLowerCase() == 'redeem') {
        let amount = args[2];
        if (!args[2]) return message.channel.send(`Unexpected Amount received! It should be in the form of \`${prefix}shopbuy 6 redeem <amount>\``);
        if (!Number(amount)) return message.channel.send(`${amount} is not a Valid Number! Please try again in the Form of \`${prefix}shopbuy 6 redeem <amount>\``);
        if (amount>15) return message.channel.send(`Error! Cannot Buy more then 15 Redeems at a Time!`);
        amount = parseInt(amount);
        if (user1.shards < amount*200) return message.channel.send(`You don't have enough Shards (${amount*200}) to Buy ${amount} Redeems!`);
        let embed = new MessageEmbed()
        .setAuthor("Shop Buy Redeem")
        .setDescription(`${message.author.username}\n\n\n**Your Cur. Shards**: ${user1.shards} Sh\n**After Shards**: ${user1.shards} - ${amount} X 200 = ${user1.shards-amount*200} Sh\n**Your Cur. Redeems**: ${user1.redeems}\n**After Redeems**: ${user1.redeems} + ${amount} = ${user1.redeems + amount}\n\nPlease confirm if you would like to buy **${amount} Redeem(s)** for **${amount*200} Shards**! React with ✅ to Confirm or ❌ to Cancel.`)
        .setColor(0x00f9ff)

        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });
        collector.on('collect', async (reaction, user) => {
            if (reaction.emoji.name === "✅") {
            collector.stop();
            user1.redeems = user1.redeems + amount;
            user1.shards = user1.shards - amount*200;
            await user1.save();
            message.reactions.removeAll();
            msg.reactions.removeAll();
            if(amount=="1") return message.channel.send(`Successfully bought ${amount} Redeem.`)
            else if((amount>"1")){return message.channel.send(`Successfully bought ${amount} Redeems.`)}}
            else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send("Cancelled.")}});
        collector.on('end', collected => {
          return;});
      }
      if (args[1].toLowerCase() == '3sh') {
        if (user1.balance < 5000) return message.channel.send("You don't have enough Balance (5000 cc) to Exchange for 3 Shards.");
        let embed = new MessageEmbed()
        .setAuthor("Shop Exchange Shards")
        .setDescription(`${message.author.username}\n\n**Your Shards**: ${user1.shards}\n**Your Balance**: ${user1.balance}\n\nPlease confirm if you would like to buy 3 Shards for 5000 Ricks. React with ✅ to Confirm or ❌ to Cancel.`)
        .setColor(0x00f9ff)
        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });
        collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
            collector.stop();
            user1.shards = user1.shards + 3;
            user1.balance = user1.balance - 5000;
            await user1.save();
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send(`Successfully Exchanged for 3 Shards.`)}
        else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send("Cancelled.")}});
        collector.on('end', collected => {
          return;});
      }
      if (args[1].toLowerCase() == '10sh') {
        if (user1.balance < 10000) return message.channel.send("You don't have enough Balance (10000 cc)to buy 10 Shards.");
        let embed = new MessageEmbed()
        .setAuthor("Shop Exchange Shards")
        .setDescription(`Hello ${message.author.username}\n\n**Your Shards**: ${user1.shards}\n**Your Balance**: ${user1.balance}\n\nPlease confirm if you would like to buy 10 Shards for 10000 Ricks. React with ✅ to Confirm or ❌ to Cancel.`)
        .setColor(0x00f9ff)
        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });
        collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
            collector.stop();
            user1.shards = user1.shards + 10;
            user1.balance = user1.balance - 10000;
            await user1.save();
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send(`Successfully Exchanged for 10 Shards.`)}
        else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send("Cancelled.")}});
        collector.on('end', collected => {
          return;});
      }
      if (args[1].toLowerCase() == '25sh') {
        if (user1.balance < 20000) return message.channel.send("You don't have enough Balance (20000 cc) to buy 25 Shards.");
        let embed = new MessageEmbed()
        .setAuthor("Shop Exchange Shards")
        .setDescription(`${message.author.username}\n\n**Your Shards**: ${user1.shards}\n**Your Balance**: ${user1.balance}\n\nPlease confirm if you would like to buy 25 Shards for 20000 Ricks. React with ✅ to Confirm or ❌ to Cancel.`)
        .setColor(0x00f9ff)
        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });
        collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
            collector.stop();
            user1.shards = user1.shards + 25;
            user1.balance = user1.balance - 20000;
            await user1.save();
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send(`Successfully Exchanged for 25 Shards.`)} 
        else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send("Cancelled.")}});
        collector.on('end', collected => {
          return;});
      }
      if (args[1].toLowerCase() == '80sh') {
        if (user1.balance <= 50000) return message.channel.send("You don't have enough Balance (50000 cc) to buy 80 Shards.");
        let embed = new MessageEmbed()
        .setAuthor("Shop Exchange Shards")
        .setDescription(`${message.author.username}\n\n**Your Shards**: ${user1.shards}\n**Your Balance**: ${user1.balance}\n\nPlease confirm if you would like to buy 80 Shards for 50000 Ricks. React with ✅ to Confirm or ❌ to Cancel.`)
        .setColor(0x00f9ff)
        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });
        collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
            collector.stop();
            user1.shards = user1.shards + 80;
            user1.balance = user1.balance - 50000;
            await user1.save();
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send(`Successfully Exchanged for 80 Shards.`)}
        else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send("Cancelled.")}});
        collector.on('end', collected => {
          return;});
      }
      if (args[1].toLowerCase() == '200sh') {        
        if (user1.balance <= 100000) return message.channel.send("You don't have enough Balance (100000 craft coins) to buy 200 Shards.");
        let embed = new MessageEmbed()
        .setAuthor("Shop Exchange Shards")
        .setDescription(`${message.author.username}\n\n**Your Shards**: ${user1.shards}\n**Your Balance**: ${user1.balance}\n\nPlease confirm if you would like to buy 200 Shards for 100000 Ricks. React with ✅ to Confirm or ❌ to Cancel.`)
        .setColor(0x00f9ff)
        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });
        collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
            collector.stop();
            user1.shards = user1.shards + 200;
            user1.balance = user1.balance - 100000;
            await user1.save();
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send(`Successfully Exchanged for 200 Shards.`)}  
        else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send("Cancelled.")}});
        collector.on('end', collected => {
          return;});
      }
    }

    //SHOPBUY 7
        if (args[0].toLowerCase() == '7') {
      if(!args[1]) return message.channel.send("Please specify the Item you want to Buy!")
      if (args[1].toLowerCase() == 'redeem') {
        let amount = args[2];
        if (!Number(amount)) return message.channel.send(`Amount is not a valid Number! It should be in the form of \`${prefix}shopbuy 7 <amount>\``);
        if (amount>15) return message.channel.send(`Error! Cannot buy more than 15 Redeems at a Time!`);
        amount = parseInt(amount);
        let embed = new MessageEmbed()
        .setAuthor("Upvotes Shopbuy")
        .setDescription(`${message.author.username}\n\n**Your Cur. Upvotes**: ${user1.upvotes}\n**After Upvotes**: ${user1.upvotes} - ${amount*30} = ${user1.upvotes-amount*30}\n**Your Cur. Redeems**: ${user1.redeems}\n**After Redeems**: ${user1.redeems} + ${amount} = ${user1.redeems + amount}\n\nPlease confirm if you would like to buy ${amount} Redeems for ${amount*30} Upvotes. React with ✅ to Confirm or ❌ to Cancel.`)
        .setColor(0x00f9ff)
        if (user1.upvotes < amount*30) return message.channel.send(`You don't have enough Upvotes (${30*amount}) to buy ${amount} Redeems!`);
        let msg = await message.channel.send(embed);
        await msg.react("✅");
        msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000 });
        collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === "✅") {
            collector.stop();
            user1.upvotes = user1.upvotes - amount*30;
            user1.redeems = user1.redeems + amount;
            await user1.save();
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send(`Successfully bought ${amount} Redeems!`)}
        else if (reaction.emoji.name === "❌") {
            collector.stop("aborted");
            message.reactions.removeAll();
            msg.reactions.removeAll();
            return message.channel.send("Cancelled.")}});
        collector.on('end', collected => {
          return;});
      }
    }

    //SHOPBUY 8

    if (args[0] == "8"){
      if(!args[1]) return message.channel.send("Please specify the Item you want to Buy!")
      
    }

    //SHOPBUY 10
    if (args[0] == "10") {
      if(!args[1]) return message.channel.send("Please specify the Item you want to Buy!")
        if (args[1].toLowerCase()==="form"){
        if (args[2].toLowerCase() === "gmax" || args[2].toLowerCase() === "gigantamax") {
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        var selected = user.selected || 0;
        var name = user.pokemons[selected].name;
        var Name = name;

        const gx = gmax.find(e => e.name.toLowerCase() == Name.toLowerCase());

        if (user.pokemons[selected].name.startsWith("gigantamax-") || user.pokemons[selected].name.startsWith("gmax-")) return message.channel.send(`Your selected pokemon is already Gigantamax Evolved.`);
        if (!gx) return message.channel.send("This Pokemon doesn't have any Gigantamax Transformation Form.");
        if (user.balance < 25000) return message.channel.send('You must need 25000  to Gmax your Pokemon.');
        else {
        if (gx && (message.content.toLowerCase().endsWith("gmax") || message.content.toLowerCase().endsWith("gigantamax"))) {
        name = `gigantamax-${capitalize(gx.name)}`}
        user.balance = user.balance - 25000;
        
        user.pokemons[selected].name = name;

        await user.markModified('pokemons');
        await user.save();
        return message.channel.send(`Congratulations ${message.author}! Your \`${capitalize(Name).replace(/-+/g, " ")}\` has just transformed into \`${capitalize(name).replace(/-+/g, " ")}\``)
        }
      }
    }
    }
        //SHOPBUY 11
    if (args[0] == "11") {
      if(args[2]) return;
      if(!args[1]) return message.channel.send("Please specify the Item you want to Buy!")
        if (args[1].toLowerCase() == "shadow" || args[1].toLowerCase() == "shad") {
        let user = await User.findOne({ id: message.author.id });
        if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        var selected = user.selected || 0;
        var name = user.pokemons[selected].name;
        var Name = name;

        const gm = shadow.find(e => e.name.toLowerCase().endsWith(name.toLowerCase()));

        if (user.pokemons[selected].name.startsWith("shadow-") || user.pokemons[selected].name.startsWith("shad-")) return message.channel.send(`Your selected pokemon is already Shadow Transformed.`);
        if (!gm) return message.channel.send("This Pokemon doesn't have any Shadow Transformation Form.");
        if (user.balance < 10000) return message.channel.send('You must need 10000 to Shadow Transform your Pokemon.');
        else {
        if (gm && (message.content.toLowerCase().endsWith("shadow") || message.content.toLowerCase().endsWith("shad"))) {
        name = `shadow-${capitalize(gm.name)}`}
        user.balance = user.balance - 10000;
        user.pokemons[selected].name = name;
        await user.markModified('pokemons');
        await user.save();
        return message.channel.send(`Congratulations ${message.author}! Your \`${capitalize(Name).replace(/-+/g, " ")}\` has just transformed into \`${capitalize(name).replace(/-+/g, " ")}\``)
        }
      }
    }
  }
} 