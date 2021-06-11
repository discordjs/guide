# Setting up a linter

As a developer, it's a good idea to make your development process as streamlined as possible. Installing and utilizing the right tools is an essential part of any project you're working on. Although it's not required, installing a linter will help you immensely.

## Installing a code editor

First, you will need a proper code editor. Using Notepad and Notepad++ is discouraged, as they're inefficient for projects like these. If you are using either, it's advised to switch to save everyone lots of headaches and unnecessary syntax error questions.

* [Visual Studio Code](https://code.visualstudio.com/) is a prevalent choice; it is known for being fast and powerful. It supports various languages, has a terminal, built-in IntelliSense support, and autocomplete for both JavaScript and TypeScript. This is the recommended choice.
* [Atom](https://atom.io/) is user-friendly, concise, and easy to navigate. This is what many developers use to get started.
* [Sublime Text](https://www.sublimetext.com/) is another popular editor that's easy to use and write code with.

## Installing a linter

One of the significant advantages proper code editors have over Notepad and Notepad++ is their ability to use linters. Linters check syntax and help you produce consistent code that follows specific style rules that you can define yourself if you choose to do so. They help form good habits if you stick to a single configuration. When you start using a linter, you might see many errors–this is normal and perfectly fine. It might be a pain to get through during the initial process, but it's most definitely worth it.

First, be sure to install the [ESLint package](https://www.npmjs.com/package/eslint) so that you have it available in your project.

```bash
npm install eslint --save-dev
```

Afterward, install the appropriate plugin(s) for your editor of choice.

* [ESLint for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Linter-ESLint for Atom](https://atom.io/packages/linter-eslint) (requires [Linter for Atom](https://atom.io/packages/linter))
* [ESLint for Sublime Text](https://packagecontrol.io/packages/ESLint)

::: tip
You can install each of these directly inside the editors themselves. For Visual Studio Code, press `Ctrl + Shift + X`. For Atom, press `Ctrl + ,` and click on "Install". For Sublime, press `Ctrl + Shift + P` and search for "Install Package" (available via [Package Control](https://packagecontrol.io/installation)). After that, you may then search for the appropriate plugin and install it.
:::

## Setting up ESLint rules

ESLint may display many warnings and errors about your code when you start using it but don't let this startle you. To get started, follow these steps:

1. Create a file in your root directory named `.eslintrc.json` (where your main project file is).
2. Copy the code below into the file.

```json
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2019
	},
	"rules": {

	}
}
```

This is the basis of how an ESLint file will look. The `rules` object is where you'll define what rules you want to apply to ESLint. For example, if you want to make sure you never miss a semicolon, the `"semi": ["error", "always"]` rule is what you'll want to add inside that object.

You can find a list of all of ESLint's rules on their site, located [here](https://eslint.org/). There are indeed many rules, and it may be overwhelming at first, but you'll only need to go through the list and define your file once.

Alternatively, if you don't want to go through everything one by one on your own, you can use the ESLint file we use for this guide.

```json {11-45}
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2019
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

The major points of this setup would be:

* Allowing you to debug with `console.log()`;
* Prefer using `const` over `let` or `var`, as well as disallow `var`;
* Disapproving of variables with the same name in callbacks;
* Requiring single quotes over double quotes;
* Requiring semicolons. While not required in JavaScript, it's considered one of the most common best practices to follow;
* Requiring accessing properties to be on the same line;
* Requiring indenting to be done with tabs;
* Limiting nested callbacks to 4. If you hit this error, it is a good idea to consider refactoring your code.

If your current code style is a bit different, or you don't like a few of these rules, that's perfectly fine! Just head over to the [ESLint docs](https://eslint.org/docs/rules/), find the rule(s) you want to modify, and change them accordingly.
