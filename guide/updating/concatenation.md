---
forceTheme: red
---

v12 has changed how string concatenation works with stringifying objects.  The `valueOf` any data structure will return its id, which affects how it behaves in strings, eg. using an object for a mention.  In v11, you used to be able to use `channel.send(userObject + ' has joined!')` and it would automatically stringify the object and it would become the mention (`@user has joined!`), but in v12, it will now send a message that says `123456789012345678 has joined` instead.  Using template literals (\`\`) will still return the mention, however.

```diff
- channel.send(userObject + ' has joined!')
+ channel.send(`${userObject} has joined!`)
```