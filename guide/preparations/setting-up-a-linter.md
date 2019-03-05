---
title: Linter(構文チェッカー)のセットアップ
---

<!--
# Setting up a linter
-->

# Linter(構文チェッカー)のセットアップ

<!--
As a developer, it's a good idea to make your development process as streamlined as possible. Installing and utilizing the right tools is an essential part of any project you're working on. Although it's not required, installing a linter will help you greatly.
-->

開発者として、開発過程をできるだけ合理的にする事をおすすめします。適切なツールをインストールして利用することは、作業しているすべてのプロジェクトにとって不可欠なことです。必須ではありませんが linter(構文チェッカー)を利用することで、あなたを大いに助けることになるでしょう。

<!--
## Installing a code editor
-->

## コードエディタのインストール

<!--
First, you will need a proper code editor. Using Notepad and Notepad++ is discouraged, as they're inefficient for projects like these. If you are using either, it is highly recommended to switch in order to save everyone lots of headaches and unnecessary syntax error questions.
-->

はじめに、適切なコードエディタを用意しましょう。メモ帳やNotepad++は、このようなプロジェクトには向いていないのでおすすめしません。これらのエディタを利用すると多くの頭痛や構文エラーが発生します、良いエディタに切り替えることでみんなが救われるでしょう。

