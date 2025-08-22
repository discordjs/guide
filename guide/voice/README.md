# Introduction

"Voice" refers to Discord bots being able to send audio in voice channels. This is supported in discord.js via [@discordjs/voice](https://github.com/discordjs/discord.js/tree/main/packages/voice), a standalone library made by the developers of discord.js. While you can use it with any Node.js Discord API library, this guide will focus on using it with discord.js.

## Installation

### Barebones

To add voice functionality to your discord.js bot, you will need the `@discordjs/voice` package, as well as one of the encryption packages listed below. For example: 

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install @discordjs/voice libsodium-wrappers
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn add @discordjs/voice libsodium-wrappers
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add @discordjs/voice libsodium-wrappers
```
:::
::: code-group-item bun
```sh:no-line-numbers
bun add @discordjs/voice libsodium-wrappers
```
:::
::::

After this, you'll be able to play Ogg and WebM Opus files without any other dependencies. If you want to play audio from other sources, or want to improve performance, consider installing some of the extra dependencies listed below.

::: warning
This guide assumes you have installed at least one additional dependency – FFmpeg. More information on this can be found in the section below.
:::

### Extra Dependencies

- An Opus encoding library
  - [`@discordjs/opus`](https://github.com/discordjs/opus) (best performance)
  - [`opusscript`](https://github.com/abalabahaha/opusscript/)
- FFmpeg – allows you to play a range of media (e.g. MP3s).
  - [`ffmpeg`](https://ffmpeg.org/) - install and add to your system environment
  - [`ffmpeg-static`](https://www.npmjs.com/package/ffmpeg-static) - to install FFmpeg via npm
- Encryption packages
  - [`sodium`](https://www.npmjs.com/package/sodium) (best performance)
  - [`sodium-native`](https://www.npmjs.com/package/sodium-native)
  - [`libsodium-wrappers`](https://www.npmjs.com/package/libsodium-wrappers)
  - [`tweetnacl`](https://www.npmjs.com/package/tweetnacl)
- DAVE Protocol Support
  - [`@snazzah/davey`](https://www.npmjs.com/package/@snazzah/davey) - to enable end-to-end encryption with the DAVE protocol.

::: tip
Outside a development environment, it is recommended for you to use `@discordjs/opus` and `sodium` to improve performance and improve the stability of audio playback!

If you're struggling to install these dependencies, make sure you have build tools installed first. On Windows, this is as easy as running the following command!

<CodeGroup>
  <CodeGroupItem title="npm">

```sh:no-line-numbers
npm install --global --production --add-python-to-path windows-build-tools
```

  </CodeGroupItem>
  <CodeGroupItem title="yarn">

```sh:no-line-numbers
yarn global add --production --add-python-to-path windows-build-tools
```

  </CodeGroupItem>
  <CodeGroupItem title="pnpm">

```sh:no-line-numbers
pnpm add --global --production --add-python-to-path windows-build-tools
```

  </CodeGroupItem>
  <CodeGroupItem title="bun">

```sh:no-line-numbers
bun add --global --production --add-python-to-path windows-build-tools
```

  </CodeGroupItem>
</CodeGroup>
:::

::: warning
Some Discord clients already require the DAVE protocol for end-to-end encryption in voice chat. Ensure you have `@snazzah/davey` installed to avoid compatibility issues, as `@snazzah/davey` is only set as a dev-dependency for `@discordjs/voice` and may not install in production environments without explicit installation.
:::

## Debugging Dependencies

The library includes a helper function that helps you to find out which dependencies you've successfully installed. This information is also very helpful if you ever need to submit an issue on the `@discordjs/voice` issue tracker.

```js
const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());

/*
--------------------------------------------------
Core Dependencies
- @discordjs/voice: 0.3.1
- prism-media: 1.2.9

Opus Libraries
- @discordjs/opus: 0.5.3
- opusscript: not found

Encryption Libraries
- sodium: 3.0.2
- libsodium-wrappers: not found
- tweetnacl: not found

FFmpeg
- version: 4.2.4-1ubuntu0.1
- libopus: yes

DAVE Protocol
- @snazzah/davey: 0.1.6
--------------------------------------------------
*/
```

- **Core Dependencies**
  - These are dependencies that should definitely be available.
- **Opus Libraries**
  - If you want to play audio from many different file types, or alter volume in real-time, you will need to have one of these.
- **Encryption Libraries**
  - You should have at least one encryption library installed to use `@discordjs/voice`.
- **FFmpeg**
  - If you want to play audio from many different file types, you will need to have FFmpeg installed.
  - If `libopus` is enabled, you will be able to benefit from increased performance if real-time volume alteration is disabled.
- **DAVE Protocol**
  - Required for enabling end-to-end encryption in voice channels.
