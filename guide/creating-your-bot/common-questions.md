# Common questions

## Legend
`<client>` is a placeholder for the client object, such as `const client = new Discord.Client();`.
`<message>` is a placeholder for the message object, such as `client.on('message', message => {});`.

## Administrative

### How do I ban a user?

```js
const user = <message>.mentions.users.first();
<message>.guild.ban(user);
```

### How do I kick a user?

```js
const user = <message>.mentions.users.first();
<message>.guild.kick(user);
```

### How do I add a role to a guild member?

```js
const role = <message>.guild.roles.find('name', '<role name>');
const member = <message>.mentions.members.first();
member.addRole(role);
```

## Miscellaneous

### How do I set my playing status?

```js
<client>.user.setGame('<game>');
```

**Notes:**

* If you would like to set your playing status upon startup, you must place the `<client>.user.setGame()` method in a `ready` event listener (`client.on('ready', () => {});`).

* If you're using a selfbot to change your playing status, you won't be able to view the status change, but other users will.
