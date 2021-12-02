# Notes on Serious Python

By Julien Danjou; No Starch Press, Dec. 2018; ISBN 978-1-59327-878-6

# Chapter 1: Starting Your Project

## Versions of Python

* Each minor version gets bug-fix support for 18mo, security for 5 years
* Book is written to target Py3

## Laying Out Your Project

### What to Do

* Use packages and hierarchy wisely
    * Deep hierarchy is hard to navigate
    * Flat hierarchy gets bloated
* Recommends not storing unit tests outside the package directory
    * put them in a subpackage of the software so they're not installed as a top level module named `tests` by a packaging library. (This seems silly--use package discovery with a name or prefix.)
* Recommended hierarchy

    ```
    mypkg
    ├── README.rst
    ├── docs
    │   ├── conf.py
    │   ├── index.rst
    │   └── quickstart.rst
    ├── mypkg
    │   ├── __init__.py
    │   ├── cli.py
    │   ├── data
    │   │   └── image.png
    │   ├── storage.py
    │   └── tests
    │       ├── __init__.py
    │       ├── test_cli.py
    │       └── test_storage.py
    ├── setup.cfg
    └── setup.py
    ```

* Wants documentation in RST
* Common top level directories
    * `etc` - sample config files
    * `tools` - shell scripts and related tools
    * `bin` - binary scripts installed by `setup.py`

### What Not to Do

* Recommends not creating files/modules based on the type of code they store, like `functions.py` or `exceptions.py`
* Organize code based on features, not types
* Don't create module directories with only an `__init__.py`
* Be careful about what code you put in an `__init__.py`
    * Those are called and executed the first time a module contained in the directory is loaded, so putting the wrong things in there can have unintended side effects
    * They should be empty most of the time unless you know what you're doing

## Version Numbering

* PEP 440 gives a regex for this: `N[.N]+[{a|b|c|rc}N][.postN][.devN]`
* Other notable details:
    * `1.2` is equivalent to `1.2.0`, `1.3.4` is equivalent to `1.3.4.0`, etc.
    * Versions matching `N[.N]+` are considered final releases
    * Date based versions are invalid
    * Final components can also use the following format:
        * `N[.N]+aN` (ex: `1.2a1` for an alpha release, may be unstable/missing features)
        * `N[.N]+bN` (ex: `2.3.1b2` for a beta release, may be feature complete with bugs)
        * `N[.N]+cN` or `N[.N]+rcN` (ex: `0.4rc1` for a release candidate, version that may be released as final unless significant bus emerge)
        * `rc` and `c` suffixes are equivalent, but if both are used `rc` are considered newer than `c`
    * Following suffixes may also be used
        * `.postN` (ex: `1.4.post2` for a post release, used to address minor errors in the publication process like mistakes in release notes. Not for bug fixes--increment the minor version number.)
        * `.devN` (ex: `2.3.4.dev3` for developmental releases, a prerelease of the version that it qualifies. This is prior to any alpha, beta, candidate, or final. Discouraged as hard for humans to parse.)
* Semver partially overlaps with PEP 440, but they're not entirely compatible around things like prerelease versioning.

## Coding Style and Automated Checks

* Summary of PEP 8:
    * 4 spaces per indent level
    * Line limit of 79
    * Separate top level function and class defs by two lines
    * Files encoded in ASCII or UTF8
    * One module import per import statement and per line
    * Imports at the top of the file after comments and docstrings
    * Group imports first by stdlib, third party, local
    * No extra whitespace between parens, brackets, braces, or before commas
    * Class names in came case
    * Suffix exceptions with `Error`
    * Function names in snake case
    * Leading underscore for private attributes and methods
* Recommends `pep8` tool for linting

### Tools to Catch Style Errors

* No real helpful advice here.

### Tools to Catch Coding Errors

* Recommends `pyflakes` and `pylint` for static analysis
* `flake8` combines `pyflakes` and `pep8` into a single command
* Lots of `flake8` plugins

# Chapter 2: Modules, Libraries, and Frameworks

## The Import System

* `import` is a wrapper to the dunder function `__import__()`
* `__import__("itertools")` is equivalent to `import itertools`
* `it = __import__("itertools")` eq `import itertools as it`
* Modules, once imported, are essentially objects whose attributes (classes, functions, vars, etc) are objects

