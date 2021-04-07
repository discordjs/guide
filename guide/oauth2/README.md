# Getting started with OAuth2

OAuth2 enables application developers to build applications that utilize authentication and data from the Discord API. Developers can use this to create things such as web dashboard to display user info, fetch linked third-party accounts like Twitch or Steam, access users' guild information without actually being in the guild, and much more. OAuth2 can significantly extend the functionality of your bot if used correctly.

## A quick example

###  Setting up a basic web server

Most of the time, websites use OAuth2 to get information about their users from an external service. In this example, you will use [`express`](https://expressjs.com/) to create a web server to use a user's Discord information to greet them. Start by creating three files: `config.json`, `index.js`, and `index.html`. 

`config.json` will be used to store the your client ID, client secret, and server port.

```json
{
	"clientID": "",
	"clientSecret": "",
	"port": "53134"
}
```

`index.js` will be used to start the server and handle requests. When someone visits the index page (`/`), an HTML file will be sent in response.

```js
const express = require('express');
const { port } = require('./config.json');

const app = express();

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
```

`index.html` will be used to display the user interface and OAuth data once logged in.

```html
<!DOCTYPE html>
<html>
<head>
	<title>My Discord OAuth2 App</title>
</head>
<body>
	<div id="info">
		Hoi!
	</div>
</body>
</html>
```

After running `npm i express`, you can start your server with `node index.js`. Once you start it, try connecting to `http://localhost:53134`, and you should see "Hoi!".

::: tip
Although we're using express, there are many other possible alternatives to handle a web server, such as: [fastify](https://www.fastify.io/), [koa](https://koajs.com/), and the [native Node.js http module](https://nodejs.org/api/http.html).
:::

### Getting an OAuth2 url

Now that you have your web server up and running, it's time to get some information from Discord. Head over to [your Discord applications](https://discord.com/developers/applications/) and click "Create an application", where the following page will greet you:

![Create an application page](~@/images/1ch98sm.png)

Take note of the `client id` field, the `client secret` field, and the "OAuth2" link on the left side of the page. Copy your client ID and secret into your `config.json` file; you'll need them later. For now, click on "OAuth2" and add a redirect url to `http://localhost:53134` like so:

![img](~@/images/9fejia2.png)

Once you've added your redirect url, you will want to generate an OAuth2 url. Lower down on the page, you can conveniently find an OAuth2 Url Generator provided by Discord. Use this to create a url for yourself with the `identify` scope.

![img](~@/images/18e2dwi.png)

The `identify` scope will allow your application to get basic user information from Discord. You can find a list of all scopes [here](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes).

### Putting it together

You have your website, and you have a url. Now you need to use those two things to get an access token. For basic applications like [SPAs](https://en.wikipedia.org/wiki/Single-page_application), getting an access token directly is enough. You can do so by changing the `response_type` in the url to `token`. However, this means you will not get a refresh token, which means the user will have to explicitly re-authorize when this access token has expired.

After you change the `response_type`, you can test the url right away. Try visiting it in your browser, and you will be directed to a page that looks like this.

![img](~@/images/49jali8.png)

You can see that by clicking `Authorize`, you allow the application to access your username and avatar. Once you click through, you should be redirected to the redirect url with a [fragment identifier](https://en.wikipedia.org/wiki/Fragment_identifier) appended to it. You now have an access token and can make requests to Discord's API to get information on the user.

Modify `index.html` to add your OAuth2 url and to take advantage of the access token if it exists. Even though [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) is for working with query strings, it can work here because the structure of the fragment follows that of a query string after removing the leading "#".

```html{4-26}
<div id="info">
	Hoi!
</div>
<a id="login" style="display: none;" href="your-oauth2-url-here">Identify Yourself</a>
<script>
	window.onload = () => {
		const fragment = new URLSearchParams(window.location.hash.slice(1));
		const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

		if (!accessToken) {
			return document.getElementById('login').style.display = 'block';
		}

		fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${tokenType} ${accessToken}`
			}
		})
			.then(result => result.json())
			.then(response => {
				const { username, discriminator } = response;
				document.getElementById('info').innerText += ` ${username}#${discriminator}`;
			})
			.catch(console.error);
	};
