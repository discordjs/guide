const util = require('util');
const { Client, Permissions } = require('discord.js');
const client = new Client();

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.author.bot || !message.content.startsWith('!')) return;
	if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
		return;
	}
	const botPerms = ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'];
	if (!message.guild.me.permissions.has(botPerms)) {
		return message.reply(`I need the permissions ${botPerms.join(', ')} for this demonstration to work properly`);
	}

	if (message.content === '!modeveryone') {
		const everyonePerms = new Permissions(message.guild.defaultRole.permissions);
		const newPerms = everyonePerms.add(['MANAGE_MESSAGES', 'KICK_MEMBERS']);
		message.guild.defaultRole.setPermissions(newPerms.bitfield)
			.then(() => message.reply('Added mod permissions to `@everyone`'))
			.catch(console.error);
	}

	else if (message.content === '!unmodeveryone') {
		const everyonePerms = new Permissions(message.guild.defaultRole.permissions);
		const newPerms = everyonePerms.remove(['MANAGE_MESSAGES', 'KICK_MEMBERS']);
		message.guild.defaultRole.setPermissions(newPerms.bitfield)
			.then(() => message.reply('Removed mod permissions from `@everyone`'))
			.catch(console.error);
	}

	else if (message.content === '!createmod') {
		if(message.guild.roles.some(role => role.name === 'Mod')) {
			return message.reply('A role with the name "Mod" already exists on this server');
		}
		message.guild.createRole({ name: 'Mod', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] })
			.then(() => message.reply('Created modrole'))
			.catch(console.error);
	}

	else if (message.content === '!checkmod') {
		if (message.member.roles.some(thisRole => thisRole.name === 'Mod')) {
			return message.reply('You have a role called Mod');
		}
		message.reply('You do not have a role called Mod');
	}

	else if (message.content === '!cankick') {
		if (message.member.hasPermission('KICK_MEMBERS')) {
			return message.reply('You can kick members');
		}
		return message.reply('You can not kick members');
	}

	else if (message.content === '!makeprivate') {
		if (!message.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return message.reply('Please make sure i have the permissions MANAGE_ROLES in this channel and retry');
		}
		message.channel.replacePermissionOverwrites({
			overwrites: [
				{
					id: message.guild.id,
					denied: ['VIEW_CHANNEL'],
				},
				{
					id: message.guild.me,
					allowed: ['VIEW_CHANNEL'],
				},
				{
					id: message.author.id,
					allowed: ['VIEW_CHANNEL'],
				},
			],
		})
			.then(() => message.reply(`Made channel ${message.channel.name} private`))
			.catch(console.error);
	}

	else if (message.content === '!createprivate') {
		message.guild.createChannel('private', 'text', [{
			id: message.guild.id,
			deny: ['VIEW_CHANNEL'],
		},
		{
			id: message.author.id,
			allow: ['VIEW_CHANNEL'],
		},
		{
			id: message.client.user.id,
			allow: ['VIEW_CHANNEL'],
		}])
			.then(() => message.reply('Created a private channel'))
			.catch(console.error);
	}

	else if (message.content === '!unprivate') {
		if (!message.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return message.reply('Please make sure i have the permissions MANAGE_ROLES in this channel and retry');
		}
		message.channel.permissionOverwrites.get(message.guild.id).delete()
			.then(() => message.reply(`Made channel ${message.channel.name} public`))
			.catch(console.error);
	}

	else if (message.content === '!mypermissions') {
		const finalPermissions = message.channel.permissionsFor(message.member);
		message.reply(util.inspect(finalPermissions.serialize()), { code: 'js' });
	}

	else if (message.content === '!lockpermissions') {
		if (!message.channel.parent) {
			return message.reply('This channel is not placed under a category');
		}
		if (!message.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return message.reply('Please make sure i have the permissions MANAGE_ROLES in this channel and retry');
		}
		message.channel.lockPermissions();
		message.reply(`Synchronized overwrites of ${message.channel.name} with ${message.channel.parent.name}`);
	}

	else if (message.content === '!rolepermissions') {
		const roleFinalPermissions = message.channel.permissionsFor(message.member.highestRole);
		message.reply(util.inspect(roleFinalPermissions.serialize()), { code: 'js' });
	}
});

client.login('your-token-goes-here');
