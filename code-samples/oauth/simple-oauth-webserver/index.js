const http = require('http');
const fs = require('fs');
const url = require('url');
const fetch = require('node-fetch');

const port = 53134;

http.createServer((req, res) => {
	let responseCode = 404;
	let content = '404 Error';

	const urlObj = url.parse(req.url, true);

	if (urlObj.query.code) {
		const accessCode = urlObj.query.code;
		const data = {
			client_id: 'your client id',
			client_secret: 'your client secret',
			grant_type: 'authorization_code',
			redirect_uri: 'your redirect uri',
			code: accessCode,
			scope: 'the scopes',
		};

		// convert to application/x-www-form-urlencoded
		function formUrlEncode(data) {
			return Object.entries(data)
				.map(([k, v]) => k + '=' + v)
				.join('&');
		}

		fetch('https://discordapp.com/api/oauth2/token', {
			method: 'POST',
			body: formUrlEncode(data),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
			.then(discordRes => discordRes.json())
			.then(info => {
				console.log(info);
				return info;
			})
			.then(info => fetch('https://discordapp.com/api/users/@me', {
				headers: {
					authorization: `${info.token_type} ${info.access_token}`,
				},
			}))
			.then(userRes => userRes.json())
			.then(console.log);
	}

	if (urlObj.pathname === '/') {
		responseCode = 200;
		content = fs.readFileSync('./index.html');
	}

	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});

	res.write(content);
	res.end();
})
	.listen(port);
