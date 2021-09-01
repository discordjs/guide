# 린터 설정하기

개발자로써, 개발 과정을 할 수 있는 한 간소하게 유지하는 것은 문론 좋은 생각입니다. 린터는 문법을 체크하고, 여러분이 직접 설정하거나 기존에 쓰이던 것을 상속받아서 쓸 수 있는 설정 파일을 통해 코드를 일관되게 유지하도록 도와줄 겁니다. 문론 이건 필수는 아니지만, 린터를 사용하는 것은 결국 여러분을 엄청나게 도와줄 겁니다.

## 에디터 설치

우선, 여러분은 적당한 코드 에디터를 준비해야 합니다. 메모장이나 Notepad++ 등의 프로그램은 그닥 적절하지 않고, 이런 종류의 프로젝트엔 비효율적입니다. 만약 아래의 에디터를 사용하지 않고 있다면, 한번 바꿔보는 건 어떨까요?

* [Visual Studio Code](https://code.visualstudio.com/) 는 많이 사용되는 에디터입니다; 이 에디터는 빠르고 강력한 것으로 유명합니다. 정말 많은 언어를 지원하고, 터미널도 포함하고 있으며, 내장 인텔리센스 지원, 그리고 JavaScript와 TypeScript를 위한 자동완성을 지원합니다. 정말 추천하는 에디터입니다.
* [Atom](https://atom.io/)은 사용자 친화적이고, 간결하며, 코드 탐색이 쉽습니다.
* [Sublime Text](https://www.sublimetext.com/)는 코드를 쓰고 읽기 쉬운 또다른 유명한 에디터 입니다.

## 린터 설치하기

[ESLint 패키지](https://www.npmjs.com/package/eslint)를 여러분의 프로젝트 폴더 안에 설치하세요.

```bash:no-line-numbers
npm install --save-dev eslint
```

적절한 에디터들의 장점 중 하나는 플러그인으로 린터 지원 기능이 있다는 것입니다. 여러분의 에디터에 적절한 플러그인(들) 을 설치하세요.

* [Visual Studio Code 용 ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Atom 용 Linter-ESLint](https://atom.io/packages/linter-eslint) ([Linter for Atom](https://atom.io/packages/linter)이 필요합니다)
* [Sublime Text 용 ESLint](https://packagecontrol.io/packages/ESLint)

::: tip
에디터 안에서 바로 플러그인을 볼 수 있습니다.

- Visual Studio Code: `Ctrl + Shift + X`
- Atom: `Ctrl + ,` 그리고 "Install" 클릭
- Sublime Text: `Ctrl + Shift + P` 후 "Install Package" ([Package Control](https://packagecontrol.io/installation)을 사용하는) 를 검색하세요

그 후, 적절한 플러그인을 찾고 설치하세요.
:::

## ESLint 규칙 설정

여러분이 ESLint를 사용하기 시작할 때, 여러분의 코드에서 엄청난 양의 에러와 경고를 보여줄 지도 모릅니다. 하지만 걱정하지 마세요. 일단 시작하기 위해, 여러분의 프로젝트 폴더 안에 `.eslintrc.json` 라는 파일을 만들고, 아래 코드를 붙혀넣으세요.

```json
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2021
	},
	"rules": {

	}
}
```

이 코드는 ESLint 파일이 대략 어떻게 생겼는지를 보여줍니다. 우선 `rules` 객체는 ESLint에 추가하고 싶은 규칙들을 정의하는 장소입니다. 예를 들어 여러분이 세미콜론을 빠트렸는지 체크하고 싶다면, `"semi": ["error", "always"]` 를 추가하면 됩니다.

여러분은 [공식 웹사이트](https://eslint.org/docs/rules)에서 ESLint의 모든 규칙 리스트를 찾아볼 수 있습니다. 정말 많은 규칙이 존재하는데, 처음에는 여러분을 당황하게 수도 있습니다. 따라서 여러분이 모든 조합을 일일히 시험해 보고 싶지 않다면, 아래 규칙대로 설정하셔도 무방합니다:

```json {11-47}
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2021
	},
	"rules": {
		"arrow-spacing": ["warn", { "before": true, "after": true }],
		"brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
		"comma-dangle": ["error", "always-multiline"],
		"comma-spacing": "error",
		"comma-style": "error",
		"curly": ["error", "multi-line", "consistent"],
		"dot-location": ["error", "property"],
		"handle-callback-err": "off",
		"indent": ["error", "tab"],
		"keyword-spacing": "error",
		"max-nested-callbacks": ["error", { "max": 4 }],
		"max-statements-per-line": ["error", { "max": 2 }],
		"no-console": "off",
		"no-empty-function": "error",
		"no-floating-decimal": "error",
		"no-inline-comments": "error",
		"no-lonely-if": "error",
		"no-multi-spaces": "error",
		"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
		"no-shadow": ["error", { "allow": ["err", "resolve", "reject"] }],
		"no-trailing-spaces": ["error"],
		"no-var": "error",
		"object-curly-spacing": ["error", "always"],
		"prefer-const": "error",
		"quotes": ["error", "single"],
		"semi": ["error", "always"],
		"space-before-blocks": "error",
		"space-before-function-paren": ["error", {
			"anonymous": "never",
			"named": "never",
			"asyncArrow": "always"
		}],
		"space-in-parens": "error",
		"space-infix-ops": "error",
		"space-unary-ops": "error",
		"spaced-comment": "error",
		"yoda": "error"
	}
}
```

이 설정의 주목할 만한 부분들은 다음과 같습니다:

* `console.log()`를 사용할 수 있게 허용합니다;
* `let` 보다 `const` 를 사용하도록 합니다. 문론 `var`은 허용하지 않습니다;
* 콜백 함수에서 변수가 중복된 이름을 사용하지 못하게 합니다;
* 큰따옴표보다 홑따옴표를 사용하도록 합니다;
* 세미콜론을 강제합니다. JavaScript에서 필수는 아니지만, 굉장히 모범적인 규칙 중 하나입니다;
* 요청 속성이 같은 줄 위에 오도록 강제합니다;
* 들여쓰기로 탭을 사용합니다;
* 중첩된 콜백이 4번 이하로 오도록 강제합니다. 만약 이 에러가 떴다면, 여러분의 코드를 리팩토링할 좋은 기회일 겁니다.

만약 여러분이 현재 선호하는 스타일과 많이 차이가 나거나 몇몇 규칙이 마음에 들지 않는다고 해도 문제 없습니다! [ESLint 문서](https://eslint.org/docs/rules/)를 읽어보고, 여러분이 수정하고 싶은 규칙(들)을 찾은 후, 문서에 따라서 마음껏 변경하세요.
