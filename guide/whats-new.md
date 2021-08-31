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

# 추가된 기능

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				author="discord.js"
				:command="true"
			>upgrade</DiscordInteraction>
		</template>
		discord.js v13 has released and the guide has been updated!
		<span class="emoji-container">
			<img class="emoji-image" title="tada" src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f389.png" alt="" />
		</span>
		<br />
		This includes additions and changes made in Discord, such as slash commands and message components.
	</DiscordMessage>
</DiscordMessages>

## 사이트

- [VuePress v2](https://v2.vuepress.vuejs.org/) 로 업그레이드 했습니다.
- [discord.js 문서 사이트](https://discord.js.org/) 와 어울리는 테마가 생겼습니다.
- Discord message components 가 [@discord-message-components/vue](https://github.com/Danktuary/discord-message-components/blob/main/packages/vue/README.md) 로 업데이트 되었습니다.
- 수많은 코드 블록과 문법, 일관성 부분에서 세세한 부분들이 수정되었습니다.

## 페이지

모든 내용에서 discord.js v13 문법을 사용하도록 업데이트 되었습니다. v12 가이드는 이곳으로 옮겨졌습니다. [https://v12.discordjs.guide/](https://v12.discordjs.guide/).

### 새로 추가된 기능

- [Updating from v12 to v13](/additional-info/changes-in-v13.md): v12 에서 v13 으로 올라가면서 바뀐 모든 내용들의 목록
- [Registering slash commands](/interactions/registering-slash-commands.md): 슬래쉬 명령어를 등록하는 방법에 대한 자세한 설명
- [Replying to slash commands](/interactions/replying-to-slash-commands.md): 슬래쉬명령어에 답장하는 수많은 방법들
- [Slash command permissions](/interactions/slash-command-permissions.md): 특정 유저나 역할에 대해 슬래쉬 명령어를 제한하는 방법
- [Buttons](/interactions/buttons.md): 버튼을 만들고, 보내고, 응답을 받는 방법
- [Select menus](/interactions/select-menus.md): 선택 메뉴를 만들고, 보내고, 응답을 받는 방법
- [Threads](/popular-topics/threads.md): 스레드를 만들고 관리하기
- [Builders](/popular-topics/builders.md): 당신의 봇과 같이 사용할 수 있는 빌더 모음

### 업데이트

- Commando: Commando는 중단되었으며, [Sapphire](https://github.com/discordjs/guide/pull/711) 의 가이드로 대체됩니다
- [Voice](/voice/): [`@discordjs/voice`](https://github.com/discordjs/voice) 패키지를 사용하도록 다시 짜였습니다
- [Command handling](/command-handling/): 슬래쉬 명령어를 사용하도록 업데이트 되었습니다
	- 방치된 부분을 제거했습니다
- `client.on('message')` 스니펫이 `client.on('interactionCreate')` 로 바뀌었습니다
	- [Message content will become a new priviledged intent in April 2022](https://support-dev.discord.com/hc/en-us/articles/4404772028055)

<DiscordMessages>
	<DiscordMessage profile="bot">
		Thank you to all of those that contributed to the development of discord.js and the guide!
		<span class="emoji-container">
			<img class="emoji-image" title="heart" src="https://twemoji.maxcdn.com/v/13.1.0/72x72/2764.png" alt="" />
		</span>
	</DiscordMessage>
</DiscordMessages>
