# Using a REST API

REST APIs are extremely popular on the web and allow you to freely grab a site's data of that site has an available API over an HTTP connection.

If you've ever seen a music bot that accepts a YouTube query instead of just a video's URL, then you've seen a REST API in action. As a matter of fact, this site that you're on right now is using a REST API to grab all the data whenever you click on a sidebar link!

## Using a REST API with node

In these examples we are going to be using [Snekfetch](https://www.npmjs.com/package/snekfetch) which is a great library for making HTTP requests by one of the contributors of discord.js. Discord.js actually uses Snekfetch which is part of the reason why it's ideal; it's already installed if you're using discord.js!

If you're not using discord.js you'll simply have to do the following to install Snekfetch.

```bash
npm install --save snekfetch
```

## Using Snekfetch

Snekfetch is a promise-based request library with beautiful syntax. If don't already know about promises, you should read up on them [here](/additional-info/async-await).

In this tutorial we'll be making a bot with 2 API based commands. The first will be using [random.cat](https://random.cat) and the other will use [Urban Dictionary](https://www.urbandictionary.com).

<p class="tip">We're going to be take advantage of [destructuring](/additional-info/es6-syntax?id=destructuring) in this tutorial for as it just looks great.</tip>

Since we are only going to be making [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) requests in this tutorial, we're going to use [Snekfetch.get](https://snekfetch.js.org/?api=snekfetch#Snekfetch.get). To require Snekfetch's GET request method, we'll do:

```js
const { get } = require('snekfetch');
```

## Random Cat

Random cat's API is available at [random.cat/meow](https://random.cat/meow) and returns a [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) response. To actually fetch the API, you're going to do the following:

```js
get('https://random.cat/meow');
```

Now, of course it seems like this does nothing but what it's doing is launching a request to the random.cat server and random.cat is returning some JSON that contains a `file` property which is a string that contains a link to a random cat. So, let's implement that into a command.

```js
const { body } = await get('https://random.cat/meow');
message.channel.send(body.file);
```

So, here's what's happening in this code:
1) We're sending a GET request to `https://random.cat/meow`.
2) random.cat sees our request and gets a random file from their database.
3) random.cat then sends that file's URL as a JSON object that contains a link to the image/gif.
4) Snekfetch's body property deserializes the JSON response using [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse].
5) We then send the object's `file` property.

<p class="warn">The response will only be parsed if the server's `Content-Type` header includes `application/json`. In some cases, you may have to get the `text` property instead of the `body` property and JSON.parse it yourself.</p>

## Urban Dictionary

Urban Dictionary's API is available at `https://api.urbandictionary.com/v0/define` and accepts a `term` [parameter](https://en.wikipedia.org/wiki/Query_string) and also returns a JSON response.


