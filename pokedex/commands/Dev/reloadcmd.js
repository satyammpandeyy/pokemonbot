const Discord = require('discord.js')

   module.exports = {
  name: "reloadcmd",
  description: "reloads the command",
  category: "Dev",
  args: true,
  usage: ["rc <code>"],
  cooldown: 3,
  permissions: [],
  aliases: ["rc"],
   execute: async(client, message, args) => {
        if(!args[0]) return message.channel.send(`Specify a command name`);
        let cmd = args.shift().toLowerCase();
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

        if(!command) return message.channel.send(`No command named that`);
        delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];
        client.commands.delete(command.name);

        client.commands.set(command.name, require(`../${command.category}/${command.name}.js`));

        return message.channel.send(`Reloaded command: ***${command.name}***.`)
    }
}