---
forceTheme: red
---

# Collection

## Collection#exists

`collection.exists()` was removed entirely, `collection.some()` should be used to check if an element exists in the collection that satisfies the provided value.

```diff
- client.users.exists('username', 'Bob');
+ client.users.some(user => user.username === 'Bob');
```

## Collection#filterArray

`collection.filterArray()` was removed entirely, as it was just a helper method for `collection.filter().array()` and most of the time converting a collection to an array is an unnecessary step.

## Collection#find

`collection.find('property', value)` has been removed entirely, and `collection.find()` only accepts a function in v12.

```diff
- client.users.find('username', 'Bob');
+ client.users.find(user => user.username === 'Bob');
```

## Collection#findAll

`collection.findAll()` was removed entirely as it just duplicated `collection.filterArray()`'s results.
