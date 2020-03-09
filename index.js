const http = require("http");
const request = require("request");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(require('moment')(Date.now()).format('D MMMM YYYY, HH:mm:ss A') + " Ping Received");
  response.sendStatus(200);
});
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const fs = require('fs');
const Discord = require('discord.js');
const moment = require('moment-timezone');
const superagent = require('superagent');
const { Canvas } = require('canvas-constructor');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.token = token;
client.login(client.token);
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


/****** CLIENT READY ******/
client.on("ready", async => {
  
  console.log(`The bot ${client.user.tag} is up and running!`);
  client.user.setStatus("online");
  client.user.setActivity(`Moderating Server(s)!`, {
    type: "LISTENING"
  });
});


/****** COMMAND HADLER ******/ 
client.on('message', message => {
	 if (!message.content.startsWith(prefix) || message.author.bot) return;
 	 const args = message.content.slice(prefix.length).split(/ +/);
   const commandName = args.shift().toLowerCase();
	 const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
   if (!command) return;

	 if (command.guildOnly && message.channel.type !== 'text') {
		 return message.reply('I can\'t execute that command inside DMs!');
	 }

	 if (command.args && !args.length) {
		  let reply = `You didn't provide any arguments, ${message.author}!`;

	 if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
	 };

		  return message.channel.send(reply);
	 };

	 if (!cooldowns.has(command.name)) {
	   	cooldowns.set(command.name, new Discord.Collection());
	 };

	 const nowTime = Date.now();
	 const timeStamp = cooldowns.get(command.name);
	 const cooldownAmount = (command.cooldown || 3) * 1000;

	 if (timeStamp.has(message.author.id)) {
		  const endTime = timeStamp.get(message.author.id) + cooldownAmount;

	 if (nowTime < endTime) {
			const timeLeft = (endTime - nowTime) / 1000
			return message.channel.send(`<:warning:685478108333080616> **${message.author.tag}**, please wait **${timeLeft.toFixed(1)} more second(s)** before reusing the \`${command.name}\` **command**.`);
		};
	};

	   timeStamp.set(message.author.id, nowTime);
	   setTimeout(() => timeStamp.delete(message.author.id), cooldownAmount);

	try {
		  command.execute(client, message, args);
	} catch (error) {
		  console.error(error);
	};
});


/****** CLIENT READY ******/
client.on('ready', () => {
  const timeNow = moment().tz('Asia/Jakarta').format('MMMM D, YYYY HH:mm A');
  const clockChannel = client.channels.cache.find(ch => ch.id === '684362434990833683');

  clockChannel.edit({ name: `${timeNow}` }, { 'reason':'Clock update' })
    .catch(console.error);
  setInterval(() => {
    const timeNowUpdate = moment().tz('Asia/Jakarta').format('MMMM D, YYYY HH:mm A');
    clockChannel.edit({ name: `${timeNowUpdate}` }, { 'reason':'Clock update' })
      .catch(console.error);
  }, 10000);
});


