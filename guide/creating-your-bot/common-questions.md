# Common questions

## Legend
`<client>` is a placeholder for the client object, such as from `const client = new Discord.Client();`  
`<message>` is a placeholder for the message object, such as from `client.on('message', message => {});`

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

### How do I add a role?

```js
const role = <message>.guild.roles.find('name', '<role name>');
const member = <message>.mentions.members.first();
members.addRole(role);
```

## Miscellaneous

### How do I set my playing status?

```js
<client>.user.setGame('<game>');
```
