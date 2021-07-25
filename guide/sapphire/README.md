# Getting started with Sapphire

When installing the Sapphire Framework, you need to install both discord.js and the framework. You can do this by running the following command:

```sh-session
npm install discord.js @sapphire/framework
```

::: warning
You need at least Node.js version 14.0 to use Sapphire.
:::

## Creating an index.js file

While it doesn't have to be called `index.js`, this file is the main file for your bot, which will handle the bot's setup and login. You can also place it inside a folder, such as `src`.

::: warning
Make sure that the `main` property in your `package.json` points to the right path, such as `index.js` or `src/index.js`.
:::

To begin, require `@sapphire/framework` and create a new `SapphireClient`. This is where you can customize Sapphire's behavior, as well as discord.js'. The Sapphire client extends discord.js', so everything from `Client` is available in `SapphireClient`!

:::: code-group
::: code-group-item CommonJS
```js
const { SapphireClient } = require('@sapphire/framework');

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

client.login('your-token-goes-here');
```
:::
::: code-group-item ESM
```js
import { SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

client.login('your-token-goes-here');
```
:::
::::


Sapphire uses mention prefix (`@bot command`), but you can optionally define a default prefix (or prefixes) with the `defaultPrefix` option, as well as `regexPrefix` if you are familiar with regexes.

There is also the advanced option `baseUserDirectory`, which allows you to define the base directory for Sapphire to scan. By default, Sapphire will register this as the directory where your `main` file is at, joined by the store's name. As such, if the root directory is `src`, it will register `src/commands` as one of the command directories.


::: danger
You should use environment variables or a `config.json` for your token instead of passing it directly!
You can read more about why you should [here](/preparations/setting-up-a-bot-application.html#keeping-your-token-safe).
:::

And that's it for your `index.js` file! In the end, your file structure should look like this, along with whatever `.gitignore` or `config.json` files you may have:

```:no-line-numbers
node_modules/
src/
  └── index.js
package-lock.json
package.json
```

## Resulting code

<ResultingCode />
