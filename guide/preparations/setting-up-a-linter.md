## Preparing a better development environment

### Installing a code editor

First, you will need a proper text editor. Using Notepad and Notepad++ is discouraged, as they're inefficient for projects like these. If you are using either, it is highly reccommended to switch in order to save everyone lots of headaches and unecessary syntax questions.

* Atom is user-friendly. If you want to get started quickly, this is the recommended pick. Click [here](https://atom.io/) to be taken to their website.
* Visual Studio Code is a very powerful editor known for being fast. It supports a broad range of languages and comes with its own terminal. Click [here](https://code.visualstudio.com/) to be taken to their website.
* Sublime Text is another powerful editor known for looking sleek and performing speedily and efficiently. Click [here](https://www.sublimetext.com/) to be taken to their website.

### Installing a linter

One of the major advantages proper code editors have over Notepad and Notepad++ is their ability to use linters. Linters check syntax and help you produce consistent code that follows certain style rules. They help form good habits if you stick to a single configuration. When you start using a linter, you will probably be bombarded with errors. This is normal, and it's fine. It might be a pain to get through with the initial process, but it's most definitely worth it.

[Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

[Atom](https://atom.io/packages/eslint)

### Setting up ESLint rules

ESLint will complain a lot about your code when you start using it, but don't let this startle you. In order to get started, follow these steps:
1. Create a file in your root directory called `.eslintrc.json` (where your index.js file is located).
2. Copy the code below into the file.

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
		"no-console": "off",
		"no-shadow": ["error", { "allow": ["err", "resolve", "reject"] }],
		"no-trailing-spaces": ["error", { "skipBlankLines": true }],
		"no-empty-function": "error",
		"no-floating-decimal": "error",
		"no-multi-spaces": "error",
		"brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
		"comma-dangle": ["error", "always"],
		"comma-spacing": "error",
		"curly": ["error", "multi-line", "consistent"],
		"dot-location": ["error", "property"],
		"handle-callback-err": "off",
		"yoda": "error",
		"object-curly-spacing": ["error", "always"],
		"max-nested-callbacks": ["error", { "max": 4 }],
		"max-statements-per-line": ["error", { "max": 2 }],
		"no-inline-comments": "error",
		"no-lonely-if": "error",
		"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
		"space-before-blocks": "error",
		"space-before-function-paren": ["error", "never"],
		"indent": ["error", "tab"],
		"quotes": ["error", "single"],
		"semi": ["error", "always"]
	}
}
```

Essentially, all of these rules sum up to:
* Allowing you to debug with `console.log()`.
* Disapproving of variables with the same name in callbacks
* Requiring semicolons. (While it's not required in JavaScript, it's considered one of the most common best practices to follow.)
* Requiring accessing properties to be on the same line.
* Requiring indenting to be done with tabs.
* Limiting nested callbacks to 4. (If you hit this error, it is a good idea to consider refactoring your code.)
