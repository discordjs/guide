const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.get('/', async (request, response) => {
	let access_token;
	let token_type;
	if (request.query.code) {
	    const accessCode = request.query.code;
	    const data = {
	        client_id: 'client_id',
	        client_secret: 'client_secret',
	        grant_type: 'authorization_code',
	        redirect_uri: 'http://localhost:3000/',
	        code: accessCode,
	        scope: 'identify',
	    };

	    const res = await fetch('https://discordapp.com/api/oauth2/token', {
	        method: 'POST',
			body: new URLSearchParams(data),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
		const info = await res.json();
		token_type = info.token_type;
		access_token = info.access_token;
		const post = await fetch('https://discordapp.com/api/users/@me', {
			headers: {
				authorization: `${token_type} ${access_token}`,
			},
		});
		const user = await post.json();
		console.log(user);
	}

	if (token_type && access_token && request.query.state) {
		response.status(200).redirect(`/?code=${request.query.code}&state=${request.query.state}&access_token=${access_token}&token_type=${token_type}`);
	} else { response.sendFile('index.html', { root: '.' }); }
});

app.listen(3000);
