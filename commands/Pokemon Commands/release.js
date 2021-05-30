const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const ms = require("ms");

module.exports = {
  name: "release",
  description: "Release a pokemon back into the wild.\n(Confirmation Needed)",
  category: "Pokemon Commands",
  args: false,
  usage: ["release <pokemonID>"],
  cooldown: 3,
  permissions: [],
  aliases: [""],
  execute: async (client, message, args, prefix, guild, color, channel) => {
    let user = await User.findOne({ id: message.author.id });
    if (!user || !user.pokemons[0]) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
    if (user.pokemons.length == 1) return message.channel.send("You cant release your only pokemon!")
    if (user.pokemons.length == 0) return message.channel.send("You dont have any pokemon to release.")
    if (!args[0]) return message.channel.send(`Unexpected Pokemon#id provided. It should be in the form of \`${prefix}release <pokemon#id>\``);
    if (args[0].toLowerCase() === "latest") args[0] = parseInt(user.pokemons.length);
    if (args[0].toLowerCase() === "l") args[0] = parseInt(user.pokemons.length);
    if (args[0].toLowerCase() !== "all" && isNaN(args[0])) return message.channel.send(`Unexpected Pokemon#id provided. It should be in the form of \`${prefix}release <pokemon#id>\``);
    if (args[0].toLowerCase() == "all") {
      let e = message,
        a = user,
        s = a.pokemons.map((r, i) => { r.num = i + 1; return r }),
        embed2 = new MessageEmbed()
          .setDescription(`Are you sure you want to release All of your Pokémons? \n\n**Note: Confiriming will reduce your Total Pokémon's (${s.length}) count to Zero** \n\nReact with ✅ to Confirm or ❌ to Abort.`)
          .setColor("#fff200")

      let msg = await message.channel.send(embed2);
      await msg.react("✅");
      msg.react("❌");
      const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 60000 });

      collector.on('collect', async (reaction, userx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();

          poke = user.pokemons.shift()
          user.pokemons = []
          user.pokemons.push(poke)
          user.balance = user.balance + 10 * s.length-10;
          user.released = user.released + s.length -1
          await user.save();
          message.reactions.removeAll();
          msg.reactions.removeAll();
          if(s.length==2){return message.channel.send(`Successfully released ${s.length-1} Pokémon. You received ${s.length * 10-10} cc.`)}
          else if(s.length>1){return message.channel.send(`Successfully released ${s.length-1} Pokémons. You received ${s.length * 10-10}cc .`)};

        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send("Cancelled.")
        }
      });

      collector.on('end', collected => {
        return;
      });
    }
    if (!user.pokemons[parseInt(args[0]) - 1]) return; //message.channel.send("You don't have a Pokémon with this number!");

    var num, name, embed;

    let pokes = []

    num = parseInt(args[0]) - 1;
    name = user.pokemons[num].name;
    if (user.pokemons[num].fav) return message.channel.send("You can't Release your Favorited Pokemons!")


    if (args.length === 1 && parseInt(args[0])) {
      if(parseInt(args[0])-1>user.pokemons.length) return message.channel.send("no")
      let embed1 = new MessageEmbed()
        .addField("Are you sure you want to release the following Pokemons?", `\`Level ${user.pokemons[num].level} ${user.pokemons[num].shiny ? "⭐ " : ""}${name}\`\n\nReact with ✅ to Confirm or ❌ to Abort.`)
        .setColor("#fff200")

      let msg = await message.channel.send(embed1);
      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 60000 });
      collector.on('collect', async (reaction, userx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          await user.pokemons.splice(num, 1);
          await user.markModified('pokemons');
          user.released = user.released + 1;
          user.balance = user.balance + 10;
          await user.save();
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send(`Successfully released. You received 10 cc.`);

        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          message.reactions.removeAll();
          msg.reactions.removeAll();
          return message.channel.send("Cancelled.")
        }
      });

      collector.on('end', collected => {
        return;
      });
    }
    else {
      let embed5 = new MessageEmbed()
        .addField("Are you sure you want to release the following Pokemons?", `\`Level\`\n\nReact with ✅ to Confirm or ❌ to Abort.`)
        .setColor("#fff200")


      let msg = await message.channel.send(embed5);
      await msg.react("✅");
      msg.react("❌");

      const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 60000 });
      collector.on('collect', async (reaction, userx) => {
        if (reaction.emoji.name === "✅") {
          collector.stop();
          for (var x = 0; x < args.length; x++) {
            if (!isNaN(args[x])) {
              num = parseInt(args[x]) - 1;
              name = user.pokemons[num].name;
              if(!user.pokemons[num].fav) pokes.push(user.pokemons[num])
              // if (user.pokemons[num].fav) return message.channel.send("You can't Release your Favorited Pokemons!");
            }
          }

          for (var z = 0; z < pokes.length; z++) {
            pokes[z]
            if (user.pokemons.find(r => r === pokes[z])) {
              // console.log(pokes[z])
              let index = user.pokemons.indexOf(pokes[z]);
              if (index > -1) {
                await user.pokemons.splice(index, 1);
                await user.markModified("pokemons");
                user.released = user.released + 1;
                user.balance = user.balance + 10;
                await user.save();
                message.reactions.removeAll();
                msg.reactions.removeAll();
              }
            }
          }
          return message.channel.send(`Successfully released ${pokes.length} Pokémon(s). You received ${10 * pokes.length} cc.`)

        } else if (reaction.emoji.name === "❌") {
          collector.stop("aborted");
          return message.channel.send("Cancelled.")
        }
      });

      collector.on('end', collected => {
        return;
      });
    }
  }
}



 /*for (var z = 0; z < user.pokemons.length; z++) {
                user.pokemons[z]
                if (user.pokemons.find(r => r === pokes[z])) {
                    console.log(user.pokemons[z])
                    let index = user.pokemons.indexOf(user.pokemons[z]);
                    if (index > -1) {
                        await user.pokemons.splice(index, 1);
                        await user.markModified("pokemons");
                        user.released = user.released + 1 * pokes.length;
                        user.balance = user.balance + 10 * pokes.length;
                        await user.save();
                    }

                }
            } */

/*if (args[0] == "all") {
            let embed2 = new MessageEmbed()
                .setDescription("Are you sure you want to release All of your Pokémons? \n\n**Note: Confiriming will reduce your Total Pokémons' count to zero** \n\nReact with ✅ to Confirm or ❌ to Abort.")
                .setColor("#fff200")

            let msg = await message.channel.send(embed2);
            await msg.react("✅");
            msg.react("❌");
            const collector = msg.createReactionCollector((reaction, userx) => ['✅', '❌'].includes(reaction.emoji.name) && userx.id === message.author.id, { time: 60000 });

            collector.on('collect', async (reaction, userx) => {
                if (reaction.emoji.name === "✅") {
                    collector.stop();
                    await user.pokemons.splice(num, 1);
                    await user.markModified('pokemons');
                    user.balance = user.balance + 10 * user.pokemon.length;
                    await user.save();
                    message.reactions.removeAll();
                    msg.reactions.removeAll();
                    return message.channel.send(`Successfully released ${user.pokemons.length} Pokémon. You received 10 ツ.`);

                } else if (reaction.emoji.name === "❌") {
                    collector.stop("aborted");
                    message.reactions.removeAll();
                    msg.reactions.removeAll();
                    return message.channel.send("Ok Aborted.")
                }
            });

            collector.on('end', collected => {
                return;
            });
        } */