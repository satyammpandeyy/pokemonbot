module.exports = {
  name: "restart",
  category: "special",
  description: "Info about this command",
  usage: "how it can be used. for example: [usertag] or (USERTAG)",
  aliases: ["rt"],
  run: async(client, message, args) => {
     await message.channel.send("doing process exit bot should be fixied and normal in 4-5 minutes please wait...")
     await console.log(`${message.author.tag} used the restart command`)
     return process.exit(1);
  }
}
