# Setting up package.json scripts

An easy way to run scripts like the start script, the lint script or whatever scripts you use, is by storing them in your `package.json`. After you stored these scripts in your `package.json`, you can just type `npm run start` or `npm run lint` to start your bot or lint your code!

## Getting started

<p class="tip">Before getting started, you'll need to have a `package.json`. If you don't have a `package.json` yet, you can run `npm init -y` to generate one.</p>

If you haven't touched your `package.json` yet (excluding installing dependencies), your `package.json` should look similar to the following:

```json
{
  "name": "Making-Bots-With-Discord.js",
  "version": "1.0.0",
  "description": "The official guide for [discord.js](https://github.com/discordjs/discord.js), created and maintained by core members of its community.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/devdutchy/Making-Bots-with-Discord.js.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/devdutchy/Making-Bots-with-Discord.js/issues"
  },
  "homepage": "https://github.com/devdutchy/Making-Bots-with-Discord.js#readme"
}
```

Let's zoom in more. Below `main`, you'll see `scripts`. You can specify your scripts there. In this guide, we'll show how to start and lint your bot using a `package.json` script.

## Adding your first script

<p class="tip">We'll assume you have finished the [Creating your first bot](https://discordjs.guide/#/creating-your-bot/) section of the guide. If you haven't, ensure to follow it first!</p>

Over at your `package.json`, add the following line to the `scripts`:

```json
"start": "node index.js"
```

This will mean that whenever you run the `npm run start` script in your bot's directory, it will run the `node index.js` command. Let's create another one for ESLint.

<p class="tip">If you do not have ESLint installed globally, replace `eslint` with `./node_modules/.bin/eslint`.</p>
Add the following line to your scripts:

```json
"lint": "eslint index.js"
```

Now, whenever you run the `npm run lint` script, ESLint will lint your `index.js` file.

Your package.json should now look similar to the following:

```json
{
  "name": "Making-Bots-With-Discord.js",
  "version": "1.0.0",
  "description": "The official guide for [discord.js](https://github.com/discordjs/discord.js), created and maintained by core members of its community.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js",
    "lint": "eslint index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/devdutchy/Making-Bots-with-Discord.js.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/devdutchy/Making-Bots-with-Discord.js/issues"
  },
  "homepage": "https://github.com/devdutchy/Making-Bots-with-Discord.js#readme"
}
```

And that's it! You can always add more scripts now, being able to run them with `npm run script-name`.