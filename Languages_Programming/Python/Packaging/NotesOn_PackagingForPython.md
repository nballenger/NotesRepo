# Notes on Packaging for Python

Notes taken on 2020-02-19.

# An Overview of Packaging for Python

From https://packaging.python.org/overview/

## Thinking about deployment

* Questions to ask before packaging:
    * Who are your users? How complex an install are they willing to do?
    * What production devices will run the software?
    * Is your software installed individually or in large batches?
* "Packaging is all about target environment and deployment experience."

## Packaging Python libraries and tools

* Following approaches meant for libraries/tools used by technical users in a development setting.
* **Python Modules**
    * A single file is a module, can be distributed and re-used
    * Doesn't scale beyond a single file
    * Doesn't work if your project has dependencies outside stdlib
* **Python Source Distributions**
    * Any directory containing Python files can be an 'import package'
    * Since packages have multiple files, they're harder to distribute
    * If your code is nothing but pure Python, and you know your deployment environment supports your version of Python, you can use native packaging tools to create a source distribution package
    * `sdist` - Source Distribution Package, a compressed archive (`.tar.gz`) containing 1+ packages or modules. Fine if your code is pure python, and you only depend on other Python packages.

## Python Binary Distributions

* The Wheel package format is designed to ship libraries with compiled artifacts
* `pip` always prefers wheels because installation is always faster
* Binary distributions are best when they have source distributions to match, since even if you don't upload a wheel for every OS, providing the sdist means people can build a wheel for themselves
* **"Default to publishing both sdist and wheel archives together, unless you're creating artifacts for a very specific use case where you know the recipient only needs one or the other."**

## Packaging Python Applications

* sdist and Wheel are native distribution tools, which only target environments that have Python, and are for an audience that knows how to install Python packages
* You can piggyback 'tools', which are basic applications for developers, on top of Python's library packaging with things like `setuptools` `entry_points`
* Libraries are building blocks, not complete apps--for distributing actual apps, there are other options detailed below

### Depending on a Framework

* Some types of Python apps like website backends and network services are common enough that they have frameworks to enable development and packaging. Other stuff like dynamic web frontends and mobile clients are complex neough to target that a framework is pretty much required.
* You want to work backwards from the framework's packaging and deployment story. Defer to your framework's packaging guide.

#### Service Platforms

* If you're using something like Heroku, Google App Engine, etc., you should follow the relevant packaging guides

#### Web Browsers and Mobile Applications

* You can write a mobile app or web app in Python
* The packaging options for these are still brand new
* Look at frameworks like
    * Kivy
    * Beeware
    * Brython
    * Flexx

### Depending on a pre-installed Python

* Python is already present on a lot of computers.
* You can choose to depend on the pre-installed Python.
* There are some technologies to support that:
    * PEX (Python Executable)
    * zipapp (no dependency management, requires Python 3.5+)
    * shiv (requires Python 3)
* As you decrease dependency on the target system's pre-installed software, your package size will inevitably increase.

### Depending on a separate software distribution ecosystem

* For a long time the non-Unix operating systems didn't have package management
* The "app stores" focus on consumer applications, so devs came up with things like Homebrew.
* For python devs, Anaconda is the most relevant package ecosystem
* There are also approaches that involve installing an alternative Python distribution, but without support for arbitrary system packages

### Bringing your own Python executable

* Every OS has 1+ formats they can natively execute
* Turning a Python program into one of these usually involves embedding a Python interpreter and other dependencies into a single executable file.
* This is called 'freezing', provides wide compatibility and seamless user experience, but requires lots of tech and effort to do
* Some python freezers:
    * Cross-platform:
        * PyInstaller
        * cx_Freeze
    * CLI:
        * constructor
    * Windows:
        * py2exe
        * pynsist
    * Mac:
        * py2app
    * Other:
        * bbFreeze - windows, linux, Py2 only
        * osnap - windows, mac
* Most of those are single-user deployment tools
* For multi-component server apps, look at Chef Omnibus

### Bringing your own userspace