### The sys module

* `sys` gives access to variables and functions related to Python itself and the OS it's running on, and has a lot of info about the import system
* You can get the currently imported modules via `sys.modules` var, a dict of module name keys and module object values
* You can also retrieve the built in modules list via `sys.builtin_module_names`, a list that can vary based on the compilation options to your interpreter's build

### Import Paths

* List of import search locations is in `sys.path`
* You can modify that, or the `PYTHONPATH` env var
* First match is picked, so put your modifications in the right order

### Custom Importers

* The import hook mechanism is from PEP 302
* Lets you extend the standard import mechanism
* Two ways to extend:
    * meta path finders for use with `sys.meta_path`
    * path entry finders for use with `sys.path_hooks`

### Meta Path Finders

* Lets you load custom objects as well as `.py` files
* Meta path finder object must expose a `find_module(fullname, path=None)` method that returns a loader object.
* Loader objects must have a `load_module(fullname)` method that loads the module from a source file
* Example from `Hy` of a custom meta path finder that can handle `.hy` files

    ```Python
    class MetaImporter:
        def find_on_path(self, fullname):
            fls = ["%s/__init__.hy", "%s.hy"]
            dirpath = "/".join(fullname.split("."))

            for pth in sys.path:
                pth = os.path.abspath(pth)
                for fp in fls:
                    composed_path = fp % ("%s/%s" % (pth, dirpath))
                    if os.path.exists(composed_path):
                        return composed_path

        def find_module(self, fullname, path=None):
            path = self.find_on_path(fullname)
            if path
                return MetaLoader(path)

    sys.meta_path.append(MetaImporter())
    ```

* Once Python determines the path is valid and that it points to a module, a `MetaLoader` object is returned:

    ```Python
    class MetaLoader:
        def __init__(self, path):
            self.path = path

        def is_package(self, fullname):
            dirpath = "/".join(fullname.split("."))
            for pth in sys.path:
                pth = os.path.abspath(pth)
                composed_path = "%s/%s/__init__.hy" % (pth, dirpath)
                if os.path.exists(composed_path):
                    return True
            return False

        def load_module(self, fullname):
            if fullname in sys.modules:
                return sys.modules[fullname]

            if not self.path:
                return

            sys.modules[fullname] = None
            mod = import_file_to_module(fullname, self.path)

            ispkg = self.is_package(fullname)

            mod.__file__ = self.path
            mod.__loader__ = self
            mod.__name__ = fullname

            if ispkg:
                mod.__path__ = []
                mod.__package__ = fullname
            else:
                mod.__package__ = fullname.rpartition('.')[0]

            sys.modules[fullname] = mod
            return mod
    ```

* In the above, `import_file_to_module()` reads a `.hy` sourcefile, compiles to Python, and returns a Python module object

## Useful Standard Libraries

* `atexit` - lets you register functions to call on exit
* `argparse`
* `bisect` - bisection algorithms for list sorting
* `calendar` - date-related functions
* `codecs` - encoding and decoding data
* `collections` - data structures
* `copy` - copy functions
* `csv`
* `datetime`
* `fnmatch` - functions for matching unix style filename patterns
* `concurrent` - async stuff
* `glob` - functions for unix style path patterns
* `io` - IO stream stuff
* `json`
* `logging`
* `multiprocessing` - run multiple subprocesses, gives an API that makes them look like threads
* `operator` - functions implementing the basic Python operators
* `os`
* `random`
* `re`
* `sched` - event scheduler without using multithreading
* `select` - access to `select()` and `poll()` for creating event loops
* `shutil` - high level file functions
* `signal` - functions for POSIX signals
* `tempfile`
* `threading` - access to high level threading
* `urllib`
* `uuid`

## External Libraries

### External Libraries Safety Checklist

* Python 3 compatible
* Active development
* Packaged with OS distributions (indicates people depend on it)
* API compatibility commitment
* License compatbility

### Protecting your code with an API wrapper

* Look at chapter 5 that covers treating parts of a project as modular

## Package Installation: Getting More from pip

## Using and Choosing Frameworks

# Chapter 3: Documentation and Good API Practice

## Documenting with Sphinx

* Recommends your project documentation always include:
    * Problem the project seeks to solve
    * License for the project
    * Small example of how the code works
    * Install instructions
    * Links to community support
    * Link to your bug tracker
    * Link to your source code
    * a README

