const {prefix} = require("../../config.json")

let AllowedRoles = [
'1093074875024941136',
'1093074853399113788',
'1093074332986654761',
'902296035051847701',
'1095902135557828638',
'1093076121484005456',
'1093076044216541244',
'1093076087292039228',
'1093076099543605288',
'1093076031730102344',
'1093076060167491656'
]  
module.exports = {
    name: "helpjail",
    aliases: ["help-jail"],
    timeout: 1000,
    usage: "HOW TO USE THE COMMAND",
    description: "WHAT THE COMMAND DOES",
    run: async (client, message, args) => {
      try{
      let Permissions = message.member.roles.cache.some(m => AllowedRoles.includes(m.id));
      if(!Permissions) return;
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
  
  if(!message.member.permissions.has("MANAGE_GUILD")) return 

  message.reply(`\n:pushpin: *General prison commands:*\n**${prefix}jail/سجن/prison** - \`Put a user in prison.\`\n**${prefix}unjail/عفو** - \`Get a user out prison.\`\n**${prefix}addreason/addoption** - \`Add New Reason.\`\n**${prefix}deletereason/deleteoption** - \`Delete a Reason\`\n\n**${prefix}setrole @role** - \`to define jail role\``)     
}catch(e) {
  return 
}}}