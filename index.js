const discord = require('discord.js');
const fs = require('fs');
const client = new discord.Client({
  intents: 32767,
});
const config = require('./config.json')
const mongoose = require('mongoose')
const Bot = require("./data/bot")
const jail = require("./data/jail")

const prefix = config.prefix

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.queue = new Map();

mongoose.connect(config.mongodbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => error
      ? console.log('Failed to connect to database')
      : console.log('Connected to database'));

const Categories = ["jail"]; //Commands => Category => Command

Categories.forEach(async function(Category) { //
    fs.readdir(`./commands/${Category}`, async function(error, files) {
      if (error) throw new Error(`Error In Command - Command Handler\n${error}`);
      files.forEach(async function(file) {
        if (!file.endsWith(".js")) throw new Error(`A File Does Not Ends With .js - Command Handler!`);
        let command = require(`./commands/${Category}/${file}`);
   
        if (!command.name || !command.aliases) throw new Error(`No Command Name & Command Aliases In A File - Command Handler!`);
        if (command.name) client.commands.set(command.name, command);
        if (command.aliases) command.aliases.forEach(aliase => client.aliases.set(aliase, command.name));
        if (command.aliases.length === 0) command.aliases = null;
      });
    });
});

client.on("messageCreate", async message => {
  let Prefix = prefix
  if (message.author.bot || !message.guild || message.webhookID) return;
  if (!message.content.startsWith(Prefix)) return;
  let args = message.content.slice(Prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();
  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return 
   if (command) {
            command.run(client, message, args)
    }
});


client.on("ready" , () => {
  const checkMutes = async () => {

    const now = new Date()

    const conditional = {
      expires: {
        $lt: now,
      },
      current: true,
    }
    const results = await jail.findOne(conditional).catch(() =>{});
    if(results){
      const { guildid, memberid } = results
      const botresults = await Bot.findOne({
        _id:guildid
      }).catch(() =>{});

      const {roleID} = botresults

      const guild = client.guilds.cache.get(guildid)
      const member = (await guild.members.fetch()).get(memberid)
      var role = guild.roles.cache.find(r => r.id === roleID)
      if(member){
        member.roles.remove(role)
      }
     


    await jail.updateMany(conditional, {
      current: false,
    })
    }
       

    setTimeout(checkMutes, 5000 )
  }
  checkMutes()
    console.log(`${client.user.tag} ready `)
})

client.on('guildMemberAdd', async (member) => {
  const { guild, id } = member

  const currentMute = await jail.findOne({
    memberid: id,
    guildid: guild.id,
    current: true,
  })

  if (currentMute) {
    const botresults = await Bot.findOne({
      _id:guild.id
    }).catch(() =>{});

    const {roleID} = botresults

    var role = guild.roles.cache.find(r => r.id === roleID)
if(!role) return;

    if (role) {
      member.roles.add(role)
    }
  }
})

// client.on("messageCreate", async message => {
//   const currentpreminm = await premium.findOne({
//       botid: client.user.id,
//       current: true,
//     })
//   if(!currentpreminm) return
//   let args = message.content.slice(10).trim().split(/ +/g);
//   const servers = currentpreminm.server
//   if(message.content.startsWith("!addserver")){
//     if(!message.author.id === currentpreminm.userID) return
//     if(!args[0]) return message.reply({content: "give the server id"})
//     if(isNaN(args[0])){
//       return message.reply({content: "give the server id"}) 
//    }
//    let length =  servers.length;
//    if(length >= 5) return message.reply({content: "You have reached the server limit!"});
//    if(servers.includes(args[0])) return message.reply({content: "this server in alredy used!"});
//    await premium.updateMany(currentpreminm, {
//     $push: { server: args[0] } 
//     })
    
//     let Embed = new discord.MessageEmbed()
//     .setTitle(`Done`)
//     .setColor("#00FF00")
//     .setDescription(`Server has been added!`)
//     .setFooter({ text: `${client.user.username}` , iconURL:`${client.user.avatarURL({ dynamic: true, size: 1024 })}` })

//     message.reply({embeds:[Embed]})
//   }
// });
// client.on("guildCreate", async(guild) => {
//   const currentpreminm = await premium.findOne({
//     botid: client.user.id,
//     current: true,
//   })
// if(!currentpreminm) return guild.leave();
// const servers = currentpreminm.server
// if(servers.includes(guild.id)) return
// });
client.login(config.token).catch(err => console.log(`Invalid Token Provided!`)); 