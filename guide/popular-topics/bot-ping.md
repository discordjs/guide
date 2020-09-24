# Getting your bot's ping
When your bot is in production, something users might want to know is the **ping** of your bot. A **ping** is the reaction time between sending a request, and getting a response. In this section, you'll learn how to get the **WebSocket** ping of your bot.

In case you didn't know, a WebSocket is the communication between the **client** and **server**. In this case, the client is your bot, and it's interacting with the **Discord API** (Server). Let's jump right in!

Here's the base code you'll be using:
```js
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Bot ready!');
});

client.on('message', message => {
    // ...
});

client.login('your-token-goes-here');
```

### Ping in a Command
Now, you have to write the code for the actual ping command:
```js
if (message.content === '!ping') {
    message.channel.send(`My ping is ${client.ws.ping} MS!`)
};
```
It's pretty simple. First, you're fetching your bot (client), and then its **WebSocket**. Finally, you're using the **ping** property, to ping the **WebSocket**, and the ping gets returned!

Additionally, **MS** stands for **milliseconds**, as that's what ping is measured in.

**It's as simple as that!**