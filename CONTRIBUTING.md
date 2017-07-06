# Contributing

## Installations

Though it's not required, you may install the `docute-cli` package. You can do so by running the following command:
    npm i -g docute-cli

After that, you can simply run `docute ./guide` to run a server at `localhost:8080`.

Alternatively, you can simply open up the index.html file and run it through there.

## Adding Pages

When adding new pages, you should generally add them inside the appropriate dropdown menu, or create one to add it to. To create a new dropdown menu, open up the `main.js` file, and add an object to the `nav` array inside the `docute.init()` bit. It should look a little something like this:
```js
docute.init({
	nav: [
		{
			path: '/',
			title: 'Normal Nav Item',
		},
		{
			title: 'Some Important Category',
			type: 'dropdown',
			items: [
				{
					type: 'label',
					title: 'First Section',
				},
				{
					title: 'First step',
					path: '/path/to/item/',
					// all path strings should start with `/`
					// ending the string with `/` will route it to `path/to/file/README.md
					// but ending it without `/` will route it to `path/to/file.md
				},
				{
					title: 'Second step',
					path: '/path/to/item/second-step',
				},
				{
					title: 'Third step',
					path: '/path/to/item/third-step',
				},
				{
					type: 'sep',
					// stands for "separator"; simply adds a line split between items
				},
				{
					title: 'Extra info',
					path: '/path/to/item/extra-info',
				},
			],
		},
	],
});
```

The code above would display as the following:
![Example nav bar image](http://i.imgur.com/E6wYHKF.png)

There are, of course, many other things you can do within the `docute.init()` method, but this should suffice for simple edits/additions. Consult the [documentation site](https://docute.js.org/#/home) for further info.
