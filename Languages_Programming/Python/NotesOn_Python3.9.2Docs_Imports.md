# Notes on The Import System

From https://docs.python.org/3/reference/import.html

* The `import` statement is most common way to bring in code in another module, but not the only way--you can use `importlib.import_module()` and `__import__()` to invoke an import
* An import does two things:
    * Searches for the named module
    * Binds the results of that search to a name in the local scope
* The search part is defined as a call to `__import__()` with appropriate args
* The return value of `__import__()` is used to do the name binding
* A direct call to `__import__()` only does the module search, and if found the module creation operation. Only the `import` statement does the binding.
* On first import, Python searches for the module. If found, it creates a module object, initializing it.
* If not found, raises `ModuleNotFoundError`
* You can modify and extend the logic that performs the search, via hooks

## 5.1 `importlib`

* `importlib` module provides an API for interacting with the import system

## 5.2 Packages

* Python has only one type of module object. All modules are this type, whether they are implemented in Python, C, or something else.
* To organize modules and provide a naming hierarchy, there are packages
* Packages are directories, modules are files. With the caveat that neither packages nor modules need to originate in the file system.
* All packages are modules, but not all modules are packages.
* Any module containing a `__path__` attribute is considered a package.
* All modules have a name.
* Subpackage names are separated from parents by a dot.

### 5.2.1 Regular Packages

* Two types of packages: regular and namespace
* Regular packages are traditional, typically implemented as a directory with an `__init__.py` file in it.
* On import of the package, the `__init__.py` file is implicitly executed, and the objects it defines are bound to names in the package's namespace.

### 5.2.2 Namespace packages

* A composite of various portions, where each portion contributes a subpackage to the parent package.
* Portions can be in different places on the filesystem, in zip files, on the network, or in any other location Python searches during import.
* Namespace packages may or may not correspond directly to objects on the file system, they can be virtual modules with no concrete representation.
* Namespace packages don't use a list for their `__path__` attribute, they use a custom iterable that automatically does a new search for package portions on the next import attempt within that package, if the path of their parent package changes.

## 5.3 Searching

* To start a search, Python needs the fully qualified name of the module or package being imported.
* Name is used in various phases of the import search, may be the dotted path to a submodule

### 5.3.1 The module cache

* First place checked during search is `sys.modules`
* That's a mapping serving as a cache of all previously imported modules, including the intermediate paths
* If `foo.bar.baz` was previously imported, there will be `sys.modules` entries for `foo`, `foo.bar`, and `foo.bar.baz`, each linked to the corresponding module object
* If the module name is present in `sys.modules` and the associated value is a module, that's returned. If the value is `None`, `ModuleNotFoundError` is raised. If the module name is missing, Python keeps searching.
* `sys.modules` is writable. Deleting a key may not destroy the associated module object, but will invalidate the cache entry for the named module, forcing Python to do a new search on next import.
* You can also assign a key `None` to force it to raise `ModuleNotFoundError`
* Note that if you keep a reference to a module object, invalidate its cache entry, then re-import it, you'll end up with two distinct module objects.
* If you use `importlib.reload()` you'll reuse the same module object, and reinitialize the module contents.

### 5.3.2 Finders and Loaders

* If the named module isn't found in `sys.modules`, Python uses the import protocol to find and load the module.
* The protocol has two conceptual objects, finders and loaders
* Finder - determines whether it can find the named module via whatever strategy it knows about
* Loader - loads a module
* Importer - objects implementing both finder and loader interfaces
* Lots of built in, default finders and importers
* One looks for built in modules, another for frozen modules, a third searches an import path
* The import machinery is extensible, so you can write new finders and loaders
* A finder doesn't load a module, and instead returns a module spec
* A module spec is an encapsulation of a module's import related information, which the import machinery uses when loading the module.

### 5.3.3. Import hooks

