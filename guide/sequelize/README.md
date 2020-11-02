# Storing data with Sequelize

Sequelize is an object-relational-mapper, which means you can write a query using objects and have it run on almost any other database system that Sequelize supports.

### Why use an ORM?

The main benefit of using an ORM like Sequelize is that it allows you to write code that essentially looks like native JavaScript. As a side benefit, an ORM will allow you to write code that can run in almost every database system. Although databases generally adhere very closely to SQL, they each have their own slight nuances and differences. You can create a database-agnostic query using an ORM that works on multiple database systems.

## A simple tag system

For this tutorial, you will create a simple tag system. The tag system will allow you to add a tag, output a tag, edit the tag, show tag info, list tags, and delete a tag.   
To begin, you should install Sequelize into your discord.js project. We will explain SQlite as the first storage engine and show how to use other databases later. Note that you will need node 7.6 or above to utilize the `async/await` operators.

### Installing and using Sequelize

Create a new project folder and run the following:

```bash
$ npm install --save discord.js
$ npm install --save sequelize
$ npm install --save sqlite3
```

::: danger
Make sure you use version 5 or later of Sequelize! Version 4 as used in this guide will pose a security threat. You can read more about this issue On the [Sequelize issue tracker](https://github.com/sequelize/sequelize/issues/7310).
:::

After you have installed discord.js and Sequelize, you can start with the following skeleton code. The comment labels will tell you where to insert code later on.

<!-- eslint-disable require-await -->

```js
const Discord = require('discord.js');
const Sequelize = require('sequelize');

const client = new Discord.Client();
const PREFIX = '!';

// [alpha]
// [beta]

client.once('ready', () => {
	// [gamma]
});

client.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).trim().split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');

		if (command === 'addtag') {
			// [delta]
		} else if (command === 'tag') {
			// [epsilon]
		} else if (command === 'edittag') {
			// [zeta]
		} else if (command === 'taginfo') {
			// [theta]
		} else if (command === 'showtags') {
			// [lambda]
		} else if (command === 'removetag') {
			// [mu]
		}
	}
});

client.login('your-token-goes-here');
```

### [alpha] Connection information

The first step is to define the connection information. It should look something like this:

```js
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
```

`host` tells Sequelize where to look for the database. This will be localhost for most systems, as the database usually resides with the application. If you have a remote database however, then you can set it to that connection address. Otherwise, don't touch this unless you know what you're doing.  
`dialect` refers to the database engine you are going to use. For this tutorial, it will be sqlite.  
`logging` setting this to false disables the verbose output from Sequelize. Set it to true when you are trying to debug.  
`storage` is a sqlite-only setting, because sqlite is the only database that stores all its data to a single file.  


### [beta] Creating the model

In any relational database, you need to create tables in order to store your data. For this simple tag system, four fields will be used. The table in the database will look something like this:

| name | description | username | usage_count |
| --- | --- | --- | --- |
| bob | is the best | bob | 0 |
| tableflip | (╯°□°）╯︵ ┻━┻ | joe | 8 |

In order to do that in Sequelize, you define a model based on this structure, as shown below.

```js
/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255),
 * description TEXT,
 * username VARCHAR(255),
 * usage INT
 * );
 */
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});
```

The model mirrors very closely to what is defined in the database. There will be a table with 4 fields called `name`, `description`, `userid`, and `usage_count`.  
`sequelize.define()` takes two parameters. `'tags'` is passed as the name of our table, and an object that represents the table's schema in key-value pairs. Keys in the object become the model's attributes, and the values describe the attributes.

`type` refers to what kind of data this attribute should hold. The most common types are number, string, and date, but there are other data types that are available depending on the database.  
`unique: true` will ensure that this field will never have duplicated entries. Duplicate tag names will be disallowed in this database.  
`defaultValue` allows you to set a fallback value if no value is set during the insert.  
`allowNull` is not all that important, but this will guarantee in the database that the attribute is never unset. You could potentially set it to be a blank or empty string, but has to be set to _something_.

::: tip
`Sequelize.STRING` vs `Sequelize.TEXT`: In most database systems, the length of the string is a fixed length for performance reasons. Sequelize defaults this to 255. Use STRING if your input has a max length, and use TEXT if does not. For sqlite, there is no unbounded string type so it will not matter which one you pick.
:::

### [gamma] Syncing the model

Now that your structure is defined, you need to make sure the model exists in the database. This goes in our `.once('ready')` event. This way the table structure gets created when the bot is ready and we do not need to worry about it later.
```js
Tags.sync();
```

The table does not actually get created until you `sync` it. The schema you defined from before was simply creating the model that lets Sequelize know what the data should look like. For testing, you can use `Tags.sync({ force: true })` to recreate the table every time on startup. This way you can get a blank slate each time.

### [delta] Adding a tag

After all this preparation, you can now write your first command! We will start off with the ability to add a tag.

<!-- eslint-skip -->

```js
const splitArgs = commandArgs.split(' ');
const tagName = splitArgs.shift();
const tagDescription = splitArgs.join(' ');

try {
	// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
	const tag = await Tags.create({
		name: tagName,
		description: tagDescription,
		username: message.author.username,
	});
	return message.reply(`Tag ${tag.name} added.`);
}
catch (e) {
	if (e.name === 'SequelizeUniqueConstraintError') {
		return message.reply('That tag already exists.');
	}
	return message.reply('Something went wrong with adding a tag.');
}
```

`Tags.create()` uses the models that you created previously. The `.create()` method inserts some data into the model. You are going to insert a tag name, description, and the author name into the database.  
`catch (e)` This section is necessary for the insert. This will offload checking for duplicates to the database, so that it will notify you if you attempt to create a tag that already exists. The alternative is to query the database before adding data, and checking if a result is returned. If there are no errors, or no identical tag is found, only then should you add the data. Of the two methods it is clear that catching the error is less work for yourself.  
`if (e.name === "SequelizeUniqueConstraintError")` Although this was mostly for doing less work, it is always good to handle your errors, especially if you know what types of errors you will receive. This error comes up if your unique constraint is violated, i.e. someone inserted duplicate values.

::: warning
Do not use catch for inserting new data. Only use it for gracefully handling things that go wrong in your code, or logging errors.
:::

### [epsilon] Fetching a tag

Next we will explain how to fetch the tag that was just inserted.

<!-- eslint-skip -->

```js
const tagName = commandArgs;

// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
const tag = await Tags.findOne({ where: { name: tagName } });
if (tag) {
	// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
	tag.increment('usage_count');
	return message.channel.send(tag.get('description'));
}
return message.reply(`Could not find tag: ${tagName}`);
```

This is your first query. You are finally doing something with our data, yay!  
`.findOne()` is how you fetch a single row of data. The `where: { name: tagName }` makes sure you only get the row with the desired tag. Since the queries are asynchronous, you will need to make use of `await` in order to fetch it. After receiving the data, you can use `.get()` on that object to grab the data. If no data is received, then you can tell the user that it was not found.

### [zeta] Editing a tag

<!-- eslint-skip -->

```js
const splitArgs = commandArgs.split(' ');
const tagName = splitArgs.shift();
const tagDescription = splitArgs.join(' ');

// equivalent to: UPDATE tags (description) values (?) WHERE name='?';
const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
if (affectedRows > 0) {
	return message.reply(`Tag ${tagName} was edited.`);
}
return message.reply(`Could not find a tag with name ${tagName}.`);
```

It is possible to edit a record by using the `.update()` function. The result from the update is the number of rows that were changed by the `where` condition. Since you can only have tags with unique names, you do not have to worry about how many rows it may change. Should you get that no rows were changed, then it can be concluded that the tag that was trying to be edited did not exist.

### [theta] Display info on a specific tag

<!-- eslint-skip -->

```js
const tagName = commandArgs;

// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
const tag = await Tags.findOne({ where: { name: tagName } });
if (tag) {
	return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
}
return message.reply(`Could not find tag: ${tagName}`);
```

This section is very similar to our previous command, except you will be showing the tag metadata. `tag` contains our tag object. Notice two things here: firstly, it is possible to access our object properties without the `.get()` function. This is because the object is an instance of a Tag, which you can treat as an object, and not just a row of data. Second, you can access a property that was not defined explicitly, `createdAt`. This is because Sequelize automatically adds that column to all tables. This feature can be disabled by passing another object into the model with `{ createdAt: false }`, but in this case, it was useful to have.

### [lambda] Listing all tags

The next command will enable you to fetch a list of all the tags that were created so far.

<!-- eslint-skip -->

```js
// equivalent to: SELECT name FROM tags;
const tagList = await Tags.findAll({ attributes: ['name'] });
const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
return message.channel.send(`List of tags: ${tagString}`);
```

Here, you can use the `.findAll()` method to grab all the tag names. Notice that instead of having `where`, the optional field, `attributes`, is set. Setting attributes to name will let you get *only* the names of tags. If you tried to access other fields, like the tag author, then you would get an error. If left blank, it will fetch *all* of the associated column data. It will not actually affect the results, but from a performance perspective, you should only grab the data that is needed. If no results are returned, `tagString` will default to 'No tags set'.

### [mu] Deleting a tag

<!-- eslint-skip -->

```js
const tagName = commandArgs;
// equivalent to: DELETE from tags WHERE name = ?;
const rowCount = await Tags.destroy({ where: { name: tagName } });
if (!rowCount) return message.reply('That tag did not exist.');

return message.reply('Tag deleted.');
```
`.destroy()` runs the delete operation. The operation returns a count of the number of affected rows. If it returns with a value of 0, then nothing was deleted and that tag did not exist in the database in the first place.


## Resulting code

<resulting-code path="sequelize/tags" />
