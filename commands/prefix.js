const message = require("../events/message");
const Discord = require("discord.js");
const config = require("../config.json")
const redis = require("../modules/db");
const query = ""

exports.run = async (client, message, args) => {
    const redisClient = await redis()
    try{
        redisClient.set(`prefix-${message.guild.id}`, args[0])
        const alma = redisClient.mget(`prefix-${message.guild.id}`)
        console.log(alma)
    }finally{
        redisClient.quit()
    }
    
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