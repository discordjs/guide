# Storing data with Sequelize

Sequelize is an object-relational-mapper, which means you can write a query using objects and have it run on almost any other database system that Sequelize supports.

### Why use an ORM?

The main benefit of using an ORM like Sequelize is that it allows you to write code that essentially looks like native JavaScript. As a side benefit, an ORM will allow you to write code that can run in almost every database system. Although databases generally adhere very closely to SQL, they each have their own slight nuances and differences. You can create a database-agnostic query using an ORM that works on multiple database systems.

## A simple tag system

For this tutorial, we'll create a simple tag system. The tag system will allow you to add a tag, output a tag, edit the tag, show tag info, list tags, and delete a tag.   
To begin, you should install Sequelize into your discord.js project. We'll use sqlite as our first storage engine, but we'll move into other databases later. Note that you'll need node 7.6 or above to utilize the `async/await` operators.

### Installing and using Sequelize

Create a new project folder and run the following:

```bash
$ npm install --save discord.js
$ npm install --save sequelize
$ npm install --save sqlite3
```

After you have installed discord.js and Sequelize, you can start with the following skeleton code. The comment labels will tell you where we'll insert our code.

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
		const input = message.content.slice(PREFIX.length).split(' ');
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

client.login('pleaseinsertyourtokenheresothistutorialcanwork');
```

### [alpha] Connection information

The first step is to define the connection information. It should look something like this:

```js
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAliases: false,
	// SQLite only
	storage: 'database.sqlite',
});
```

`host` tells Sequelize where to look for the database. This will be localhost for most systems, as the database usually resides with the application. But if you have a remote database, then you can set it to that connection address. But otherwise, don't touch this unless you know what you're doing.  
`dialect` refers to the database engine you're going to use. For this tutorial, we'll use sqlite.  
`logging` setting this to false disables the verbose output from Sequelize. Set it to true when you're trying to debug.  
`operatorsAliases` this line is something you have to add because Sequelize recently deprecated using string based operators.
`storage` is a sqlite-only setting, because sqlite is the only database that stores all its data to a single file.  


### [beta] Creating the model

In any relational database, you need to create tables in order to store your data. We're going to create a simple tag system, and we'll have four fields. The table in the database will look something like this:

| name | description | username | usage_count |
| --- | --- | --- | --- |
| bob | is the best | bob | 0 |
| tableflip | (╯°□°）╯︵ ┻━┻ | joe | 8 |

In order to do that in Sequelize, we'll define a model object based on this structure.

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

The model mirrors very closely to what is defined in the database. We'll have a table with 4 fields called `name`, `description`, `userid`, and `usage_count`.  
`sequelize.define()` takes two parameters. We pass in `'tags'` as the name of our table, and an object that represents our table schema in key-value pairs. Keys in the object become the model's attributes, and the values describe the attributes

`type` refers to what kind of data this attribute should hold. The most common types are number, string, and date, but there are other data types that are available depending on the database.  
`unique: true` will ensure that this field will never have duplicated entries. We'll disallow the existence of duplicate tag names in our database.  
`defaultValue` lets us set a fallback value if we don't assign the value during the insert.  
`allowNull` is not all that important, but this will guarantee in the database that the attribute is never unset. You could potentially set it to be a blank or empty string, but has to be set to _something_.

::: tip
`Sequelize.STRING` vs `Sequelize.TEXT`: In most database systems, the length of the string is a fixed length for performance reasons. Sequelize defaults this to 255. Use STRING if your input has a max length, and use TEXT if doesn't. For sqlite, there's no unbounded string type so it won't matter which one you pick.
:::

### [gamma] Syncing the model

Now that we have defined our structure, we need to make sure the model exists in the database. This goes in our `.once('ready')` event. This way the table structure gets created, and we don't need to worry about it later.
```js
Tags.sync();
```

The table doesn't actually get created until you `sync` it. The schema that we defined from before was simply creating the model that lets Sequelize know what our data should look like. For testing, you can use `Tags.sync({ force: true })` to recreate the table every time on startup. This way you can get blank slate each time.

### [delta] Adding a tag

We can finally get our first command. We'll start off with adding a tag.

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

`Tags.create()` uses our models that we created previously. The `.create()` method inserts some data into the model. We're going to be inserting a tag name, description, and the author name into the database.  
`catch (e)` This section is absolutely necessary for our insert. We offload checking for duplicates to the database, so that it will tell us if we create a tag that already exists. The alternative is to query the database before adding data, and checking if we get a result. If we don't, only then do we add the data. But this requires two queries instead of one, so this method is less work.   
`if (e.name === "SequelizeUniqueConstraintError")` Although this was mostly for doing less work, it's always good to handle your errors, especially if you know what types of errors you will receive. This error comes up if your unique constraint is violated, i.e. someone inserted duplicate values.

::: warning
Do not use catch for inserting new data. Only use it for gracefully handling things that go wrong in your code, or logging errors.
:::

### [epsilon] Fetching a tag

Next we will fetch the tag we just inserted.

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

This is our first query. We're finally doing something with our data, yay!  
`.findOne()` is how we fetch a single row of data. The `where: { name: tagName }` makes sure we get we only get the row with the tag that we're searching for. Since our queries are asynchronous, we need to have await in order to fetch it. After we receive the data, we can use `.get()` on that object to grab the data. If we don't get any data, then we tell the user that we can't find it.

### [zeta] Editing a tag

<!-- eslint-skip -->

```js
const splitArgs = commandArgs.split(' ');
const tagName = splitArgs.shift();
const tagDescription = splitArgs.join(' ');

