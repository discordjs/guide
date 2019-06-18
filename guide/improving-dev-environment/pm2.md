# Managing your bot process with PM2

PM2 is a process manager. It manages your applications' states, so you can start, stop, restart and delete processes. It offers features such as monitoring running processes and setting up a "start with operating system" (be that Windows, Linux or Mac) so your processes start when you boot your system.

## Installation

You can install PM2 via npm:

```bash
npm install --global pm2
```

Or, if you use Yarn:

```bash
yarn global add pm2
```

## Starting your app

After PM2 has been installed, the easiest way you can start your app is by going to the directory your bot is in, and then run the following:

```bash
pm2 start your-app-name.js
```

### Additional notes

The `pm2 start` script allows for more optional command-line arguments.

- `--name`: This allows you to set the name of your process when listing it up with `pm2 list` or `pm2 monit`:

```bash
pm2 start your-app-name.js --name "Some cool name"
```

- `--watch`: This option will automatically restart your process as soon as a file change has been detected, which can be useful for development environments:

```bash
pm2 start your-app-name.js --watch
```

::: tip
The `pm2 start` command can take more optional parameters, but for now only these 2 are relevant for us. If you want to see all the parameters available, you can check the documentation of pm2 [here](https://pm2.io/doc/en/runtime/reference/pm2-cli/).
:::

Once the process is launched with pm2, you can run `pm2 monit` to monitor any and all console outputs from the processes started by pm2. This accounts for any `console.log()` in your code or outputted errors.

## Setting up booting with your system

Perhaps one of the more useful features of PM2 is being able to boot up with your Operating System. This will ensure that your bot processes will always be started after an (unexpected) reboot (e.g. after a power outage).

The initial steps to run differ per OS. In this guide, we'll cover those for Windows and for Linux/MacOS.

### Initial steps for Windows

::: tip
Run these from an administrative command prompt to avoid getting hit with a bunch of UAC dialogs.
:::

**Install the [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) package from npm:**

```bash
npm install --global pm2-windows-service
```

**After installation has finished, install the service by running the following command:**

```bash
pm2-service-install
```
::: tip
You can use the `-n` parameter to set the service name: `pm2-service-install -n "the-service-name"`
:::

### Initial steps for Linux/MacOS

You need to get a start script, which you can get by running the following command:

```bash
# Detects the available init system, generates the config and enables startup system
pm2 startup
```

Or, if you want to manually specify your machine select one of the options with the command:

```bash
pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freesd | systemd | systemv | upstart | launchd | rcd | openrc]
```

The output of running one of the commands listed above will output a command for you to run with all environment variables and options configured for you.

**Example output for an Ubuntu user:**

```bash
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/user/.nvm/versions/node/v8.9/bin pm2 startup ubuntu -u user --hp /home/user
```

After running that command, you can continue to the next step.

### Saving the current process list

To save the current process list so it will automatically get started after a restart, run the following command:

```bash
pm2 save
```

To disable this, you can run the following command:

```bash
pm2 unstartup
```
