# Errors

There is no doubt that you have encountered errors while making bots. While errors are very useful at warning you of what is going wrong, many people are stumped by them and how to track them down and fix them, but don't worry, we have you covered. This section will be all about how to diagnose errors, how to identify where they are coming from, and how to fix them.

## Types of Errors

### API Errors

API Errors or DiscordAPIErrors are errors which are thrown by the Discord API when an invalid request is carried out. API Errors can be mostly diagnosed using the message that is given. They can also be further examined by seeing the http method and path used, we will explore tracking these errors down in the next section.

Example: `DiscordAPIError: Cannot send an empty message`

### Discord.js Errors

Discord.js Errors are errors which are thrown by the library itself, they can usually be easily tracked down using the stacktrace and error message.

Example: `Error: Members didn't arrive in time.`

### JS Errors

JS Errors are simple errors which can be thrown by node itself, or by discord.js. These types of errors can easily be fixed by looking at the type of error, and the stacktrace. You can find a full list of types [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) And a list of common js errors [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors).

Example: `ReferenceError: "x" is not defined`

### Websocket and Network Errors

Websocket and Network errors are common system errors thrown by Node in response to something wrong with the websocket connection. Unfortunately, these errors do not have a concrete solution and can be (usually) fixed by getting a better, and stronger connection. However, if you handle these errors correctly, discord.js will attempt to reconnect to the websocket automatically.

You can handle these errors by adding an error listener as shown below.

```js
client.on('error', console.error);
```

Now, when an error occurs it will be logged to the console and discord.js will automatically attempt to reconnect to the websocket.
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
- Copying the client secret instead of the bot token (token is alphanumerical and 3 parts delimited by a period while client secret is all numbers)
- Simply showing the token and copying that, instead of clicking regenerate and copying that.

<branch version="12.x">

::: warning
On master there used to be an issue where the token was not prefixed correctly which resulted in valid tokens being marked as invalid. If you have verified that all of the above is not the case, make sure you have updated discord.js to the latest commit.
:::

</branch>

### Request to use token, but token was unavailable to the client.

Another common error, this error originates from the client attempting to execute an action which requires the token but the token not being available. This is most commonly caused by destroying the client and then attempting to execute an action.

<branch version="12.x">

### MessageEmbed field names may not be empty.

This error originates from attempting to call `MessageEmbed.addField()` without the first parameter, which is a title. If you would like the title to be empty for a reason, you should use a zero width space, which can be inputted as `\u2008`.

### MessageEmbed field values may not be empty.

This error, in conjunction to the previous error, is the result of calling `MessageEmbed.addField()` without the second parameter, the value. You can use a zero width space if you would like this empty.

</branch>

### The messages must be an Array, Collection, or number.

This error originates from an invalid call to `bulkDelete()`, make sure you are inputting a valid Array or Collection of messages, or a valid number.

### Members didnt't arrive in time.

Another common error, this error originates from the client requesting members from the API through the websocket, and the member chunks not arriving in time and triggering the timeout. The most common cause to this error is a bad connection, however, it can also be caused by a very large amount of members being fetched, upwards of 50 thousand. To fix this, run the bot on a location with better internet, such as a VPS. If this does not work for you, you will have to manually change the member fetching timeout.

### MaxListenersExceededWarning: Possible EventEmitter memory leak detected...

This error is caused by spawning a large amount of event listeners, usually for the client. The most common cause of this is nesting your event listeners instead of separating them. This can also be caused by spawning a lot of Collectors, since Collectors themselves spawn event listeners. The way to fix this error is to make sure you do not nest your listeners or spawn a lot of Collectors, it is **not** to use `emitter.setMaxListeners()` as the error suggests.

### Cannot send messages to this user.

This error is thrown when the bot attempts to send a DM message to a user and it is unable to do so. This is caused by a variety of reasons:
- The bot and the user do not share a guild (oftentimes people accidentally kick or ban a user and then try to dm them).
- The user has blocked the bot.
- The user has disabled dms in the privacy settings.

In the case of the last two reasons, the error is not preventable, as the Discord API does not provide a way to check if you can send a user a dm until you attempt to send one. The best way to handle this error is to add a `.catch()` where you attempt to dm the user, and either ignore the rejected promise, or do what you want because of it.

## Common miscellaneous errors

### code ENOENT... syscall spawn git.

This is an error commonly thrown by npm due to git not being installed on your machine. You must install git:
Ubuntu/Debian: `sudo apt-get install git`
Windows: https://git-scm.com/download/win

