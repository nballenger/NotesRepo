# Notes on Creating and Discovering Plugins

From https://packaging.python.org/guides/creating-and-discovering-plugins/

## Approach 1: Using Naming Convention

* If all the plugins for your app use the same naming convention you can use `pkgutil.iter_modules()` to do discovery of all top-level modules that match the pattern.
* Discovery of all `flask_{plugin_name}` modules:

    ```Python
    import importlib
    import pkgutil

    discovered_plugins = {
        name: importlib.import_module(name)
        for finder, name, ispkg
        in pkgutil.iter_modules()
        if name.startswith('flask_')
    }
    ```

* Also lets you query PyPI's simple API for packages matching the pattern

## Approach 2: Using Namespace Packages

* Provide a convention for where to put plugins, how to do discovery
