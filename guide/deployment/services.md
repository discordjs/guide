---
{
    "tableData":
        {
            "vps":
                {
                    "control": "You have complete control over your bot's resources, but at the cost of having to do everything manually.",
                    "performance": "This is dependent on the VPS provider and the specifications of the VPS. Depending on the workload of your bot, a VPS with 1 core and at least 1 - 2 GB(s) of RAM is usually sufficient.",
                },
            "replit":
                {
                    "control": "Little to no control, Replit was never really intended to be a hosting provider, rather a simple yet powerful online IDE, Editor, Compiler, Interpreter, and REPL.",
                    "performance": "Replit's Free plan has 500mb of memory and 0.2 - 0.5 vCPUs, which is sufficient for most bots, but if you're doing a lot of heavy work, you should consider Replit's Hacker plan or another hosting method.",
                },
        },
}
---

# Deployment

Congratulations! 🎉 On making it this far, now it's time to deploy your bot to production. 🚀

# Hosting Methods

When deploying your bot to production there are many different methods you can use. Below are some of the most common ones.

## Benefits of each deployment method

| Method                         | Control                                     | Performance                                     |
| ------------------------------ | ------------------------------------------- | ----------------------------------------------- |
| [VPS](#virtual-private-server) | {{ $frontmatter.tableData.vps.control }}    | {{ $frontmatter.tableData.vps.performance }}    |
| [Replit](#replit)              | {{ $frontmatter.tableData.replit.control }} | {{ $frontmatter.tableData.replit.performance }} |

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

### Running the bot via Docker on a VPS

Running projects like your bot on a VPS with Docker is a great way to get your bot running on a VPS, with the added benefits of being able to run your bot on any OS, quickly spin up your bot on other servers using Docker, securely use environment variables, simple scaling, auto updating on GitHub pushes, and much more.

1. Get access to your VPS's terminal via SSH or other methods.
2. Install Docker on your VPS by following the specific instructions for your linux [distribution](https://docs.docker.com/engine/install/#server)
3.

## Replit

<!----------------- Links --------------->

[linode]: https://www.linode.com/
[digitalocean]: http://www.digitalocean.com/
[vultr]: https://www.vultr.com/
[amazon ec2]: https://aws.amazon.com/ec2/
