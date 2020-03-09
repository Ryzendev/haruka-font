const Discord = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands', 'h'],
	usage: '[command name]',
	cooldown: 5,
	execute(client, message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('**Here\'s a list of all my commands:**');
			data.push(commands.map(command => `\`${command.name}\``).join(', '));
			data.push(`\n**You can send \`${prefix}help [command name]\` to get info on a specific command!**`);

			return message.channel.send(data, { split: true })
			
    }
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.channel.send(`<:false:685478051525689394> **${message.autor.tag}**, that\'s not a valid **command**!`);
		}

		 data.push(`**Command Name:** ${command.name}`);
	   data.push(`**Description:** ${command.description || 'None' }`);
     data.push(`**Aliases** ${command.aliases.join(', ') || 'None' }`);
		 data.push(`**Usage:** ${prefix}${command.name} ${command.usage ? command.usage : '' }`);
		 data.push(`**Cooldown:** ${command.cooldown ? command.cooldown || 3 + ' seconds(s) ' : 'None'}`);

    const embed = new Discord.MessageEmbed()
    .setColor('#FFFFFF')
    .setDescription(data)
		message.channel.send({ embed });
	},
};