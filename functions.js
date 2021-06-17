const { MessageAttachment, WebhookClient } = require("discord.js")
const { webhooks } = require("./config");
const randomNumber = (min, max) => {
    const t = Math.random() * (max - min) + min;
    return t.toFixed(2);
}

module.exports = {
    randomNumber(min, max) {
        randomNumber
    },
    genIV(min, max) {
        var gen = `${randomNumber(min, max)}`;
        if (gen[1] == ".") {
            gen = gen.substr(0, 3);
        } else if (gen[2] == ".") {
            gen = gen.substr(0, 4);
        } else if (gen[3] == ".") {
            gen = gen.substr(0, 5);
        }
        return gen;

    },
    getlength(number) {
        return number.toString().length;
    },
    capitalize(arg) {
        return arg.charAt(0).toUpperCase() + arg.slice(1);
    },
    log(content, type = "cmd") {
        if (type.toLowerCase() === "cmd") {
            const webhookClient = new WebhookClient(webhooks.cmd.ID, webhooks.cmd.Token);
            webhookClient.send({
                username: "Pokecraft - commands logs",
                avatarURL: "https://cdn.discordapp.com/avatars/840579144525021185/4ca1238359198d85b6d74da3365cfa84.png?size=256",
                embeds: [
                    {
                        description: content,
                        color: 0xb6ffdb
                    }
                ]
            });
        }
        if (type.toLowerCase() === "guild") {
            const webhookClient = new WebhookClient(webhooks.guild.ID, webhooks.guild.Token);
            webhookClient.send(".", {
                username: "Pokécraft - guild logs",
                avatarURL: "https://cdn.discordapp.com/avatars/840579144525021185/4ca1238359198d85b6d74da3365cfa84.png?size=256",
                embeds: [content]
            });
        }
    }
}
