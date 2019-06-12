---
forceTheme: red
---

# Webhook

## Webhook#send\*\*\*

Just like the `TextChannel#send***` methods, all the `.send***()` methods have been removed in favor of one general `.send()` method. Read through the [TextChannel#send\*\*\*](/additional-info/changes-in-v12.md#channelsend) section for more information.

## WebhookClient

The `WebhookClient` class now extends `BaseClient` and implements `Webhook` instead of just extending `Webhook`, so a lot of methods and properties are documented there, as opposed to on the client.
