# Contributing

## Installations

If you don't already have some sort of local server, you should install the `docsify-cli` package. You can do so by running the following command:

```
npm i -g docsify-cli
```

After that, you can simply run `docsify serve guide` to run a server at `localhost:3000`.

## Adding Pages

To add a new page to the guide, simply create a `file-name.md` file inside the folder of your choice. If you want to link to `/dir/some-tutorial`, you would create a `some-tutorial.md` file inside a `dir` folder. Docsify will pick up on it and set up the routing appropriately.

With that being said, you will still need to add the link to the sidebar manually. Go to the `/guide/_sidebar.md` file and insert a new list item with a link to your newly created page.

There are, of course, many other things you can do with docsify, but this should suffice for simple edits/additions. Consult the [documentation site](https://docsify.js.org/#/) for further info.
