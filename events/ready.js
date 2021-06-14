const axios = require('axios');
const express = require("express");
const app = express();
const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const { get } = require('request-promise-native');
const User = require('../models/user.js');
const Guild = require('../models/guild.js');
const Spawn = require('../models/spawn.js');
const Auction = require("../models/auctions.js");
const ms = require("ms");
const mongoose = require("mongoose");


module.exports = async client => {
    mongoose.connect(`mongodb://admin:7QI8M1O6M3MRRKVH@n7.danbot.host:1563/?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true }).then(async mon => {
        await console.log(`Connected to the database!`);
    }).catch((err) => {
        console.log("Unable to connect to the Mongodb Database. Error:" + err, "error")
    });

    await console.log(client.table.toString() + "\n" + client.table2.toString());
    console.log(`${client.user.tag} Has Successfully Connected To Discord API!`
        + `\n-----------------------------------------\n`
        + `> Users: ${client.users.cache.size}\n`
        + `> Channels: ${client.channels.cache.size}\n`
        + `> Servers: ${client.guilds.cache.size}`
    );


    let acts = [
        { name: "Your Commands ", type: "LISTENING" },
        { name: "With You Brain", type: "PLAYING" }
    ],
        act = 0;
    setInterval(() => {
        //client.user.setPresence()
    }, 15000)

    // let activities =[
    //   `Death | Vian | Leo`,
    //   `Your Commands`,
    // ];
    //  let i = 0
    //  setInterval(()=> client.user.setActivity(`p!help | ${activities[Math.floor(i++ % activities.lenght)]}`,{ type: "LISTENING"}), 15000);

    let i = 0;
    let activities = ["With Pokémons", "default prefix is  ."]
    setInterval(() =>
        client.user.setActivity(`${activities[Math.floor(i++ % activities.length)]}`, { type: "PLAYING" }), 30000);





    // let activity = 1;  
    // setInterval(() => {
    //   client.user.setPresence({ status: 'online', activity: activities[0] });
    //   activities[2] = { name: `Vian | Death`, type: 'LISTENING' }; 
    //   activities[3] = { name: `p!help @PokéMania`, type: 'LISTENING' }; 
    //   if (activity > 3) activity = 0;
    //   client.user.setActivity(activities[activity].name)
    //   activity++;
    // }, 30000); 

    // client.user.setPresence({ activity: { name: `Your Commands | p!help @PokéMania`, type: "LISTENING" }, status: "online" }).catch(console.error);

    let spawns = await Spawn.find({});
    if (!spawns) return;
    spawns.forEach(async r => {
        if (r.time < Date.now()) {
            r.pokemon = [];
            r.time = 0;
            r.hcool = false;
            await r.save()
        }
    })

    // Website
    app.get("/", (request, response) => {
        response.status(200).send("OK");
    });

    const listener = app.listen(process.env.PORT, () => {
        console.log(`Your app is listening on port ${listener.address().port}`);
    });


    //Auction
    let auction = await Auction.find({});
    setInterval(async () => {
        auction = await Auction.find({});
        auction.map(async r => {
            //console.log(Date.now(), r.time);
            if (Date.now() >= r.time) {
                let member = client.users.cache.get(r.id);
                if (!member) return await Auction.findOneAndDelete({ _id: r._id });

                let user = client.users.cache.get(r.user)
                if (!user) {
                    member.send(`Your auction has been failed due to some technical reasons!`);
                    return await Auction.findOneAndDelete({ _id: r._id });
                }
                let mem = await User.findOne({id: r.id})
                let userDB = await User.findOne({ id: user.id });
                if (!userDB) {
                    member.send(`Your auction has been failed due to some technical reasons!`);
                    return await Auction.findOneAndDelete({ _id: r._id });
                }
               
                mem.balance = mem.balance + r.bid
                userDB.pokemons.push(r.pokemon);
                await userDB.markModified("pokemons");
                await userDB.save();
                await mem.save()
                user.send(`You  have won auction of ${r.pokemon.name}`)
                await Auction.findOneAndDelete({ _id: r._id });
                member.send(`Your auction of ${r.pokemon.name} has ended with the final bid of ${r.bid} R`);
            }

            /*if (Date.now() < r.time) {
                let x = await Auction.findOne({ _id: r._id });
                //console.log(x.time, Date.now(), x.time - Date.now())
                x.time = r.time - Date.now();
                await x.save();
            } */
        })
    }, 1000)
    //return console.log(auction.map(r => `${r.pokemon.name}: ${r.time}`).join("\n"))
}
