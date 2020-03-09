const { exec } = require('child_process');

module.exports = {
    name: 'exec',
    description: null,
    aliases: [],
    cooldown: 1,
    async execute(client, message, args) {
    
    if (message.author.id !== '636094216384151582') return;
		if (!args[0]) return message.channel.send('```COMMAND REQUIRED```');
		try {
			exec(args.join(' '), (err, stdout, stderr) => {
				if (stderr) return message.channel.send({ embed: { description: stderr } });
				message.channel.send(`\`\`\`${stdout}\`\`\``);
			});
		}
		catch (err) {
			console.log(err);
		}
    }
}