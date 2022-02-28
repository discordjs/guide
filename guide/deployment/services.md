---
{
    "tableData":
        {
            "docker":
                {
                    "eou": "Hard learning curve",
                    "perf": "How Docker works under the hood is by utilizing containers which are basically little light virtual machines, so expect a bit of overhead if your VPS is on the low-end.",
                    "update": "Updating your bot is easy with Docker. Simply setup [Watchtower](https://containrrr.dev/watchtower/) to monitor your bot's Docker container and update it when it notices a new Image.",
                    "devops": "Working with Docker also gives you the ability to easily integrate your bot with other services, such as [GitHub Actions](#automating-the-build-process-with-github-actions) for example.",
                },
        },
}
---

# Deployment

Congratulations! 🎉 On making it this far, now it's time to deploy your bot to production. 🚀

## Virtual Private Server

> Using a VPS or virtual private server is a virtual machine sold as a service by an Internet hosting service.

There are a multitude of virtual private servers available, but the most popular ones, and the ones we will be covering in this guide, are:

-   [Linode]
-   [DigitalOcean]
-   [Vultr]
-   [Amazon EC2]

### Before you go all out

Before you go out and purchase a VPS, we recommend learning linux terminal basics and how to remotely connect to a VPS. The usual method is via [SSH](https://en.wikipedia.org/wiki/Secure_Shell_Protocol). We won't go deep into it as thats outside of the scope of this guide, however VPS providers usually have a guide regarding connection so you can read up on that.

-   [Linode](https://www.linode.com/docs/guides/connect-to-server-over-ssh/)
-   [DigitalOcean](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/)
-   [Vultr](https://www.vultr.com/docs/how-to-access-your-vultr-vps/)
-   [Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)

> If your using another provider, we recommend following [DigitalOcean](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/openssh/)'s SSH instructions.

# Running your bot

When running your bot in production there are many different methods you can use. Below are some of the most common ones.

## Benefits of each deployment method

| Method            | Ease of use                             | Performance                              | Updating                                                                                                                                                                               | Dev-ops                                    |
| ----------------- | --------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Docker](#docker) | {{ $frontmatter.tableData.docker.eou }} | {{ $frontmatter.tableData.docker.perf }} | Updating your bot is easy with Docker. Simply setup [Watchtower](https://containrrr.dev/watchtower/) to monitor your bot's Docker container and update it when it notices a new Image. | {{ $frontmatter.tableData.docker.devops }} |

### Docker

Running projects like your bot with Docker is a great way to get your bot running on a VPS, with the added benefits of being able to quickly spin up your bot on other servers using Docker, use environment variables, simple scaling, auto updating on GitHub pushes, and much more.

1. Get access to your VPS's terminal via SSH or other methods.
2. Install Docker on your VPS by following the specific instructions for your linux [distribution](https://docs.docker.com/engine/install/#server)
3. Create a [Dockerfile](#creating-a-dockerfile) or [docker-compose](#creating-a-docker-compose-file) to run your bot.

#### Creating a Dockerfile

> A Dockerfile is a file that tells Docker how to build your bot.

If you have been following the guide so far the below Dockerfile should work for you.

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

#### Automating the build process with GitHub Actions

> Why use Docker? Docker is a system that uses text document instructions to build an image, a read-only template containing instructions for creating a container that can run on Docker.

<!----------------- Links --------------->

[linode]: https://www.linode.com/
[digitalocean]: http://www.digitalocean.com/
[vultr]: https://www.vultr.com/
[amazon ec2]: https://aws.amazon.com/ec2/
