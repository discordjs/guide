---
forceTheme: red
---

# RichEmbed

The `RichEmbed` class has been removed in favor of the `MessageEmbed` class.

## RichEmbed#attachFile

`RichEmbed.attachFile()` has been removed in favor of `MessageEmbed.attachFiles()`.

```diff
- new RichEmbed().attachFile('attachment://file-namme.png');
+ new MessageEmbed().attachFiles(['attachment://file-namme.png']);

- new RichEmbed().attachFile({ attachment: './file-name.png' });
+ new MessageEmbed().attachFiles([{ attachment: './file-name.png' }]);

- new RichEmbed().attachFile(new Attachment('./file-name.png'));
+ new MessageEmbed().attachFiles([new MessageAttachment('./file-name.png')]);
```
