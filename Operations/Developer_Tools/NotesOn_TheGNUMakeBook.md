# Notes on The GNU Make Book

By John Graham-Cumming; No Starch Press, April 2015

# Chapter 1: The Basics Revisited

* If you're using make prior to 3.79.1, upgrade.

## Getting Environment Variables into GNU make

* Any env var set when `make` is started is available as a variable inside the makefile
* Ex. Makefile: `$(info $(FOO))`, will output value of `FOO` if set
* This discovers where the value was set: `$(info $(FOO) $(origin FOO))`
* If defined in the env, you will output `environment`

