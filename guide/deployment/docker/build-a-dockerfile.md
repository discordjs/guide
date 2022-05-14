# Building your Docker image

:::tip
A Docker image is a read-only template containing instructions for creating a container that can run on the Docker platform. It provides an easy way to package up applications and pre-configured server environments that you can use privately or publicly with other Docker users.
:::

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

:::tip
GitHub Actions is a CI/CD platform that allows you to automate your build, test, and deployment pipelines. You can set up workflows to build and test each pull request that comes into your repository, for this example we will be using GitHub Actions to publish a Docker Image every push you do to your master branch.
:::

To use GitHub Actions your code must be in a GitHub repository.
You can store your code in a git server such as GitHub for ease of access.

[Create a GitHub repository](https://docs.github.com/en/get-started/quickstart/create-a-repo)

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

Now every time you push to your main branch the docker image will be built and pushed to the GHCR.

## Resulting code

<ResultingCode />
