##  Message Collectors

Collectors are a useful way to enable your bot to obtain *additional* input after the first command was sent. An example would be initiating a quiz, where the bot will "await" a correct response from somebody.

<p class="tip">You may read up more on collectors [here](https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=createMessageCollector).</p>

### Basic Message Collector

For now, let's take the example that they have provided us:

```js
// `m` is a message object that will be passed through the filter function
const filter = m => m.content.includes('discord');
const collector = message.channel.createMessageCollector(filter, { time: 15000 });
collector.on('collect', m => console.log(`Collected ${m.content}`));
collector.on('end', collected => console.log(`Collected ${collected.size} items`));
```

In the first argument of `.createMessageCollector()`, it specifies that it requires a function. This function should ideally return a boolean, which would indicate whether or not the message should pass through the collector's filter. This filter function includes implicit return, which means that (in this case), it will return the value of `m.content.includes('discord')` without actually specifying `return`. This happens when we use arrow functions without braces.

You can also allow more than one condition, as you would with any function. An alternative could be `m => m.content.includes('discord') && m.author.id === message.author.id`, assuming `message` is the name of what you receive in the `message` event. This function will only allow a message that was sent by the person who triggered the command *and* if the message content included "discord" in it.

After a message passes through, this will trigger the `collect` event for the `collector` we have created, which will then run the provided function. In this case, it will simply log the collected message. Once the collector finishes, one way or another, it will run the `end` event. A collector can end in different ways, such as:
* Time running out
* A certain number of messages passing the filter
* A certain number of attempts to go through the filter altogether

Those options you pass as the second argument in `.createMessageCollector()`. The benefit of using this method over `.awaitMessages()` is that you can stop it manually by calling `collector.stop()`, should you have your own reason to interrupt the collecting early.

### Await Messages

Using `.awaitMessages()` can be easier if you understand promises, and it allows you to have cleaner code overall. It is essentially identical to `.createMessageCollector()`, except promisified. The drawback of using this method, however, is that you cannot do things before the promise is resolves or rejected, either by an error or completion. However, it should do for most purposes, such as awaiting the correct response in a quiz. Instead of taking their example, let's set up a basic quiz command using the `.awaitMessages()` feature.

<p class="tip">You may read up more on `.awaitMessages()` [here](https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=awaitMessages).</p>

First, we will need some questions and answers to choose from, so here's a basic set:


```json
[
	{
		"question": "What colour is the sky?",
		"answers": ["blue"]
	},
	{
		"question": "How many letters are there in the alphabet?",
		"answers": ["26", "twenty-six", "twenty six", "twentysix"]
	}
]
```

The provided set allows for responder error with an array of answers allowed. Ideally, you should place this in a json file, which we'll call `quiz.json` for simplicity.

```js
const quiz = require('./quiz.json');
const item = quiz[Math.floor(Math.random() * quiz.length)];
const filter = response => item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());

message.channel.send(item.question).then(() => {
	message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
		.then(collected => message.channel.send(`${collected.first().author} got the correct answer!`))
		.catch(collected => message.channel.send('Looks like nobody got the answer this time.'));
});
```

<p class="tip">If you do not understand `.some()`, feel free to look it up in more detail [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).</p>

In this filter we iterate through our answers to find what we want. We would like to ignore case because simple typos can happen, so we convert each answer to its lowercase form, and check if it's equal to the response in lowercase form as well. In the options section, we only want to allow one answer to pass through, hence the `maxMatches: 1` setting.

The filter looks for messages that match one of the answers in our array of possible answers in order to pass through the collector. In the options, in the second parameter, we have specified that only a maximum of 1 message can go through the filter successfully, before the promise will successfully resolve. In the errors section, we have specified that time will cause it to error out, which will cause the promise to reject if 1 correct answer is not received within the time limit of 1 minute. As you can see, there is no on `collect` event, so you are limited in that regard.

## Reaction Collectors

### Basic Reaction Collector

These work quite similarly to message collectors, except that you apply them on a message rather than a channel. The following is an example taken from the documentation, with slightly better variable names fo clarification. The filter will check for the 👌 emoji - in the default skin tone specifically, so be wary of that. It will also check that the person who reacted shares the same id as the author of the original message that the collector was assigned to.

<p class="tip">You may read more about reaction collectors [here](https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=createReactionCollector).</p>

```js
const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === message.author.id;
const collector = message.createReactionCollector(filter, { time: 15000 });
collector.on('collect', (reaction, collector) => console.log(`Collected ${reaction.emoji.name}`));
collector.on('end', collected => console.log(`Collected ${collected.size} items`));
```

### Await Reactions

As before, these work almost exactly the same as a reaction collector, except it is promise based. The same differences apply as with channel collectors.

<p class="tip">You may read more about awaiting reactions [here](https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=awaitReactions).</p>

```js
const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === message.author.id;
message.awaitReactions(filter, { max: 4, time: 60000, errors: ['time'] })
	.then(collected => console.log(collected.size))
	.catch(collected => console.log(`After a minute, only ${collected.size} out of 4 reacted.`));
```