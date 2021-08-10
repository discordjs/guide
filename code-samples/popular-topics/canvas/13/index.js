const { Client, Intents, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 70;

	do {
		context.font = `${fontSize -= 10}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
};

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'profile') {
		const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');

		const background = await Canvas.loadImage('./wallpaper.jpg');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		context.strokeStyle = '#0099ff';
		context.strokeRect(0, 0, canvas.width, canvas.height);

		context.font = '28px sans-serif';
		context.fillStyle = '#ffffff';
		context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);

		context.font = applyText(canvas, `${interaction.member.displayName}!`);
		context.fillStyle = '#ffffff';
		context.fillText(`${interaction.member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

		context.beginPath();
		context.arc(125, 125, 100, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();

		const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg' }));
		context.drawImage(avatar, 25, 25, 200, 200);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

		interaction.reply({ files: [attachment] });
	}
});

client.login('your-token-goes-here');
