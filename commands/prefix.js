const message = require("../events/message");
const Discord = require("discord.js");
const config = require("../config.json")
const redis = require("../modules/db");
const query = ""
let a = ""

exports.run = async (client, message, args) => {
    const redisClient = await redis()
    try{
        const prefix = redisClient.set(`prefix-${message.guild.id}`, args[0])
        a = await redisClient.get(`prefix-${message.guild.id}`)
    }finally{
        redisClient.quit()
    }
    const embed = new Discord.RichEmbed()
    .setTitle("PREFIX VÁLTOZOTT!")
    .setDescription(`Jelenlegi prefix: ${a}`)
    .setColor("BLUE")
    message.channel.send(embed)
}
  
exports.help = {
    name: "prefix",
    category: "Administratrion",
    description: "prefix change",
    usage: "!prefix",
    aliases: ["prefix", "pr", "pref"]
};

exports.conf = {
    permission: "none"
}