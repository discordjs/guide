## Adding your bot to your own (and other) servers

So now, if you've been diligently following the previous pages of the guide, you're the proud owner of your very own bot application, woo!

But wait a second... where is it? You can't see it on any servers, you ask?

That's right -- before you're actually able to see your bot in your own (or other) servers, it needs to be added using a special invite link that can be created using your bot application's Client ID.

### Bot invite links

The basic version of one such link looks like this:

`https://discordapp.com/oauth2/authorize?client_id=328037144868290560&scope=bot`

The structure of the url is pretty simply:

- The first part is just Discord's standard structure for authorizing an OAuth2 application (such as your bot application) for entry to a Discord server.
- The second part that says ``client_id=...`` is to specify _which_ Application we want to authorize. You'll have to replace this part with the Client ID of your bot to invite yours. 
- And lastly, the third part which says ``scope=bot`` specifies that we want to add this Application as a Discord bot.

<p class="tip">A permissions parameter also exists to restrict or guarantee the permission your bot will have on the server you add it to. For ease of usage, it is recommended to use [this](https://discordapi.com/permissions.html) website.</p>

<p class="warning">If you get an error message saying "Bot requires a code grant." then head over into your application's settings and disable the "Require OAuth2 Code Grant" option. You usually shouldn't enable this checkbox unless you know what you are doing.</p>

### Creating and using your own invite link

Right. So if you've been paying attention, you'll likely have figured out that to add your own bot to a server, you're going to have to substitute the ``client_id=...`` part of the link with your bot application's ID.

To find its ID, check by the "My Apps" menu under the "Applications" section once again, click on your bot application and then copy this ID:

![Finding your Bot application's Client ID](http://i.imgur.com/U6mlQGm.png)

Insert this ID into the link template and then access it in your browser, you should see something like this (with your bot's username and avatar):

![Bot Authorization field](https://i.imgur.com/A8l70bj.png)

Choose the server you want to add it to (you can only add it to servers you have the "Manage Server" permission on!) and press "Authorize", this should then present you a nice confirmation message:

![Bot authorized](https://i.imgur.com/BAUsjyg.png)

Congratulations! You've successfully added your bot to your Discord server. 

It should show up in your server's member list somewhat like this:

![Bot in server's user list](https://i.imgur.com/6qTlDW0.png)