<!--
* [Visual Studio Code](https://code.visualstudio.com/) is a very popular choice known for being fast and powerful. It supports a broad range of languages and comes with its own terminal, as well as built-in intellisense and autocomplete for both JavaScript and TypeScript. This is the recommended choice.
* [Atom](https://atom.io/) is user-friendly, being concise and easy to navigate. This is what many developers use to get started.
* [Sublime Text](https://www.sublimetext.com/) is another powerful editor known for looking sleek and performing speedily and efficiently.
-->

* [Visual Studio Code](https://code.visualstudio.com/) 高速で高性能であるため非常に人気な選択肢です。これは広範囲の言語をサポートし独自のターミナルが付属しています、JavaScriptやTypeScriptのためのインテリセンスや自動補充も備わっています。これは、おすすめの選択です。
* [Atom](https://atom.io/) 簡単で扱いやすく、ユーザーにフレンドリーです。多くの開発者が始めに使用します。
* [Sublime Text](https://www.sublimetext.com/) 洗練された外観でスピーディーかつ効率的に実行できることで知られてるもう一つの強力なエディタです。

<!--
## Installing a linter
-->

## Linterのインストール

<!--
One of the major advantages proper code editors have over Notepad and Notepad++ is their ability to use linters. Linters check syntax and help you produce consistent code that follows certain style rules that you can define yourself, if you choose to do so. They help form good habits if you stick to a single configuration. When you start using a linter, you might be bombarded with errors at first. This is normal and perfectly fine. It might be a pain to get through during the initial process, but it's most definitely worth it.
-->

適切なコードエディタがメモ帳やNotepad++より優れている大きな理由の一つはLinterを利用することができることです。Linterは構文をチェックし、あなたが利用することを選択した場合、自分で定義できる特定のスタイルに従う一貫したコードを作成するのを助けます。あなたが決めたスタイルを守れば、これは良い習慣を定着させるのを助けます。

<!--
First, be sure to install the [ESLint package](https://www.npmjs.com/package/eslint) so that you have it available in your project.
-->

まず、[ESLint](https://www.npmjs.com/package/eslint)をインストールして、プロジェクトで利用できるようにします。

<!--
```bash
# locally
npm install eslint

# globally
npm install --global eslint
```
-->

```bash
# ローカルインストール
npm install eslint

# グローバルインストール
npm install --global eslint
```

<!--
Afterwards, install the appropriate plugin(s) for your editor of choice.
-->

その後、エディタにあった拡張機能をインストールしてください。

<!--
* [ESLint for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Linter-ESLint for Atom](https://atom.io/packages/linter-eslint) (requires [Linter for Atom](https://atom.io/packages/linter))
* [ESLint for Sublime Text](https://packagecontrol.io/packages/ESLint)
-->

* [Visual Studio Code : ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Atom : Linter-ESLint](https://atom.io/packages/linter-eslint) ([Atom : Linter](https://atom.io/packages/linter)が必要)
* [Sublime Text : ESLint](https://packagecontrol.io/packages/ESLint)

<!--
::: tip
You can install each of these directly inside the editors themselves. For Visual Studio Code, press `Ctrl + Shift + X`. For Atom, press `Ctrl + ,` and click on "Install". For Sublime, press `Ctrl + Shift + P` and search for "Install Package" (available via [Package Control](https://packagecontrol.io/installation)). After that, you may then search for the appropriate plugin and install it through there.
:::
-->

::: tip
あなたは、これらをエディタに直接インストールすることができます。Visual Studio Codeでは`Ctrl + Shift + X`。Atomでは`Ctrl + ,`。Sublimeでは `Ctrl + Shift + P`([Package Control](https://packagecontrol.io/installation)が必要)。その後、適切な拡張機能を見つけインストールしてください。
:::

<!--
## Setting up ESLint rules
-->

## ESLintのルール設定

<!--
ESLint may display a lot of warnings and errors about your code when you start using it, but don't let this startle you. In order to get started, follow these steps:
-->

ESLintを使い始めるとコードに対するエラーや警告がたくさん表示されると思いますが、驚く必要はありません。しっかりと利用するために以下のステップに従ってください。

<!--
1. Create a file in your root directory named `.eslintrc.json` (where your main project file is located).
2. Copy the code below into the file.
-->

1. ルートディレクトリに`.eslintrc.json`というファイルを作成する(ここには、このプロジェクトのメインファイルがあります)。
2. 以下のコードをファイルに貼り付ける。

```json
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2017
	},
	"rules": {

	}
}
```

<!--
This is the base of what an ESLint file will look like. The `rules` object is where you'll define what rules you want to apply to ESLint. For example, if you want to make sure you never miss a semicolon, the `"semi": ["error", "always"]` rule is what you'll want to add inside that object.
-->

これは、ESLintファイルの基本です。`rules`オブジェクトはESLintのルールを定義する場所です。例えば、セミコロンを必ず付けるようにする場合、ルールに`"semi": ["error", "always"]`を追加します。

<!--
You can find a list of all of ESLint's rules on their site, located [here](https://eslint.org/). There are indeed many rules and it may be overwhelming at first, but you'll only need to go through the list and define your file once.
-->

ESLintのすべてのルールは[ここ](https://eslint.org/)にあります。実際にたくさんのルールがありはじめは圧倒されると思いますが、リストをたどり一回設定してしまえばそれで済みます。

<!--
Alternatively, if you don't want to go through everything one-by-one on your own, you can use the ESLint file we use for this guide.
-->

自分で設定したくなければ、このガイドで利用しているルールを利用することもできます。

```json
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2017
	},
	"rules": {
		"brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
		"comma-dangle": ["error", "always-multiline"],
		"comma-spacing": "error",
		"comma-style": "error",
		"curly": ["error", "multi-line", "consistent"],
		"dot-location": ["error", "property"],
		"handle-callback-err": "off",
		"indent": ["error", "tab"],
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

<!--
The major points of this setup would be:
-->

この設定の主なポイントは以下のとおりです。

<!--
* Allowing you to debug with `console.log()`;
* Prefer using `const` over `let` or `var`, as well as disallow `var`;
* Disapproving of variables with the same name in callbacks;
* Requiring single quotes over double quotes;
* Requiring semicolons. While it's not required in JavaScript, it's considered one of the most common best practices to follow;
* Requiring accessing properties to be on the same line;
* Requiring indenting to be done with tabs;
* Limiting nested callbacks to 4. If you hit this error, it is a good idea to consider refactoring your code.
-->

* `console.log()`でデバッグできるようにします。
* `var`を禁止し、`var`や`let`ではなく`const`を最優先で使うようにします。
* コールバック内で同じ名前の変数を許可しません。
* ダブルクオート(`"`)ではなくシングルクオート(`'`)を利用するようにします。
* セミコロンが必要です。JavaScriptでは必須ではありませんがつけるほうが良いとされています。
* プロパティへのアクセスを同じ行にする必要があります。
* タブでインデントすることを要求します。
* ネストしたコールバックを4つに制限します。このエラーが発生した場合は、コードのリファクタリングを検討することをお勧めします。

<!--
If your current code style is a bit different or you simply don't like a few of these rules, that's perfectly fine! Just head over to the [ESLint docs](https://eslint.org/docs/rules/), find the rule(s) you want to modify, and change them accordingly.
-->

現在のコードスタイルと少し違う場合や、これらの規則のいくつかが気に入らない場合は、それで問題ありません。[ESLint docs](https://eslint.org/docs/rules/)に行き、変更したいルールを見つけて、それに応じて変更してください。
