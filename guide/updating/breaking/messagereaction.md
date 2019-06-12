---
forceTheme: red
---

# MessageReaction

## MessageReaction#fetchUsers

`messageReaction.fetchUsers()` has been transformed in the shape of a DataStore.  In addition, the first parameter has been removed in favor of an object.

```diff
- reaction.fetchUsers(50);
+ reaction.users.fetch({ limit: 50 });
```

## MessageReaction#remove

`messageReaction.remove()` has been transformed in the shape of a DataStore.

```diff
- reaction.remove();
+ reaction.users.remove();
```