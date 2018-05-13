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

const makeAvatar = async url => {
	const canvas = Canvas.createCanvas(200, 200);
	const ctx = canvas.getContext('2d');

	ctx.beginPath();
	ctx.arc(100, 100, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const buffer = await snekfetch.get(url).then(r => r.body);
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

	return canvas;
};

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find('name', 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./test.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	const avatarImage = new Canvas.Image();
	const circleCanvas = await makeAvatar(member.user.displayAvatarURL);
	const base64 = circleCanvas.toDataURL('image/png');
	avatarImage.src = base64;
	ctx.drawImage(avatarImage, 25, 25);

	ctx.strokeStyle = '#FF0000';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = applyText(canvas, member.displayName);
	ctx.fillStyle = '#FFFFFF';
	ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'image.png');

	channel.send(`Welcome to the server, ${member}`, attachment);
});
