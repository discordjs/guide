# Creating a Dockerfile

A Dockerfile is a file that tells Docker how to build your bot into an image for the Docker engine to run.
When the image is built and running in a container, it will be running in a virtual environment that is isolated from the host machine.
This means you cannot access files in your host machine without volume mounts. This means if you decided to use a JSON file instead of environment variables for configuration, you will need to mount the file to the container or simply use [environment variables](/creating-your-bot/#using-environment-variables).

1. Create a `Dockerfile` file in your project directory.

```bash
touch Dockerfile
```

2. Add the following lines to your `Dockerfile` file:

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

3. Create a `.dockerignore` file in your project directory.

```bash
touch .dockerignore
```

4. Add the following lines to your `.dockerignore` file:

```dockerignore
node_modules
**/*.env
```

If you decide to build your bot locally we ignore the `node_modules` folder and any `.env` files so you have a clean build.

## Resulting code

<ResultingCode />
