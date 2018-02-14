# Using a REST API

REST APIs are extremely popular on the web and allow you to freely grab a site's data if that site has an available API over an HTTP connection.

If you've ever seen a music bot that accepts a YouTube query instead of just a video's URL, then you've seen a REST API in action. As a matter of fact, discord.js is made to use Discord's API. So, you've probably used an API yourself.

## Using a REST API with node

In these examples we are going to be using [Snekfetch](https://www.npmjs.com/package/snekfetch) which is a great library for making HTTP requests by one of the developers of discord.js. Discord.js actually uses Snekfetch which is part of the reason why it's ideal; it's already installed if you're using discord.js!

If you're not using discord.js you'll simply have to do the following to install Snekfetch.

```bash
npm install --save snekfetch
```

## Using Snekfetch

Snekfetch is a promise-based request library with beautiful syntax. If you don't already know about promises, you should read up on them [here](/additional-info/async-await).

In this tutorial we'll be making a bot with 2 API based commands. The first will be using [random.cat](https://random.cat) and the other will use [Urban Dictionary](https://www.urbandictionary.com).

<p class="tip">We're going to take advantage of [destructuring](/additional-info/es6-syntax?id=destructuring) in this tutorial because it just looks great.</tip>

Since we're only going to be making [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) requests in this tutorial, we're going to use [Snekfetch.get](https://snekfetch.js.org/?api=snekfetch#Snekfetch.get). To require Snekfetch's GET request method, we'll do:

```js
const { get } = require('snekfetch');
```

## Random Cat

Random cat's API is available at [random.cat/meow](https://random.cat/meow) and returns a [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) response. To actually fetch the API, you're going to do the following:

```js
get('https://random.cat/meow');
```

Now, of course it seems like this does nothing but what it's doing is launching a request to the random.cat server and random.cat is returning some JSON that contains a `file` property which is a string containing a link to a random cat. So, let's implement that into a command. The code should look similar to this:

```js
const { body } = await get('https://random.cat/meow');

message.channel.send(body.file);
```

So, here's what's happening in this code:
1) We're sending a GET request to `https://random.cat/meow`.
2) random.cat sees our request and gets a random file from their database.
3) random.cat then sends that file's URL as a JSON object that contains a link to the image/gif.
4) Snekfetch's body property deserializes the JSON response using [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse].
5) We then send the object's `file` property in Discord.

<p class="warn">The response will only be parsed if the server's `Content-Type` header includes `application/json`. In some cases, you may have to get the `text` property instead of the `body` property and JSON.parse it yourself.</p>

## Urban Dictionary

Urban Dictionary's API is available at `https://api.urbandictionary.com/v0/define` and accepts a `term` parameter and also returns a JSON response.

<p class="warn">This section assumes that you have an `args` variable. If you don't, you should follow the [arguments tutorial](/creating-your-bot/commands-with-user-input).</p>

First, we're going to need to fetch the API and get it's body. To do this, we'd do:

```js
if (command === 'urban') {
	const { body } = await get('https://api.urbandictionary.com/v0/define').query({ term: args.join(' ') });
}
```

The `query` appends a [query string](https://en.wikipedia.org/wiki/Query_string) to the URL so that the Urban Dictionary server can parse it and know what to search for.

If we were to do `!urban hello world` (assuming your prefix is `!`) then, the URL would become `https://api.urbandictionary.com/v0/define?term=hello%20world` as the string gets [encoded](https://en.wikipedia.org/wiki/Query_string#URL_encoding).

With our body variable, we can get the properties of the returned JSON. If you were to view it in your browser, it usually looks like a bunch of mumbo jumbo. If it doesn't, great! If it does, then you should get a JSON formatter/viewer. If you're using Chrome, I'd recommend [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa). If you're not using Chrome, search for "JSON formatter/viewer <your browser>" and get one.

Now, if we look at the JSON, we can see that there are 4 properties:

- `tags` - An array of strings containing tags related to the search result.
- `result_type` - A string containing the type of the result.
- `list` - An array of objects containing various definitions for the term (maximum 10).
- `sounds` - An array of strings containg links to audio recordings of people saying the term (ignore this, we won't use it).

Something you always want to do when making API based commands is to handle there being no results. So, let's throw a random term in there (e.g. `njaksdcas` (I just smashed my keyboard)) and then look at the response. From what it looks like, when there are no results, the `result_type` property is `no_results`. Now we are ready to start writing!

First, we want to start with a check. After fetching the API and storing the body, we would do:

```js
if (body.result_type === 'no_results') return message.reply(`No results found for **${args.join(' ')}**`);
```

After making sure that there are results, we will use those results. For now, let's simply send back the definition and nothing more. It's as simple as:

```js
message.channel.send(body.list[0].definition);
```

Here, we are simply getting the first object from the array of objects called `list` and grabbing its `definition` property.

If you've followed the tutorial, you should have something like this:

![Basic Urban Command](/assets/img/N0t4M.png)

Now, let's just make this an [embed](/popular-topics/miscellaneous-examples?id=sending-an-embed). I will be requiring the RichEmbed by having `const { Client, RichEmbed } = require('discord.js')` at the top of my file. If you required discord.js as Discord, you'd do `Discord.RichEmbed`.

We are also going to be defining a utility function at the top of our file so that our embed doesn't error when the field value is over 1024 characters. Here is a bit of code to do that:

```js
const trim = (str, max) => str.length > max ? `${str.slice(0, max - 3)}...` : str;
```

Now, to make the embed, here's what we'll do:

```js
const [answer] = body.list;

const embed = new RichEmbed()
	.setColor(0xEFFF00)
	.setTitle(answer.word)
	.setURL(answer.permalink)
	.addField('Definition', trim(answer.definition, 1024))
	.addField('Example', trim(answer.example, 1024))
	.addField('Rating', `${answer.thumbs_up} thumbs up.\n${answer.thumbs_down} thumbs down.`)
	.setFooter(`Tags: ${body.tags.join(', ')}`);

message.channel.send({ embed });
```

Now, if we do that same command again, we should get this:

![Embeded Urban Command](/assets/img/RMv88.png)

## Resulting code
If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository [here](https://github.com/discordjs/guide/tree/master/code_samples/additional-info/rest-api).
