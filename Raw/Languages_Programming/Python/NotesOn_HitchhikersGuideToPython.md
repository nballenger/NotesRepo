# Notes on The Hitchhiker's Guide to Python

## Chapter 4: Writing Great Code

* Use PEP8 rules--there are linters aplenty.
* PEP20 guidelines are useful.

### General Advice

* Explicit is better than implicit
    * Good rule of thumb is that another dev should be able to read the first and last lines of a function and know what it does
* Sparse is better than dense
    * One statement per line (with some exceptions)
    * Makes for more understandable diffs
    * Instead of `and`-ing conditions in a compound test, make their output variables, one line each
* Errors should never pass silently unless explicitly silenced
    * Errors should be either dealt with, logged, or raised
* Function arguments should be intuitive to use
    * Basic arg layout is `def func(positional, keyword=value, *args, **kwargs):`
* Return values from a single place in a function body
* Use parens to combine multiline strings or arg lists
* If you need to assign something when unpacking a list, but don't need to store it, use a double underscore
* Use the star operator to make a list of length n of a single immutable: `four_nones = [None] * 4`
* Use a comprehension to make a list of mutables, since otherwise you end up with a list of references to the same object
* You can implement `__enter__()` and `__exit__()` on a resource to make it usable via `with` as an exception safe context
* The `contextlib` library also gives tools for context managers

### Common Gotchas

* Mutable default arguments
    * Python default args are evaluated once when the function is defined
    * If you use a mutable default and proceed to mutate it, it is mutated for all future calls
    * Create a new object each time the function runs and explicitly assign the default value in the function body
* Late binding closures
    * The value of a variable used in a closure is looked up at the time the inner function is called
    * You can either create a closure that binds immediately to its arguments by using a default arg, or you can use `functools.partial`

### Structuring Your Project

* Modules
    * Keep module names short and lowercase, with no special symbols
* Importing Modules
    * Import lookups for `import somemod`
        1. Looks for `somemod.py` in the same directory as the caller
        1. Searches the python search path recursively
        1. If not found, raises `ImportError`
    * Once found, executes the module in an isolated scope
    * Top level statements are executed
    * Function and class defs are stored in the modules dict
    * Variables, functions, classes are made available to the caller via the module's namespace
    * `dir()`, `globals()`, `locals()` help with namespace introspection
        * `dir(obj)` returns a list of attributes accessible via the object
        * `globals()` returns a dict of the attributes in the global namespace
        * `locals()` returns a dict of the attributes in the local namespace
    * Generally bad practice to do `from modu import *`
* Project structure pitfalls
    * Circular dependencies
    * Hidden coupling
    * Heavy use of global state or context
    * Spaghetti code
    * Ravioli code - lots of similar pieces of logic without proper structure
* Packages
    * Any directory with an `__init__.py` file is a package
    * Top level directory with that is the root package
    * Init file is typically used to gather package-wide definitions
    * Don't put too much code in the init file
    * You can leave it empty when the package's modules and subpackages don't need to share any code
    * Use `import very.deep.module as mod` to avoid long names
* Object Oriented Programming
    * Functional is also nice
* Decorators
    * Preferred way is to use the `@decorator` syntax
    * Example:

```Python
def foo():
    print("Inside foo.")

import logging
logging.basicConfig()

def logged(func, *args, **kwargs):
    logger = logging.getLogger()
    def new_func(*args, **kwargs):
        logger.debug("calling {} with args {} and kwargs {}".format(
                     func.__name__, args, kwargs))
        return func(*args, **kwargs)
    return new func


@logged
def bar():
    print("Inside bar.")
```


### Documentation

* You should have:
    * `README` in the root directory
    * `INSTALL` is helpful but not always needed
    * `LICENSE` in the root directory
    * `TODO` as a separate file or a section of the README
    * `CHANGELOG` as a file or section of the README
* For project publication, you should have:
    * An intro section about what you can do with the project
    * A tutorial for use cases in detail
    * An API reference generated from the code
    * Developer documentation for contributors
    
### Logging

* You need both
    * Diagnostic logging - events related to app operation
    * Audit logging - events for business analysis
* On logging inside a library: "It is strongly advised that you do not add any handlers other than NullHandler to your library's loggers."
* User should be able to turn your logging on, but should not have to turn it off
* Logging in an application:
    * Twelve-Factor App (reference on good practice in app development) says you should treat your log events as an event stream, and send that event stream to standard out to be handled by the application environment
    * Several ways to configure a logger:
        * Using an INI file, which lets you update at runtime but gives you less control than a logger in code
        * Using a dict or a JSON file
