const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content === '!everyonemod') {
		message.guild.defaultRole.setPermissions(['VIEW_CHANNEL', 'MANAGE_MESSAGES', 'KICK_MEMBERS']);
		console.log('Made everyone mod');
	}
	if (message.content === '!createmod') {
		message.guild.createRole({ name: 'Mod', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] });
		console.log('Created a modrole');
	}
	else if (message.content === '!makeprivate') {
		message.channel.overwritePermissions(message.channel.guild.id, { VIEW_CHANNEL: false });
		message.channel.overwritePermissions(message.channel.guild.me, { VIEW_CHANNEL: true });
		message.channel.overwritePermissions(message.author.id, { VIEW_CHANNEL: true });
		console.log(`Made channel ${message.channel.name} private`);
	}
	else if (message.content === '!createprivate') {
		message.guild.createChannel('new-channel', 'text', [{
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
		console.log('Created a private channel');
	}
	else if (message.content === '!mypermissions') {
		const finalPermissions = message.channel.permissionsFor(message.member);
		message.channel.send(finalPermissions.serialize(), { code: 'js' });
	}
	else if (message.content === '!sync') {
		if (!message.channel.parent) return;
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
		console.log(`Synchronized overwrites of ${message.channel.name} with ${message.channel.parent.name}`);
	}
	else if (message.content === '!rolpermissions') {
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
		message.channel.send(getRoleFinalPermissions(message.channel, message.member.highestRole).serialize(), { code: 'js' });
	}
});

client.login('your-token-goes-here');
