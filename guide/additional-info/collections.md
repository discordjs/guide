# Collections

Discord.js comes with this utility class known as `Collection`.
It extends JavaScript's native `Map` class, so it has all the features of `Map` and more!  

::: warning
If you're not familiar with `Map`, read [MDN's page on it](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) before continuing. You should be familiar with `Array` [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) as well. We will also be using some ES6 features, so read up [here](/additional-info/es6-syntax.md) if you do not know what they are.
:::

In essence, `Map` allow for an association between unique keys and their values, but lack an iterative interface.
For example, how can you transform every value or filter the entries in a `Map` easily?
This is the point of the `Collection` class!

## Array-like Methods

Many of the methods on `Collection` are based on their namesake in `Array`. One of them is `find`:

```js
// Assume we have an array of users and a collection of the same users.
array.find(u => u.discriminator === '1000');
collection.find(u => u.discriminator === '1000');
```

The interface of the callback function is very similar between the two.
For arrays, callbacks are usually passed the parameters `(value, index, array)`, where `value` is the value it iterated to,
`index` is the current index, and `array` is the array itself. For collections, you would have `(value, key, collection)`.
Here, `value` is the same, but `key` is the key of the value, and `collection` is the collection itself instead.  

Methods that follow this philosophy of staying close to the `Array` interface are as follows:

- `find`
- `filter` - Note that this returns a `Collection` rather than an `Array`.
- `map` - Yet this returns an `Array` of values instead of a `Collection`!
- `every`
- `some`
- `reduce`
- `concat`
- `sort`

## Converting to Array

There are two ways you might want to convert a `Collection` into an `Array`. The first way is the `array` or `keyArray` methods.
They simply create an array from the items in the collection, but also caches it too:

```js
// Not computed again the second time, it is cached!
collection.array();
collection.array();

// Any change to the collection, however, invalidates the cache.
// This call to `array` must be recomputed.
collection.delete('81440962496172032');
collection.array();
```

This caching behavior is undesirable if you are planning to mutate the array, so instead, you can use `Array.from`:

```js
// For values.
Array.from(collection.values());

// For keys.
Array.from(collection.keys());

// For [key, value] pairs.
Array.from(collection);
```

::: warning
Many people use `array` way too much! This leads to unneeded caching of data and confusing code. Before you use `array` or similar, ask yourself if whatever you are trying to do can't be done with the given `Map` or `Collection` methods or with a for-of loop.
:::

## Extra Utilities

Some methods are not from `Array` and are instead completely new to standard JavaScript.

```js
// A random value. Be careful, this uses `array` so caching is done.
collection.random();

// The first value.
collection.first();

// The first 5 values.
collection.first(5);

// Similar to `first`, but from the end. This uses `array`.
collection.last();
collection.last(2);

// Removes from the collection anything that meets a criteria.
// Sort of like `filter`, but in-place.
collection.sweep(user => user.username === 'Bob');
```

A more complicated method is `partition`, which splits a collection into two, based on a certain criteria.
You can think of it as two `filter`s, but done at the same time:

```js
// `bots` is a Collection of users where their `bot` property was true.
// `humans` is a Collection where the property was false instead!
const [bots, humans] = collection.partition(u => u.bot);

// Both return true.
bots.every(b => b.bot);
humans.every(h => !h.bot);
```
