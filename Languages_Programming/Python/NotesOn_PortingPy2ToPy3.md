# Notes on Porting Python 2 Code to Python 3

By Brett Cannon

From https://docs.python.org/3/howto/pyporting.html

## The Short Explanation

1. Make sure you've got good test coverage.
1. Learn the differences between 2 and 3.
1. Use `Futurize` or `Modernize` to update code.
1. Use `pylint` to make sure you don't regress on Py3 support.
1. Use `caniusepython3` to find out which dependencies are blocking py3
1. Once dependencies are unblocked, use CI to make sure you stay compatible.
1. Consider using type checking to make sure your type usage works in 2 and 3.

## Details
