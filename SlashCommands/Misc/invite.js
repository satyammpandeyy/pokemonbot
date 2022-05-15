const { MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js');


module.exports = {
    name: "invite",
    description: "Returns Bot's Invite Link.",

    run: async (client, interaction, args) => {

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Invite`)
            .setDescription(`**Invite The Bot**\n[Click Here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot).\n**Support Server**\n[Click Here](https://discord.gg/N9sPtTQ48a).`)
            .setColor('RANDOM')
            .setThumbnail(client.user.displayAvatarURL())

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Support Server")
                    .setStyle("LINK")
                    .setURL('https://discord.gg/N9sPtTQ48a'),
                new MessageButton()
                    .setLabel("Invite Link")
                    .setStyle("LINK")
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
            )



        return interaction.followUp({ embeds: [embed], components: [row] });
    }
};
