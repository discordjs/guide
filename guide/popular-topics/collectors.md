# Collectors

## Message collectors

Collectors are useful to enable your bot to obtain *additional* input after the first command was sent. An example would be initiating a quiz, where the bot will "await" a correct response from somebody.

::: tip
You can read the docs for the Collector class <DocsLink path="class/Collector">here</DocsLink>.
:::

### Basic message collector

For now, let's take the example that they have provided us:

```js
// `m` is a message object that will be passed through the filter function
const filter = m => m.content.includes('discord');
const collector = message.channel.createMessageCollector({ filter, time: 15000 });

collector.on('collect', m => {
	console.log(`Collected ${m.content}`);
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
```

In the options passed to `.createMessageCollector()`, users can provide a `filter` - a function that should ideally return a boolean which would indicate whether or not the message should pass through the collector's filter. If a filter is not provided, the collector will collect all new messages sent in `message.channel`. The filter function in the example above includes implicit return, which means that (in this case), it will return the value of `m.content.includes('discord')` without actually specifying `return`. This happens when you use arrow functions without braces. Since the function we created is called `filter`, the same as the option, we can pass it in the options object using [object property shorthand](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#property_definitions).

You can also allow more than one condition, as you would with any function. An alternative could be `m => m.content.includes('discord') && m.author.id === message.author.id`, assuming `message` is the name of what you receive in the `messageCreate` event. This function will only allow a message sent by the person who triggered the command *and* if the message content included "discord" in it.

After a message passes through, this will trigger the `collect` event for the `collector` you've created, which will then run the provided function. In this case, it will only log the collected message. Once the collector finishes, one way or another, it will run the `end` event. A collector can end in different ways, such as:

* Time running out: `time`
* A certain number of messages passing the filter: `max`
* A certain number of attempts to go through the filter altogether: `maxProcessed`

Those are additional options you pass in the object to `.createMessageCollector()`. The benefit of using this method over `.awaitMessages()` is that you can stop it manually by calling `collector.stop()`, should you have your own reason to interrupt the collecting early.

### Await messages

Using `.awaitMessages()` can be easier if you understand Promises, and it allows you to have cleaner code overall. It is essentially identical to `.createMessageCollector()`, except promisified. However, the drawback of using this method is that you cannot do things before the Promise is resolved or rejected, either by an error or completion. However, it should do for most purposes, such as awaiting the correct response in a quiz. Instead of taking their example, let's set up a basic quiz command using the `.awaitMessages()` feature.

::: tip
You can read the docs for the `.awaitMessages()` method <DocsLink path="class/TextChannel?scrollTo=awaitMessages">here</DocsLink>.
:::

First, you'll need some questions and answers to choose from, so here's a basic set:

```json
[
	{
		"question": "What color is the sky?",
		"answers": ["blue"]
	},
	{
		"question": "How many letters are there in the alphabet?",
		"answers": ["26", "twenty-six", "twenty six", "twentysix"]
	}
]
```

The provided set allows for responder error with an array of answers permitted. Ideally, it would be best to place this in a JSON file, which you can call `quiz.json` for simplicity.

```js
const quiz = require('./quiz.json');
const item = quiz[Math.floor(Math.random() * quiz.length)];
const filter = response => {
	return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
};

message.channel.send(item.question).then(() => {
	message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
			message.channel.send(`${collected.first().author} got the correct answer!`);
		})
		.catch(collected => {
			message.channel.send('Looks like nobody got the answer this time.');
		});
});
```

::: tip
If you don't understand how `.some()` works, you can read about it in more detail [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
:::

In this filter, you iterate through the answers to find what you want. You would like to ignore the case because simple typos can happen, so you convert each answer to its lowercase form and check if it's equal to the response in lowercase form as well. In the options section, you only want to allow one answer to pass through, hence the `max: 1` setting.

The filter looks for messages that match one of the answers in the array of possible answers to pass through the collector. The options (the second parameter) specifies that only a maximum of one message can go through the filter successfully before the Promise successfully resolves. The errors section specifies that time will cause it to error out, which will cause the Promise to reject if one correct answer is not received within the time limit of one minute. As you can see, there is no `collect` event, so you are limited in that regard.

## Reaction collectors

### Basic reaction collector

These work quite similarly to message collectors, except that you apply them on a message rather than a channel. The following is an example taken from the documentation, with slightly better variable names for clarification. The filter will check for the 👍 emoji–in the default skin tone specifically, so be wary of that. It will also check that the person who reacted shares the same id as the author of the original message that the collector was assigned to.

::: tip
You can read the docs for the `.createReactionCollector()` method <DocsLink path="class/Message?scrollTo=createReactionCollector">here</DocsLink>.
:::

```js
const filter = (reaction, user) => {
	return reaction.emoji.name === '👍' && user.id === message.author.id;
};

const collector = message.createReactionCollector({ filter, time: 15000 });

collector.on('collect', (reaction, user) => {
	console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
```

### Await reactions

As before, these work almost the same as a reaction collector, except it is Promise-based. The same differences apply as with channel collectors.

::: tip
You can read the docs for the `.awaitReactions()` method <DocsLink path="class/Message?scrollTo=awaitReactions">here</DocsLink>.
:::

```js
const filter = (reaction, user) => {
	return reaction.emoji.name === '👍' && user.id === message.author.id;
};

message.awaitReactions({ filter, max: 4, time: 60000, errors: ['time'] })
	.then(collected => console.log(collected.size))
	.catch(collected => {
		console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
	});
```

## Interaction collectors

The third type of collector allows you to collect interactions; such as when users activate a slash command or click on a button in a message.

### Basic message component collector

Collecting interactions from message components works quite similarly to reaction collectors. In the following example, we check that the interaction came from a button, and that user interacting with the button shares the same id as the user who activated the slash command that caused the bot to send them.

One important difference to note with interaction collectors however is that Discord expects a response to *all* interactions within 3 seconds - even ones that you don't want to collect. For this reason, you may wish to `.deferUpdate()` all interactions in your filter, or not use a filter at all and handle this behaviour in the `collect` event.

```js
const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

collector.on('collect', i => {
	if (i.user.id === interaction.user.id) {
		i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
	} else {
		i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
	}
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} interactions.`);
});
```

### Await message component

As before, this works similarly to the message component collector, except it is Promise-based.

Unlike other Promisified collectors though, this method will only ever collect one interaction which passes the filter. If no interactions are collected before the time runs out, the Promise will reject. This is to align with Discord's requirement that actions should immediately receive a response. In this example, we choose to `.deferUpdate()` all interactions in the filter.

```js
const filter = i => {
	i.deferUpdate();
	return i.user.id === interaction.user.id;
};

message.awaitMessageComponents({ filter, componentType: 'SELECT_MENU', time: 60000 })
	.then(interaction => interaction.editReply(`You selected ${interaction.values.join(', ')}!`))
	.catch(err => console.log(`No interactions were collected.`));
```