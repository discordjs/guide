# Bot Ping

You've made it to this stage, and that stage is getting the ping of your well-made bot. **Ping** is the reaction time of your bot, from getting the request to sending a response. In this section, you'll learn how to get the **websocket** (heartbeat) ping of your bot. You will also learn how to get the latency between the message being sent, and the time that the bot responded.

If you didn't know what a **WebSocket** is, a **WebSocket** is the communication or link between the **client** and **server**. In this case, the client is your bot, and the server is the **Discord API**. Lets get started!

To start off, here is the base code that we'll be using in this example:
```js
const { Client } = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.login('your-token-goes-here');
```

## Client's ping in a command

Now, you will have to write the code necessary to retrieve the heartbeat ping through a command:
```js
if (message.content === '!ping') {
	message.channel.send(`My ping is ${client.ws.ping}ms!`);
}
```
It's pretty simple. You're getting the bot (client), and then its **WebSocket**. After that, you're getting the ping thats stored after every handshake!

For extra convenience, the **ms** stands for **milliseconds**, which is what the ping is measured in.

After your hard work, here is what the resulting response should look like, the number being the ping of your bot!
<div is="discord-messages">
  <discord-message author="User" avatar="djs">
    !ping
  </discord-message>
  <discord-message author="Tutorial Bot" avatar="blue" :bot="true">
    My ping is 100ms!
  </discord-message>
</div>

**It's as simple as that!**
  
## Client's latency in a command

Theres another alternative to the ping command above that is just as popular, and that is the latency! This type of ping measurement measures the time between the message being sent by the bot, the bot confirming it was sent, and subtracting that timestamp from the triggering messages timestamp.

Just like in the previous example:
```js
if (message.content === '!latency') {
	message.channel.send('Pinging...').then(sent => {
		sent.edit(`Pong! That took ${sent.createdTimestamp - message.createdTimestamp}ms!`);
	});
}
```
After finishing, this is what the result should look like!
<div is="discord-messages">
  <discord-message author="User" avatar="djs">
    !latency
  </discord-message>
  <discord-message author="Tutorial Bot" avatar="blue" :bot="true">
    Pong! That took 135ms!
  </discord-message>
</div>

## Client's websocket shard ping in a command

On the more advanced side, you can get the individual ping of a random shard!

In the following code example:
```js
if (message.content === '!shardping') {
	// Grabs a random shards ping.
	const shard = client.ws.shards.random();
	message.channel.send(`A shards ping was ${shard.ping}ms!`);
}
```
This is what the results should look like!
<div is="discord-messages">
  <discord-message author="User" avatar="djs">
    !shardping
  </discord-message>
  <discord-message author="Tutorial Bot" avatar="blue" :bot="true">
    A shards ping was 50ms!
  </discord-message>
</div>