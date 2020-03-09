module.exports = {
    name: 'eval',
    description: null,
    aliases: ['ev'],
    cooldown: 0,
    async execute(client, message, args) {
      if(message.author.id !== '636094216384151582') return;
		const clean = text => {
			if (typeof (text) === 'string') {
				return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
			}
			else {
				return text;
			}
		};
		try {
			const code = args.join(' ');
			let evaled = await eval(code);
			if (typeof evaled !== 'string') {
				evaled = require('util').inspect(evaled, {depth: 0});
			}
			if (evaled.includes(client.token)) return message.channel.send('```Nice try FBI.```');
			message.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
    }
}
