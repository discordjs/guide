# Making an Eval command

## Introduction

### What is eval?

The eval() function evaluates JavaScript code represented as a string.
For instance, `eval(1 + 1)` will return `2`. Similarly, `eval(client.user.tag)` returns the bot's tag, e.g. `MyBot#0001`.

### Why eval can be dangerous?

eval() is a dangerous function, which executes the supplied code, with the privileges of the caller. If you run eval() with a string that could be affected by a malicious party, you may end up running malicious code on your machine. More importantly, a third-party code can see the scope in which eval() was invoked, which can lead to possible attacks.

In other words, eval is dangerous if somehow someone else has access to it, the person can run (malicious) code with administrator access, i.e. anyone with access to it can get the app's secrets and credentials such as bot token, API keys, and so on.

:::warning
Note: eval() is also slower than the alternatives since it has to invoke the JS interpreter, while many other constructs are optimized by modern JS engines.
:::

## Implementation

### Securing eval

We will be limiting the eval command only to the owner.
To do that, we will add a condition, which will return if the author's ID is not equals to the owner's ID.

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
const { owner } = require('../config.json');
if (message.author.id !== owner) return;
```

### Cleaning eval

We'll be creating a function that prevents the use of actual mentions within the return line by adding a zero-width character between the @ and the first character of the mention - blocking the mention from happening.

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

We can convert an object to string representation by using an in-built Node.js module - `util`. Specifically, `util#inspect()`
So what is `util#inspect`? The `util.inspect()` method returns a string representation of an object that is intended for debugging.
Read more on [Node.js API Docs](https://nodejs.org/api/util.html#util_util_inspect_object_options).

First, requiring the `util` module, however, we just need the inspect module, so we will simply destruct it from the module.

```js
const { inspect } = require('util');
```

Second, checking if the result is a string or not, if it is, inspect it:

<!-- eslint-skip -->

```js
let res = eval(args.join(' '));
if (typeof res !== 'string') res = inspect(res);
```

## Conclusion

Here's the final code with enhancements.

<!-- eslint-skip -->

```js
const { inspect } = require('util');
const { owner } = require('../config.json');

if (message.author.id !== owner) return;
try {
    let res = eval(args.join(' '));
    if (typeof res !== 'string') res = inspect(res);
    message.channel.send(clean(evaled), { code: 'xl' });
} catch (err) {
    message.channel.send(`\`Error\` \`\`\`xl\n${clean(err)}\n\`\`\``);
}
```

## Resulting code

<resulting-code />