* Two types of import hooks: meta hooks, import path hooks
* Meta hooks called at the start of import processing, after `sys.modules` lookup
* Lets meta hooks override `sys.path` processing, frozen modules, builtins
* Meta hooks are registered by adding new finder objects to `sys.meta_path`
* Import path hooks are called as part of `sys.path` / `package.__path__` processing, at the point where their associated path item is encountered.
* Import path hooks registered by adding new callables to `sys.path_hooks`

### 5.3.4 The meta path

* If a named module isn't in `sys.modules`, Python looks in `sys.meta_path`
* That contains a list of meta path finder objects
* The finders are queried in order
* Meta path finders have to implement a method called `find_spec()` 
* If the finder knows how to handle a named module it returns a spec object
* If it can't, returns `None`
* If `sys.meta_path` processing gets to the end of its list with no spec, raise the module not found exception
* Meta path may be traversed multiple times for a single import request
* `find_spec()` called with two or three args:
    1. fully qualified name of imported module
    1. path entries to use for the module search (`None` for top level modules, value of the parent package's `__path__` for submodules/subpackages)
    1. An existing module object that's the target of loading--only passed in during reloads
* Example of importing `foo.baz.bar`:
    1. `mpf.find_spec("foo", None, None)` for each meta finder
    1. `mpf.find_spec("foo.bar", foo.__path__, None)`
    1. `mpf.find_spec("foo.bar.baz", foo.bar.__path__, None)`
* Default `sys.meta_path` has three meta path finders
    1. for built in modules
    1. for frozen modules
    1. for modules from an import path

## 5.4 Loading

* If/when a module spec is found, the import machinery uses it and the loader it contains to load the module
* Rough approximation of the loading portion of import:

    ```Python
    module = None
    if spec.loader is not None and hasattr(spec.loader, 'create_module'):
        module = spec.loader.create_module(spec)

    if module is None:
        module = ModuleType(spec.name)

    _init_module_attrs(spec, module)  # import related module attrs set here

    if spec.loader is None:
        raise ImportError

    if spec.origin is None and spec.submodule_search_locations is not None:
        sys.modules[spec.name] = module     # namespace package
    elif not hasattr(spec.loader, 'exec_module'):
        module = spec.loader.load_module(spec.name)
        # set __loader__ and __package__ if missing
    else:
        sys.modules[spec.name] = module
        try:
            spec.loader.exec_module(module)
        except BaseException:
            try:
                del sys.modules[spec.name]
            except KeyError:
                pass
            raise
    return sys.modules[spec.name]
    ```

* Things of note
    * If there's an existing module object in the `sys.modules` cache, return it
    * The module will exist in `sys.modules` before the loader executes the module code. That's important because the module code may directly or indirectly import itself. Adding it to `sys.modules` before that prevents unbounded recursion in the worst case and multiple loading in the best case.
    * If the loading fails the failing module (only) gets removed from `sys.modules`. 
    * After the module is created but before execution, the import machinery sets import related module attributes
    * Module execution is the key moment of loading in which the module's namespace gets populated
    * Module created during loading and passed to `exec_module()` may not be the one returned at the end of import

### 5.4.1 Loaders


## 5.7 Package Relative Imports

* Relative imports use leading dots.
* Single dot is a relative import starting with the current package.
* Two or more dots indicate a relative import to the parent(s) of the current package
* One level per dot after the first
* Given this package layout:

    ```
    package/
        __init__.py
        subpackage1/
            __init__.py
            moduleX.py
            moduleY.py
        subpackage2/
            __init__.py
            moduleZ.py
        moduleA.py
    ```

* In either `subpackage1/moduleX.py` or `subpackage1/__init__.py`, the following are valid relative imports:

    ```Python
    from .moduleY import spam
    from .moduleY import spam as ham
    from . import moduleY
    from ..subpackage1 import moduleY
    from ..subpackage2.moduleZ import eggs
    from ..moduleA import foo
    ```

* Absolute imports may be written as `import some_thing` or `from some_thing import some_member`
* Relative imports may ONLY use `from <relative_thing> import <some_member>`
