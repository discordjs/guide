# Collectors

## Message collectors

Collectors are useful to enable your bot to obtain *additional* input after the first command was sent. An example would be initiating a quiz, where the bot will "await" a correct response from somebody.

::: tip
You can read the docs for the Collector class <docs-link path="class/Collector">here</docs-link>.
:::

### Basic message collector

For now, let's take the example that they have provided us:

```js
// `m` is a message object that will be passed through the filter function
const filter = m => m.content.includes('discord');
const collector = message.channel.createMessageCollector(filter, { time: 15000 });

collector.on('collect', m => {
	console.log(`Collected ${m.content}`);
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
```

In the first argument of `.createMessageCollector()`, it specifies that it requires a function. This function should ideally return a boolean, which would indicate whether or not the message should pass through the collector's filter. This filter function includes implicit return, which means that (in this case), it will return the value of `m.content.includes('discord')` without actually specifying `return`. This happens when you use arrow functions without braces.

You can also allow more than one condition, as you would with any function. An alternative could be `m => m.content.includes('discord') && m.author.id === message.author.id`, assuming `message` is the name of what you receive in the `message` event. This function will only allow a message sent by the person who triggered the command *and* if the message content included "discord" in it.

After a message passes through, this will trigger the `collect` event for the `collector` you've created, which will then run the provided function. In this case, it will only log the collected message. Once the collector finishes, one way or another, it will run the `end` event. A collector can end in different ways, such as:

* Time running out
* A certain number of messages passing the filter
* A certain number of attempts to go through the filter altogether

Those options you pass as the second argument in `.createMessageCollector()`. The benefit of using this method over `.awaitMessages()` is that you can stop it manually by calling `collector.stop()`, should you have your own reason to interrupt the collecting early.

### Await messages

Using `.awaitMessages()` can be easier if you understand Promises, and it allows you to have cleaner code overall. It is essentially identical to `.createMessageCollector()`, except promisified. However, the drawback of using this method is that you cannot do things before the Promise is resolved or rejected, either by an error or completion. However, it should do for most purposes, such as awaiting the correct response in a quiz. Instead of taking their example, let's set up a basic quiz command using the `.awaitMessages()` feature.

::: tip
You can read the docs for the `.awaitMessages()` method <docs-link path="class/TextChannel?scrollTo=awaitMessages">here</docs-link>.
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

<branch version="11.x">

```js
const quiz = require('./quiz.json');
const item = quiz[Math.floor(Math.random() * quiz.length)];
const filter = response => {
	return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
};

message.channel.send(item.question).then(() => {
	message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
		.then(collected => {
			message.channel.send(`${collected.first().author} got the correct answer!`);
		})
		.catch(collected => {
			message.channel.send('Looks like nobody got the answer this time.');
		});
});
```

</branch>
<branch version="12.x">

```js
const quiz = require('./quiz.json');
const item = quiz[Math.floor(Math.random() * quiz.length)];
const filter = response => {
	return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
};

message.channel.send(item.question).then(() => {
	message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
			message.channel.send(`${collected.first().author} got the correct answer!`);
		})
		.catch(collected => {
			message.channel.send('Looks like nobody got the answer this time.');
		});
});
```

</branch>

::: tip
If you don't understand how `.some()` works, you can read about it in more detail [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
:::

In this filter, you iterate through the answers to find what you want. You would like to ignore the case because simple typos can happen, so you convert each answer to its lowercase form and check if it's equal to the response in lowercase form as well. In the options section, you only want to allow one answer to pass through, hence the <branch version="11.x" inline>`maxMatches: 1`</branch><branch version="12.x" inline>`max: 1`</branch> setting.

The filter looks for messages that match one of the answers in the array of possible answers to pass through the collector. The options (the second parameter) specifies that only a maximum of one message can go through the filter successfully before the Promise successfully resolves. The errors section specifies that time will cause it to error out, which will cause the Promise to reject if one correct answer is not received within the time limit of one minute. As you can see, there is no `collect` event, so you are limited in that regard.

## Reaction collectors

### Basic reaction collector

These work quite similarly to message collectors, except that you apply them on a message rather than a channel. The following is an example taken from the documentation, with slightly better variable names for clarification. The filter will check for the 👍 emoji–in the default skin tone specifically, so be wary of that. It will also check that the person who reacted shares the same id as the author of the original message that the collector was assigned to.

::: tip
You can read the docs for the `.createReactionCollector()` method <docs-link path="class/Message?scrollTo=createReactionCollector">here</docs-link>.
:::

<branch version="11.x">

```js
const filter = (reaction, user) => {
	return reaction.emoji.name === '👍' && user.id === message.author.id;
};

const collector = message.createReactionCollector(filter, { time: 15000 });

collector.on('collect', reaction => {
	console.log(`Collected ${reaction.emoji.name} from ${reaction.users.last().tag}`);
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
```

</branch>
<branch version="12.x">

```js
const filter = (reaction, user) => {
	return reaction.emoji.name === '👍' && user.id === message.author.id;
};

const collector = message.createReactionCollector(filter, { time: 15000 });

collector.on('collect', (reaction, user) => {
	console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
```

</branch>

### Await reactions

As before, these work almost the same as a reaction collector, except it is Promise-based. The same differences apply as with channel collectors.

::: tip
You can read the docs for the `.awaitReactions()` method <docs-link path="class/Message?scrollTo=awaitReactions">here</docs-link>.
:::

```js
const filter = (reaction, user) => {
	return reaction.emoji.name === '👍' && user.id === message.author.id;
};

message.awaitReactions(filter, { max: 4, time: 60000, errors: ['time'] })
	.then(collected => console.log(collected.size))
	.catch(collected => {
		console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
	});
```
