const { MessageEmbed } = require('discord.js');
const bot = require("../../data/bot");

module.exports = {
    name: "setuprole",
    aliases: ["setrole" , "setr"],
    timeout: 1000,
    usage: "HOW TO USE THE COMMAND",
    description: "WHAT THE COMMAND DOES",
    run: async (client, message, args) => {

      if(!message.member.permissions.has("MANAGE_GUILD")) return 
      let Role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id === args[0]);;

        let embederror1 = new MessageEmbed()
        .setTitle('❌ Error')
        .setColor(`#FF0000`)
        .setDescription("**Please Mention A Role!**")
        if (!Role)  return message.channel.send({embeds:[embederror1]})

        const currentrole = await bot.findOne({
            _id:message.guild.id,
          });
          if(!currentrole) {
              await new bot({
                _id:message.guild.id,
                roleID:Role.id,
				}).save()
          }
          if(currentrole){
            await bot.updateMany(currentrole, {
                _id:message.guild.id,
                roleID:Role.id,
              })
          }
        let Embed = new MessageEmbed()
        .setTitle("✅ Done")
        .setColor("#00FF00.")
        .setDescription(`**Role is setted as **<@&${Role.id}>`)
       return message.channel.send({embeds:[Embed]})

}}