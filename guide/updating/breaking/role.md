---
forceTheme: red
---

# Role

The properties of a role relating to its position have been renamed.  `role.calculatedPosition` is now `role.position`.  `role.position` is now more clearly named `role.rawPosition` to denote that it's directly from the API without any sorting.

```diff
- role.calculatedPosition;
+ role.position;

- role.position;
+ role.rawPosition;
```

## Role#hasPermission(s)

`role.hasPermission()` and `role.hasPermissions()` have been removed in favor of `permissions.has()`.

```diff
- role.hasPermission('MANAGE_MESSAGES');
+ role.permissions.has('MANAGE_MESSAGES');
```

```diff
- role.hasPermissions(['MANAGE_MESSAGES', 'MANAGE_SERVER']);
+ role.permissions.has(['MANAGE_MESSAGES', 'MANAGE_SERVER']);
```

## Role#serialize

`role.serialize()` has been removed as an extraneous helper method.

```diff
- role.serialize();
+ role.permissions.serialize();
```

## Role#setPosition

The optional, second parameter of the `role.setPosition()` method has been changed to an object; its keys are `relative` (a boolean) and `reason` (a string).

```diff
- role.setPosition(3, true);
+ role.setPosition(3, { relative: true, reason: 'Needed to be higher.' });
```
