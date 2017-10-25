## Creating an application

Now that you've installed Node, discord.js, and hopefully a linter, you're almost ready to start coding! The next step you need to take is setting up an actual Discord bot application via Discord's website.

It's incredibly easy to create one. The steps you need to take are as follows:

1. Open up [the Discord website](https://discordapp.com/) and [login](https://discordapp.com/login).
2. Hover over the "More" drop-down menu and click on the [Developers](https://discordapp.com/developers/docs/intro) link.
3. On the sidebar, under "Applications", click on the [My Apps](https://discordapp.com/developers/applications/me) link.
4. Click on the "New App" button and fill out the form. **Note:** Only the app name field is required; all the others are optional. Submit the form once you're done.

Once you fill out and submit the form, you should see a page like this:
![Successfully created application](assets/img/jnE3tVM.png)

On that same page, click the "Create a Bot User" button.

Congratulations, you're now the proud owner of a shiny new Discord bot! you're not quite done, though.

## Your token

<p class="danger">This section is very important, so pay close attention. It explains what your bot token is, as well as the security aspects of it.</p>

After creating a bot user, you'll see a section like this:
![Bot application](assets/img/E1CZqFT.png)

In that section, there's a field labeled "Token". Click the "click to reveal" link in order to view your token. When we ask you to paste your token somewhere, this is the value that you need to put in. Don't worry if you do happen to lose your token—you can always go back to this page and view it again, as well as generate a new one, if necessary.

### What is a token, anyway?

A token is essentially your bot's password; it's what your bot uses to login to Discord. With that being said, **it is vital that you do not ever share this token with anybody, purposely or accidentally**. If someone does manage to get a hold of your token, they can use your bot as if it were theirs—this means they can perform malicious acts with it.

### Token leak scenario

Let's imagine that you have a bot on over 1,000 servers, and it took you many, many months of coding and patience to get it on that amount. Your token gets leaked somewhere, and now someone else has it. That person can:

* Spam every server your bot is on;
* Attempt to DM spam as many users as they can;
* Attempt to delete as many channels as they can;
* Attempt to kick or ban as many server members as they possibly can;
* Make your bot leave all of the servers it has joined.

All that and much, much more. Sounds pretty terrible, right? So make sure to keep your token as safe as possible! Now, let's move on to the next step.
