# Replying to Slash Commands

Discord provides users the option to create client-integrated Slash Commands. In this section you will be learning how to respond to these commands using discord.js!

::: tip
You need to have at least one Slash Command set-up for your application to follow the instructions on this page.
:::

## Receiving Interactions

Every Slash Command is an `interaction`, so to respond to a command you need to setup an event listener that will execute code when your application receives an interaction:

```js
client.on('interaction', interaction => {
	console.log(interaction);
});
```

::: warning
Not every `interaction` is a Slash Command, so you need to make sure you that you know which type of Interaction you are dealing with!
:::

Let's make sure you only receive Slash Commands by making use of the `interaction.isCommand()` method:

```js
client.on('interaction', interaction => {
    // We return if our interaction is not a Slash Command
    if (!interaction.isCommand()) return; 
	console.log(interaction);
});
```

## Responding to a command

There are multiple ways of responding to a Slash Command, we will be covering each of these in the following segments.
The most common way of sending a response is by using the `interaction.reply()` method:

```js
client.on('interaction', interaction => {
    // We return if our interaction is not a Slash Command
    if (!interaction.isCommand()) return; 
    // Check if it is the correct command and send a response
	if (interaction.commandName === 'ping') interaction.reply('Pong!');
});
```
Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:

<!--- vue-discord-message doesn't yet have support for inline replies/interactions/ephemeral messages -->
<div is="discord-messages">
	<discord-message profile="user">
		/ping
	</discord-message>
	<discord-message profile="bot">
		Pong!
	</discord-message>
</div>

You've successfully sent a response to a Slash Command! This is only the beginning, there's more to look out for so let's move on to further ways of replying to a command!


## Ephemeral Responses

You may not always want everyone who has access to the channel in which a command has been used to see the response, thankfully Discord implemented a way to hide messages from everyone but the executor of the Slash Command. These type of messages are called `ephemeral` messages.

To make a response ephemeral all you have to do is set `ephemeral: true` in the `InteractionReplyOptions` as follows:

```js
client.on('interaction', interaction => {
    if (!interaction.isCommand()) return; 
    // Setting the ephemeral flag to true will make the response ephemeral
	if (interaction.commandName === 'ping') interaction.reply('Pong!', { ephemeral: true });
});
```
Now when you run your command again, you should see something like this:

<!--- vue-discord-message doesn't yet have support for inline replies/interactions/ephemeral messages -->
<div is="discord-messages">
	<discord-message profile="user">
		/ping
	</discord-message>
	<discord-message profile="bot">
		Pong! (ephemeral)
	</discord-message>
</div>

That's it! You've successfully sent an ephemeral response to a Slash Command.
We're not done yet, there's still more topics to cover, so let's move on to the next!

## Editing Responses

## Deferred Responses

## Followups
