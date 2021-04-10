# Replying to slash commands

Discord provides users the option to create client-integrated slash commands. In this section you will be learning how to respond to these commands using discord.js!

::: tip
You need to have at least one slash command set-up for your application to follow the instructions on this page.
:::

## Receiving interactions

Every slash command is an `interaction`, so to respond to a command you need to setup an event listener that will execute code when your application receives an interaction:

```js
client.on('interaction', interaction => {
    console.log(interaction);
});
```

However, not every interaction is a slash command. Let's make sure to only receive slash commands by making use of the `interaction.isCommand()` method:

```js{2}
client.on('interaction', interaction => {
    if (!interaction.isCommand()) return; 
    console.log(interaction);
});
```


## Responding to a command

There are multiple ways of responding to a slash command, we will be covering each of these in the following segments.
The most common way of sending a response is by using the `interaction.reply()` method:

::: warning
Initially an Interaction token is only valid for three seconds, so that's the timeframe in which you are able to use the `interaction.reply()` method. Responses that require more time ("Deferred Responses") are explained later in this page.
:::

```js{3}
client.on('interaction', interaction => {
    if (!interaction.isCommand()) return; 
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

You've successfully sent a response to a slash command! This is only the beginning, there's more to look out for so let's move on to further ways of replying to a command!


## Ephemeral responses

You may not always want everyone who has access to the channel to see a slash command's response. Thankfully, Discord implemented a way to hide messages from everyone but the executor of the slash command. These type of messages are called `ephemeral` messages and can be set by using `ephemeral: true` in the `InteractionReplyOptions`, as follows:

```js{3}
client.on('interaction', interaction => {
    if (!interaction.isCommand()) return; 
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

That's it! You've successfully sent an ephemeral response to a slash command.
We're not done yet, there's still more topics to cover, so let's move on to the next!


## Editing responses

After you've sent an initial response, you may want to edit that response for various reasons. This can be easily achieved by making use of the `interaction.editReply()` method, as seen below:

::: warning
After the initial response, an Interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.
:::

```js{1,3,8-9}
const wait = require('util').promisify(setTimeout);

client.on('interaction', async interaction => {
    if (!interaction.isCommand()) return; 
    
    if (interaction.commandName === 'ping') { 
        interaction.reply('Pong!');
        await wait(2000);
        interaction.editReply('Pong again!');
    }
});
```

Excellent, now you've successfully edited the response of a slash command!


## Deferred responses

As previously mentioned, you have three seconds to respond to an interaction before its token turns invalid. But what if you have a command that performs a task that takes longer than that before sending the response? 

In this case you can make use of the `interaction.defer()` method, which triggers the `<application> is thinking...` message and also acts as initial response, giving you 15 minutes time to complete your tasks before responding:
<!--- here either display the is thinking message via vue-discord-message or place a screenshot -->

```js{7-9}
const wait = require('util').promisify(setTimeout);

client.on('interaction', async interaction => {
    if (!interaction.isCommand()) return; 
    
    if (interaction.commandName === 'ping') { 
        interaction.defer();
        await wait(4000);
        interaction.editReply('Pong!');
    }
});
```

As you can see, you are now able to respond to your command even if you surpass the initial three second timeframe! When you have a command that performs longer tasks, be sure to call `defer()` as soon as possible.

But what if you want the deferred response to be ephemeral? Fear not, you can pass `true` as parameter to the `defer()` method as outlined below, which will make the deferred response ephemeral:

```js{7}
const wait = require('util').promisify(setTimeout);

client.on('interaction', async interaction => {
    if (!interaction.isCommand()) return; 
    
    if (interaction.commandName === 'ping') { 
        interaction.defer(true);
        await wait(4000);
        interaction.editReply('Pong!');
    }
});
```

Perfect, now you know how to reply to a slash command when you have to perform time intensive tasks!

## Follow-ups

Replying to slash commands is great and all, but what if you want to send multiple responses instead of just one? Followup messages got you covered, you can use `interaction.webhook.send()` to send multiple responses:

::: warning
After the initial response an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send followup messages.
:::

```js{6}
client.on('interaction', interaction => {
    if (!interaction.isCommand()) return; 
    
    if (interaction.commandName === 'ping') { 
        interaction.reply('Pong!');
        interaction.webhook.send('Pong again!');
    }
});
```

If you run this code you should end up having something that looks like this:

<!--- vue-discord-message doesn't yet have support for inline replies/interactions/ephemeral messages -->
<div is="discord-messages">
	<discord-message profile="user">
		/ping
	</discord-message>
	<discord-message profile="bot">
		Pong!
	</discord-message>
	<discord-message profile="bot">
		Pong again!
	</discord-message>
</div>

That's all, now you know everything there is to know on how to reply to slash commands!
