const { MessageEmbed ,MessageActionRow, MessageButton } = require('discord.js');
const dayjs = require("dayjs");
var emoji = require('node-emoji')
const ms = require("ms");
const bot = require("../../data/bot");
var converter = require('number-to-words');
const {prefix} = require("../../config.json")

module.exports = {
    name: "deletereason",
    aliases: ["deleteoption","delreason","deloption"],
    timeout: 1000,
    usage: "HOW TO USE THE COMMAND",
    description: "WHAT THE COMMAND DOES",
    run: async (client, message, args) => {
try{
  if(!message.member.permissions.has("MANAGE_GUILD")) return 
        
        let embederror2 = new MessageEmbed()
        .setAuthor({name:'❌ Error'})
        .setColor(`#FF0000`)
        .setDescription("**Please give a reson!**")

        const currentrole = await bot.findOne({
            _id:message.guild.id,
          });

          if(!currentrole){
            return message.reply({embeds:[embederror2.setDescription(`**قم بتحديد بعض أسباب السجن \n ${prefix}addreason  ❌**`)] })
          }

          if(!currentrole.resons){
            return message.reply({embeds:[embederror2.setDescription(`**قم بتحديد بعض أسباب السجن \n ${prefix}addreason  ❌**`)] })
          }
          if(currentrole.resons.length == 0){
            return message.reply({embeds:[embederror2.setDescription(`**قم بتحديد بعض أسباب السجن \n ${prefix}addreason  ❌**`)] })
          }


        let text = `**Reasons:**\n`
        for(let counter = 0; counter  < currentrole.resons.length; counter++) {
        text += `\n:${converter.toWords(counter + 1)}: -\`${currentrole.resons[counter].Time}\` | **${currentrole.resons[counter].Reson}**`
        }
        if(!text){
          return message.reply({embeds:[embederror2.setDescription(`**قم بتحديد بعض أسباب السجن \n ${prefix}addreason  ❌**`)] })
        }

        row1 = [] 
        for(let counter = 0; counter  < currentrole.resons.length; counter++) {
            const button = new MessageButton()
            .setCustomId(`${counter + 1}`)
            .setStyle('SECONDARY')
            .setEmoji(`${emoji.get(converter.toWords(counter + 1))}`); 
            row1.push(button) 
        }
        if(!row1){
          return message.reply({embeds:[embederror2.setDescription(`**قم بتحديد بعض أسباب السجن \n ${prefix}addreason  ❌**`)] })
        }
        const row = new MessageActionRow()
            .addComponents(row1);

    let embed = new MessageEmbed()
    .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
    .setColor(`#2f3136`)
    .setDescription(text)
    const lole = message.channel.send({embeds:[embed] , components: [row] });

    const filter = i => i.user.id === `${message.author.id}`;
        
    const collector = message.channel.createMessageComponentCollector({ filter, max: 1, time: 15000 });
    collector.on('collect', async i => {
        let button = i.customId;
        const result = currentrole.resons
        result.splice(button - 1 , 1)

        let id = currentrole._id

        let role = currentrole.roleID
        if(role === null) role = null
        await bot.deleteOne({_id:id});
        await new bot({
        _id:message.guild.id,
         resons:result,
         roleID:role
        }).save()

        const currentrole1 = await bot.findOne({
          _id:message.guild.id,
        });

        row2 = [] 
        for(let counter = 0; counter  < currentrole1.resons.length; counter++) {
            const button = new MessageButton()
            .setStyle('SECONDARY')
            .setDisabled(true)
            .setCustomId(`Update${counter + 1}`)
            .setEmoji(`${emoji.get(converter.toWords(counter + 1))}`); 
            row2.push(button) 
        }
        if(!row2){
          return message.reply({embeds:[embederror2.setDescription(`**قم بتحديد بعض أسباب السجن \n ${prefix}addreason  ❌**`)] })
        }
        const row12 = new MessageActionRow()
            .addComponents(row2);

        const Update = new MessageEmbed()
        .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`})
        .setColor(`#2f3136`)
        .setDescription("✅ :The reasons have been successfully modified")

        i.update({embeds:[Update] , components: [row12] }).catch(() =>{})
        message.react("✅").catch(() =>{})
    });

    collector.on('end', collected => {
      message.channel.messages.fetch(lole.id)
      .then(message => message.delete())
      .catch(console.error);

    });
  }catch(e) {
    return console.log(e)
  }}}