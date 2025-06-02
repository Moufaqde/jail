const {MessageEmbed} = require('discord.js')
const jail = require("../../data/jail");
const bot = require("../../data/bot");
let AllowedRoles = [
'1096182899562262589', '1093074875024941136' ,  '902296035051847701' , '1093074332986654761', '1093090532634406985', '1095902135557828638' ,
'1093076121484005456' , '1093076099543605288' ,  '1093076060167491656' , '1093076031730102344', '1093072931271233566' 
]
module.exports = {
    name: "unjail",
    aliases: ["عفو"],
    timeout: 1000,
    usage: "HOW TO USE THE COMMAND",
    description: "WHAT THE COMMAND DOES",
    run: async (client, message, args) => {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
        
      let Permissions = message.member.roles.cache.some(m => AllowedRoles.includes(m.id));
            if(!Permissions) return;
      let embederror2 = new MessageEmbed()
      .setAuthor({name:'❌ Error'})
      .setColor(`#FF0000`)
      .setDescription("**give a Reason!**")
      
      // if(message.guild.me.hasPermission("MANAGE_SERVER")){
      //     return message.reply({embeds:[embederror2.setDescription("i dont have Permission \`MANAGE_SERVER\`")] })
      // }
      if(!member){
          return message.reply("> mention user")
      };
      if(member.user.bot === true){
          return message.reply("> The mentioned user should be person not bot")
      }
		const currentMute = await jail.findOne({
      memberid: member.user.id,
      guildid: message.guild.id,
      current: true,
    })
    var memberx= message.guild.members.cache.get(member.user.id)
var role1 = message.guild.roles.cache.find(r => r.id === "1093076592797941880");

const jail1 = memberx.roles.cache.some(role => role.id === "1093076592797941880") 
if(jail1) {
 memberx.roles.remove(role1)
 message.react("✅").catch(() => {});
 message.react("1️⃣").catch(() => {});
 return; 
}
				if(!currentMute) return message.reply("> This user not in prison")
        const currentrole = await bot.findOne({
          _id:message.guild.id,
        });
        if(!currentrole.roleID){
          return message.reply({embeds:[embederror2.setDescription(`**قم بتحديد رتبه السجن \n ${prefix}setrole @role ❌**`)] })
        }
var role = message.guild.roles.cache.find(r => r.id === currentrole.roleID);

console.log(currentrole.roleID)

memberx.roles.remove(role)

						message.react("✅")
      await jail.updateMany(currentMute, {
        current: false,
      })
    }
  }