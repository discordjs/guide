const Discord = require('discord.js');
const util = require('util');

const client = new Discord.Client();

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.author.bot || !message.content.startsWith('!')) return;
	if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
		return;
	}
	const botPermsGlobal = ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'];
	if (!message.guild.me.permissions.has(botPermsGlobal)) {
		return message.reply(`I need the permissions ${botPermsGlobal.join(', ')} for this demonstration to work properly`);
	}
	if (message.content === '!modeveryone') {
		const everyonePerms = new Discord.Permissions(message.guild.defaultRole.permissions);
		const newPerms = everyonePerms.add(['MANAGE_MESSAGES', 'KICK_MEMBERS']);
		message.guild.defaultRole.setPermissions(newPerms.bitfield);
		message.reply('Added mod permissions to `@everyone`');
	}

	else if (message.content === '!unmodeveryone') {
		const everyonePerms = new Discord.Permissions(message.guild.defaultRole.permissions);
		const newPerms = everyonePerms.remove(['MANAGE_MESSAGES', 'KICK_MEMBERS']);
		message.guild.defaultRole.setPermissions(newPerms.bitfield);
		message.reply('Removed mod permissions from `@everyone`');
	}

	else if (message.content === '!createmod') {
		if(message.guild.roles.some(role => role.name === 'Mod')) {
			return message.reply('A role with the name "Mod" already exists on this server');
		}
		message.guild.createRole({ name: 'Mod', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] });
		message.reply('Created modrole');
	}

	else if (message.content === '!makeprivate') {
		if (!message.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return message.reply('Please make sure i have the permissions MANAGE_ROLES in this channel and retry');
		}
		message.channel.overwritePermissions(message.channel.guild.id, { VIEW_CHANNEL: false });
		message.channel.overwritePermissions(message.channel.guild.me, { VIEW_CHANNEL: true });
		message.channel.overwritePermissions(message.author.id, { VIEW_CHANNEL: true });
		message.reply(`Made channel ${message.channel.name} private`);
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
		}]);
		message.reply('Created a private channel');
	}
	else if (message.content === '!mypermissions') {
		const finalPermissions = message.channel.permissionsFor(message.member);
		message.reply(util.inspect(finalPermissions.serialize()), { code: 'js' });
	}
	else if (message.content === '!sync') {
		if (!message.channel.parent) {
			return message.reply('This channel is not placed under a category');
		}
		if (!message.channel.permissionsFor(client.user).has('MANAGE_ROLES')) {
			return message.reply('Please make sure i have the permissions MANAGE_ROLES in this channel and retry');
		}
		for (const overwrite of message.channel.permissionOverwrites.values()) {
			if (!message.channel.parent.permissionOverwrites.has(overwrite.id)) { overwrite.delete(); }
		}
		for (const overwrite of message.channel.parent.permissionOverwrites.values()) {
			const options = {};
			const allow = new Discord.Permissions(overwrite.allow);
			const deny = new Discord.Permissions(overwrite.deny);
			for (const flag of Object.keys(Discord.Permissions.FLAGS)) {
				if (allow.has(flag)) options[flag] = true;
				else if (deny.has(flag)) options[flag] = false;
				else options[flag] = null;
			}

			message.channel.overwritePermissions(overwrite.id, options);
		}
		message.reply(`Synchronized overwrites of ${message.channel.name} with ${message.channel.parent.name}`);
	}
	else if (message.content === '!rolepermissions') {
		const getRoleFinalPermissions = (channel, role) => {
			let permissions = role.permissions | role.guild.defaultRole.permissions;
			if (permissions & 1 << 3) {return new Discord.Permissions(permissions);}
			const roleOverwrites = channel.permissionOverwrites.get(role.id);
			const everyoneOverwrites = channel.permissionOverwrites.get(role.guild.id);
			if (everyoneOverwrites) {
				permissions &= ~everyoneOverwrites.deny;
				permissions |= everyoneOverwrites.allow;
			}
			if (roleOverwrites) {
				permissions &= ~roleOverwrites.deny;
				permissions |= roleOverwrites.allow;
			}
			return new Discord.Permissions(permissions);
		};
		message.reply(util.inspect(getRoleFinalPermissions(message.channel, message.member.highestRole).serialize()), { code: 'js' });
	}
});

client.login('your-token-goes-here');
