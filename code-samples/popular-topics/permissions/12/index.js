const util = require('util');
const { Client, Permissions } = require('discord.js');
const client = new Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.author.bot || !message.content.startsWith('!')) return;
	if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;

	const botPerms = ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'];

	if (!message.guild.me.permissions.has(botPerms)) {
		return message.reply(`I need the permissions ${botPerms.join(', ')} for this demonstration to work properly`);
	}

	if (message.content === '!mod-everyone') {
		const everyonePerms = new Permissions(message.guild.defaultRole.permissions);
		const newPerms = everyonePerms.add(['MANAGE_MESSAGES', 'KICK_MEMBERS']);

		message.guild.defaultRole.setPermissions(newPerms.bitfield)
			.then(() => message.channel.send('Added mod permissions to `@everyone`.'))
			.catch(console.error);
	} else if (message.content === '!unmod-everyone') {
		const everyonePerms = new Permissions(message.guild.defaultRole.permissions);
		const newPerms = everyonePerms.remove(['MANAGE_MESSAGES', 'KICK_MEMBERS']);

		message.guild.defaultRole.setPermissions(newPerms.bitfield)
			.then(() => message.channel.send('Removed mod permissions from `@everyone`.'))
			.catch(console.error);
	} else if (message.content === '!create-mod') {
		if (message.guild.roles.cache.some(role => role.name === 'Mod')) {
			return message.channel.send('A role with the name "Mod" already exists on this server.');
		}

		message.guild.roles.create({ data: { name: 'Mod', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] } })
			.then(() => message.channel.send('Created Mod role.'))
			.catch(console.error);
	} else if (message.content === '!check-mod') {
		if (message.member.roles.cache.some(role => role.name === 'Mod')) {
			return message.channel.send('You do have a role called Mod.');
		}

		message.channel.send('You don\'t have a role called Mod.');
	} else if (message.content === '!can-kick') {
		if (message.member.hasPermission('KICK_MEMBERS')) {
			return message.channel.send('You can kick members.');
		}

		message.channel.send('You cannot kick members.');
	} else if (message.content === '!make-private') {
		if (!message.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return message.channel.send('Please make sure I have the `MANAGE_ROLES` permissions in this channel and retry.');
		}

		message.channel.overwritePermissions([
			{
				id: message.guild.id,
				deny: ['VIEW_CHANNEL'],
			},
			{
				id: client.user.id,
				allow: ['VIEW_CHANNEL'],
			},
			{
				id: message.author.id,
				allow: ['VIEW_CHANNEL'],
			},
		])
			.then(() => message.channel.send(`Made channel \`${message.channel.name}\` private.`))
			.catch(console.error);
	} else if (message.content === '!create-private') {
		message.guild.channels.create('private', {
			type: 'text', permissionOverwrites: [
				{
					id: message.guild.id,
					deny: ['VIEW_CHANNEL'],
				},
				{
					id: message.author.id,
					allow: ['VIEW_CHANNEL'],
				},
				{
					id: client.user.id,
					allow: ['VIEW_CHANNEL'],
				},
			],
		})
			.then(() => message.channel.send('Created a private channel.'))
			.catch(console.error);
	} else if (message.content === '!unprivate') {
		if (!message.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return message.channel.send('Please make sure i have the permissions MANAGE_ROLES in this channel and retry.');
		}

		message.channel.permissionOverwrites.get(message.guild.id).delete()
			.then(() => message.channel.send(`Made channel ${message.channel.name} public.`))
			.catch(console.error);
	} else if (message.content === '!my-permissions') {
		const finalPermissions = message.channel.permissionsFor(message.member);

		message.channel.send(util.inspect(finalPermissions.serialize()), { code: 'js' });
	} else if (message.content === '!lock-permissions') {
		if (!message.channel.parent) {
			return message.channel.send('This channel is not placed under a category.');
		}

		if (!message.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return message.channel.send('Please make sure i have the permissions MANAGE_ROLES in this channel and retry.');
		}

		message.channel.lockPermissions()
			.then(() => {
				message.channel.send(`Synchronized overwrites of \`${message.channel.name}\` with \`${message.channel.parent.name}\`.`);
			})
			.catch(console.error);
	} else if (message.content === '!role-permissions') {
		const roleFinalPermissions = message.channel.permissionsFor(message.member.roles.highest);

		message.channel.send(util.inspect(roleFinalPermissions.serialize()), { code: 'js' });
	}
});

client.login('your-token-goes-here');
