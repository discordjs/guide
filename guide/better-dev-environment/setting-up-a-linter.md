## Preparing a better development environment

### Installing a code editor

First, you will need a proper editor. Notepad and Notepad++ are not good editors for this. If you are using either, it is highly reccommended to switch in order to save you and I lots and lots of headaches and unecessary questions regarding syntax.

* Atom is user-friendly, and if you want to quickly start coding, this is a reccommended pick: Click [here](https://atom.io/) to be taken to their website.
* Visual Studio Code is a very powerful editor that is known for being fast and supports a broad range of languages and comes with its own terminal. Click [here](https://code.visualstudio.com/) to be taken to their website.
* Sublime is another powerful editor that is known for looking sleek and performs very well. Click [here](https://www.sublimetext.com/) to be taken to their website.

### Installing a linter

One of the major advantages of using a proper code editor over Notepad and Notepad++ is the opportunity to use a linter. Linters, on top of syntax checking, allow you to produce more consistent code as per the rules you have defined. It encourages good habits if you stick with one configuration. When you start using a linter, you will probably be bombarded with errors, which is normal and fine. It might be a pain to get through with the initial process, but it's most definitely worth it.

[Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

[Atom](https://atom.io/packages/eslint)

### Setting up ESLint rules

ESLint will complain a lot about your code when you get started with it, but it's worth it. In order to get started, follow these steps:
1. Create a file in your root directory called `.eslintrc.json` (where your index.js file is located).
2. Copy the contents of the codeblock enclosed below into this file.

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
* Allowing you to debug with console.log()
* Disapproving of variables with the same name in callbacks
* Requiring semicolons (while this is not required in JavaScript, you will have less fun switching to other languages if you do not get used to this rule)
* Requiring accessing properties to be on the same line
* Indenting to be done with tabs
* Limiting nested callbacks to 4 (if you hit this error, it is a good idea to consider refactoring your code)
