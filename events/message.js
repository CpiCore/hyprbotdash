const errors = require("../utils/errors.js");
const config = require("../config.json");
const { RichEmbed } = require("discord.js");
const redis = require("../modules/db");
let prefix = ""
const trim = (str, toReplace) => {
    let regexOne = new RegExp(`^[/${toReplace}]+`);
    let regexTwo = new RegExp(`[${toReplace}/]+$`);
    return str.replace(regexOne, "").replace(regexTwo, "");
};
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) {
        if (message.content.startsWith(config.defaultPrefix)) {
            return;
        } else {
            const dmEmbed = new RichEmbed()
                .setTitle("DM Recieved")
                .setDescription(`DM from ${message.author.tag} (${message.author.id})\n**Content**:\n${message.content}`)
                .setThumbnail(message.author.avatarURL || message.author.defaultAvatarURL)
                .addField(`Mutual Servers with ${client.user.username}`, client.guilds.filter(g => g.members.find(m => m.id == message.author.id)).size)
                .addField("Account created on", message.author.createdAt.toUTCString())
                .setColor(config.red)
                .setTimestamp();

            const owner = await client.fetchUser(config.ownerID).catch(err => { });
            if (!owner) return;
            if (message.attachments.size != 0) {
                let attachments = "";
                message.attachments.forEach(attachment => {
                    attachments += attachment.url + "\n"
                });
                owner.send(dmEmbed).catch(err => { });
                return owner.send("With attachments: " + attachments)
            }
            return owner.send(dmEmbed).catch(err => { });
        }
    };
    const redisClient = await redis()
    try {
        prefix = await redisClient.get(`prefix-${message.guild.id}`)
    } finally {
        redisClient.quit()
    }
    let stop;
    if (stop) return;

    if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;

    const prefixes = [prefix, `<@!${client.user.id}>`, `<@${client.user.id}>`];

    prefix = prefixes.find(p => message.content.startsWith(p));

    if (!prefix) return;

    if (message.content.indexOf(prefix) !== 0) return;
    message.prefix = prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;

    if (cmd.conf.NSFWCommand && !message.channel.nsfw) {
        return errors.notNSFWChannel(message);
    }

    try {
        client.logger.log(`[CMD] ${message.author.tag} (${message.author.id}) ran command ${cmd.help.name} in ${message.guild.name} (${message.guild.id})`)
        cmd.run(client, message, args);
    } catch (e) {
        client.logger.error(`From ${cmd.help.name}: ${e}`)
    }
}