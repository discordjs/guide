# Understanding notation

Throughout out the discord.js docs and when asking for help on the official server, you will run into many different kinds of notations. To help you understand the texts that you read, we will be going over some common notations.

::: tip
Always keep in mind that notation is not always rigorous. There will be typos, misunderstandings, or context that will cause notation to differ from the usual meanings.
:::

## Classes

Some common notations are used to refer to a class or the properties, methods, or events of a class. There are many variations on these notations, and they are very flexible depending on the person, so use your best judgement when reading them.

The notation `<Class>` means an instance of the `Class` class. For example, a snippet like `<Message>.reply('hello')` is asking you to replace `<Message>` with some value that is an instance of `Message`, e.g. `msg.reply('hello')`. It could also just be a placeholder, e.g. `<id>` would mean a placeholder for some ID.

The notation `Class#foo` can refer to the `foo` property, method, or event of the `Class` class. Specifically which one the writer meant needs to be determined from context. For example:

- `Message#author`, means that you should refer to the `author` property on a `Message`.
- `TextChannel#send`, means that you should refer to the `send` method on a `TextChannel`.
- `Client#message`, means that you should refer to the `message` event on a `Client`.

::: tip
Remember that this notation is not valid JavaScript, it is a shorthand to refer to a certain piece of code.
:::

Sometimes, the notation is extended, which can help you determine which one the writer meant. For example, `TextChannel#send(content, options)` is definitely a method of `TextChannel`, since it uses function notation. And, `Client#event:message` is an event, since it says that it is an event.

The important thing to take away from this notation is that the `#` symbol signifies that the property, method, or event can only be accessed through an instance of the class. Unfortunately, this notation is often abused, e.g. `<Message>#send` (`<Message>` is already an instance so this makes no sense), or `Util#resolveColor` (`resolveColor` is a static method, this should be written `Util.resolveColor`), so always refer back to the docs if you are confused.

An example of where this notation is used is in the documentation's search feature.

![Docs search](~@/images/search.png)

Notice the use of the `.` operator for the static method, `Role.comparePositions` and the `#` notation for the method, `Role#comparePositionsTo`.

## Types

In the discord.js docs, there are type signatures everywhere, such as in properties, parameters, or return values. If you do not come from a statically typed language, you may not know what certain notations mean.

The symbol `*` means any type. For example, methods that return `*` means that they can return anything, and a parameter of type `*` can be anything.

The symbol `?` means that the type is nullable. You can see it before or after the type (e.g. `?T` or `T?`). What this symbol means is that the value can be of the type `T` or it can be `null`. An example is the property `GuildMember#nickname` which has the type `?string` since a member may or may not have a nickname.

The expression `T[]` means an array of `T`. You can sometimes see multiple brackets `[]`, meaning that the array is multi-dimensional, e.g. `string[][]`.

The expression `...T` signifies a rest parameter of type `T`. This means that the function can take any amount of arguments, and all those arguments must be of the type `T`.

The operator `|`, which can be read as "or", creates a union type, e.g. `A|B|C`. Simply, it means the value can be of any one of the types given.

The angle brackets `<>` are used for generic types or parameterized types. This means a type that uses another type(s). The notation looks like `A<B>` where `A` is the type and `B` is a type parameter. If this is hard to follow, it is enough to keep in mind that whenever you see `A<B>` you can think an `A` that contains `B`. Examples:

- `Array<String>` means an array of strings.
- `Promise<User>` means a `Promise` that contains a `User`.
- `Array<Promise<User|GuildMember>>` would be an array of `Promise`s each containing a `User` or a `GuildMember`.
- `Collection<Snowflake, User>` would be a `Collection`, containing key-value pairs where the keys are `Snowflake`s, and the values are `User`s.

![TextChannel#send on the docs](~@/images/send.png)

In this piece of the docs, you can see three type signatures, `StringResolvable`, `MessageOptions or MessageAdditions`, and `Promise<(Message|Array<Message>)>`. The meaning of the word "or" here is the same as `|`.
