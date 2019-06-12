---
forceTheme: red
---

# OAuth2Application

The `OAuth2Application` class has been renamed to `ClientApplication`.

## OAuth2Application#bot

`application.bot` has been removed entirely.

## OAuth2Application#flags

`application.flags` has been removed entirely.

## OAuth2Application#iconURL

`application.iconURL` is now a method, as opposed to a property. It also allows you to determine the file format and size to return.

```diff
- user.iconURL;
+ user.iconURL();
+ user.iconURL({ format: 'png', size: 1024 });
```

## OAuth2Application#redirectURLs

`application.redirectURLs` has been removed entirely.

## OAuth2Application#reset

`application.reset()` has been removed entirely, as it was an endpoint for user accounts.

## OAuth2Application#rpcApplicationState

`application.rpcApplicationState` has been removed entirely.

## OAuth2Application#secret

`application.secret` has been removed entirely.
