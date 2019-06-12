---
forceTheme: red
---

# Fetch

Some methods that retrieve uncached data have been changed, transformed in the shape of a DataStore.

```diff
- client.fetchUser('123456789012345678');
+ client.users.fetch('123456789012345678');

- guild.fetchMember('123456789012345678');
+ guild.members.fetch('123456789012345678');

- guild.fetchMembers();
+ guild.members.fetch();

- textChannel.fetchMessage('123456789012345678');
+ textChannel.messages.fetch('123456789012345678');

- textChannel.fetchMessages({ limit: 10 });
+ textChannel.messages.fetch({ limit: 10 });

- textChannel.fetchPinnedMessages();
+ textChannel.messages.fetchPinned();
```