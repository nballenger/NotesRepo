# PostgreSQL Cheatsheet

## `psql` CLI options

* `-A` - do not align output
* `-q` - quiet
* `-t` - write tuples without header info
* `-X` - ignore the `~/.psqlrc` file
* `-o` - output to named location
* `-F` - field separator between columns
* `PGOPTIONS` - add command line options to send to the server at runtime

## `psql` meta commands

* `\a` - toggle aligned / unaligned output
* `\c [-reuse-previous=on|off] [dbname [username] [host] [port] | conninfo]`
* `\C [title]` - sets the title of any tables being printed (or unsets)
* `\cd [directory]` - change CWD
* `\! pwd` - print CWD
* `\conninfo` - output current connection info:

## PostgreSQL Identifiers

* ANSI SQL for case sensitivity
* Double quote to use camel case
* Constraints on identifier names:
    * Must start with letter or underscore
    * Can contain letters, digits, underscore, dollar sign (don't use)
    * Min length is 1, max is 63

## Objects Hierarchy

* Template Databases
    * By default any db is cloned from `template1`
    * `template1` can be modified to make all new databases different
    * `template0` - safeguard / version database, can be used to fix `template1`
* User Databases
* Roles
* Tablespaces
* Settings
* Template procedural languages