// equivalent to: UPDATE tags (descrption) values (?) WHERE name='?';
const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
if (affectedRows > 0) {
	return message.reply(`Tag ${tagName} was edited.`);
}
return message.reply(`Could not find a tag with name ${tagName}.`);
```

We can edit a record by using the `.update()` function. The result from the update is the number of rows that were changed by the `where` condition. Since we can only have tags with unique names, we don't have to worry about how many rows it may change. And if we get that no rows were changed, then we can conclude that the tag that was trying to be edited did not exist.

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

This section is very similar to our previous command, except we're showing the tag metadata. `tag` contains our tag object. Notice two things here: firstly, we can access our object properties without the `.get()` function. This is because the object is an instance of a Tag, which we can treat as an object, and not just a row of data. Second, we accessed a property that we didn't define, `createdAt`. This is because Sequelize automatically adds that column to all tables. We can turn this feature off by passing another object into our model with `{ createdAt: false }`, but in this case, it was useful to have.

### [lambda] Listing all tags

We'll use the next command to fetch a list of all the tags we've created so far.

<!-- eslint-skip -->

```js
// equivalent to: SELECT name FROM tags;
const tagList = await Tags.findAll({ attributes: ['name'] });
const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
return message.channel.send(`List of tags: ${tagString}`);
```

Here, we use the `.findAll()` method to grab all the tag names. Notice that instead of having `where`, we have set the optional field, `attributes`. Setting attribute to name will let us get *only* the names of tags. If we tried to access other fields, like the tag author, then we'll get an error. If left blank, it will fetch *all* of our associated column data. It won't actually affect our results, but from a performance perspective, we should only grab the data that we need. If we get no results, `tagString` will default to 'No tags set'.

### [mu] Deleting a tag

<!-- eslint-skip -->

```js
const tagName = commandArgs;
// equivalent to: DELETE from tags WHERE name = ?;
const rowCount = await Tags.destroy({ where: { name: tagName } });
if (!rowCount) return message.reply('That tag did not exist.');

return message.reply('Tag deleted.');
```
`.destroy()` runs the delete operation. The operation returns a count of the number of affected rows. If it returns with a value of 0, we know nothing was deleted, and that tag didn't exist in the database in the first place.


## Resulting code

<resulting-code path="sequelize/tags" />
