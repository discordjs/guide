const config = require('./config');
const Discord = require('discord.js');

const client = new Discord.Client();
const { Users, CurrencyShop } = require('./dbObjects');
const currency = new Discord.Collection();
const PREFIX = '!';

Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

client.once('ready', async() => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => {
		currency.set(b.user_id, b);
	});
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
	if (msg.author.bot) return;
	currency.add(msg.author.id, 1);

	if (!msg.content.startsWith(PREFIX)) return;
	const input = msg.content.slice(PREFIX.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

	if (command === 'balance') {

		const target = msg.mentions.users.first() || msg.author;
		return msg.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);

	}
	else if (command === 'inventory') {

		const target = msg.mentions.users.first() || msg.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();

		if (!items.length) msg.channel.send(`${target.tag} has nothing!`);
		return msg.channel.send(`${target.tag} currently has ${items.map(t => `${t.amount} ${t.item.name}`).join(', ')}`);

	}
	else if (command === 'transfer') {

		const currentAmount = currency.getBalance(msg.author.id);
		const transferAmount = commandArgs.split(/\s+/g).find(arg => !/<@!?\d+>/g.test(arg));
		const transferTarget = msg.mentions.users.first();

		if (!transferAmount || isNaN(transferAmount)) return msg.channel.send(`Sorry ${msg.author}, that's an invalid amount`);
		if (transferAmount > currentAmount) return msg.channel.send(`Sorry ${msg.author} you don't have that much.`);
		if (transferAmount <= 0) return msg.channel.send(`Please enter an amount greater than zero, ${msg.author}`);

		currency.add(msg.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);

		return msg.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(msg.author.id)}💰`);

	}
	else if (command === 'buy') {

		const item = await CurrencyShop.findOne({ where: { name: { $iLike: commandArgs } } });
		if (!item) return msg.channel.send('That item doesn\'t exist.');
		if (item.cost > currency.getBalance(msg.author.id)) {
			return msg.channel.send(`You don't have enough currency, ${msg.author}`);
		}

		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		currency.add(msg.author.id, -item.cost);
		await user.addItem(item);

		msg.channel.send(`You've bought a ${item.name}`);

	}
	else if (command === 'shop') {

		const items = await CurrencyShop.findAll();
		return msg.channel.send('```' +
			items.map(i => `${i.name}: ${i.cost}💰`).join('\n')
		+ '```');

	}
	else if (command === 'leaderboard') {

		return msg.channel.send('```' +
			Array.from(currency.entries()).sort((a, b) => b[1].balance - a[1].balance)
				.filter((u) => client.users.get(u[0]))
				.slice(0, 10)
				.map((v, k) => `(${k + 1}) ${(client.users.get(v[0]).tag)}: ${v[1].balance}💰`)
				.join('\n')
		+ '```');

	}

});

client.login(config.token);