* Increasingly you can run apps packaged as lightweight images, via containerization
* Stuff like AppImage, Docker, Flatpak, Snapcraft

### Bringing your own kernel

* Classic virtualization approach
* Mostly for larger deployments in data centers
* Tech like Vagrant, VHD, AMI, OpenStack

### Bringing your own hardware

* Embedded stuff--Adafruit, MicroPython, whatever
* Seven layer gradient model, least to most complex:
    1. PEX - libraries included
    1. anaconda - a python packaging ecosystem
    1. freezers - including your own Python
    1. images - including your own system libraries
    1. containers - sandboxing images
    1. virtual machines - sandbox with a kernel
    1. hardware - just supply electricity

## What About...

### Operating system packages

* If you're sure of the OS you're targeting, and they have a package management system, you can build formats like `deb`, `RPM`, etc.

### virtualenv

* This says they're slowly fading away because of being wrapped by higher level tools
* **For production deployments, do not rely on running `pip install` from the internet into a virtualenv.**

### Security

* The further down the gradient you go, the harder it gets to update components of your package. 
* Example: you deploy containers, and a fix comes out at the kernel level--the host kernel can be patched without you having to build and redeploy your container. If you build VMs, you've got to rebuild and redeploy.

-----------

# Tutorial: Installing Packages

From https://packaging.python.org/tutorials/installing-packages/

* Note that for this tutorial, 'package' refers to a bundle of software to install, NOT a Python package you import in source.
* Requirements for installing packages
    * You have to have a Python interpreter installed
    * Watch out for `python` vs `python3` and `pip` vs `pip3` issues
    * When in doubt, execute via `python3 -m pip`, optionally with `--user`
    * You have to have pip installed
    * If you installed Python from source or via an installer from Python.org, or from homebrew, you should already have pip. On Linux you may have to install it separately.
    * You can try to bootstrap pip from the stdlib with `python -m ensurepip --default-pip`
    * Note that `get-pip.py` doesn't play well with OS managed or package manager managed versions of Python, so you can end up with an inconsistent system state
    * You can use `python get-pip.py --prefix=/usr/local/` for safety
    * Make sure your pip, setuptools, and wheel are up to date

        ```shell
        python -m pip install --upgrade pip setuptools wheel
        ```

    * You can also create a virtualenv to install your packages in
* Creating Virtual Environments
    * Virtualenvs let you install Python packages in a sandbox for a particular app, rather than globally
    * If you just throw all your dependencies into `site-packages` you can often end up in version conflicts, or unintentionally upgrading a package version that shouldn't be upgraded.
    * Most common tools for creating Python virtualenvs are
        * `venv` - available by default in Py3.3+, installs pip and setuptools into created venvs in Py3.4+
        * `virtualenv` - has to be installed separately, supports py2 and 3.3+, always installs pip, setuptools, and wheel into created virtualenvs by default
    * Managing multiple virtualenvs can be tedious, so there's a higher level tool, Pipenv, that automatically manages a separate venv for each project/app you work on.
* Installing from PyPI
    * Most common usage of pip is installing from PyPI using a requirement specifier, which is a project name plus a version specifier
    * Examples:

        ```shell
        python -m pip install "SomeProject"
        python -m pip install "SomeProject==1.4"
        python -m pip install "SomeProject>=1,<2"
        python -m pip install "SomeProject~=1.4.2"
        ```

    * Last syntax there means "any version that's `1.4.*` and greater than or equal to 1.4.2"
* Source Distributions vs Wheels
    * pip can install sdist or wheel, but always prefers wheels
    * if pip doesn't find a wheel to install, it builds one locally and caches it for future installs
* Upgrading packages
    * `python -m pip install --upgrade SomeProject`
* Installing to the User Site
    * `python -m pip install --user SomeProject`
    * Isolates packages to the current user
    * Has no effect in a virtualenv, all installation commands affect the venv
    * If `SomeProject` defines and CLI scripts or console entry points, `--user` makes them install into the `site.USER_BASE` directory, which may or may not be in your shell's `PATH`, though pip 10+ shows a warning if it installs anything to directories outside `PATH`
    * You can get the user base binary directory with `"$(python -m site --user-base)/bin"` 
