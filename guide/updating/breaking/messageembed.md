---
forceTheme: red
---

# MessageEmbed

`MessageEmbed` now encompasses both the received embeds in a message and the constructor - the `RichEmbed` constructor was removed in favor of `MessageEmbed`.

## MessageEmbed#attachFiles

`RichEmbed.attachFile()` is the only method that did not make the transition from v11 to v12.  The `MessageEmbed.attachFiles()` works for one or more files.

## MessageEmbed#client

`messageEmbed.client` has been removed entirely so a new embed can be constructed without needing the full client.

## MessageEmbed#message

`messageEmbed.message` has been removed entirely so a new embed can be constructed without needing the full client.