# Notes on Exploring NPM Packages video 

On O'Reilly Learning

# Ch. 1: Introduction to the NPM

## Project initialization

* `package.json` file in project root is req for multiple devs or public sharing
* File has basic metadata in json
* package.json can be created:
    * manually
    * `npm init`
    * `yarn init`
* Looks at package.json for babel-cli package
    * name, version, desc, author, hoempage, license, repo, keywords, and depedencies
    * Dependencies are versioned
* Package versions / semver
    * Each public package must have name/version
    * General agreement to use Semver
    * Major dot minor dot patch
    * Bug fixes are patch version
    * Back compatible changes are minor
    * Breaking changes are major versions
    * If you are depended on by other packages, major version updates do not guarantee compatible
    * Versioning:
        * Exact: `1.2.3`
        * Greater than: `>1.2.3`
        * Compatible changes: `^1.2.3` (compatible, minor and patch changes)
        * Minor level changes: `~1.2.3` (only patch version may change)
    * Tags:
        * `1.2.3-alpha < 1.2.3-alpha.1 < 1.2.3-beta < 1.2.3-beta.2 < 1.2.3-beta.11 < 1.2.3-rc.1 < 1.2.3`
        * alpha, beta, rc (release candidate)
    * Package version for public package is in package.json

## Package Installation

* Installation
    * need to install with npm or yarn
    * `npm install` or `npm i`
        * Installs all packages listed in `package.json`
        * If no package.json, nothing installed
        * If package.json exists and lists dependencies, they are installed in node_modules inside the project folder
        * Very often the node_modules folder gets very large
    * `npm install <package>` or `npm install <package> --save-dev`
        * `npm install <package>` installs package in the project folder and adds it as a dependency in package.json
        * `npm install <package> --save-dev` installs the package and adds it as a _development_ dependency in package.json
    * Install package in project
        * Installs moment.js
        * `npm install moment`
        * `yarn add moment`
    * By default the dependency is added as `^1.2.3` (compatible updates)
    * Also added to `package-lock.json`, which adds:
        * version
        * resolved
        * SHA hash
    * Creates `node_modules/moment`, which has its own `package.json`
    * Uses `const moment = require("moment");` in index.js of own package
    * calls `moment()` to get curdate obj, uses `.format("dddd")` to format
    * calls it with `node src/index.js` to output day to console
    * in this case only one package was installed (moment), which is because it has no dependencies to install
    * it has lots of development dependencies, but no actual dependencies
* Installing Semver package
    * `npm i semver` or `yarn add semver`
    * semver has no dependencies, and is relatively simple
    * it has a lot of methods around verifying and comparing version strings
    * `semver.coerce()` tries to coerce strings like "v2" to valid semver
* Installing BrowsersList
    * Has 2 dependencies
    * `npm i browserslist`
    * Installs the dependencies into `node_modules`
    * All dependencies (not dev dependencies) are installed automatically
    * Our package's `package.json` only gets the head of the dependency tree--the `browserslist` package is added
    * If the dependencies of something you install have cascading dependencies, they will auto-install as well
    * Your `package-lock.json` file gets EVERY dependency with version, source, and SHA hash

## 3. Dependencies vs Dev. Dependencies

* Dependencies and dev dependencies
    * A dependency is installed with `npm i package_name`
    * If a project has a package.json, and you run `npm install` in that folder, all dependencies will go into the node_modules folder of that package
    * If package A is installed using `npm install packageA`, and has a dependency on `packageB`, then `packageB` will ALSO be installed, along with its dependencies. They will show up in your `package.json` and `package-lock.json`
    * Development dependencies are also installed using `npm install`, but not installed using `npm install --production`
    * If packageA has dev dependency on packageB, package B IS NOT INSTALLED
    * Dependencies are transitive, dev dependencies are not.
* Installing development dependencies
    * Removing browserslist: `npm uninstall browserslist`
    * Removal removes the dependencies of the uninstalled package.
    * Removes from node_modules, `package.json`, `package-lock.json`
    * Adding a package as dev dependency: `npm i --save-dev browserslist`
    * It adds the package and its dependencies, but adds it to the `devDependencies` hash in `package.json`, not `dependencies`
    * He deletes the node_modules folder, then runs `npm install` in the project root
    * That installs all dependencies AND dev dependencies
    * The node_modules folder gets big fast, so you should always keep your it out of source control
    * Deletes `node_modules` again
    * Runs `npm install --production`
    * That should only install the dependencies, NOT the dev dependencies
    * You can freely delete `node_modules` and recreate it with npm
* Browser App vs Server Package
    * Should you add a package as a dependency or a dev dependency?
    * Are you building a browser application or a server package?
        * Browser app - intended to run in the browser
            * must always have at least one HTML file, typically index
        * Server package - no HTML files, just javascript
    * The test project he's doing has only JS files so far
    * The JS file requires an external package, semver, installed by npm
    * The dependency also does not contain any HTML
    * Previously he's executed the source js via node executable
    * That makes it a server app. It cannot be executed in a browser except by futzing with the console
    * Creates an HTML file at the root, with head and body
    * In the body he uses a script tag to reference his index.js file (relative path)
    * That file will open in the browser, so this is now a browser app
    * The browser's JS engine doesn't support `require`, so it fails
    * Browser doesn't support common or ES6 modules. If you want it to, you have to use a bundler like webpack
