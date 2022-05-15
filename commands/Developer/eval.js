const discord = require("discord.js");
const Commands = require('../../models/commands.js')
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const ms = require("ms")
const Quests = require('../../models/quests.js')
const { MessageActionRow, MessageButton } = require("discord.js")
const Guild = require('../../models/guild.js')
const User = require('../../models/user.js')
const Auction = require('../../models/auction.js')
const Trade = require('../../models/trade.js')
const Market = require('../../models/market.js')
const Spawn = require('../../models/spawn.js')
const Pokemons = require('../../models/pokemons.js')
const { generatePokemon } = require("../../functions");

module.exports = {
    name: "eval",
    description: "Evals the code.",
    args: false,
    aliases: ['jsk', 'js'],
    run: async (client, message, args, prefix, color, channel) => {
        if (!client.config.owners.includes(message.author.id)) return message.reply(`Only **${client.user.username}** Owner/Developers can use this Command!`)
        this.client = client;

        let code = args.join(' ')
        if (!code) return message.reply('Provide Code To Execute!')
        let codeArr = code.match(/(.|[\r\n]){1,1980}/g);

        let time = new Date();
        let ping = new Date() - message.createdAt;
        let timeTaken;
        let executed = []

        const embed = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(
                message.guild.iconURL({ dynamic: true }) || message.author.displayAvatarURL({ dynamic: true }))
            .addField('**📥 Input:**', '```js\n' + code.substr(0, 1024) + '```')
            .setColor(color)

        try {
            let evaled = await eval(`(async() => { ${code} })()`);
            timeTaken = new Date() - time;

            let result = evaled;
            if (typeof evaled !== 'string') result = require('util').inspect(evaled);
            let resultArr = result.match(/(.|[\r\n]){1,1980}/g);

            if (code.length > 1024) {
                embed.fields[0].value = `\`\`\`Code is longer than 1024 characters.. Do you want the code in DMs?\`\`\``;
            } else {
                embed.fields[0].value = `\`\`\`\n${code.substr(0, 1024)}\`\`\``;
            }
            executed.push({
                type: 'code',
                code: codeArr
            });

            if (result.length > 1024) {
                embed.addField('**📤 Output: **', `\`\`\`Result is longer than 1024 characters.. Do you want the Result in DMs?\`\`\``);
            } else {
                embed.addField('**📤 Output: **', '```js\n' + result + '```');
            }
            executed.push({
                type: 'evaled',
                evaled: resultArr
            });
            embed.addField('**❗ Output Type: **', '```xl\n' + typeof evaled + '\n```');
        } catch (err) {
            console.error(err.message);
            let errArr = err.message.match(/(.|[\r\n]){1,1980}/g);
            timeTaken = new Date() - time;

            if (err.length > 1024) {
                embed.addField('**❌ ERROR: **', `\`\`\`Error is longer than 1024 characters.. Do you want the Error in DMs?\`\`\``);
            } else {
                embed.addField('**❌ ERROR: **', `\`\`\`xl\n${err.message}\n\`\`\``);
            }
            executed.push({
                type: 'evaled',
                evaled: errArr
            });
            executed.push({
                type: 'code',
                code: codeArr
            });
        }
        embed
            .addField("⏰ Execution Time:", `**\`\`\`\nPING: ${ping}ms\nTIME TAKEN: ${((timeTaken / 1000)) < 1 ? `${timeTaken}ms` : `${(timeTaken / 1000).toFixed(2)} Second(s)`}\n\`\`\`**`)
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("📥 DM Code")
                    .setStyle("SUCCESS")
                    .setCustomId(`code-${message.id}`),
                new MessageButton()
                    .setLabel("📤 DM Results")
                    .setStyle("SUCCESS")
                    .setCustomId(`result-${message.id}`),
                new MessageButton()
                    .setLabel("❌ Delete")
                    .setStyle("DANGER")
                    .setCustomId(`delete-${message.id}`)
            )
        let rowx = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("📥 DM Code")
                    .setStyle("SUCCESS")
                    .setCustomId(`code-${message.id}`)
                    .setDisabled(true),
                new MessageButton()
                    .setLabel("📤 DM Results")
                    .setStyle("SUCCESS")
                    .setCustomId(`result-${message.id}`)
                    .setDisabled(true),
                new MessageButton()
                    .setLabel("❌ Delete")
                    .setStyle("DANGER")
                    .setCustomId(`delete-${message.id}`)
                    .setDisabled(true)
            )
        let msg = await message.reply({
            embeds: [embed],
            components: [row],
            allowedMentions: {
                repliedUser: false
            }
        })
        const filter = async (interaction) => {
            if (message.author.id == interaction.user.id) return true
            if (message.author.id != interaction.user.id) {
                await interaction.deferUpdate()
                let m = await interaction.channel.send({
                    content: "Only **Command Author** can interact with Buttons.",
                    ephermal: true
                })
                setTimeout(() => m.delete(), 4000)
                return false
            }
        }
        const collector = message.channel.createMessageComponentCollector({
            filter,
            time: 60000
        })
        collector.on('collect', async i => {
            if (i.customId == `code-${message.id}`) {
                executed.find(r => r.type === 'code').code.forEach(msg => {
                    message.author.send(`\`\`\`js\n${msg}\`\`\``).catch((r) => {
                        console.log(r)
                        if (r.message.includes("Cannot send messages to this user")) return message.reply({
                            content: "You have your DMs closed!",
                            allowedMentions: {
                                repliedUser: false
                            }
                        });
                    })
                })
                await i.deferUpdate();
            }
            if (i.customId == `result-${message.id}`) {
                executed.find(r => r.type === 'evaled').evaled.forEach(msg => {
                    message.author.send(`\`\`\`js\n${msg}\`\`\``).catch((r) => {
                        console.log(r)
                        if (r.message.includes("Cannot send messages to this user")) return message.reply({
                            content: "You have your DMs closed!",
                            allowedMentions: {
                                repliedUser: false
                            }
                        });
                    })
                })
                await i.deferUpdate();
            }
            if (i.customId === `delete-${message.id}`) {
                collector.stop()
                await i.deferUpdate()
                try {
                    await msg.delete();
                    await message.delete();
                } catch (e) {
                    console.log(e)
                    return
                }
                return
            }
        })
        collector.on('end', () => {
            return msg.edit({
                components: [rowx]
            })
        })
    }
}

function splitText(text) {
    text = text.toString();
    let chunks = [text.substr(0, 2000), text.substr(2000, 4000), text.substr(4000, 6000), text.substr(6000, 8000), text.substr(8000, 10000)];
    return chunks;
}