* Requirements files
    * pip will install requirements from pypi if you use the requirements file syntax
    * `python -m pip install -r requirements.txt`
* Installing from VCS
    * You can install a project from a version control system in editable mode, using things like

        ```shell
        python -m pip install -e git+https://git.repo/some_pkg.git#egg=SomeProject
        python -m pip install -e git+https://git.repo/some_pkg.git@feature#egg=SomeProject
        ```

* Installing from other indexes

    ```shell
    python -m pip install --index-url http://my.pkg.repo/simple/ SomeProject
    python -m pip install --extra-index-url http://my.pkg.repo/simple SomeProject
    ```

* Installing from a local src tree, in development mode, so the project seems installed but is actually editable from the src tree

    ```shell
    python -m pip install -e <path>
    ```

* Installing from local archives

    ```shell
    python -m pip install ./downloads/SomeProject-1.0.4.tar.gz

    # install from local directory containing archives, don't check PyPI
    python -m pip install --no-index --find-links=file:///local/dir/ SomeProject
    python -m pip install --no-index --find-links=/local/dir/ SomeProject
    python -m pip install --no-index --find-links=relative/dir/ SomeProject
    ```

* Installing from other data sources (like S3), use a helper app that presents data in PEP 503 compliant index format

    ```shell
    ./s3helper --port=7777
    python -m pip install --extra-index-url http://localhost:7777 SomeProject
    ```

* Installing prereleases--by default pip only finds stable versions, use `--pre` to search for pre-release and development versions

    ```shell
    python -m pip install --pre SomeProject
    ```

* Installing setuptools "extras"

    ```shell
    python -m pip install SomePackage[PDF]
    python -m pip install SomePackage[PDF]==3.0
    python -m pip install -e .[PDF]==3.0  # editable proj in pwd
    ```

------

# Managing Application Dependencies

From https://packaging.python.org/tutorials/managing-dependencies/

* Tutorial walks through using Pipenv to manage application dependencies
* Guidance here most directly applicable to development/deployment of network services
* **"Developers of Python libraries, or of applications that support distribution as Python libraries, should also consider the `poetry` project as an alternative dependency management solution."**

## Installing Pipenv

```shell
python -m pip install --user pipenv
```

## Installing packages for your project

* Pipenv manages dependencies on a per-project basis
* Change into your project directory and run `pipenv install requests`
* That installs `requests` and creates or amends a `Pipfile`, which tracks dependencies
* also creates a virtualenv for the project
* To use the virtualenv, you either have to prepend `pipenv run` to commands in that directory, or enter the virtualenv with `pipenv shell`

------

# Packaging Python Projects

From https://packaging.python.org/tutorials/packaging-projects/

* Example file structure:

    ```
    packaging_tutorial
    |___ example_pkg
         |___ __init__.py
    ```

* Create the following files in `packaging_tutorial/`:
    * `LICENSE`
    * `README.md`
    * `pyproject.toml`
    * `setup.cfg`
    * `setup.py`
    * `tests/`
* `pyproject.toml` tells build tools what system you're using and what your build requirements are
* If that file is missing the default is to assume a classic `setuptools` build system, but better to be explicit.
* Contents of `pyproject.toml`:

    ```
    [build-system]
    requires = [
        "setuptools>=42",
        "wheel"
    ]
    build-backend = "setuptools.build_meta"
    ```

* `build-system.requires` gives a list of packages needed to build your package. Items listed here are *only* available during build, not after.
* `build-system.backend` is technically optional, but you'll get `setuptools.build_meta.__legacy__` if you leave it out, so always include it. An alternative build system like flit or poetry would also go here.

## Configuring Metadata

* Two types of metadata, static and dynamic
    * Static metadata as in `setup.cfg` is guaranteed to be the same every time
    * Dynamic metadata as in `setup.py` is possibly non-deterministic. Anything determined at install time, and any extension modules or extensions to setuptools, need to go into `setup.py`
