# Web Dashboard

::: tip
This page assumes your code looks like the one on [this page](/command-handling/).
:::

## How It Works

Web dashboards usually require two different components to function - a client side dashboard that allows interaction and server side [API](https://wikipedia.org/wiki/Application_programming_interface)s that saves your changes.

::: danger
Please note, for the sake of clarity, we will be ommiting the code to authenticate an user - you can do so by following the [Oauth guide](https://discordjs.guide/oauth2/). If you do follow this tutorial and make the dashboard accessible to the public, please remember to add authentication as necessary.
:::

As always, the red is what you'll remove and the green is what you'll replace it with.

```diff
if (command === 'ping') {
-	message.channel.send('Pong.'); //Remove this
+	client.commands.get('ping').execute(message, args); //Add this
}
```

To get started, install [Express](https://expressjs.com/). Express is a powerful yet lightweight module that allows node to recieve requests.
```sh
npm install express --save
```

::: tip
We're going to take advantage of [destructuring](https://discordjs.guide/additional-info/es6-syntax.html#destructuring) in this tutorial to maintain readability.
:::

Rename your bot file (`index.js` if you followed the tutorial) to `bot.js`. Add a new file named `index.js`. This is where your project will start now.

## Recieving Requests

To start off, add this code to `index.js` (which should be empty).

```js
const Express = require("express");
const app = Express();
const bot = require("./bot.js");

app.get("/", function(req, res){
	res.status(200);
	res.send("Hello world!");
});

app.listen(80, () => {
  console.log("HTTP server is listening at port " + listener.address().port);
});
```
::: tip
If you're using [Glitch](https://glitch.com) for hosting, replace the last three lines of code with this:

```js
app.listen(process.env.PORT, () => {
  console.log("HTTP server is listening at port " + listener.address().port);
});
```

Glitch will auto-assign your project a port to use.
:::

You can test out the code by restarting your project and visiting [http://localhost:80](http://localhost:80) in your browser. If you see a `Hello world!`, you've successfully created a HTTP server! Exciting stuff, isn't it? This is only the beginning, so let's move on to making the site more usefull.

## Creating a Dashboard

Create a new folder named `views` and create a new file named `dashboard.html`:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Loading Server... | Dashboard</title>
    </head>
    <body>
        <h1>Server Name</h1>
        <br />
        <input id="prefix" placeholder="Enter prefix here..." value="" />
        <br />
        <button type="button">Save</button>
        <script>
            var guild = window.location.pathname.replace(/^\/?guild[\/]+([0-9]+)\/?$/gim, "$1");
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                if (this.readyState !== 4) return;
                if (this.status == 404) return alert("Could not find server!");
                const json = JSON.parse(this.responseText);
                document.title = json.name + " | Dashboard";
                document.querySelector("body > h1").innerText = json.name;
                document.querySelector("#prefix").value = json.prefix;
            };
            xhttp.open("GET", "/api/guild/" + guild, true);
            xhttp.send();
        </script>
    </body>
</html>

```

Next, edit `index.js`, replacing `<guild id>` with the server id of any server your bot is in:

```diff
const Express = require("express");
const app = Express();
const bot = require("./bot.js");

app.get("/", function(req, res){
	res.status(200);
-	res.send("Hello world!");
+	res.send("<a href='/guild/<guild id>'>Web Dashboard</a>");
});

+ app.get("/guild/*", function(req, res){
+   res.status(200);
+	res.sendFile("./views/dashboard.html");
+ });

+ app.get("/api/guild/:server", function(req, res){
+ const server = bot.server(req.params.server);
+ if(!server){
+ 	return res.status(404);
+ }
+ res.status(200);
+ res.json(server);
+ });

app.listen(80, function () {
  console.log("HTTP server is listening at port " + listener.address().port);
});

```

To finish up, add this line of code to `bot.js`, preferrably after creating a client:
```js
module.exports.server = function (id){
	if(client.readyTimestamp) return;
	return client.guilds.cache.get(id);
};
```

Try visiting [http://localhost](http://localhost) again - you should see a link to a dashboard. Click it and you should be taken to a page where the dashboard is at. The server name and title may take a few seconds to update, but after a few seconds it should be the name of the server you set in `server.js`. If it does do so, you've successfully created a simple web dashboard! Exciting stuff, isn't it? This is only the beginning, so let's add more to the dashboard.

## Adding Settings
The dashboard currently is not interactive and does not display anything other than the server name. Lets change that by adding customizable options for each server. We'll use 

First, modify `bot.js` as shown below:


loader 			//https://i.gifer.com/ZZ5H.gif
```js

```
