const message = require("../events/message");
const Discord = require("discord.js");
const config = require("../config.json")
const redis = require("../modules/db");

exports.run = async (client, message, args) => {
    const redisClient = await redis()
    message.channel.send(client.commands.size)
    try{
        redisClient.set("alma", 'true')
    }finally{
        redisClient.quit()
    }
}
  
exports.help = {
    name: "teszt",
    category: "test",
    description: "teszt",
    usage: "!teszt",
    aliases: ["teszt"]
};

exports.conf = {
    permission: "none"
}