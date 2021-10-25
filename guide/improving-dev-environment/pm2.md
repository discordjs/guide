# Managing your bot process with PM2

PM2 is a process manager. It manages your applications' states, so you can start, stop, restart, and delete processes. It offers features such as monitoring running processes and setting up a "start with operating system" (be that Windows, Linux, or Mac) so your processes start when you boot your system.

## Installation

You can install PM2 via the following command:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install --global pm2
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn global add pm2
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add --global pm2
```
:::
::::

## Starting your app

After you install PM2, the easiest way you can start your app is by going to the directory your bot is in and then run the following:

```sh:no-line-numbers
pm2 start your-app-name.js
```

### Additional notes

The `pm2 start` script allows for more optional command-line arguments.

- `--name`: This allows you to set the name of your process when listing it up with `pm2 list` or `pm2 monit`:

```sh:no-line-numbers
pm2 start your-app-name.js --name "Some cool name"
```

- `--watch`: This option will automatically restart your process as soon as a file change is detected, which can be useful for development environments:

```bash
pm2 start your-app-name.js --watch
```

::: tip
The `pm2 start` command can take more optional parameters, but only these two are relevant. If you want to see all the parameters available, you can check the documentation of pm2 [here](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).
:::

Once the process launches with pm2, you can run `pm2 monit` to monitor all console outputs from the processes started by pm2. This accounts for any `console.log()` in your code or outputted errors.

In a similar fashion to how you start the process, running `pm2 stop` will stop the current process without removing it from PM2's interface:

```sh:no-line-numbers
pm2 stop your-app-name.js
```

## Setting up booting with your system

Perhaps one of the more useful features of PM2 is being able to boot up with your Operating System. This feature will ensure that your bot processes will always be started after an (unexpected) reboot (e.g., after a power outage).

The initial steps differ per OS. In this guide, we'll cover those for Windows and Linux/MacOS.

### Initial steps for Windows

::: tip
Run these from an administrative command prompt to avoid getting hit with a bunch of UAC dialogs.
:::

**Install the [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) package from npm:**

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install --global pm2-windows-service
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn global add pm2-windows-service
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add --global pm2-windows-service
```
:::
::::

**After installation has finished, install the service by running the following command:**

```sh:no-line-numbers
pm2-service-install
```
::: tip
You can use the `-n` parameter to set the service name: `pm2-service-install -n "the-service-name"`
:::

### Initial steps for Linux/MacOS

You'll need a start script, which you can get by running the following command:

```sh:no-line-numbers
# Detects the available init system, generates the config, and enables startup system
pm2 startup
```

Or, if you want to specify your machine manually, select one of the options with the command:

```sh:no-line-numbers
pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freesd | systemd | systemv | upstart | launchd | rcd | openrc]
```

The output of running one of the commands listed above will output a command for you to run with all environment variables and options configured.

**Example output for an Ubuntu user:**

```sh:no-line-numbers
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/user/.nvm/versions/node/v8.9/bin pm2 startup ubuntu -u user --hp /home/user
```

After running that command, you can continue to the next step.

### Saving the current process list

To save the current process list so it will automatically get started after a restart, run the following command:

```sh:no-line-numbers
pm2 save
```

To disable this, you can run the following command:

```sh:no-line-numbers
pm2 unstartup
```
