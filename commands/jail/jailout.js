const { MessageEmbed ,MessageActionRow, MessageButton } = require('discord.js');
const dayjs = require("dayjs");
const ms = require("ms");
var converter = require('number-to-words');
var emoji = require('node-emoji')
const bot = require("../../data/bot");
const jail = require("../../data/jail");
const {prefix} = require("../../config.json")
let AllowedRoles = [
'1096182899562262589', '1093074875024941136' ,  '902296035051847701' , '1093074332986654761', '1093090532634406985', '1095902135557828638' ,
'1093076121484005456' , '1093076099543605288' ,  '1093076060167491656' , '1093076031730102344', '1093072931271233566' 

]
module.exports = {
    name: "jailout",
    aliases: ["سجن-برا"],
    timeout: 1000,
    usage: "HOW TO USE THE COMMAND",
    description: "WHAT THE COMMAND DOES",
    run: async (client, message, args) => {
        try{
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
      if(!args[0]) return message.channel.send(`**${prefix}jailout \`user\`**`)

      let Permissions = message.member.roles.cache.some(m => AllowedRoles.includes(m.id));
            if(!Permissions) return;
      let embederror2 = new MessageEmbed()
      .setAuthor({name:'❌ Error'})
      .setColor(`#FF0000`)
      .setDescription("**give a Reason!**")
      
      // if(message.guild.me.hasPermission("MANAGE_SERVER")){
      //     return message.reply({embeds:[embederror2.setDescription("i dont have Permission \`MANAGE_SERVER\`")] })
      // }

      if(member){
          return message.reply("> this user in server")
      };

      const currentrole = await bot.findOne({
        _id:message.guild.id,
      });
      if(!currentrole.roleID){
        return message.reply({embeds:[embederror2.setDescription(`**قم بتحديد رتبه السجن \n ${prefix}setrole @role ❌**`)] })
      }
      if(!currentrole.resons){
        return message.reply({embeds:[embederror2.setDescription(`**قم بتحديد بعض أسباب السجن \n ${prefix}addreason  ❌**`)] })
      }
      const currentMute = await jail.findOne({
        memberid: args[0],
        guildid: message.guild.id,
        current: true,
      })
      if(currentMute) return message.reply("> This user is already jailed");
      let text = `**will be imprisoned \`${args[0]}\` | <@${args[0]}>**`

      for(let counter = 0; counter  < currentrole.resons.length; counter++) {
      text += `\n:${converter.toWords(counter + 1)}: -\`${currentrole.resons[counter].Time}\` | **${currentrole.resons[counter].Reson}**`
  }
       row1 = [] 
      for(let counter = 0; counter  < currentrole.resons.length; counter++) {
          const button = new MessageButton()
          .setCustomId(`${counter + 1}`)
          .setStyle('SECONDARY')
          .setEmoji(`${emoji.get(converter.toWords(counter + 1))}`); 
          row1.push(button) 
      }
          const row = new MessageActionRow()
          .addComponents(
              row1
          );
      let Embed = new MessageEmbed()
          .setTitle(':police_officer: Prison')
          .setThumbnail("https://cdn.discordapp.com/attachments/926641775169396757/946730841747378236/lock-1.png")
          .setColor("#161617")
.setDescription(text)
          .setTimestamp()
          .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}`});

      let rmessageembed = await message.channel.send({embeds:[Embed] , components: [row]})
      
      const filter = i => i.user.id === `${message.author.id}`;
      
      const collector = message.channel.createMessageComponentCollector({ filter, max: 1, time: 15000 });

      // الكولكتر
      collector.on('collect', async i => {
          let button = i.customId;
          let date = Date.now()
          const expire = date+ms(currentrole.resons[button-1].Time)

          var role = message.guild.roles.cache.find(r => r.id === currentrole.roleID);
          if(!role)return message.Reply("**قم بتحديد رتبه السجن \n #setrole @role ❌**")

      
          await new jail({
              guildid:i.guild.id,
              memberid:args[0],
              staffid:i.user.id,
              expires:expire,
              current:true,
              reason:currentrole.resons[button-1].Reson,
          }).save();

          await message.reply("> Done when user join he will be in jail")
          message.react("✅").catch(() =>{})

          const row123 = new MessageActionRow()
          .addComponents(
              new MessageButton()
              .setCustomId('primary')
              .setLabel(`${currentrole.resons[button-1].Reson}`)
              .setStyle('DANGER')
              .setDisabled(true)
          );


      
      });

      collector.on('end', collected => {
          message.channel.messages.fetch(rmessageembed.id)
          .then(message => message.delete())
          .catch(console.error);
      });


  }catch(e) {
      return console.log(e)
  }}}