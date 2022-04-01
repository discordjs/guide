# Deploying to Docker

Running projects like your bot with Docker is a great way to get your bot running on a VPS, with the added benefits of being able to quickly spin up your bot on other servers using Docker, use environment variables, simple scaling, auto updating on GitHub pushes, and much more.

1. Get access to your VPS's terminal via SSH or other methods.
2. Install Docker on your VPS by following the specific instructions for your linux [distribution](https://docs.docker.com/engine/install/#server)
3. Create a [Dockerfile](#creating-a-dockerfile) or [docker-compose](#creating-a-docker-compose-file) to run your bot.
4. [Build](#building-your-docker-image) your Docker image.
5. [Run](#running-your-docker-container) your bot.

## Creating a Dockerfile

A Dockerfile is a file that tells Docker how to build your bot.

:::tip
If you have been following the guide so far the below Dockerfile should work for you.
:::

```dockerfile
# Use node:16.11.1 as the base image
FROM node:16.11.1

# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./

# Fetch dependencies
RUN npm i

# Copy code
COPY . .

# Install pm2
RUN npm install pm2 -g

# Start the bot using pm2 so errors won't kill the container, Learn More: https://discordjs.guide/improving-dev-environment/pm2.html#installation
CMD [ "pm2-runtime", "start", "index.js" ]
```

# Building your Docker image

<Definition content="A Docker image is a read-only template containing instructions for creating a container that can run on the Docker platform. It provides an easy way to package up applications and pre-configured server environments that you can use privately or publicly with other Docker users." />

Now that you have your `Dockerfile` and `.dockerignore` file, you can build your Docker image, with your instruction manual you made for the cli. Most people like to [automate this](#automating-the-build-process-with-github-actions) but you can also do it [manually](#manually-building-and-publishing-your-docker-image).

## Manually building and publishing your Docker image

Step 1: Build your Docker image

```bash
    docker build -t [your-image-name] .
```

Step 2: Push your Docker image to Docker Hub

```bash
    docker push [your-image-name]
```

## Automating the build process with GitHub Actions

<Definition content="GitHub Actions is a CI/CD platform that allows you to automate your build, test, and deployment pipelines. You can set up workflows to build and test each pull request that comes into your repository, for this example we will be using GitHub Actions to publish a Docker Image every push you do to your master branch." />

To use GitHub Actions your code must be in a GitHub repository.
You can store your code in a git server such as GitHub for ease of access.

### GitHub Desktop

> A good choice for people who are scared of the terminal and don't wanna learn it, or simply just get things done quicker with a app.

1. Download [GitHub Desktop](https://desktop.github.com/)
2. [Create a repository](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/overview/creating-your-first-repository-using-github-desktop)

### Terminal

> The classic way

1. [Make sure git is installed](https://github.com/git-guides/install-git)
2. [Create a repository](https://docs.github.com/en/get-started/quickstart/create-a-repo)

### Creating the GitHub Action

Make a new file called `publish.yml` in `.github/workflows` with the contents of:

```yml
# Name of the workflow
name: publish

# When to trigger it
on:
    # Trigger the workflow on push or pull request,
    # but only for the main branch
    push:
        branches:
            - main

# Jobs to run
jobs:
    # Build the bot job,
    build-bot:
        # Run it on ubuntu
        runs-on: ubuntu-latest

        # Steps of the job
        steps:
            # Checkout the repo at the current state
            - uses: actions/checkout@v2

              # Login to the GitHub Container Registry
            - name: Login to GitHub Container Registry
              uses: docker/login-action@v1
              with:
                  registry: ghcr.io
                  username: ${{ github.actor }}
                  password: ${{ secrets.GITHUB_TOKEN }}

              # Build and Push the bot to the GHCR
            - name: Build and Push to GHCR
              run: |
                  docker build . --tag ghcr.io/AccountUsername/RepoName:latest
                  docker push ghcr.io/AccountUsername/RepoName:latest
```

Now every time you push to your main branch the bot will be built and pushed to the GHCR.

# Running Your Docker Container

Now that you have containerized your bot, you can run it by typing:

```bash
sudo docker run -d -t -i -e DISCORD_TOKEN='your-token' \
-e A='123' \
-e B='456' \
--name bot_name ghcr.io/AccountUsername/RepoName:latest # The 2nd argument is the image location, we're expecting you followed the GitHub Actions instructions and published it to the GHCR
```

Congratulations! You have now built, published and deployed your bot to Docker.

:::tip
For easier management of your bot, we recommend [installing Portainer](https://docs.portainer.io/v/ce-2.9/start/install/server/docker/linux#deployment) for an online panel of your Docker containers without having to use the cli all the time.
:::

## Resulting code

<ResultingCode />
