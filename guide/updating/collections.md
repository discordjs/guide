---
forceTheme: red
---

# Collection

## Collection#find/findKey

Both methods will now return `undefined` if nothing is found.

## Collection#deleteAll

`collection.deleteAll()` has been removed in favor of map's default `clear()` method.

```diff
- roles.deleteAll();
+ roles.clear();
```

## Collection#exists

`collection.exists()` has been removed entirely in favor of `collection.some()`

```diff
- client.users.exists('username', 'Bob');
+ client.users.some(user => user.username === 'Bob');
```

## Collection#filterArray

`collection.filterArray()` has been removed completely.

## Collection#findAll

`collection.findAll()` has been removed completely as the same functionality can be obtained through `collection.filter()`.

## Collection#first/firstKey/last/lastKey/random/randomKey

The `amount` parameter of these methods now allows a negative number which will start the query from the end of the collection instead of the start.

## Collection#tap

`collection.tap` runs a specific function over the collection instead of mimicking `<array>.forEach()`, this functionality was moved to `collection.each()`. 