* Creating a clock browser app
    * In the immediate function in `node_modules/moment/index.js`, there is a check for whether common js is supported, by checking `typeof exports`
    * Then the factory function is run, which returns a set of hooks as another immediate function
    * He copies all of the js from moment to his index, which makes `hook` available as a sub property of the `window` global object
    * Then he adds his own code after that function executes
* Summary of Clock Challenge
    * Installed moment.js package as a dependency of our local package
    * Created an HTML file to serve to the browser, used a reference in that to our own index.js file
    * In index.js, we have put all the code necessary for the browser application, by copying the contents of the moment.js file into our index.js directly, plus our custom code that uses that packages code
    * This is NOT dealing with packages, because the browser cannot natively use them
    * Dependencies AND dev dependencies have zero relations to a browser application. The browser does not support require, etc, and knows nothing about your package's setup. It ONLY needs files for execution.
* So, add package as dependency or dev dependency?
    * If your application is a browser app, it doesn't matter how you add your packages, because they only matter to how you build the browser application that will eventually result from your build process.
    * Some people say you should add your front end dependencies as actual dependencies (jquery, react, etc), and back end stuff should be dev dependencies. THIS IS WRONG.
    * If you use the functionality of those packages in an HTML app, you're not doing it via the node dependency framework.
    * For HTML apps, Bogdan says you can add all your packages a dependencies OR as dev dependencies, it does not matter.
    * His suggestion is to add all your dependencies as dev dependencies
    * For that, you just create your bundle to be the actual app.
    * For a standalone app, don't split between dependencies / dev dependencies
    * Add your dependencies ONLY IF:
        1. Your package is public.
        1. Compiled version of your package uses features from dependent packages.
        1. Other packages depend on your package.
    * So, for public packages, use dependencies and devDependencies.
    * Most packages in the world are used on the server ONLY during development of other packages, because most things end up being browser apps (I think that's the implication here)
    
## 4: NPM packages versions and package-lock.json file

* Exploring package information and versions
    * `npm view <package>` gives you info about a package
    * Typical line: `pkgname@1.2.3 | LICENSE | deps: none | Versions: 10`
    * Shows you keywords, homepage, distro info, maintainers, last pub date
    * `npm view <package> versions` shows all versions for a package
    * Latest version shown in `npm view <package>` is latest non alpha/beta/rc
    * You can install any specific version
* Installing specific package versions
    * `npm install <package>@<version>`
    * If you install a version, npm will update package.json and lock
    * Going to `moment@2.14.0` shows a vulnerability
    * `npm audit` shows the details of all such warnings
    * Usually you can follow links to get recommended resolutions
* Why is package-lock.json needed?
    * In yarn, called `yarn.lock`
    * Keeps the versions tree of the project dependencies, including children
    * Also includes all versions of each package in dependency tree
    * Your package.json will have dependency entries like `^1.2.3`
    * You may have `1.2.3` actually installed
    * If somebody else used your package, and the dependency had jumped to `1.3.3`, the caret notation would allow it to upgrade, so their environment is going to be different
    * Also your dependencies may change THEIR dependencies, which means even if a nested part of the dependency tree changes, you can keep your env stable
* Challenge: reinstall old package version without lock file
* How lock file is handled 
    * Created automatically since npm 5.0.0
    * Autoupdated on all updates/installs
    * Should ALWAYS be committed to source control
    * `node_modules` folder should be excluded
    * Lock file is NOT published to NPM registry
    * When you install as a dev dependency, it cascades to all development dependencies of those
* Lock file summary
    * Guarantees consistency of dependencies versions
    * Generated and updated automatically
    * Should always be in source control

## 5: Updating NPM Packages

* Update NPM packages overview
    * Use `npm update`
    * Updates all packages listed in your dependencies, within semver constraints
    * Update specific package: `npm update <package>`
* Challenge: update project dependencies
    * Using `--save-exact` option to `npm install` causes an exact match semver constraint
* Challenge update solution

## 6: NPM Scripts

* Introduction to the NPM scripts
    * Popular commands: run, build, test
    * Each script has a name, all are defined in `package.json` under `scripts`
    * They're just shorthand for shell commands, I think
    * By default you get a `test` command with no real content
    * There are other built in scripts, and you can make custom ones
* Start NPM script
    * `npm start` will by default attempt to execute `server.js`
    * Other commands:
        * `npm start`
        * `npm stop`
        * `npm restart`
        * `npm test`
        * `npm prestart`
        * `npm poststart`
* Custom NPM scripts
    * `npm run <scriptname>` to run
    * define it as a string in package.json
* Challenge: run scripts simultaneously
    * Needs the package `npm-run-all`
    * lets you use a script like: `npm-run-all --parallel script1 script2`

## 7: Executable scripts in the NPM

* NPM .bin Folder with executable scripts
    * installed `npm-run-all`
    * if you use that, it looks for executables in `node_modules/.bin`
    * any installed package looks for `bin` key in the package.json of the installed package, and will put any scripts it finds there into the `node_modules/.bin` folder
    * it's not just `npm-run-all` that uses it to be clear, it's a general mechanism

