# Notes on using a pyproject.toml file

# What the heck is pyproject.toml?

From https://snarky.ca/what-the-heck-is-pyproject-toml/

By Brett Cannon

## PEP 518 and pyproject.toml

* Purpose of PEP 518 was to create a way for projects to specify their build tools
* Previously no way to tell a tool like pip what build tools were required to build a wheel or sdist
* PEP 518 and pyproject.toml lets a tool like pip see what build tools are specified and install them in a venv to build the project, so you can rely on a specific version of setuptools and wheel if you want to, or use some other build tool like flit or Poetry. 

## PEP 517 and building wheels

* 517 sets up how you use a pyproject.toml to produce a wheel or sdist using a pyproject.toml file
* 518 gets the tools installed, 517 gets them executed
* Previously no standardized way to build a wheel or sdist except with `python setup.py sdits bdist_wheel`, which was inflexible--no way for the tool running the build to pass in env details, for instance.
* 517+518 also allow for build isolation, which helps make builds reproducible

## Tools standardizing on pyproject.toml

* Side effect of 518's introduction of a standard file that all projects should have is that non-build dev tools realized they could put their config in that file as well. 
* That was originally disallowed by 518, but people ignored that and the PEP was eventually updated to allow for centralizing config data in a single file.
* Now projects like black, coverage, towncrier let you put config in pyproject.toml

## How to use pyproject.toml with setuptools

* Example:

    ```
    [build-system]
    requires = ["setuptools > 40.6.0", "wheel"]
    build-backend = "setuptools.build_meta"
    ```

* If you use a `pyproject.toml` file with a `setup.cfg` configuration for setuptools, you don't need a `setup.py` file anymore
* However if you want editable installs you still need a `setup.py` shim:

    ```Python
    #!/usr/bin/env python

    import setuptools

    if __name__ == '__main__':
        setuptools.setup()
    ```

## Where all of this is going

* The Python packaging ecosystem is working towards basing itself on standards, and the standards are all working towards standardizing artifacts and how to work with them.

# Notes on PEP 518

From https://www.python.org/dev/peps/pep-0518/


