/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable operator-linebreak */
var fs = require("fs");
var Discord = require("discord.js");
var _a = require("./config.json"),
  prefix = _a.prefix,
  token = _a.token;
var red = require("./color.json").red;
var client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
var commandFolders = fs.readdirSync("./commands");
for (var i = 0; i < commandFolders.length; i += 1) {
  var commandFiles = fs
    .readdirSync("./commands/" + commandFolders[i])
    .filter(function (file) {
      return file.endsWith(".js");
    });
  for (var j = 0; i < commandFolders.length; i += 1) {
    var command = require("./commands/" +
      commandFolders[i] +
      "/" +
      commandFiles[j]);
    client.commands.set(command.name, command);
  }
}
client.once("ready", function () {
  console.log("Ready!");
});
client.on("message", function (message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  var args = message.content.slice(prefix.length).trim().split(/ +/);
  var commandName = args.shift().toLowerCase();
  var command =
    client.commands.get(commandName) ||
    client.commands.find(function (cmd) {
      return cmd.aliases && cmd.aliases.includes(commandName);
    });
  if (!command) return;
  if (command.guildOnly && message.channel.type === "dm") {
    var error = new Discord.MessageEmbed()
      .title("Error!")
      .description("I can't execute that command inside DMs!")
      .color(red !== null && red !== void 0 ? red : "red")
      .footer(message.author.tag)
      .timestamp();
    message.reply(error);
    return;
  }
  if (command.permissions) {
    var authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !authorPerms.has(command.permissions)) {
      var error = new Discord.MessageEmbed()
        .title("Error!")
        .description("You don't have the permissions to run that command!")
        .color(red !== null && red !== void 0 ? red : "red")
        .footer(message.author.tag)
        .timestamp();
      message.reply(error);
      return;
    }
  }
  if (command.args && !args.length) {
    var error = new Discord.MessageEmbed()
      .title("Error!")
      .description(
        "You didn't provide the proper arguments\nThe proper usage would be: `" +
          prefix +
          command.name +
          " " +
          command.usage +
          "`",
      )
      .color(red !== null && red !== void 0 ? red : "red")
      .footer(message.author.tag)
      .timestamp();
    message.reply(error);
    return;
  }
  var cooldowns = client.cooldowns;
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  var now = Date.now();
  var timestamps = cooldowns.get(command.name);
  var cooldownAmount = (command.cooldown || 3) * 1000;
  if (timestamps.has(message.author.id)) {
    var expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      var timeLeft = (expirationTime - now) / 1000;
      var error = new Discord.MessageEmbed()
        .title("Error!")
        .description(
          "please wait " +
            timeLeft.toFixed(1) +
            " more second(s) before reusing the `" +
            command.name +
            "` command.",
        )
        .color(red !== null && red !== void 0 ? red : "red")
        .footer(message.author.tag)
        .timestamp();
      message.reply(error);
      return;
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(function () {
    return timestamps["delete"](message.author.id);
  }, cooldownAmount);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    var errorMSG = new Discord.MessageEmbed()
      .title("Error!")
      .description("We had an error while trying to run that command")
      .color(red !== null && red !== void 0 ? red : "red")
      .footer(message.author.tag)
      .timestamp();
    message.reply(errorMSG);
  }
});
client.login(token);
