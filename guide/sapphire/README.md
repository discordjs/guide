# Getting started with Sapphire

When installing Sapphire Framework, you need to install both discord.js and the framework, you can do this by running the following command:

```sh-session
npm install discord.js @sapphire/framework
```

::: warning
You need at least Node.js version 14.0 to use Sapphire.
:::

## Creating your index.js file

While it doesn't have to be called `index.js`, this file is the main file for your bot, which will handle the bot's setup and login. You can also place it inside a folder, such as `src`.

::: warning
Make sure that the `main` property in your `package.json` points to the right path, such as `index.js` or `src/index.js`.
:::

The first thing you have to do is require Sapphire. Contrary to what you may think, you may **not** need to require discord.js in this file, and the Sapphire client extends discord.js's, so everything from Client is available in SapphireClient!

```js
const { SapphireClient } = require('@sapphire/framework');
```

The next step is to create a new SapphireClient, which is where you can customize Sapphire's behavior, as well as discord.js's. Just like in Client, you must define the `intents`:

```js
const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
```

Sapphire uses mention prefix (`@bot command`), but you can optionally define a default prefix (or prefixes) by defining `defaultPrefix` in the options, as well as `regexPrefix` if you are familiar with regexes.

You can also define the base directory Sapphire will scan directories at by defining a path to `baseUserDirectory`, this is an advanced option, and will always be set to the directory of the main file, defined in your package.json.

By default, Sapphire will register the directory the main file is at, joined by the store's name, as such, if the root directory is `src`, it will register `src/commands` as one of the command directories.

Last but certainly not least, log the bot in.

```js
client.login('your-token-goes-here');
```

::: danger
You should use environment variables or a `config.json` for your token instead of passing it directly!
You can read more about why you should [here](/preparations/setting-up-a-bot-application.html#keeping-your-token-safe).
:::

And there you have it! You've set up your `index.js` file! In the end, your file structure should look like this, along with whatever `.gitignore` or `config.json` you may have:

```
node_modules/
src/
  ├── commands/
  │     └── ping.js
  ├── listeners/
  └── index.js
package-lock.json
package.json
```

## Resulting code

<ResultingCode />
