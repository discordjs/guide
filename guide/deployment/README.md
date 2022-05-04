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

Congratulations! On making it this far, now it's time to deploy your bot to production. 🚀
When running your bot in production there are many different methods you can use. Below are some of the most common and recommended ways:

## Common deployment methods

| Method                           | Ease of use                             | Performance                              | Updating                                                                                                                                                                               | Dev-ops                                                                                                                                                                                                         |
| -------------------------------- | --------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Docker](deploying-to-docker.md) | {{ $frontmatter.tableData.docker.eou }} | {{ $frontmatter.tableData.docker.perf }} | Updating your bot is easy with Docker. Simply setup [Watchtower](https://containrrr.dev/watchtower/) to monitor your bot's Docker container and update it when it notices a new Image. | Working with Docker also gives you the ability to easily integrate your bot with other services, such as [GitHub Actions](deploying-to-docker.md#automating-the-build-process-with-github-actions) for example. |
