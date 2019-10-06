# Making an Eval command

## Introduction

### What is eval?

The `eval()` function evaluates JavaScript code represented as a string.
For instance, `eval(1 + 1)` will return `2`. Similarly, `eval(client.user.tag)` returns the bot's tag, e.g. `MyBot#0001`.

### Why eval can be dangerous?

:::danger
`eval()` is a dangerous function, which executes the supplied code, with the privileges of the caller. If you run `eval()` with a string that could be affected by a malicious party, you may end up running malicious code on your machine. More importantly, third-party code can see the scope in which `eval()` was invoked, which can lead to possible attacks.

In other words, eval is dangerous if somehow someone else has access to it, the person can run (malicious) code with administrator access.
:::

:::tip
`eval()` is also slower than the alternatives since it has to invoke the JS interpreter, while many other constructs are optimized by modern JS engines.
:::

## Implementation

### Securing eval

To limit the eval command to the owner, add a condition which will return if the author's ID is not equals to the owner's ID.

<!-- eslint-skip -->

```js
if (message.author.id !== 'ownerID') return;
```

Additionally, you can add your ID in the config file:

```json
{
    "prefix": "!",
    "token": "your-token-goes-here",
    "owner": "Owner-ID-here"
}
```

<!-- eslint-skip -->

```js
const config = require('../config.json');
if (message.author.id !== config.owner) return;
```

### Cleaning eval

You have to create a function to prevent the use of actual mentions within the return line by adding a zero-width character between the @ and the first character of the mention - blocking the mention from happening, you have to create a function

<!-- eslint-skip -->

```js
const clean = content => {
    if (typeof content === 'string') {
        return content.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
        return content;
    }
}
```

### Object to String representation

What is `Util#inspect`? The `Util#inspect()` method returns a string representation of an object (with properties).
Read more on [Node.js API Docs](https://nodejs.org/api/util.html#util_util_inspect_object_options).

First, importing/requiring the `util` module:

:::tip
The `util` modules comes with Node.js, so you don't have to install it.
:::

```js
const util = require('util');
```

Second, if result is not a string, calling the `Util#inspect`:

<!-- eslint-skip -->

```js
let res = eval(args.join(' '));
if (typeof res !== 'string') res = util.inspect(res);
```

## Conclusion

Here's the final code with enhancements.

<!-- eslint-skip -->

```js
const util = require('util');
const config = require('../config.json');

if (message.author.id !== config.owner) return;
const clean = content => {
    if (typeof content === 'string') {
        return content.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
        return content;
    }
}
try {
    let res = eval(args.join(' '));
    if (typeof res !== 'string') res = util.inspect(res);
    message.channel.send(clean(res), { code: 'xl' });
} catch (err) {
    message.channel.send(`\`Error\` \`\`\`xl\n${clean(err)}\n\`\`\``);
}
```

## Resulting code

<resulting-code />
