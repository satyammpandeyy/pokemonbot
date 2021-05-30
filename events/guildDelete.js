const { MessageEmbed } = require("discord.js");
const { log } = require("../functions");

module.exports = async (client, guild, channel, color) => {
    let embed = {
        author: {
            name: "-1 Server!",
            icon_url: "https://cdn.discordapp.com/emojis/827098817417052191.png"
        },
        title: `${client.user.username} has been removed from  \"${guild.name}\"\n${client.user.username}'s guildCount is now ${client.guilds.cache.size} Servers`,
        thumbnail:{
            url: guild.iconURL()
        },
        fields: [
            {
                name: "Basic Information",
                value: `Total MemberCount: ${guild.memberCount}\n` +
                    `Owner: <@${guild.owner.id}>/${guild.owner.user.tag}/${guild.owner.id}\n` +
                    `Emoji Count: ${guild.emojis.cache.size}\n` +
                    `Region: ${guild.region}\n` +
                    `Role Count: ${guild.roles.cache.size}`
            },
            {
                name: `Other Information`,
                value: `Partnered: ${guild.partnered}\n` +
                    `Verified: ${guild.verified}`
            }
        ],
        footer: {
            icon_url: client.user.displayAvatarURL(),
            text: `Guild ID: ${guild.id}\nOwner ID: ${guild.owner.id}`
        },
        color: 0xd7342a
    }
    log(embed, "guild");
}