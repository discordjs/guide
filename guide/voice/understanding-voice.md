## Understanding Voice

<branch version="11.x">

The Discord.js voice system allows your bot to join voice channels and play audio. This guide will teach you how to make simple music bots, and tips and tricks to optimize performance!

This voice guide is written for Discord.js v12, which features an improved audio system. Much of the example code in the voice guide is unsuitable for v11 and below - to access this content, please update Discord.js to v12! 

</branch>
<branch version="12.x">

::: tip
It's common for people to get confused with voice and not understand what they're doing. **This topic is optional**, but it aims to solve these problems by explaining some of the jargon and features of the Discord API.
:::

### Glossary
- [PCM](https://en.wikipedia.org/wiki/Pulse-code_modulation) - Think of this as raw audio, it is not encoded in anything special and is used by your computer at a lower level.
- [Opus](https://en.wikipedia.org/wiki/Opus_(audio_format)) - This is a _lossy audio format_, it's an encoding applied to PCM that makes music playable over Discord. An Opus encoder generates Opus packets which can be played over Discord.
- [Ogg](https://en.wikipedia.org/wiki/Ogg) and [WebM](https://en.wikipedia.org/wiki/WebM) - these are audio containers. Think of this as ZIP vs RAR - they both contain the exact same audio, but they go about containing it in different ways. In this context, these containers store lots and lots of Opus audio packets, which can be extracted to be played.
- [FFmpeg](https://ffmpeg.org/) - for cases where we _don't_ have Opus audio, e.g. in MP3 files, we need a way of converting them to Opus. FFmpeg is the tool we use, it converts hundreds of formats of media to Opus for us so they can be played over Discord.

### The voice connection lifecycle
1. A packet is sent to the main gateway telling Discord we wish to join a voice channel. Discord responds with a voice gateway (WebSocket) to connect to and the bot authenticates itself. We also select an _encryption mode_ available on that gateway. We now start heart beating.
2. We find our external port and send it to Discord over UDP so we can send/receive audio. It follows that a voice connection has two main components, a WebSocket connection - where we can change speaking status - and a UDP socket, where audio is actually sent and received.
3. We send our audio packets at regular time intervals to the UDP socket, which forwards it to other users connected to the channel.
4. The server may change its voice region, in this case Discord.js will disconnect these sockets and reconnect to the new voice servers.
5. Once we're done with the voice connection, we tell the main gateway that we're no longer in a voice channel, and we can now destroy the UDP socket and voice gateway connection without disrupting any activity on the normal gateway.

### Playing audio

To play audio, we need to send Opus audio packets to Discord at a regular time interval - we have selected 20ms. This is the job of the `StreamDispatcher` - it is simply a WritableStream that has Opus audio packets written to it. The dispatcher handles the timing of the packets, and also applies some metadata, e.g. the sequence number of the packet, the timestamp, and then encrypts the packet before sending it via the UDP socket.

Obtaining the Opus audio is mainly offloaded to a separate module, [`prism-media`](https://github.com/amishshah/prism-media). This module converts media to Opus audio, either through "demuxing" Ogg/WebM media files (extracting Opus audio directly), or using FFmpeg to transcode most media formats to Opus audio so we can use it.

It can also be used to change the volume of a stream in real-time without much cost to performance.

In conclusion:

1. You do `VoiceConnection#play(...)`
2. Discord.js will convert whatever you've provided into Opus audio in the most efficient way it can find. The worst-case route would be having FFmpeg convert a file to PCM, then passing this data through an Opus encoder.
3. A `StreamDispatcher` is created and it is fed data from the Opus audio stream
4. The StreamDispatcher will take an Opus audio packet every 20ms, applying metadata and then encrypting it. The packet is then sent over UDP
5. This occurs until the stream has ended, in which case the StreamDispatcher is destroyed and all intermediary processes, (e.g. FFmpeg transcoder, Volume Transformer, Opus Encoder) are all destroyed.

### Receiving audio

::: warning
Discord does not officially support bots receiving audio. However, Discord.js does its best to implement this anyway! 
:::

Just as we send audio to the UDP socket, we also receive audio through the UDP socket. Processing this audio is the reverse process of sending audio:

1. The packet is decrypted
2. Metadata is removed, leaving an Opus packet
3. If selected, the packet is decoded into PCM audio
4. The processed packet is pushed to a user-friendly stream given to you

### Key takeaways

- You should be familiar with the definitions in the glossary above
- A voice connection does not disrupt the bot's main gateway - separate connections to a voice gateway and UDP socket are created
- The `StreamDispatcher` is essentially a WritableStream that takes Opus audio
- Receiving audio is officially unsupported, however we do our best to maintain it
- Playing audio has varying complexity depending on the file/audio you want to play - the simplest (and most efficient) files to play would be Ogg/WebM files as they already contain Opus audio. Other files must be passed through FFmpeg and an Opus Encoder before they are able to be played

</branch>
