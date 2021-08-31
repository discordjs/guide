# 들어가며

만약 여러분이 이 가이드를 읽고 있다면, 아마 여러분은 Discord.js 로 봇을 만들어 보고 싶을 것입니다. 좋아요! 아주 잘 찾아오셨습니다,
이 가이드는 앞으로 여러분에게 다음과 같은 것들을 알려 줄 겁니다:

- 봇을 [만들고 실행하는](https://discordjs.guide/preparations/) 기초적인 방법;
- 명령어를 [만들고](https://discordjs.guide/creating-your-bot/), [구성하고](https://discordjs.guide/creating-your-bot/command-handling.html), 확장시키는 방법;
- 자주 쓰이는 방법에 대한 깊은 설명과 예제들 (e.g. [반응](https://discordjs.guide/popular-topics/reactions.html), [임베드](https://discordjs.guide/popular-topics/embeds.html), [canvas](https://discordjs.guide/popular-topics/canvas.html));
- 데이터베이스 적용하기 (e.g. [sequelize](https://discordjs.guide/sequelize/) 그리고 [keyv](https://discordjs.guide/keyv/));
- [sharding](https://discordjs.guide/sharding/) 적용해 보기;
- 그 외에도 기타 등등..!

또, 이 가이드에는 자주 발생하는 에러들과 그에 대한 해결법, 코드를 예쁘게 유지하고 적합한 개발 환경을 준비하는 방법 등 여러분을 도울 여러 내용도 다루고 있습니다.
신나지 않나요? 좋습니다! 바로 시작하도록 하죠!

## 시작하기 전에...

네, 봇을 만드는 일은 참 재미있지만, 그 전에 몇 가지 전제 조건이 있습니다. discord.js로 봇을 만들기 전에, 여러분은 JavaScript 자체에 대해 깊게 이해하고 있어야 합니다.
JavaScript나 기초적인 프로그래밍에 대한 지식 없이 봇을 만들어 _볼 수는_ 있지만, 곧 난관에 부딫히고 말 겁니다. 복잡하지 않은 문제에 발목이 잡히거나, 진짜 쉬운 문제로 끙끙대고, 결국엔 좌절하게 될 지도 모릅니다. 정말 별로죠?

만약 Javascript를 잘 모르지만, 배워 볼 의향이 있다면 다음 링크들에서 도움을 받아 보세요.

* [Eloquent JavaScript, a free online book](http://eloquentjavascript.net/)
* [JavaScript.info, a modern javascript tutorial](https://javascript.info/)
* [CodeCademy's interactive JavaScript course](https://www.codecademy.com/learn/learn-javascript)
* [Nodeschool, for both JavaScript and Node.js lessons](https://nodeschool.io/)
* [MDN's JavaScript guide and full documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Google, your best friend](https://google.com)

문론 JavaScript를 충분히 많이 배운 것 같다고 느껴지시면 언제든지 이 가이드로 봇 개발을 시작해 보세요!

<a href="https://www.netlify.com">
	<img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
</a>
