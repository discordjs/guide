# Introduction

"Voice" refers to the ability of a bot to send audio in voice channels. Discord.js makes it easy for you to get up and running with voice!

## Installation

### Barebones

To add voice functionality to your Discord.js v12 or v13 bot, install the `@discordjs/voice` module:

```bash
npm install @discordjs/voice
```

Out of the box, you'll be able to play Ogg and WebM Opus files using `@discordjs/voice` without any additional dependencies. However, you may consider additional dependencies if you want to play additional file types, or if you want improved performance.

::: warning
This guide assumes you have installed at least one additional dependency – FFmpeg. More information on this can be found in the
section below.
:::

### Optional Dependencies

- An Opus encoding library
  - [`@discordjs/opus`](https://github.com/discordjs/opus) (best performance)
  - [`opusscript`](https://github.com/abalabahaha/opusscript/)
- FFmpeg – allows you to play a range of media (e.g. MP3s).
  - [`ffmpeg`](https://ffmpeg.org/) - install and add to your system environment
  - [`ffmpeg-static`](https://www.npmjs.com/package/ffmpeg-static) - to install FFmpeg via npm
- Faster encryption packages
  - [`sodium`](https://www.npmjs.com/package/sodium) (best performance)
  - [`libsodium-wrappers`](https://www.npmjs.com/package/libsodium-wrappers)

::: tip
Outside a development environment, it is recommended for you to use `@discordjs/opus` and `sodium` to improve performance and improve the stability of audio playback!

If you're struggling to install these dependencies, make sure you have build tools installed first. On Windows, this is as easy as running `npm install --global --production --vs2015 --add-python-to-path windows-build-tools`!
:::

## Debugging Dependencies

The library includes a helper function that helps you to find out which dependencies you've successfully installed. This information is also very helpful if you ever need to submit an issue on the `@discordjs/voice` issue tracker.

```ts
import { generateDependencyReport } from '@discordjs/voice';

console.log(generateDependencyReport());

/*
--------------------------------------------------
Core Dependencies
- @discordjs/voice: 0.0.1
- discord.js: 12.5.1
- prism-media: 1.2.5

Opus Libraries
- @discordjs/opus: 0.4.0
- opusscript: 0.0.7

Encryption Libraries
- sodium: 3.0.2
- libsodium-wrappers: not found
- tweetnacl: 1.0.3

FFmpeg
- version: 4.2.4-1ubuntu0.1
- libopus: yes
--------------------------------------------------
*/
```

- **Core Dependencies**
  - These are dependencies that should definitely be available.
- **Opus Libraries**
  - If you want to use varying file types or inline volume altering, you will need to have one of these
- **Encryption Libraries**
  - You should have at least one encryption library installed to use `@discordjs/voice`
- **FFmpeg**
  - If you want to use varying file types, you will need to have FFmpeg installed
  - If `libopus` is enabled, you will be able to make use of performance improvements planned for the future.
