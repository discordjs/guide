# Errors

There is no doubt that you have encountered errors while making bots. While errors are very useful at warning you of what is going wrong, many people are stumped by them and how to track them down and fix them, but don't worry, we have you covered. This section will be all about how to diagnose errors, how to identify where they are coming from, and how to fix them.

## Types of Errors

### API Errors

API Errors or DiscordAPIErrors are errors which are thrown by the Discord API when an invalid request is carried out. API Errors can be mostly diagnosed using the message that is given. They can also be further examined by seeing the http method and path used, we will explore tracking these errors down in the next section.

Example: `DiscordAPIError: Cannot send an empty message`

### Discord.js Errors

Discord.js Errors are errors which are thrown by the library itself, they can usually be easily tracked down using the stacktrace and error message.

Example: `The messages must be an Array, Collection, or number.`

### JS Errors

JS Errors are simple errors which can be thrown by node itself, or by discord.js. These types of errors can easily be fixed by looking at the type of error, and the stacktrace. You can find a full list of types [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) And a list of common js errors [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors).

Example: `ReferenceError: "x" is not defined`

### Websocket and Network Errors

Websocket and Network errors are common system errors thrown by Node in response to something wrong with the websocket connection. Unfortunately, these errors do not have a concrete solution and can be (usually) fixed by getting a better, more stable, and stronger connection. Discord.js will automatically try to reconnect to the websocket if an error occurs. 

<branch version="11.x">

Normally these errors will crash your process, however, you can add an event listener for these errors which will notify you of them and it won't crash your process as shown below.

```js
client.on('error', error => {
	 console.error('The websocket connection encountered an error:', error);
});
```

Now, when an error occurs it will be logged to the console and it will not terminate the process.

</branch>

<branch version="12.x">

In version 12, WebSocket errors are handled internally, meaning your process should never crash from them. If you want to log these errors, should they happen, you can listen to the `shardError` event as shown below.

```js
client.on('shardError', error => {
	 console.error('A websocket connection encountered an error:', error);
});
```

</branch>

The commonly thrown codes for these errors are:
- `ECONNRESET` - The connection was forcibly closed by a peer, thrown by the loss of connection to a websocket due to timeout or reboot.
- `ETIMEDOUT` - A connect or send request failed because the receiving party did not respond after some time.
- `EPIPE` - The remote side of the stream being written to has been closed.
- `ENOTFOUND` - The domain being accessed is unavailable, usually caused by a lack of internet, can be thrown by the websocket and http API.
- `ECONNREFUSED` - The target machine refused the connection, check your ports and firewall.

## How to diagnose API errors

API Errors can be tracked down by adding an event listener for unhandled rejections and looking at the extra info that is given.
This can be done by easily adding this to your main file.

```js
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
```

The next time you get the error it will show info along the bottom of the error which will look something like this for example:

```json
  name: 'DiscordAPIError',
  message: 'Invalid Form Body\nmessage_id: Value "[object Object]" is not snowflake.',
  path: '/api/v7/channels/638200642359525387/messages/[object%20Object]',
  code: 50035,
  method: 'GET'
```

All of this information can help you track down what caused the error and how to fix it. In this section we will run through what each property means.

### Message

