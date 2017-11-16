const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = sequelize.import('models/CurrencyShop');
sequelize.import('models/Users');
sequelize.import('models/UserItems');

sequelize.sync().then(async() => {

	const shop = [
		CurrencyShop.upsert({ name: 'Tea', cost: 1 }),
		CurrencyShop.upsert({ name: 'Coffee', cost: 2 }),
		CurrencyShop.upsert({ name: 'Cake', cost: 5 }),
	];
	await Promise.all(shop);
	console.log('Database loaded');

}).catch(console.error);
