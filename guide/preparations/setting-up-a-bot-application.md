# Setting up a bot application

## Creating your bot

Now that you've installed Node, discord.js, and hopefully a linter, you're almost ready to start coding! The next step you need to take is setting up an actual Discord bot application via Discord's website.

It's incredibly easy to create one. The steps you need to take are as follows:

1. Open up [the Discord website](https://discordapp.com/) and [login](https://discordapp.com/login).
2. Hover over the "Developers" drop-down menu and click on the [Developer Portal](https://discordapp.com/developers/applications/) link.
3. Click on the "New Application" button.
4. Enter a name and optionally select a team (if you want the bot to belong to one). Then confirm the pop-up window by clicking the "Create" button.

You should see a page like this:

![Successfully created application](~@/images/create-app.png)

You can optionally enter a name, description, and avatar for your application here. Once you've saved your changes, you can move on by selecting the "Bot" tab in the left pane.

![Create a bot UI](~@/images/create-bot.png)

Click the "Add Bot" button on the right and confirm the pop-up window by clicking "Yes, do it!". Congratulations, you're now the proud owner of a shiny new Discord bot! You're not quite done, though.

## Your token

::: danger
This section is very important, so pay close attention. It explains what your bot token is, as well as the security aspects of it.
:::

After creating a bot user, you'll see a section like this:

![Bot application](~@/images/created-bot.png)

In this panel, you can give your bot a snazzy avatar, set its username, and make it public or private. You can access your token in this panel as well, either by revealing it or simply pressing the "Copy" button. When we ask you to paste your token somewhere, this is the value that you need to put in. Don't worry if you do happen to lose it at some point; you can always come back to this page and copy it again.

### What is a token, anyway?

A token is essentially your bot's password; it's what your bot uses to login to Discord. With that being said, **it is vital that you do not ever share this token with anybody, purposely or accidentally**. If someone does manage to get a hold of your token, they can use your bot as if it were theirs—this means they can perform malicious acts with it.

### Token leak scenario

Let's imagine that you have a bot on over 1,000 servers, and it took you many, many months of coding and patience to get it on that amount. Your token gets leaked somewhere, and now someone else has it. That person can:

* Spam every server your bot is on;
* Attempt to DM spam as many users as they can;
* Attempt to delete as many channels as they can;
* Attempt to kick or ban as many server members as they possibly can;
* Make your bot leave all of the servers it has joined.

All that and much, much more. Sounds pretty terrible, right? So make sure to keep your token as safe as possible!

::: danger
If you ever somehow leak your token (commit it to a repository, post it in a support channel, etc.) or otherwise see your bot in danger, return to this page and regenerate a new one. Your old token will become invalid and you'll need to update it with the new one in all the places you've used it.
:::
