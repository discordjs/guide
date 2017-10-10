##  Message Collectors
Collectors are a useful way to enable your bot to obtain *additional* arguments after the first command was sent. An example would be initiating a quiz, where the bot will try to "await" a correct response from somebody. You may read up more on collectors [here](https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=createMessageCollector).

### Basic Message Collector
For now, let's take the example that they have provided us:

```js
const collector = message.channel.createMessageCollector(
m => m.content.includes('discord'),
  { time: 15000 }
);
collector.on('collect', m => console.log(`Collected ${m.content}`));
collector.on('end', collected => console.log(`Collected ${collected.size} items`));
```

In the first argument of `createMessageCollector`, it specifies that it requires a function. This function should ideally return a boolean, which would indicate whether or not the message should pass through the collector via the filter. This filter function includes implicit return, which means that (in this case), it will return the value of `m.content.includes('discord')` without actually specifying `return`. The equivalent of this code is `m => { return m.content.includes('discord'); }` which would work just as well. You can also allow more than one condition, as you would with any function. An alternative could be `m => m.content.includes('discord') && m.author.id === message.author.id`, assuming `message` is the name of what you receive in the `message` event. This function will only allow a message that was sent by the person who triggered the command *and* if the message content included discord in it. After a message passes through, this will trigger the `on` event for the `collector` we have created, which will then run the provided function. In this case, it will simply log the collected message. Once the collector finishes, one way or another, it will run the `end` event. A collector can end in different ways, such as the time being ran out, or a certain number of messages passing the filter, or a certain number of attempts to go through the filter altogether. Those options you pass as the second argument in `createMessageCollector`. The benfit of usin this method, over `awaitMessages`, is that you can stop it manually by calling `collector.stop()`, should you have your own reason to interrupt the collecting early.

### Await Messages
Using await messages can be easier if you understand promises, and it allows you to have cleaner code overall. It is essentially createMessageCollector, except promisified. The drawback of using this method, however, is that you cannot do things before the promise is over, either by an error or completion. However, it should do for most purposes, such as awaiting the correct response in a quiz. You may read up more on awaitMessages [here](https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=awaitMessages). Let's take a look at the sample code they provided:

```js
const filter = m => m.content.startsWith('!vote');
message.channel.awaitMessages(filter, { max: 4, time: 60000, errors: ['time'] })
  .then(collected => console.log(collected.size))
  .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
  ```

The filter looks for messages that begin with `!vote` that can pass through the collector. In the options, in the second parameter, we have specified that only a maximum of 4 messages can go through the filter successfully, before the promise will successfully complete. In the errors section, we have specified that time will cause it to error out, which will cause the promise to reject if 4 correct messages aren't received within the time limit of 1 minute. As you can see, there is no on `collect` event, so you are limited in that regard.

## Reaction Collectors

### Basic Reaction Collector

These work quite similarly to message collectors, except that you apply them on a message rather than a channel. The following is an example taken from the documentation, with slightly better variable names fo clarification. The filter will check for the 👌 emote, in the default skin tone specifically, so be wary of that. It will also check that the person who reacted shares the same id as the author of the original message that the collector was assigned to. You may read more about reaction collectors [here](https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=createReactionCollector).

```js
const collector = message.createReactionCollector(
  (reaction, user) => reaction.emoji.name === '👌' && user.id === message.author.id,
  { time: 15000 }
);
collector.on('collect', (reaction, collector) => console.log(`Collected ${reaction.emoji.name}`));
collector.on('end', (collected) => console.log(`Collected ${collected.size} items`));
```

### Await Reactions

As before, these work almost exactly the same as a reaction collector, except it is promise based. The same differences apply as with channel collectors.
You may read more about awaiting reactions [here](https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=awaitReactions).

```js
const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === message.author.id;
message.awaitReactions(filter, { max: 4, time: 60000, errors: ['time'] })
  .then(collected => console.log(collected.size))
  .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 reacted.`));
  ```