### Getting Started with Sphinx and reST

* `pip install sphinx` then `sphinx-quickstart` in your project's top level directory
* That creates the directory structure sphinx expects to find, plus `doc/source/conf.py` for config and `doc/source/dex.rst` as the front page of your documentation
* `sphinx-build doc/source doc/build` will build HTML docs

### Sphinx Modules

* Basic functionality only supports manual documentation
* Has a bunch of modules to enable automatic documentation and other stuff
* `sphinx.ext.autodoc` extracts reST formatted strings from modules and generates `.rst`
* You can enable that in `conf.py` with `extensions = ['sphinx.ext.autodoc']`
* Note that `autodoc` won't automatically recognize and include your modules, so you have to add something like this to one of your `.rst` files:

    ```
    .. automodule:: foobar
        :members:               <-- all documented members to be printed
        :undoc-members:         <-- all undocumented members printed
        :show-inheritance:      <-- show inheritance
    ```

* Notes:
    * If you don't include any directives Sphinx generates no output
    * If you only specify `:members:` then undocumented nodes are skipped even if their members are documented. So a class with documented methods but no class doc will be entirely excluded.
    * Your module has to be where Python can import it, so may have to add to `sys.path`

#### Automating the ToC with autosummary

* `sphinx.ext.autosummary` can create a ToC
* Enable it in your extensions list in `conf.py`
* Add something like this to an `.rst` file

    ```
    .. autosummary::

        mymodule
        mymodule.submodule
    ```

* That creates files `generated/mymodule.rst` and `generated/mymodule.submodule.rst` with the `autodoc` directives described earlier, so you can specify which parts of your module API you want included in the documentation
* `sphinx-apidoc` can automatically create files for you

#### Automating Testing with doctest

* Sphinx can run `doctest` on your examples automatically during doc build
* You can use `doctest` for "documentation driven development"
    * write your docs and examples first
    * write code to match the documentation
* Do that

#### Writing a Sphinx Extension

* For a REST API you can use `sphinxcontrib-pecanwsme` to analyze docstrings and code to generate REST API documentation automatically
* For HTTP frameworks like Flask, Bottle, Tornado, you can use `sphinxcontrib.httpdomain.`
* For flask: https://sphinxcontrib-httpdomain.readthedocs.io/en/stable/#module-sphinxcontrib.autohttp.flask

## Managing Changes to Your APIs

### Numbering API Versions

* API versioning should reflect changes that will impact users
* `requests` does a good job with their versioning

### Documenting Your API Changes

* Documentation should cover:
    * New elements of the new interface
    * Elements of the old interface that are deprecated
    * Instructions on how to migrate to the new interface

### Marking Deprecated Functions with the warnings Module

* Python has `DeprecationWarning` and `PendingDeprecationWarning` in `warnings`

# Chapter 4: Handling Timestamps and Time Zones

## The Problem of Missing Time Zones

* A timestamp without a time zone isn't useful
* Your app should never have to handle timestamps with no time zone, and should raise an error if no time zone is provided
* Be careful about doing time zone conversions prior to storing data
* Python has a timestamp object, `datetime.datetime`
    * microsecond granularity
    * can be timezone aware (embeds tz info) or unaware
* The `datetime` API returns a tz unaware object by default

## Building Default datetime Objects

* To get a current timestamp you can use `datetime.datetime.utcnow()`
* For the timestamp of the region the machine is in, `datetime.datetime.now()`
* You can check a `datetime` object for zone with `mydtobj.tzinfo`
* Both `utcnow()` and `now()` return unaware timestamp objects
* Those are kind of useless, since you can't tell from the object which method was used to create them, and the those two methods return different results

## Time Zone-Aware Timestamps with dateutil

* You don't want to create your own timezone classes, those are already present
* You want to use `dateutil` to get `tzinfo` classes
* `dateutil` provides `tz`, a module that can access the OS level time zone info, and ship and embed the tz database so it's available to Python
* It's a third party lib, install with `pip install python-dateutil`
* Examples

    ```Python
    from dateutil import tz
    tz.gettz("Europe/Paris")    # returns tzfile("/path/to/zonefile")
    tz.gettz("GMT+1")           # returns tzstr('GMT+1')
    ```

