<style scoped>
.emoji-container {
	display: inline-block;
}

.emoji-container .emoji-image {
	width: 1.375rem;
	height: 1.375rem;
	vertical-align: bottom;
}
</style>

# What's new

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				author="discord.js"
				:command="true"
			>upgrade</DiscordInteraction>
		</template>
		discord.js v14 has released and the guide has been updated!
		<span class="emoji-container">
			<img class="emoji-image" title="tada" alt=":tada:" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/72x72/1f389.png" />
		</span>
		<br />
		This includes additions and changes made in Discord, such as slash commands and message components.
	</DiscordMessage>
</DiscordMessages>

## Site

- Upgraded to [VuePress v2](https://v2.vuepress.vuejs.org/)
- New theme made to match the [discord.js documentation site](https://discord.js.org/)
- Discord message components upgraded to [@discord-message-components/vue](https://github.com/Danktuary/discord-message-components/blob/main/packages/vue/README.md)
- Many fixes in code blocks, grammar, consistency, etc.

## Pages

All content has been updated to use discord.js v14 syntax. The v13 version of the guide can be found at [https://v13.discordjs.guide/](https://v13.discordjs.guide/).

### New

- [Updating from v13 to v14](/additional-info/changes-in-v14.md): A list of the changes from discord.js v13 to v14
- [Slash commands](/slash-commands/advanced-creation.md): Registering, replying to slash commands and permissions
- [Buttons](/message-components/buttons): Building, sending, and receiving buttons
- [Select menus](/message-components/select-menus): Building, sending, and receiving select menus
- [Threads](/popular-topics/threads.md): Creating and managing threads
- [Formatters](/popular-topics/formatters.md): A collection of formatters to use with your bot

### Updated

- Commando: Replaced with [Sapphire](https://sapphirejs.dev/docs/Guide/getting-started/getting-started-with-sapphire)
- [Voice](/voice/): Rewritten to use the [`@discordjs/voice`](https://github.com/discordjs/discord.js/tree/main/packages/voice) package
- [Command handling](/creating-your-bot/command-handling.md/): Updated to use slash commands
	- Obsolete sections removed
- `client.on('message')` snippets updated to `client.on('interactionCreate')`
	- [Message content will become a new privileged intent on August 31, 2022](https://support-dev.discord.com/hc/articles/4404772028055)

<DiscordMessages>
	<DiscordMessage profile="bot">
		Thank you to all of those that contributed to the development of discord.js and the guide!
		<span class="emoji-container">
			<img class="emoji-image" title="heart" alt=":heart:" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/72x72/2764.png" />
		</span>
	</DiscordMessage>
</DiscordMessages>
