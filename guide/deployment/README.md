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

> VPS or virtual private server is a virtual machine sold as a service by an Internet hosting service.

There are a multitude of virtual private servers available, but the most popular ones, and the ones we will be covering in this guide, are:

-   [Linode]
-   [DigitalOcean]
-   [Vultr]
-   [Amazon EC2]

### Recommended VPS Services (I will make a table explaining benefits of each tomorrow, going to bed now)

-   [Linode](https://www.linode.com/docs/guides/connect-to-server-over-ssh/)
-   [DigitalOcean](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/)
-   [Vultr](https://www.vultr.com/docs/how-to-access-your-vultr-vps/)
-   [Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)

# Running your bot

When running your bot in production there are many different methods you can use. Below are some of the most common ones:

## Common deployment methods

| Method                           | Ease of use                             | Performance                              | Updating                                                                                                                                                                               | Dev-ops                                                                                                                                                                                                         |
| -------------------------------- | --------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Docker](deploying-to-docker.md) | {{ $frontmatter.tableData.docker.eou }} | {{ $frontmatter.tableData.docker.perf }} | Updating your bot is easy with Docker. Simply setup [Watchtower](https://containrrr.dev/watchtower/) to monitor your bot's Docker container and update it when it notices a new Image. | Working with Docker also gives you the ability to easily integrate your bot with other services, such as [GitHub Actions](deploying-to-docker.md#automating-the-build-process-with-github-actions) for example. |

<!----------------- Links --------------->

[linode]: https://www.linode.com/
[digitalocean]: http://www.digitalocean.com/
[vultr]: https://www.vultr.com/
[amazon ec2]: https://aws.amazon.com/ec2/
