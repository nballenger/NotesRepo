# Notes on Grunt Cookbook

By Jurie-Jan Botha; Packt Publishing, June 2015; ISBN 9781783286515

# 1: Getting Started with Grunt

* Grunt is a pluggable framework that provides a consistent interface for configuring automated tasks.
* Task logic comes from modular plugins.
* To use a grunt config file, you need the grunt-cli tool.
* Typically you install CLI tools globally.
* Book uses 0.4.x Grunt and 0.8.x Node
* Installation:

    ```
    npm install --global grunt-cli
    ```

## Setting up Grunt in a project

* For a project to use grunt, it requires its own libraries and creating a config file. The libraries provide the framework and tools required by all grunt plugins, and the config file gives you a starting point from which you can start loading plugins.
* Standard package format for Node.js based projects is CommonJS
* Core of CommonJS is `package.json` file
* Create it via `npm init`
* Install grunt to your project with `npm install --save grunt`
* Create a bare config file:

    ```JavaScript
    module.exports = function (grunt) {
        grunt.initConfig({});
        grunt.registerTask('default', []);
    };
    ```

* Running `grunt` in the directory runs the `default` task, which in the above is set to nothing.
* The cli tool always looks for the nearest file named Gruntfile.js, from which it attempts to load configurations.
* In a Gruntfile, there is an exported function that takes one argument, which is an object giving access to the Grunt framework.

## Installing a Plugin

* Install the `contrib-jshint` plugin from `grunt-contrib-jshint`:

    ```
    npm install --save grunt-contrib-jshint
    ```

* Load the tasks contained in the plugin package by adding `loadNpmTasks()` to your Gruntfile:

    ```JavaScript
    module.exports = function (grunt) {
        grunt.initConfig({});
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.registerTask('default',[]);
    };
    ```

* If you use more than a few plugins, you may want to install the `load-grunt-tasks` utility, which means you no longer need to call `loadNpmTasks` for each plugin
* Bringing in the tasks lets you use them in your Gruntfile:

    ```JavaScript
    module.exports = function (grunt) {
        require('load-grunt-tasks')(grunt);
        grunt.initConfig({
            jshint: {
                sample: {
                    files: 'src/*.js'
                }
            }
        });
        grunt.registerTask('default',[]);
    };
    ```

* By default, `load-grunt-tasks` will only load plugins that have names starting with `grunt`. You can customize that with the `pattern` option.

## Setting up a basic web server

* Uses the `contrib-connect` plugin
* Install the package: `npm install --save grunt-contrib-connect`
* Give it some config in the Gruntfile:

    ```JavaScript
    module.exports = function (grunt) {
        require('load-grunt-tasks')(grunt);
        grunt.initConfig({
            jshint: {
                sample: {
                    files: 'src/*.js'
                }
            },
            connect: {
                server: {
                    options: {
                        base: 'www',
                        keepalive: true
                    }
                }
            }
        });
        grunt.registerTask('default',[]);
    };
    ```

* Add an index.html file in a folder called www and run `grunt connect`

## Watching files for changes

* Install: `npm install --save grunt-contrib-watch`