The most important part of the error is the message, it tells you what actually went wrong which can help you track down where it came from. 
You can find a full list of messages [here](https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#json) in the Discord API Docs.

### Path

The path is another helpful piece of information, the path tells you where you tried to execute an action. We cannot possibly cover all API paths but they are usually very descriptive, for example, in our example above the path tells us we are first in the channels path, then judging by the id after it we can see we got a specific channel. After the `/api/v7/channels/638200642359525387` we can see that we get the `messages` of that channel, and in the same way we saw before, we see we try to access a specific message by id, however we gave it an invalid id, which is the origin of the message.

### Code

The code is another partial representation of the message, in this case `Invalid Form Body`. You can find a full list of codes [here](https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes)

The code is also very useful if you want to only handle a specific error. Say we were trying to delete a message which may or may not be there, and we wanted to simply ignore unknown message errors. This can be done by checking the code, either manually, or using discord.js's constants.

```js
message.delete().catch(error => {
	// Only log the error if it is not an Unknown Message error
	if (error.code !== 10008) {
		console.error('Failed to delete the message:', error);
	}
});
```

Or using Constants:

```js
message.delete().catch(error => {
	if (error.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
		console.error('Failed to delete the message:', error);
	}
});
```

You can find a list of constants <branch version="12.x" inline> [here](https://github.com/discordjs/discord.js/blob/stable/src/util/Constants.js#L552) </branch> <branch version="11.x" inline> [here](https://github.com/discordjs/discord.js/blob/stable/src/util/Constants.js#L788) </branch>

### Method

The final piece of information can tell us a lot about what we tried to do to the path, there are a set of predefined keywords which describe our actions on the path.

```
GET    - Used to retrieve a piece of data
POST   - Used to send a piece of data
PATCH  - Used to modify a piece of data
PUT    - Used to completely replace a piece of data
DELETE - Used to completely delete a piece of data
```

In this particular example we can see we are trying to access a piece of data, specifically, a message.

## Common Discord.js and API errors

### An invalid token was provided.

This is a very common error, it originates from a wrong token being passed into `client.login()`. The most common causes of this error are:

- Not importing the config or env file correctly
- Copying the client secret instead of the bot token (token is alphanumerical and 3 parts delimited by a period while the client secret is significantly smaller and one part only)
- Simply showing the token and copying that, instead of clicking regenerate and copying that.

<branch version="12.x">

::: warning
Before the release of version there used to be an issue where the token was not prefixed correctly which resulted in valid tokens being marked as invalid. If you have verified that all of the above is not the case, make sure you have updated discord.js to the currently stable version.
:::

</branch>

### Request to use token, but token was unavailable to the client.

Another common error, this error originates from the client attempting to execute an action which requires the token but the token not being available. This is most commonly caused by destroying the client and then attempting to execute an action.

This error is also caused by attempting to use a client which has not been logged in. Both of the examples below will throw errors.

<branch version="11.x">

```js
const { Client } = require('discord.js');
const client = new Client(); // Should not be here!

module.exports = (message, args) =>	{
	// Should be message.client instead!
	client.fetchUser(args[0]).then(user => {
		message.reply('your requested user', user.tag);
	});
};
```

```js
const { Client } = require('discord.js');
const client = new Client();

client.on('message', someHandlerFunction);

client.login('token');
//	client will not be logged in yet!
client.fetchUser('myId').then(someInitFunction);
```

</branch>
<branch version="12.x">

```js
const { Client } = require('discord.js');
const client = new Client(); // Should not be here!

module.exports = (message, args) =>	{
	// Should be message.client instead!
	client.users.fetch(args[0]).then(user => {
		message.reply('your requested user', user.tag);
	});
};
```

```js
const { Client } = require('discord.js');
const client = new Client();

client.on('message', someHandlerFunction);

client.login('token');
//	client will not be logged in yet!
client.users.fetch('myId').then(someInitFunction);
```

### MessageEmbed field names may not be empty.

This error originates from attempting to call `MessageEmbed.addFields()` with field object that has an empty string as a value for `name` field. If you would like the title to be empty for a reason, you should use a zero width space, which can be inputted as `\u200b`.

### MessageEmbed field values may not be empty.

This error, in conjunction to the previous error, is the result of calling `MessageEmbed.addFields()` with field object that has an empty string as a value for `value` field. You can use a zero width space if you would like this empty.

</branch>

### The messages must be an Array, Collection, or number.

This error originates from an invalid call to `bulkDelete()`, make sure you are inputting a valid Array or Collection of messages, or a valid number.

### Members didn't arrive in time.

Another common error, this error originates from the client requesting members from the API through the websocket, and the member chunks not arriving in time and triggering the timeout. The most common cause to this error is a bad connection, however, it can also be caused by a very large amount of members being fetched, upwards of 50 thousand. To fix this, run the bot on a location with better internet, such as a VPS. If this does not work for you, you will have to manually change the hardcoded member fetching timeout in the source code.

### MaxListenersExceededWarning: Possible EventEmitter memory leak detected...

This error is caused by spawning a large amount of event listeners, usually for the client. The most common cause of this is nesting your event listeners instead of separating them. The way to fix this error is to make sure you do not nest your listeners, it is **not** to use `emitter.setMaxListeners()` as the error suggests.

You can debug these messages in different ways:
- Through the [CLI](https://nodejs.org/api/cli.html#cli_trace_warnings): `node --trace-warnings index.js`
- Through the [`process#warning` event](https://nodejs.org/api/process.html#process_event_warning): `process.on('warning', console.warn);`

### Cannot send messages to this user.

This error is thrown when the bot attempts to send a DM message to a user and it is unable to do so. This is caused by a variety of reasons:
- The bot and the user do not share a guild (oftentimes people attempt to dm the user after kicking or banning them).
- The bot is attempting to DM another bot.
- The user has blocked the bot.
- The user has disabled dms in the privacy settings.

In the case of the last two reasons, the error is not preventable, as the Discord API does not provide a way to check if you can send a user a dm until you attempt to send one. The best way to handle this error is to add a `.catch()` where you attempt to dm the user, and either ignore the rejected promise, or do what you want because of it.

## Common miscellaneous errors

### code ENOENT... syscall spawn git.

This error is commonly thrown by your system due to it not being able to find `git`. You need to install `git` or update your path if `git` is already installed. Here are the download links for it:
- Ubuntu/Debian: `sudo apt-get install git`
- Windows: [git-scm](https://git-scm.com/download/win)

### code ELIFECYCLE

This error is commonly thrown by your system in response to the process unexpectedly closing. It can usually be fixed by cleaning npm cache, and deleting node_modules. The instructions for doing that are as such:
- Clean npm cache with `npm cache clean --force`
- delete `node_modules`
- delete `package-lock.json` (make sure you have a `package.json`!)
- run `npm install` to reinstall packages from `package.json`

