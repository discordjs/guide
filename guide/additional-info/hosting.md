# Hosting your bot on a VPS

A bot requires itself to be hosted in order for it to run, however, it would be unideal to host it on your computer all day without shutting it down. That's where a **Virtual Private Server**(VPS) comes into place. A good VPS can mark a turning point for your project as you can host local databases, and it is reliable as well. A VPS suitable for your Discord bot is typically cheap, ranging from around $2-10/month.

## Well known affordable providers

We have gathered a small list of famous and inexpensive VPS providers who you may rely on for getting your job done:
* [OVH](https://www.ovh.com/us/vps/) - Starting at $3.35/month for 1 core, 2GB RAM, 20GB SSD
* [DigitalOcean](https://www.digitalocean.com/) - Starting at $5/month for 1 core, 1GB RAM, 25GB SSD
* [Linode](https://www.linode.com/) - Starting at $5/month for 1 core, 1GB RAM, 25GB SSD
* [Vultr](https://www.vultr.com/) - Starting at $2.50/month for 1 core, 512MB RAM, 10GB SSD
* [AWS Lightsail](https://amazonlightsail.com/) - Starting at $3.50/month (first month free) for 1 core, 512MB RAM, 20GB SSD

Before you purchase a VPS, we recommend you learn how to remotely connect to a VPS. The usual method is via [SSH](https://en.wikipedia.org/wiki/Secure_Shell_Protocol). We won't go deep into it as its outside the scope of this guide, however VPS providers usually have a guide regarding connection so you can read up on that.

## Steps to host

::: warning
The following steps are stated guessing your Linux flavour is Ubuntu. However all Linux flavours are similar and should work on your VPS
:::

Ok, now you have purchased your own VPS, and you have remotely connected to it. What do you do now? We first recommend you create a Github repository and add your bot files there as it would be very ineffecient to code files through a terminal. 

### Installing Git and cloning repository

First, you need to install Git on the VPS, run the following command in the terminal to install it:

```bash
sudo apt-get -y install git
```
Clone the repository by running:

```bash
git clone <git-url>
```

### Installing NodeJS via NVM

At the point of writing, the NodeJS library supported by Linux's `apt` repository only supports Version 10, however Discord.js v13 requires you to have Version 14+ in order to run your bot. To solve this issue, you need to install Node Version Manager which is a simple Bash script to manage multiple Node.js versions. Install NVM using Curl:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
```
Then you can install the LTS version of Nodejs by doing:

```bash
nvm install --lts
```

::: tip
If your Linux system doesn't have Curl, you can run `sudo apt-get install curl` to install it.
:::

### Final steps

Finally, `cd` into the directory which you have just cloned and run:

```bash
node <file-name>
```

And thats it! You have officially hosted your Discord bot on a VPS. If you want to make changes, update your repository on Github and update the VPS's local clone by running `git pull`(inside the directory).

