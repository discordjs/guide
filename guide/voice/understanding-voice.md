## Understanding Voice

<branch version="11.x">

The discord.js voice system allows your bot to join voice channels and play audio. This guide will teach you how to make simple music bots and give you tips to optimize performance!

This voice guide targets discord.js v12, which features an improved audio system. Much of the example code in the voice guide is unsuitable for v11 and below–to access this content, please update discord.js to v12! 

</branch>
<branch version="12.x">

::: tip
It's common for people to get confused with voice and not understand what they're doing. **This topic is optional**, but it aims to solve these problems by explaining some of the Discord API's jargon and features.
:::

### Glossary
- [PCM](https://en.wikipedia.org/wiki/Pulse-code_modulation) - Think of this as raw audio; it is not encoded in anything special and is used by your computer at a lower level.
- [Opus](https://en.wikipedia.org/wiki/Opus_(audio_format)) - This is a _lossy audio format_; it's an encoding applied to PCM that makes music playable over Discord. An Opus encoder generates Opus packets, which can play over Discord.
- [Ogg](https://en.wikipedia.org/wiki/Ogg) and [WebM](https://en.wikipedia.org/wiki/WebM) - These are audio containers. Think of this as ZIP vs. RAR–they both contain the same audio, but they go about containing it in different ways. In this context, these containers store lots and lots of Opus audio packets, which can be extracted to be played.
- [FFmpeg](https://ffmpeg.org/) - For cases where you _don't_ have Opus audio, e.g., in MP3 files, you need a way of converting them to Opus. FFmpeg is the tool to use; it converts hundreds of media formats to Opus for you so they can play over Discord.

### The voice connection lifecycle
1. A packet is sent to the main gateway telling Discord we wish to join a voice channel. Discord responds with a voice gateway (WebSocket) to connect to, and the bot authenticates itself. You also select an _encryption mode_ available on that gateway. You then start heart beating.
2. You find your external port and send it to Discord over UDP to send/receive audio. It follows that a voice connection has two main components, a WebSocket connection–where you can change speaking status–and a UDP socket, where audio is sent and received.
3. You send your audio packets at regular time intervals to the UDP socket, which forwards them to other users connected to the channel.
4. The server may change its voice region; in this case, discord.js will disconnect these sockets and reconnect to the new voice servers.
5. Once you're done with the voice connection, tell the main gateway that you're no longer in a voice channel. You can then destroy the UDP socket and voice gateway connection without disrupting any regular gateway activity.

### Playing audio

To play audio, you need to send Opus audio packets to Discord at a fixed interval–we have selected 20ms. This is the `StreamDispatcher`s job–it is a WritableStream with Opus audio packets written to it. The dispatcher handles the packets' timing and applies some metadata, e.g., the packet's sequence number, the timestamp, and then encrypts the packet before sending it via the UDP socket.

Obtaining the Opus audio is mainly offloaded to a separate module, [`prism-media`](https://github.com/amishshah/prism-media). This module converts media to Opus audio, either through "demuxing" Ogg/WebM media files (extracting Opus audio directly) or using FFmpeg to transcode most media formats to Opus audio so you can use it.

It can also change the volume of a stream in real-time without much cost to performance.

In conclusion:

1. You do `VoiceConnection#play(...)`
2. discord.js will convert whatever you've provided into Opus audio in the most efficient way it can find. The worst-case route would be having FFmpeg convert a file to PCM, passing this data through an Opus encoder.
3. A `StreamDispatcher` is created and fed data from the Opus audio stream
4. The StreamDispatcher will take an Opus audio packet every 20ms, applying metadata, and then encrypting it. The packet is then sent over UDP
5. This occurs until the stream has ended, in which case the StreamDispatcher is destroyed, and all intermediary processes (e.g., FFmpeg transcoder, Volume Transformer, Opus Encoder) are all destroyed.

### Receiving audio

::: warning
Discord does not officially support bots receiving audio. However, discord.js does its best to implement this anyway! 
:::

Just as you send audio to the UDP socket, you also receive audio through it. Processing it is the reverse process of sending audio:

1. The packet is decrypted
2. Metadata is removed, leaving an Opus packet
3. If selected, the packet is decoded into PCM audio
4. The processed packet is pushed to a user-friendly stream given to you

### Key takeaways

- You should be familiar with the definitions in the glossary above
- A voice connection does not disrupt the bot's main gateway–separate connections to a voice gateway and UDP socket are created
- The `StreamDispatcher` is essentially a WritableStream that takes Opus audio
- Receiving audio is officially unsupported; however, we do our best to maintain it
- Playing audio has varying complexity depending on the file/audio you want to play–the simplest (and most efficient) files would be Ogg/WebM files as they already contain Opus audio. Other files must be passed through FFmpeg and an Opus Encoder before they can play.

</branch>
