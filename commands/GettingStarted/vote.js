const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../../models/user.js');
const Guild = require('../../models/guild.js');
const Daily = require('../../models/daily.js');
const ms = require("ms");
const rewards = [
    {
        streak: 0, rewards: [/* Common */ 100, 100, 100, 100, 125, 125, 125, 125, /* Uncommon */ 200, 200],
        common: ["• 100 Credits", "• 125 Credits"], uncommon: ["• 200 Credits"], rare: [], legendary: []
    },
    {
        streak: 1, rewards: [/* Common */ 100, 100, 100, 100, 125, 125, 125, 125, /* Uncommon */ 200, 200],
        common: ["• 100 Credits", "• 125 Credits"], uncommon: ["• 200 Credits"], rare: [], legendary: []
    },
    {
        streak: 2, rewards: [/* Common */ 100, 100, 100, 100, 125, 125, 125, 125, /* Uncommon */ 200, 200],
        common: ["• 100 Credits", "• 125 Credits"], uncommon: ["• 200 Credits"], rare: [], legendary: []
    },
    {
        streak: 3, rewards: [/* Common */ 100, 100, 100, 100, 125, 125, 125, 125, /* Uncommon */ 200, 200],
        common: ["• 100 Credits", "• 125 Credits"], uncommon: ["• 200 Credits"], rare: [], legendary: []
    },
    {
        streak: 4, rewards: [/* Common */ 200, 200, 200, 200, 225, 225, 225, 225, /* Uncommon */ 400, 400],
        common: ["• 200 Credits", "• 225 Credits"], uncommon: ["• 400 Credits"], rare: [], legendary: []
    },
    {
        streak: 5, rewards: [/* Common */ 225, 225, 225, 225, 250, 250, 250, 250, /* Uncommon */ 450, 450, /* Rare */ 500],
        common: ["• 225 Credits", "• 250 Credits"], uncommon: ["• 450 Credits"], rare: ["• 500 Credits"], legendary: []
    },
    {
        streak: 6, rewards: [/* Common */ 250, 250, 250, 250, 300, 300, 300, 300, /* Uncommon */ 500, 500, /* Rare */ 750],
        common: ["• 250 Credits", "• 300 Credits"], uncommon: ["• 500 Credits"], rare: ["• 750 Credits"], legendary: []
    },
    {
        streak: 7, rewards: [/* Common */ 250, 250, 250, 250, 250, 400, 400, 400, 400, 400, /* Uncommon */ 500, 500, 500, /* Rare */ 1000, 1000, /* Legendary */ 1],
        common: ["• 250 Credits", "• 400 Credits"], uncommon: ["• 500 Credits"], rare: ["• 1000 Credits"], legendary: ["• 1 Redeem"]
    },
]

module.exports = {
    name: "vote",
    description: "Get credit rewards every day for just clicking a button!",
    category: "GettingStarted",
    args: false,
    usage: ["vote"],
    cooldown: 3,
    permissions: [],
    aliases: ["daily"],

    async execute(client, message, args, prefix, guild, color, channel) {
        
        let user = await User.findOne({ id: message.author.id });
        if (!user) return message.channel.send("You need to pick a starter pokémon using the \`" + prefix + "start\` command before using this command!");
        if (!user.streak) user.streak = 0; await user.save();
        let daily = await Daily.findOne({ id: message.author.id });
        if (!daily) await new Daily({ id: message.author.id }).save();
        daily = await Daily.findOne({ id: message.author.id });

        let streak = "<a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> ";
        if (user.streak == 1) streak = "<a:cc:851711450682621986> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198>";
        if (user.streak == 2) streak = "<a:cc:851711450682621986> <a:cc:851711450682621986><a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198>";
        if (user.streak == 3) streak = "<a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986><a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198>";
        if (user.streak == 4) streak = "<a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198> <a:bsdk:851712017503879198>";
        if (user.streak == 5) streak = "<a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986><a:bsdk:851712017503879198> <a:bsdk:851712017503879198> ";
        if (user.streak == 6) streak = "<a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986>  <a:cc:851711450682621986> <a:bsdk:851712017503879198>";
        if (user.streak > 6) streak = "<a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986> <a:cc:851711450682621986>";
        streak = streak + "\nCurrent Voting Streak: " + user.streak + " Day(s)!\n\n**Rewards**"

        let amount = [250, 250, 250, 250, 250, 400, 400];
        if (user.streak <= 7) amount = rewards.find(r => r.streak == user.streak);
        if (user.streak > 6) amount = rewards.find(r => r.streak == 7);
        let stuffs = "";
        amount.common[0] ? stuffs = stuffs + amount.common.join("\n") : "";
        amount.uncommon[0] ? stuffs = stuffs + "\n**Uncommon Crate**\n" + amount.uncommon.join("\n") : "";
        amount.rare[0] ? stuffs = stuffs + "\n**Rare Crate**\n" + amount.rare.join("\n") : "";
        amount.legendary[0] ? stuffs = stuffs + "\n**Legendary Crate**\n" + amount.legendary.join("\n") : "";

        let embed = new MessageEmbed()
            .setAuthor("Voting Rewards")
            .setDescription(`**Vote for the bot up to every 12 hours to gain rewards! https://top.gg/bot/840579144525021185/vote** Voting for the bot multiple days in a row will increase your streak and give you a chance at better rewards!\n\n**You haven't voted yet today! Vote Now! https://top.gg/bot/840579144525021185/vote**`)
            
       
            .setColor("#00feff")
            .setFooter("Once your vote is received, type .vote  claim")

        let timeleft = ms(daily.time - Date.now());
        timeleft = timeleft.replace("s", " second(s)");
        timeleft = timeleft.replace("m", " minute(s)");
        timeleft = timeleft.replace("h", " hour(s)");

        if (daily.time >= Date.now()) return message.channel.send(embed.setDescription(`**[Vote for the bot up to every 12 hours to gain rewards!](https://google.com)** Voting for the bot multiple days in a row will increase your streak and give you a chance at better rewards!\n\n**You've already voted today, come back in ${timeleft} to vote!**`))
        amount = amount.rewards
        amount = amount[Math.floor(Math.random() * amount.length)];

        if (!args[0]) return message.channel.send(embed);
        else if (args[0].toLowerCase() === "claim") {
            const options = {
                url: `https://top.gg/api/bots/${client.user.id}/check?userId=${message.author.id}`,
                json: true,
                headers: {
                    'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0MDU3OTE0NDUyNTAyMTE4NSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjIzOTQxNjM5fQ.i253uh6oI11n1NONhav08Pv1cdyDryOkKyF891H06g4`
                }
            };
            let t = await get(options);
            t.voted = 1
            if (t.voted == 1) {
                if (amount == 1) {
                    user.redeems = user.redeems + 1;
                    await user.save();
                    daily.time = Date.now() + 43200000;
                    await daily.save();
                    return message.reply(`You received a Redeem by daily command!`);
                } else {
                    user.balance = user.balance + amount;
                    await user.save();
                    daily.time = Date.now() + 43200000;
                    await daily.save();
                    return message.reply(`You received ${amount} cc by daily command!`);
                }
            } else {
                return message.reply(`You haven't voted yet **[Vote Now To Claim Rewards](https://top.gg/bot/${client.user.Discord}/vote)**`)
            }
        }
    }
}
