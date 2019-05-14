# The Basics

Now that you have your dependencies installed, you can start using voice!

## Joining voice channels

Joining a voice channel is easy, here's a common example:

```js
client.on('message', async message => {
  // Join the same voice channel of the author of the message
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();
  }
});
```

If you try to join a channel the bot is already in, nothing will happen so we don't need to worry about running this method repeatedly.

::: tip
In the above example we accessed a `VoiceState` through `member.voice`. A voice state exists for members connected to a voice channel, and it tells you which channel they're connected to, if the member is speaking, and whether they're deafened or muted. Consult the documentation for a full description of what voice states can do!
:::

## Playing audio

Playing audio is also simple. It provides you with a `StreamDispatcher`, you can use this to control and monitor the playback of your audio over the voice channel.

```js
// Create a dispatcher
const dispatcher = connection.play('audio.mp3');

dispatcher.on('start', () => {
  console.log('audio.mp3 is now playing!');
});

dispatcher.on('finish', () => {
  console.log('audio.mp3 is finished playing!');
});

// Always remember to handle errors appropriately!
dispatcher.on('error', console.error);
```

A VoiceConnection can only ever have one dispatcher. If you try to play another stream while audio is already playing, the existing stream will be destroyed and the new audio will begin to play shortly after.

To end the stream yourself, you can run:

```js
dispatcher.destroy();
```

## Leaving voice channels

Leaving a voice channel will cause the current dispatcher (if there is one) to be destroyed.

```js
// Option 1
connection.disconnect();

// Option 2
voiceChannel.leave();
```