* The `tz.gettz()` method returns an object that implements the `tzinfo` interface
* The `dateutil` time zone objects can be used as `tzinfo` classes directly

    ```Python
    import datetime
    from dateutil import tz
    now = datetime.datetime.now()
    tz = tz.gettz("Europe/Paris")
    now.replace(tzinfo=tz)          # adds tzinfo to the object
    ```

* If you need to access the embedded timezone list:

    ```Python
    from dateutil.zoneinfo import get_zonefile_instance
    zones = list(get_zonefile_instance().zones)
    sorted(zones)[:5]       # returns first five zones
    ```

* Sometimes your program doesn't know what timezone it's running in, so you have to determine it yourself. With no argument, `dateutil.tz.gettz()` will return the tz local to the computer it's running on

    ```Python
    from dateutil import tz
    import datetime
    now = datetime.datetime.now()
    localzone = tz.gettz()
    localzone.tzname(datetime.datetime(2018, 10, 19))   # 'CEST'
    localzone.tzname(datetime.datetime(2018, 11, 19))   # 'CET'
    ```

* Should you ever need to implement a custom class to represent a time zone, you can subclass the abstract base class `datetime.tzinfo`
* You have to implement three methods:
    * `utcoffset(dt)` - return an offset from UTC in minutes east of UTC
    * `dst(dt)` - return the daylight saving time adjustment in minutes east of UTC
    * `tzname(dt)` - return the tz name as a string

## Serializing Time Zone-Aware datetime Objects

* You often need to transport a `datetime` object to non-Python contexts
* The native method `isoformat` can serialize `datetime` objects for non-Python use

    ```Python
    import datetime
    from dateutil import tz

    def utcnow():
        return datetime.datetime.now(tz=tz.tzutc())

    utcnow().isoformat()    # '2021-07-15T15:23:38.310384+00:00'
    ```

* Recommends always formatting `datetime` input and output as ISO 8601 via `isoformat()`
* You can use the `iso8601` module's `parse_date` function for parsing those strings
* Best practice: use timezone aware `datetime` objects, use ISO 8601 for string representations

## Solving Ambiguous Times

* Ambiguous times are like when you have a daylight savings time transition and the same wall clock time can occur twice in a single day
* `dateutil` `tz` objects have an `is_ambiguous()` method

    ```Python
    import datetime
    import dateutil.tz
    localtz = dateutil.tz.gettz("Europe/Paris")
    confusing = datetime.datetime(2017, 10, 29, 2, 30)
    localtz.is_ambiguous(confusing)     # True
    ```

* In the above example a timestamp of 2:30am, Oct. 30, 2017 in Paris is during the switchover from summer to winter time, which happens at 3am, when the time goes back to 2am.
* If you use a timestamp from an ambiguous period, there's no way for the object to know whether it's before or after the time change
* You can specify which side of the fold a timestamp is on, via the `fold` attribute added in 3.6 by PEP 495, Local Time Disambiguation

    ```Python
    import dateutil.tz
    import datetime
    localtz = dateutil.tz.gettz("Europe/Paris")
    utc = dateutil.tz.tzutc()
    confusing = datetime.datetime(2017, 10, 29, 2, 30, tzinfo=localtz)
    confusing.replace(fold=0).astimezone(utc)
    confusing.replace(fold=1).astimezone(utc)
    ```

# Chapter 7: Methods and Decorators

## Decorators and When to Use Them

* Primary use case is in factoring common code that needs to be called before, after, or around multiple functions

### Creating Decorators

### Writing Decorators

# Chapter 9: The Abstract Syntax Tree, Hy, and Lisp-like Attributes

* The AST is a representation of the source code
* Python's AST is built by parsing a Python source file
* Since it's a tree, it's made of nodes
* Nodes can represent operations, statements, expressions, modules
* Nodes can contain references to other nodes that make up the tree

## Looking at the AST

* Easiest way to view the Python AST is parsing some Python code and dumping the generated AST

    ```Python
    import ast
    ast.parse("x = 42")             # dumps the repr of an _ast.Module object
    ast.dump(ast.parse("x = 42")    # dumps the generated AST code
    ```

* `ast.parse()` parses any string that contains python code, returns an `_ast.Module` object
* That object is the root of the tree, so you can browse it to find every node
* To visualize the tree you can use `ast.dump()`
* 
