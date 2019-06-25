# Notes on the NPM 'How NPM Works' docs

From [http://npm.github.io/how-npm-works-docs/](http://npm.github.io/how-npm-works-docs/)

# 1: Theory and Design

## What is a package?

* File or directory described by `package.json`
* A module is any file or directory that can be loaded by `require()`

### What is a `package`?

* Any of:
    * folder containing a program described by a `package.json` file
    * gzipped tarball that contains such a folder
    * url that resolves to such a tarball
    * a `name@version` published on the registry, with such a URL
    * a `name@tag` that points to a `name@version` on the registry
    * a `name` with the `latest` tag, pointing to `name@version` on the registry
    * a git url that, when cloned, results in a folder described by package.json
* git urls may be in these forms:
    * `git://github.com/user/project.git#commit-ish`
    * `git+ssh://user@hostname:project.git#commit-ish`
    * `git+http://user@hostname/project.git#commit-ish`
    * `git+https://user@hostname/project/blah.git#commit-ish`
* `commit-ish` may be a tag, sha, or branch that works with `git checkout`
* Defaults to `master`

### What is a `module`?

* Anything that can be loaded with `require()` in a Node.js program
* These things may be:
    * a folder with a package.json containing a `main` field
    * a folder with an `index.js` file in it
    * a JavaScript file

#### Most npm packages are modules

* It's not required, but most are.
* Some packages, like `cli`, only contain an executable CLI interface and no `main` field in their `package.json`. These are not modules.
* Almost all npm packages contain many modules within them, if they use require at all
* In the context of a Node program, the `module` is also the thing that was loaded from a file, such as `req` in `const req = require('request');`

## File and Directory Names

* The `package.json` file defines a package.
* The `node_modules` folder is where Node.js looks for modules
* There may be things in `node_modules` that are not packages (do not have a package.json file)
* If you create a package with no `index.js` or `main` in its package.json, it is not a module, and even if put into `node_modules`, cannot be loaded via `require()`

## Dependency Hell

* Three modules, A, B, C
* A requires B@1.0
* C requires B@2.0
* If my app requires both A and C, there's a real problem resolving the dependency tree.

## The Node Module Loader

* Most module loaders can't load two of the same module into memory, even if they both exist on the system and can be resolved by name+version
* The Node.js module CAN load both versions without conflict
* 
