# Notes on The GNU Make Book

By John Graham-Cumming; No Starch Press, April 2015; ISBN 9781593276492

# Chapter 1: The Basics Revisited

## Getting Environment Variables into GNU make

* Any env var set when `make` is started will be available as a `make` variable inside the makefile.
* If `FOO` is set in the environment, `$(info $(FOO))` in the makefile will output the value `foo`
* You can find out where the variable was set using make's `origin` function:
* `$(info $(FOO) $(origin FOO))`
