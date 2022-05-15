# Running your image

There are many different ways to run a Docker image.
The most common is to use the `docker run` command on a VPS.

## Virtual Private Server

VPS or virtual private server is a virtual machine sold as a service by an Internet hosting service.
There are a multitude of virtual private servers available, but the most popular ones, and the ones we will be covering in this guide, are:

-   [Linode](https://www.linode.com/)
-   [DigitalOcean](https://www.digitalocean.com/)
-   [Vultr](https://www.vultr.com/)
-   [Amazon EC2](https://aws.amazon.com/ec2/)

Once you have acquired a VPS you will need to SSH into it, here are some instructions for the providers above, if you are using a different provider you will need to follow the instructions for that provider though it's pretty much the same thing.

-   [Linode](https://www.linode.com/docs/guides/connect-to-server-over-ssh/)
-   [DigitalOcean](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/)
-   [Vultr](https://www.vultr.com/docs/how-to-access-your-vultr-vps/)
-   [Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)

Once you have SSHed into your VPS you will need to install Docker. This is different for each Linux distribution.
Install Docker on your VPS by following the specific instructions for your linux [distribution](https://docs.docker.com/engine/install/#server)

Once Docker is installed and ready you can run your image with the below command, make sure to replace `AccountUsername` and `RepoName` with your own values.

```bash
sudo docker run -d -t -i -e DISCORD_TOKEN='your-token' \
-e A='123' \
-e B='456' \
--name bot_name ghcr.io/AccountUsername/RepoName:latest # The 2nd argument is the image location, we're expecting you followed the GitHub Actions instructions and published it to the GHCR
```

## Services that support Docker

There are many platform as a service (PaaS) that support Docker to quickly deploy and run Docker images without worrying about the setup and underlying infrastructure.

-   [DigitalOcean](https://docs.digitalocean.com/products/app-platform/how-to/deploy-from-container-images/)
-   [Railway](https://railway.app/)
-   [Render](https://render.com/)
-   [Heroku](https://devcenter.heroku.com/categories/deploying-with-docker)
