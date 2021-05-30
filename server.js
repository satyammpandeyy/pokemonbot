process.setMaxListeners(0);
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.js");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const { get } = require('request-promise-native');
const Pokemon = require('./Classes/Pokemon.js');
const { classToPlain } = require("class-transformer");
const ascii = require("ascii-table");

client.table = new ascii("Commands");
client.table2 = new ascii("Events");
client.commands = new Discord.Collection();
client.config = config;
client.xyz = [];
let Guild = require('./models/guild.js');
let User = require("./models/user.js");
let levelUp = require("./db/levelup.js");
let Spawn = require("./models/spawn.js");
let spawnCooldown = new Set();
let xpCooldown = new Set();
let color = 0xb6ffdb;
let channel = client.channels.cache.get(client.config.channel)

client.login(client.config.token);

readdirSync('./commands').forEach(dir => {
  if (dir.toLowerCase() == "ignore") return;
  const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
  for (const file of commands) {
    const command = require(`./commands/${dir}/${file}`)
    if (!command.name) return client.table.addRow(file, `❌ -> missing command.name!`);
    client.commands.set(command.name, command);
    client.table.addRow(file, `✅`)
  }
})

let events = readdirSync("./events/");
for (const event of events) {
  const file = require(`./events/${event}`);
  client.on(event.split(".")[0], (...args) => file(client, ...args));
  client.table2.addRow(event, "✅")
}

xyz = [];
require('./index.js')