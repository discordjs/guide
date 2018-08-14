# To-do list

Feel free to add on to this list as you see fit. Make sure to cross things off as they get done, too.

---

* Category for improving your dev environment
	* Keyboard shortcuts for VSC/Atom/Sublime
	* Useful packages for VSC/Atom/Sublime
	* cmder/hyper/etc.

* Useful packages for bots (single page, probably)
	* common-tags
	* moment.js
	* chalk
	* winston

* Category for best practices
	* Sanity checks

* Frequently asked questions section
	* Incoming breaking changes in v12 from v11
	* A "mute" role
	* An eval command

* Frequently requested topic guides
	* How to navigate the d.js docs (hoo boi)
	* Reaction menu example
	* Embeds
	* Permission overwrites (roles, members, adding, deleting, etc.)
	* Audit logs (e.g. see who deleted what message)
	* Common errors and what they mean

* Long-term plans
	* OAuth guide
	* Figure out how to make an OAuth dashboard (node, express, passport, vue maybe)
	* Merge the Commando guide into this guide
	* Look into how to create a search plugin for Docsify (the existing one doesn't work well at all)
	* Possibly adopt [Crawl's ESLint config](https://github.com/iCrawl/eslint-config-aqua)

* Adjustments / Updates
	* Update `Reflect.defineProperty()` and prototyped methods to use `.findOrCreate()`/`.findOrBuild()` instead of manual checks
	* Fix code style inconsistency in the Sequelize pages
	* Fix wording style inconsistency in the Sequelize pages (e.g. using "we" instead of "you")
	* Add a section on the reactions page about removing reactions (per user, per emoji, etc.)

* Vue-related
	* Make a [version selector component](https://github.com/discordjs/guide/issues/121) that determines what content a user sees on a page
	* Replace all `<p class="tip">` stuff with Vue components, e.g. `<tip>`, `<warning>`, etc.
	* Expand upon Discord message component:
		* Add a component for embeds and all the related areas, e.g. `<discord-embed>`, `<embed-field>`, `<embed-footer>`, etc.
		* Possibly add a component for reactions
		* Eventually move it to its own repo so that it doesn't have to be directly related to the guide and other people can use it in their own projects
