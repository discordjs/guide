---
forceTheme: red
---

# Permissions

## Permissions#_member

`permissions._member` has been removed entirely.

## Permissions#flags

The following permission flags have been renamed:

* `READ_MESSAGES` -> `VIEW_CHANNEL`
* `EXTERNAL_EMOJIS` -> `USE_EXTERNAL_EMOJIS`
* `MANAGE_ROLES_OR_PERMISSIONS` -> `MANAGE_ROLES`

## Permission#hasPermission(s)

`permissions.hasPermission()` and `permissions.hasPermissions()` have been removed entirely in favor of `permissions.has()`.  This change reduces extraneous helper methods.

## Permissions#missingPermissions

`permissions.missingPermissions()` has been renamed to `permissions.missing()` and also refactored. The second parameter in v11 was named `explicit`, described as "Whether to require the user to explicitly have the exact permissions", defaulting to `false`. However, the second parameter in v11 is named `checkAdmin`, described as "Whether to allow the administrator permission to override", defaulting to `true`.

```diff
- permissions.missingPermissions(['MANAGE_SERVER']);
+ permissions.missing(['MANAGE_SERVER']);
```

## Permissions#raw

`permissions.raw` has been removed in favor of `permissions.bitfield`.

```diff
- permissions.raw;
+ permissions.bitfield;
```

## Permissions#resolve

`permissions.resolve()` has been removed entirely.