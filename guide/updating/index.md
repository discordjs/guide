---
forceTheme: red
---

# A Brief Primer Updating from v11 to v12

After a long time in development, Discord.js v12 is nearing a stable release, meaning it's time to update from v11 to get new features for your bots!  However, with those new features comes a lot of changes to the library that will break code written for v11.  This guide will serve as a handy reference for updating your code, covering the most commonly-used methods that have been changed, new topics such as partials and internal sharding, and will also include a comprehensive list of the method and property changes at the end.

## Before You Start

v12 requires Node 10.x or higher to  use, so make sure you're up-to-date.  To check your Node version, use `node -v` in your terminal or command prompt, and if it's not high enough, update it!  There are many resources online to help you get up-to-date.

For now, you do need Git installed and added to your PATH environment, so ensure that's done as well - again, guides are available online for a wide variety of operating systems.  Once you have Node up-to-date and Git installed, you can install v12 by running `npm install discordjs/discord.js` in your terminal or command prompt for text-only use, or `npm install discordjs/discord.js node-opus` for voice support.

:::danger
Version 12 is an experimental development version of the library and might introduce breaking changes at any point without notice! Please watch the [github](https://github.com/discordjs/discord.js/issues) cloesly to make sure you catch any bugs that might apply. You can pin your used version to a specific commit ([documentation](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies) at npm)
:::

:::tip
Take me back to [safety](/)!
:::

## How to read this guide

* All section headers are named in the following convention: `Class#methodOrProperty`.
* The use of parenthesis designates optional inclusion. For example, `Channel#fetch(Pinned)Message(s)` means that this section will include changes for `Channel#fetchPinnedMessages`, `Channel#fetchMessages`, and `Channel#fetchMessage`.
* The use of asterisks designates a wildcard. For example, `Channel#send***` means that this section will include changes for `Channel#sendMessage`, `Channel#sendFile`, `Channel#sendEmbed`, and so forth.
