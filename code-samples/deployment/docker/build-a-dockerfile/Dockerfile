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