/****** GUILD MEMBER UPDATE ******/
client.on('guildMemberUpdate', (oldMember, newMember) => {
  
  const channel = oldMember.guild.channels.cache.get('680489948566388746');
  
     var Changes = {
        unknown: 0,
        nickname: 1
    };
  
  var change = Changes.unknown;
  
   if (Changes.nickname) {
    if (oldMember.nickname !== newMember.nickname){
       var oldNickname = oldMember.nickname != null ? oldMember.nickname : oldMember.user.tag;
       var newNickname = newMember.nickname != null ? newMember.nickname : newMember.user.tag;
         const embed = new Discord.MessageEmbed()
           .setColor('#70D5FF')
           .setTitle('<:Tanya:648395967565004831> CHANGE NICKNAME')
           .setDescription(`> Before: **${oldNickname}** \n> After: **${newNickname}**`)
           .setTimestamp()
           .setFooter(`ID: ${newMember.id}`, newMember.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
         return channel.send(embed);
   };
 };
});


/****** USER UPDATE ******/
client.on('userUpdate', (oldUser, newUser) => {
  
   const channel = client.guilds.cache.get('620671058021842944').channels.cache.get('680489948566388746');
  
     var Changes = {
        unknown: 0,
        username: 1,
        avatar: 2
     }
  
   if (Changes.username) {
    if (oldUser.username !== newUser.username) {
      var oldUsername = oldUser.username + '#' + oldUser.discriminator;
      var newUsername = newUser.username + '#' + newUser.discriminator;
        const embed = new Discord.MessageEmbed()
          .setColor('#70D5FF')
          .setTitle('<:Tanya:648395967565004831> CHANGE USERNAME')
          .setDescription(`> Before: **${oldUsername}** \n> After: **${newUsername}**`)
          .setTimestamp()
          .setFooter(`ID: ${newUser.id}`, newUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        return channel.send(embed);
   };
 };
  if (Changes.avatar) {
    if (oldUser.avatar !== newUser.avatar) {
      var oldAvatar = oldUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
      var newAvatar = newUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
      
    async function createCanvas(){
      const { body: oldAvatars } = await superagent.get(oldAvatar);
      const { body: newAvatars } = await superagent.get(newAvatar);
      const { body: right } = await superagent.get('https://cdn.glitch.com/26e03451-ae3d-4175-a59d-d89744a0abd6%2FUIHere.png?v=1583604928482')
      
        return new Canvas(500, 200)
            .setColor('#282828')
            .addRect(0, 0, 500, 200)
            .setColor('#303030')
            .addBeveledRect(20, 20, 460, 165, 15)
            .fill().restore()
            .setColor('#FFFFFF')
            .addImage(oldAvatars, 60, 45, 120, 120)
            .addImage(newAvatars, 305, 45, 120, 120)
            .addImage(right, 210, 70, 70, 70)
            .toBufferAsync()
      }
    
      
        const embed = new Discord.MessageEmbed()
          .setColor('#70D5FF')
          .setTitle('<:Tanya:648395967565004831> CHANGE AVATAR')
          .setDescription(`> Before: **${oldAvatar}** \n> After: **${newAvatar}**`)
          .setTimestamp()
          .attachFiles([{ attachment: createCanvas(), name: 'avatar.png' }])
	        .setImage( 'attachment://avatar.png' )
          .setFooter(`ID: ${newUser.id}`, newUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        return channel.send(embed);
   };
  };
});


client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.cache.find(ch => ch.id === '680489948566388746');
    if (!channel) return;
           
    let nameLimit = member.user.username;
    let username = nameLimit.length > 12 ? nameLimit.substring(0, 10) + "" : nameLimit;

    async function createCanvas() {
 
           // let { body : background} = await superagent.get("https://cdn.glitch.com/370c13e8-5cfa-4fae-986a-754eee53d531%2F20191231_000345.png?v=1577725594104");
            let { body : avatar } = await superagent.get(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
           
            return new Canvas(1024, 450)
                 .setColor('#232323')
                 .addRect(0, 0, 1024, 450)
                 .setColor('#FFFFFF')
                 .addCircle(510, 165, 133)
                 .setColor('#232323')
                 .addCircle(510, 165, 125)
                 .addCircularImage(avatar, 510, 165, 125)
                 .setColor('#FFFFFF')
                 .setTextFont('60px VampireWars')
                 .setTextAlign('center')
                 .addText('WELCOME', 510, 355)
                 .setTextFont('35px Arial')
                 .setTextAlign('center')
                 .addText(`${username}${member.user.discriminator}`, 510, 390)
                 .setTextFont('25px Arial')
                 .setTextAlign('center')
                 .addText(`WELCOME TO ${member.guild.name}`, 510, 430)
                 .toBufferAsync()
     }
   channel.send({
    files: [{
    attachment: await createCanvas(),
    name: 'welcome.png'}] 
  });    
});