* Static should be preferred, dynamic as an "escape hatch when absolutely necessary"

### setup.cfg (static metadata)

* Config file for `setuptools`, tells it about your package and which code files to include. Eventually a lot of this can move to `pyproject.toml`
* Content of `setup.cfg`:

    ```
    [metadata]
    name = example-pkg-nballenger
    version = 0.0.1
    author = Nick Ballenger
    author_email = nballeng@gmail.com
    description = Small example package
    long_description = file: README.md
    long_description_content_type = text/markdown
    url = https://github.com/nballenger/example-pkg-nballenger
    project_urls =
        Bug Tracker = https://github.com/nballenger/example-pkg-nballenger/issues
    classifiers =
        Programming Language :: Python :: 3
        Programming Language :: Python :: 3.9
        License :: OSI Approved :: MIT License
        Operating System :: OS Independent

    [options]
    packages = find:
    python_requires = >=3.9
    ```

* It's in `configparser` format, don't quote values
* Metadata values:
    * `name` - distribution name of the package. Can be any name using `[a-zA-Z0-9_-]+` that doesn't already exist on pypi.org
    * `version` - package version under PEP 440, you can use `file:` or `attr:` directives to rad from a file or package attribute
    * `author` and `author_email` identify the author of the package
    * `description` - short, one sentence package summary
    * `long_description` shown on the package detail page, source it from readme
    * `long_description_content_type` tells the index the markup type
    * `url` - url of the homepage, usually the github or whatever
    * `project_urls` lets you list any number of extra links on PyPI
    * `classifiers` - gives index and pip some additonal metadata about the package. Always include at least your min python version, package license, and which OS's your package works under.
* In `[options]` there are controls for `setuptools` itself:
    * `packages` - list of all python import packages that should be included in the distribution package. `find:` directive lets you automatically discover all packages and subpackages
    * `python_requires` - gives versions of Python supported by your project
* `setup.py` isn't technically required anymore, but you can include a shim for it:

    ```Python
    import setuptools

    setuptools.setup()
    ```

* `README.md` can be in github flavored markdown
* `LICENSE` should be something from, e.g., https://choosealicense.com

## Generating Distribution Archives

* Make sure you've got the latest version of `build` installed

    ```shell
    python3 -m pip install --upgrade build
    ```

* Then run `python3 -m build` in the directory where `pyproject.toml` is
* That'll generate two files in `dist/`, a `.whl` and a `.tar.gz` source archive
* Always upload both a source archive and built archives for the platforms your project is compatible with.

## Uploading the distribution archives

* First you need to register an account on `Test PyPI`, which is a separate instance of the package index for testing and experimentation. Good for stuff where you don't want to upload to the real index.
* Need to create a PyPI API token so you can upload, put that into a `.pypirc` file
* Install `twine`
* Upload your archives under `dist/` with

    ```shell
    python3 -m twine upload --repository testpypi dist/*
    ```

## Install your newly uploaded package

* Create a new virtualenv and start it up
* Install with

    ```shell
    python3 -m pip install --index-url https://test.pypi.org/simple/ --no-deps example-pkg-nballenger
    ```

* Specify `--no-deps` with packages on testpypi, because it won't include the same dependencies as the real pypi, so dependency resolution isn't going to work well

# Creating Documentation

From https://packaging.python.org/tutorials/creating-documentation/

* Install Sphinx: `python -m pip install -U sphinx`
* Create a `docs/` directory to hold your documentation
* Run `sphinx-quickstart` in that directory
* That sets up a source directory, does some configs, etc.
* You can add some info about hte project in the `index.rst` file it creates, then use `make html` to generate documentation

# Guide: Packaging and Distributing Projects

From https://packaging.python.org/guides/distributing-packages-using-setuptools/

* Make sure you've installed all the requirements for installing packages
* Make sure your `build` is up to date
* Install `twine`

## Configuring your project

### Initial Files

* `setup.py`
    * holds dynamic metadata logic
    * calls `setup()` function
    * is the CLI interface for running packaging commands
