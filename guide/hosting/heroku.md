# Hosting with Heroku

## Intro

Heroku is a container-based cloud **Platform as a Service** (PaaS). Developers use Heroku to deploy, manage, and scale modern apps. What this means, is that you can host your code on it so that your bot is running **all the time**. They offer a **free** plan which has a limit of **550 hours a month** across all of the applications on your account, which you shall be utilizing today (unless you want to throw in some money and get a paid tier).

## Prerequisites

Before you get started, you need to make sure that you have:

- [installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [configured](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup) Git on your local machine
- [installed](https://devcenter.heroku.com/articles/heroku-cli) the Heroku CLI

## Editing your `package.json`

Let's use the following `package.json` as an example:

```json
{
  "name": "my-bot",
  "version": "1.0.0",
  "description": "A Discord bot!",
  "main": "bot.js",
  "scripts": {
    
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
      "discord.js": "^11.4.2"
  }
}
```

To start with our edit, you're going to have to make a **start script**. To do that, you're going to have to add the following line to the `scripts`:

```json
"start": "node bot.js"
```

This assumes that your bot's main file is called `bot.js`, and it runs the file. You can test the script out if you want by running `npm start`.

## Creating a `Procfile`

When you have pushed your code to Heroku, it searches for a file called a `Procfile`. A `Procfile` determines what is run by the [dynos](https://devcenter.heroku.com/articles/dynos) (or containers) of your app.

You are going to need to create a file called `Procfile` at the root directory of your bot with the following contents:

```
worker: npm start
```

What this does is tells Heroku to initiate the **worker** Dyno (container) and makes it run the script we made previously, `start`, which runs `bot.js`.

## Creating a `.gitignore`

Now you need a `.gitignore`, because Heroku doesn't need the `node_modules` folder, and uploading will slow you down.

If you don't already have a `.gitignore`, download this Node `.gitignore` [template](https://github.com/github/gitignore/blob/master/Node.gitignore) made by the people at GitHub, and put it in the root directory of your bot.

If you already have one, if you haven't already, add the following line to it:

```
node_modules/
```

## Creating a Heroku application

Next up, you need to make a Heroku application. This is easy enough.

:::warning
Now is the time you are going to make use of the Heroku CLI. Make sure you have [downloaded](https://devcenter.heroku.com/articles/heroku-cli) it.

You are also going to make use of git. Make sure you have [downloaded](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [configured](ttps://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup) it!
:::

Let's get started. If you haven't already, [sign up](https://signup.heroku.com/) for a Heroku account, and verify it.

To create a Heroku application, you are going to need to login with the CLI. Run the following command, and login with your Heroku credentials when prompted.

```
heroku login
```

Now, you are going to actually create the app. Create an app with the name that you want. In this example, we are going to call it `super-awesome-discord-bot` by running:

```
heroku create super-awesome-discord-bot
```

If your specified name is available, Heroku's CLI will proceed to create the app for you.

Finally, you are going to add a git remote called `heroku`, pointing to Heroku. Make sure you replace `super-awesome-discord-bot` with your application's name!

```
git remote add heroku https://git.heroku.com/super-awesome-discord-bot.git
```

## Committing your files

It's nearly time for the fun stuff, now you just need to get your files to Heroku for them to host! You shall be doing that with git, a popular version control software!

This part of the tutorial requires you to use the command prompt, so be ready.

1. First, you are going to want to open the Command Prompt in your bot's directory
2. Next, you are going to want to intitiate a local git repository. To do that, run the `git init` command!
3. Now you want to stage the files to commit. Run the `git add .` command!
4. After that, we need to actually commit the files so they are ready to be pushed to Heroku's servers. Run the command `git commit -m "Initial commit."`. Remember, when you make commits, you can leave messages! It is good practice to do that!
5. Finally, you are going to send this all to Heroku's servers, so they can finish the job. Run the following command: `git push heroku master`

If your app has deployed correctly, congratulations! You've managed to setup, deploy and host your bot on Heroku! 🎉🎉🎉