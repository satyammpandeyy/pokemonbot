const User = require('../../models/user.js')
const Discord = require('discord.js')
const client = require('../../index.js')

module.exports = {
  name: "stats",
  description: "Returns bot statistics and informations.",

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */

  run: async (client, interaction, args, color, prefix) => {
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;

    let botLatency = new Date() - interaction.createdAt
    let d = await User.find()

    let devs = [], a = []
    client.config.owners.map(r => devs.push(r))
    // devs.forEach(async (x) => {
    //   let y = await client.users.fetch(x)
    //   a.push(`\`${y.tag}\``)
    // })

    let embed = new Discord.MessageEmbed()
      .setAuthor(`${client.user.username} Statistics`)
      .setDescription(`[Official Website](https://pokesoul.xyz) | [Invite Bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=2148002881&scope=bot) | [Support Server](https://discord.gg/j8nyvXAART)`)
      // .addField('Author/Developers', devs.map(async (x) => {
      //   let y = await client.users.fetch(x)
      //   return(`\`${y.tag}\``)
      // }).join(', '))
      .addField("📚 Library", `\`Discord Js ${Discord.version}\``)
      .addFields(
        {
          name: "📡 Total Guilds",
          value: `\`${client.guilds.cache.size}\``,
          inline: true
        },
        {
          name: "👥 Total Trainers",
          value: `\`${d.length}\``,
          inline: true
        },
        // {
        //   name: "🖥️ Total Channels: ",
        //   value: `\`${client.channels.cache.size}\``,
        //   inline: true
        // }
      )
      .addField("⏱️ Uptime", `\`${days}d ${hours}h ${minutes}m ${seconds}s\``, true)
      .addField("🏓 Average Ping Latency", `\`${Math.round(botLatency)}ms\``, true)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(color)
      .setFooter(`Executed by ${interaction.user.username}`)
      .setTimestamp()

    return interaction.followUp({ embeds: [embed] });
  },
}