</script>
```

Here you grab the access token and type from the url if it's there and use it to get info on the user, which is then used to greet them. In the following sections, we'll go over various details of Discord and OAuth2.

## More details

### The state parameter

OAuth2's protocols provide a `state` parameter, which Discord supports. This parameter helps prevent [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) attacks and represents your application's state. The state should be generated per user and appended to the OAuth2 url. For a basic example, you can use a randomly generated string encoded in Base64 as the state parameter.

```js{1-10,15-18}
function generateRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

window.load = () => {
	// ...
	if (!accessToken) {
		const randomString = generateRandomString();
		localStorage.setItem('oauth-state', randomString);

		document.getElementById('login').href += `&state=${btoa(randomString)}`;
		return document.getElementById('login').style.display = 'block';
	}
};
```

When you visit a url with a `state` parameter appended to it and then click `Authorize`, you'll notice that after being redirected, the url will also have the `state` parameter appended, which you should then check against what was stored. You can modify the script in your `index.html` file to handle this.

```js{2,8-10}
const fragment = new URLSearchParams(window.location.hash.slice(1));
const [accessToken, tokenType, state] = [fragment.get('access_token'), fragment.get('token_type'), fragment.get('state')];

if (!accessToken) {
	// ...
}

if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
	return console.log('You may have been clickjacked!');
}
```

::: tip
Don't forgo security for a tiny bit of convenience!
:::

### OAuth2 flows

What you did in the quick example was go through the `implicit grant` flow, which passed the access token straight to the user's browser. This flow is great and simple, but you don't get to refresh the token without the user, and it is less secure than going through the `authorization code grant`. This flow involves receiving an access code, which your server then exchanges for an access token. Notice that this way, the access token never actually reaches the user throughout the process.

#### Authorization code grant

Unlike the quick example, you need an OAuth2 url where the `response_type` is `code`. Once you've obtained it, try visiting the link and authorizing your application. You should notice that instead of a hash, the redirect url now has a single query parameter appended to it like `?code=ACCESS_CODE`. Modify your `index.js` file to pull the parameter out of the url if it exists. In express, you can use the `request` parameter's `query` property.

```js{2}
app.get('/', (request, response) => {
	console.log(`The access code is: ${request.query.code}`);
	return response.sendFile('index.html', { root: '.' });
});
```

Now you have to exchange this code with Discord for an access token. To do this, you need your `client_id` and `client_secret`. If you've forgotten these, head over to [your applications](https://discord.com/developers/applications) and get them. You can use `node-fetch` to make requests to Discord; you can install it with `npm i node-fetch`.

Require `node-fetch` and make your request.

```js{1,4,6-29}
const fetch = require('node-fetch');
const express = require('express');
const { clientID, clientSecret, port } = require('./config.json');

const app = express();

app.get('/', async ({ query }, response) => {
	const { code } = query;

	if (code) {
		try {
			const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientID,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${port}`,
					scope: 'identify',
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await oauthResult.json();
			console.log(oauthData);
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
		}
	}

	return response.sendFile('index.html', { root: '.' });
});
```

::: warning
The content-type for the token url must be `application/x-www-form-urlencoded`, which is why `URLSearchParams` is used.
:::

Now try visiting your OAuth2 url and authorizing your application. Once you're redirected, you should see something like this in your console.

```json
{
	"access_token": "an access token",
	"token_type": "Bearer",
	"expires_in": 604800,
	"refresh_token": "a refresh token",
	"scope": "identify"
}
```

Try fetching the user's information now that you have an access token and a refresh token. It's the same as how the html file did it in the html file.

<!-- eslint-skip -->
```js{3-7,9}
const oauthData = await oauthResult.json();

const userResult = await fetch('https://discord.com/api/users/@me', {
	headers: {
		authorization: `${oauthData.token_type} ${oauthData.access_token}`,
	},
});

console.log(await userResult.json());
```

::: tip
To maintain security, store the access token server-side but associate it with a session ID that you generate for the user.
:::

## Additional reading

[RFC 6759](https://tools.ietf.org/html/rfc6749)  
[Discord Docs for OAuth2](https://discord.com/developers/docs/topics/oauth2)

## Resulting code

<resulting-code path="oauth/simple-oauth-webserver" />
