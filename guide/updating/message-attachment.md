---
forceTheme: red
---

# MessageAttachment

The `MessageAttachment` class constructor parameters have changed to reflect that `Attachment` has been removed and rolled into `MessageAttachment`.

## MessageAttachment#client

`attachment.client` has been removed entirely so an attachment can be constructed without needing the full client.

## MessageAttachment#filename

`attachment.filename` has been renamed to `attachment.name`.

## MessageAttachment#filesize

`attachment.filesize` has been renamed to `attachment.size`.
