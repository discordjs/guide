const fetch = require('node-fetch');
const express = require('express');
const app = express();
const { clientID, clientSecret, port } = require('./config.js');

app.get('/', async ({ query }, response) => {
	const { code } = query;

	if (code) {
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

		const userResult = await fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${oauthData.token_type} ${oauthData.access_token}`,
			},
		});

		console.log(await userResult.json());
	}

	return response.sendFile('index.html', { root: '.' });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