* `setup.cfg`
    * `ini` file with static metadata for `setup.py`
* `README.rst`/`README.md`
* `MANIFEST.in` - needed when you need to package additional files not automatically included in a source distribution
* `LICENSE` / `LICENSE.txt`
* `<your package>` - most common practice is to put all modules/packages under a single top level package with the same name as your project
* `setup()` args - `name`, `version`, `description`, etc.
* Specific args to look at more:
    * `console_scripts`
    * `entry_points`
    * `data_files`
    * `package_data`
* Versioning schemes allowable under PEP 440:

```
1.2.0.dev1  # Development release
1.2.0a1     # Alpha Release
1.2.0b1     # Beta Release
1.2.0rc1    # Release Candidate
1.2.0       # Final Release
1.2.0.post1 # Post Release
15.10       # Date based release
23          # Serial release
```

## Working in development mode

* If you're in the root of your project directory, you can run

    ```shell
    python -m pip install -e .
    ```

* which will install in editable mode
* You can install dependencies in editable mode. Requirements file syntax:

    ```
    -e .
    -e git+https://somerepo/bar.git#egg=bar
    ```

## Packaging your project

* Creating a source distro: `python setup.py sdist`
* Creating a wheel: `python -m pip install wheel`
* Creating a universal (pure python) wheel: `python setup.py bdist_wheel --universal`
* Can set the `--universal` flag in `setup.cfg`:

    ```
    [bdist_wheel]
    universal=1
    ```

* Only use `--universal` if your project runs on py 2 and 3 with no changes, and you have no C extensions in use.
* Pure python wheels that aren't universal are pure python, but don't natively support both python 2 and 3
* Build these with `python setup.py bdist_wheel`
* Platform wheels are specific to an OS
* Build them with `python setup.py bdist_wheel`

# Guide: Packaging Namespace Packages

* Namespace packages let you split sub-packages and moudles in a single package across multiple, separate distribution packages.
* For example, with this package structure:

    ```
    mynamespace/
        __init__.py
        subpackage_a/
            __init__.py
            ...
        subpackage_b/
            __init__.py
            ...
        module_b
    setup.py
    ```

* And these usages in code:

    ```Python
    from mynamespace import subpackage_a
    from mynamespace import subpackage_b
    ```

* Then you can actually break the subpackages into two separate distributions:

    ```
    mynamespace-subpackage-a/
        setup.py
        mynamespace/
            subpackage_a/
                __init__.py

    mynamespace-subpackage-b/
        setup.py
        mynamespace/
            subpackage_b/
                __init__.py
            module_b.py
    ```

* And the subpackages can be separately installed, used, and versioned.
* Useful for a large collection of loosely-related packages
* Come with some caveats and are not always appropriate

## Creating a namespace package

* Three approaches currently
    * Use native namespace packages, as defined in PEP 420, only available in Python 3.3+. Recommended if you only need to support python3 and pip installation
    * Use pkgutil-style namespace packages. If you need python2 and 3 support, and install via pip and setuptools
    * Use `pkg_resources`-style namespace packages. If you need compatibility with packages already using the method, or if your package needs to be zip safe.
* Native and `pkgutil` style are largely compatible, `pkg_resources` style are not compatible with other methods.

### Native namespace packages

* Added in 3.3 via PEP 420
* All you have to do is omit `__init__.py` from the namespace package directory:

    ```
    setup.py
    mynamespace/
        # no __init__.py here
        subpackage_a/
            __init__.py
            module.py
    ```

* Every distribution using the namespace package must omit the namespace level init file. If any distro does not, it will cause the namespace logic to fail
* Because there's no init file in the top level, `setuptools.find_packages()` won't find the sub package, and you must use `setuptools.find_namespace_packages()` instead, or explicitly list your packages.

    ```Python
    from setuptools import setup, find_namespace_packages

    setup(
        name='mynamespace-subpackage-a',
        ...
        packages=find_namespace_packages(include=['mynamespace.*'])
    )
    ```




