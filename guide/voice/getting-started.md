# Getting Started

Now that you have your dependencies installed, we can start using voice!

## Joining voice channels

Joining a voice channel is easy, here's a common example:

```js
// Join the same voice channel of the author of the message
if (message.member.voice.channel) {
  const connection = await message.member.voice.channel.join();
}
```

If you try to join a channel the bot is already in, nothing will happen so we don't need to worry about running this method repeatedly.
