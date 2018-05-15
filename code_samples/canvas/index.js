const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

const client = new Discord.Client();
client.login('token');

const applyText = (canvas, username) => {
	const ctx = canvas.getContext('2d');
	let size = 70;
	do {
		ctx.font = `${size -= 10}px sans-serif`;
	} while (ctx.measureText(username).width > canvas.width - 300);
	return ctx.font;
};

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = applyText(canvas, member.displayName);
	ctx.fillStyle = '#FFFFFF';
	ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);	

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const buffer = await snekfetch.get(member.user.displayAvatarURL).then(r => r.body);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
