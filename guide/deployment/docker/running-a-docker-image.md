# Running your image

## Linux

```bash
sudo docker run -d -t -i -e DISCORD_TOKEN='your-token' \
-e A='123' \
-e B='456' \
--name bot_name ghcr.io/AccountUsername/RepoName:latest # The 2nd argument is the image location, we're expecting you followed the GitHub Actions instructions and published it to the GHCR
```

## Digital Ocean App
