const { MessageEmbed } = require('discord.js');
const dayjs = require("dayjs");
const ms = require("ms");
const bot = require("../../data/bot");

module.exports = {
    name: "addreason",
    aliases: ["addoption","addre"],
    timeout: 1000,
    usage: "HOW TO USE THE COMMAND",
    description: "WHAT THE COMMAND DOES",
    run: async (client, message, args) => {
try{
    if(!message.member.permissions.has("MANAGE_GUILD")) return 

        let time = args[0]
        let embederror1 = new MessageEmbed()
        .setAuthor({name:'❌ Error'})
        .setColor(`#FF0000`)
        .setDescription(`اكتب \`وقت\`صالح رجاء!\n> Ex: \`1d (1 day)\`, \`1h (1 hour)\`, \`1m (1 minute)\`, \`1s (1 seconds)\`!`)
        if (!time)  return message.channel.send({embeds:[embederror1]})
        
        if (!time || isNaN(ms(time)) || ms(time) < ms("1s")) {
            return message.channel.send({embeds:[embederror1]})
        }
    
        const reson =  args.slice(1).join(' ');
        let embederror2 = new MessageEmbed()
        .setAuthor({name:'❌ Error'})
        .setColor(`#FF0000`)
        .setDescription("**Give a Reason!**")
        if (!reson)  return message.channel.send({embeds:[embederror2]})
        if (!reson.length > 30)  return message.channel.send({embeds:[embederror2.setDescription("Please let the reason length less than 30!")]})


        const currentrole = await bot.findOne({
            _id:message.guild.id,
          });
          if(!currentrole) {
              await new bot({
                _id:message.guild.id,
                $push: { resons: {Time:time, Reson:reson} }
            }).save()
              }
              if(currentrole){
                await bot.updateMany(currentrole, {
                    _id:message.guild.id,
                    $push: { resons: {Time:time, Reson:reson} }
                })}
            let Embed = new MessageEmbed()
            .setTitle("✅ Done")
            .setColor("#00FF00.")
            .setDescription(`**The Reason Has Been added **`)
           return message.channel.send({embeds:[Embed]})

        }catch(e) {
            return console.log(e)
        }}}