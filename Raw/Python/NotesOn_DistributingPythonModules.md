# Notes On Distributing Python Modules

Based on information at [https://docs.python.org/2/distutils/](https://docs.python.org/2/distutils/)

# Summary of Process:

* Assuming a project that looks like this:

```
/project-root
    setup.py
    setup.cfg
    README.txt
    MANIFEST.in
    mypkg/
        __init__.py
        alpha.py
        bravo.py
        mysubpkg/
            __init__.py
            charlie.py
            delta.py
        data/
            echo.dat
            foxtrot.dat
        cfg/
            golf.conf
    doc/
    examples/
```

* Create a ``setup.py`` similar to this in the root of your project:

```Python
from distutils.core import setup

setup(
    name='mypkg',
    maintainer='The Groundwork',
    maintainer_email='info@thegroundwork.com',
    version='1.0',
    description='A short description!',
    platforms='ubuntu',
    license='All Rights Reserved',
    packages=['mypkg', 'mypkg.mysubpkg'],
    package_dir={'mypkg': 'mypkg'},
    requires=['django (>=1.7)', 'djangorestframework'],
    provides=['mypkg'],
    package_data={'mypkg': ['data/*.dat']},
    data_files=[('config', ['cfg/golf.conf'])],
)
```

* Write a ``setup.cfg`` like this:

```

```

# Section Summaries

## 1. An Introduction to Distutils

### 1.1 Concepts and Terminology

* Developer responsibilities when using Distutils:
    * write a ``setup.py`` script
    * write a setup config file (optional)
    * create a source distribution
    * create one or more binary distributions (optional)
    
### 1.2 A Simple Example

* To distribute a module called ``candyland``, from ``candyland.py``, then ``setup.py`` can be:

```Python
from distutils.core import setup

setup(name='candyland', version='1.0', py_modules=['candyland'],)
```

* Keyword args to ``setup()`` are either package metadata or a manifest.
* Creating a source distribution would be: ``python setup.py sdist``
* That creates an archive file containing ``setup.py`` and the module.
* Name would be ``candyland-1.0.tar.gz``
* Installation would be download, unpack, run ``python setup.py install``
* Both ``sdist`` and ``install`` are distutils commands.
* The ``bdist_`` commands create binary distributions: ``python setup.py bdist_rpm``

### 1.3 General Python Terminology

* **module** &mdash; block of code imported by other code
* **pure Python module** &mdash; written in Python, lives in a single ``.py`` file
* **extension module** &mdash; written in C/C++, stored in precompiled ``.so``
* **package** &mdash; a module containing other modules / directory with ``__init__.py``
* **root package** &mdash; root of package hierarchy, has no ``__init__.py``. Everything in ``sys.path`` contributes to root package.

### 1.4 Distutils-specific Terminology

* **module distribution** &mdash; collection of Python modules distributed together
* **pure module distribution** &mdash; module distro containing only Python modules and packages
* **non-pure distribution** &mdash; contains at least one extension module
* **distribution root** &mdash; top level of the source tree, where ``setup.py`` is and runs from

## 2. Writing the Setup Script

* Main purpose of ``setup.py`` is describing the module distro to distutils
* Most info supplied to distutils is passed through ``setup()``

### 2.1 Listing Whole Packages

* The ``packages`` arg to ``setup()`` tells Distutils to build, distribute, and install all pure Python modules in each package listed.
* List package names relative to the directory where ``setup.py`` is
* Alternately, pass a ``package_dir`` option

### 2.2 Listing Individual Modules

* Passing an array to the ``py_modules`` arg of ``setup()`` looks for individual modules

### 2.3 Describing Extension Modules

* Pass the ``ext_modules`` arg to ``setup()``
* ``ext_modules`` is an array of ``Extension`` references:

```Python
from distutils.core import setup, Extension

setup(name='candyland', version='1.0',
      ext_modules=[Extension('candyland', ['candyland.c'])],)
```

#### 2.3.1 Extension Names and Packages

* First arg to ``Extension()`` is the name of the extension, including any package names
* If you have multiple extensions in the same package:

```Python
setup(...,
      ext_package='pkg',
      ext_modules=[Extension('foo', ['foo.c']),
                   Extension('subpkg.bar', ['bar.c'])],
)
```

#### 2.3.2 Extension Source Files

* Second arg to ``Extension()`` is a list of source files in C/C++/Obj-C
* You can include SWIG (``.i``) interface files in the list too.
* You can pass options to SWIG: ``Extension('_foo', ['foo.i'], swig_opts=['-modern', '-I../include'])``
* Or at the command line: ``setup.py build_ext --swig-opts="..."``

#### 2.3.3 Preprocessor Options

* There are three optional arguments to ``Extension()``:
    * ``include_dirs`` takes a list of include directories for header files
    * ``define_macros`` takes a list of tuples: ``define_macros=[('NDEBUG', '1'), ...]``
    * ``undef_macros`` takes a list of strings for macros to undefine

#### 2.3.4 Library Options

* You can specify the libraries to link against when building an extension:

```Python
Extension(..., libraries=['gdbm', 'readline])
Extension(..., library_dirs=['/usr/X11R6/lib'], libraries=['X11', 'Xt'])
```

#### 2.3.5 Other Options

* ``extra_objects`` takes a list of object files to pass to the linker
* ``extra_compile_args`` and ``extra_link_args`` specify additional command line options for the compiler and linker
* ``depends`` is a list of files the extension depends on, like header files

### 2.4 Relationships Between Distributions and Packages

* A distribution may relate to packages in three specific ways:
    1. It can **require** packages or modules.
    1. It can **provide** packages or modules.
    1. It can **obsolete** packages or modules.
* All three relationships can be set using keyword args to ``distutils.core.setup()``:

```Python
setup(..., 
      requires=['somepkg (>1.1)', 'otherpkg (==2.4)'],
      provides=['my-math', 'my-strings'],
      obsoletes=['oldpkg', 'otheroldpkg (<1.3)'],
)
```

### 2.5 Installing Scripts

* Scripts are files with python source code, intended to be started from the command line
* If the first line of a script starts with ``#!`` and contains 'python', distutils will adjust the first line to refer to the current interpreter location.

```Python
setup(...,
      scripts='scripts/xmlproc_parse', 'scripts/xmlproc_val']
)
```

### 2.6 Installing Package Data

* Additional files may need to be installed into a package, like data, text files, etc. Collectively called 'package data'.
* The ``package_data`` keyword arg to ``setup()`` maps a package name to a list of relative path names to copy into the package.
* Relative paths are interpreted relative to the directory containing the package, and may contain glob patterns.
* Example source tree of distro:

```
setup.py
src/
    mypkg/
        __init__.py
        module.py
        data/
            tables.dat
            spoons.dat
            forks.dat
```

* Corresponding ``setup()`` call:

```Python
setup(...,
      packages=['mypkg'],
      package_dir={'mypkg': 'src/mypkg'},
      package_data={'mypkg': ['data/*.dat']},
)
```

### 2.7 Installing Additional Files

* The ``data_files`` option can specify any additional files, like config files, message catalogs, data files, etc.
* ``data_files`` takes a sequence of (directory,files) tuples:

```Python
setup(...,
      data_files=[('bitmaps', ['bm/b1.gif', 'bm/b2.gif']),
                  ('config', ['cfg/data.cfg']),
                  ('/etc/init.d', ['init-script'])]
)
```

* If the directory is a relative path, it is relative to the installation prefix (``sys.prefix`` or ``sys.exec_prefix`` for pure and non-pure packages, respectively)
* Each file in name in the specified files is interpreted relative to the location of ``setup.py`` at the top of the package source distro.

### 2.8 Additional Meta-data

* Additional fields you can pass to ``setup()``: ``name``, ``version``, ``author``, ``author_email``, ``maintainer``, ``maintainer_email``, ``url``, ``description``, ``long_description``, ``download_url``, ``classifiers``, ``platforms``, ``license``
* ``name``, ``version``, and ``url`` are required
* None of the values can be unicode
* Version numbers should be ``major.minor[.patch][sub]``

### 2.9 Debugging the Setup Script

* Distutils catches exceptions when running the setup script and prints an error message before terminating, with no traceback appended.
* Setting ``DISTUTILS_DEBUG`` to a value in the environment will cause a full traceback dump

## 3. Writing the Setup Configuration File

* If you need user provided info, creating a ``setup.cfg`` file for them to edit is a very easy way to get it.
* ``setup.cfg`` and any other distutils config files are processed after the contents of the setup script, and before the command line
* Basic syntax is

```
[command]
option=value
...
```

* Command is a distutils command like ``build_py`` or ``install``
* Options are the options to those commands.
* Long option values can be split across lines by indenting the second line
* You can get the list of options for a command with, for example, ``python setup.py --help build_ext``
* Example config file:

```
[build_ext]
inplace=1

[bdist_rpm]
release = 1
packager = Jack Sprat <jack@example.com>
doc_files = CHANGES.txt
            README.txt
            doc/
            examples/
```

## 4. Creating a Source Distribution

* The ``sdist`` distutils command creates source distributions
* Default format is .tar.gz, though it can be set with ``--formats`` to a comma separated list of ``zip``, ``bztar``, ``gztar``, ``ztar``, ``tar``
* When using a tar format you can set owner and group with ``--owner=whatever --group=whatever``

### 4.1 Specifying the Files to Distribute

* With no explicit list of files or instructions for how to generate one, distutils will grab a minimal default set:
    * all Python source files implied by ``py_modules`` and ``packages``
    * all C source files from ``ext_modules`` or ``libraries``
    * scripts identified by ``scripts``
    * anything that looks like a test script (though it won't run them)
    * ``README.txt``, ``setup.py``, ``setup.cfg``
    * all files from ``package_data`` and ``data_files``
* If you want to include more you use a manifest template in ``MANIFEST.in``
* Manifest is a list of instructions for generating the ``MANIFEST`` file, which is the exact list of files for the source distribution
* ``sdist`` processes the template and generates the manifest
* Writing a static manifest file is just one filename per line, regular files and symlinks only. If you supply a ``MANIFEST`` the defaults won't be pulled in.

### 4.2 Manifest-Related Options

* Operation of ``sdist``:
    1. If ``MANIFEST`` exists and the first line doesn't indicate it was generated from ``MANIFEST.in`` it is used as is
    1. If ``MANIFEST`` doesn't exist of has been previously auto generated, read ``MANIFEST.in`` and create it
    1. If neither file nor template exist, create a manifest with defaults
    1. use the list of files in ``MANIFEST`` to create the source distro archives
* You can set ``--no-defaults`` and ``--no-prune`` to disable standard include/exclude behavior
* If you want to regenerate the manifest but not the source distro: ``setup.py sdist --manifest-only``

### 4.3 The ``MANIFEST.in`` Template

#### 4.3.1 Principle

* One command per line, each command specifying a set of files to include or exclude
* The order of commands matters, since each command adds to or removes from the list of files.
* After processing the template, some files are removed:
    * all files in ``build/``
    * all files in directories ``RCS``, ``CVS``, ``.svn``, ``.hg``, ``.git``, ``.bzr``, ``_darcs``
* Example:

```
include *.txt
recursive-include examples *.txt *.py
prune examples/sample?/build
```

* How ``sdist`` builds the list of files for the Distutils distribution itself:
    1. Include all Python source files in ``distutils`` and ``distutils/command`` subdirectories, because they are referenced from ``packages``
    1. Include ``README.txt``, ``setup.py``, ``setup.cfg``
    1. Include ``test/test*.py``
    1. Include ``*.txt`` in the distribution root
    1. Include anything under ``examples/`` matching ``*.txt`` or ``*.py``
    1. Exclude everything in subtrees matching ``examples/sample?/build``
    1. Exclude the entire ``build`` tree and version control directories

#### 4.3.2 Commands

* ``include pattern1 pattern2``
* ``exclude pattern1 pattern2``
* ``recurisve-include dir-to-look-in pattern1 pattern2``
* ``recursive-exclude dir-to-look-in pattern1 pattern2``
* ``global-include pattern1 pattern2``
* ``global-exclude pattern1 pattern2``
* ``prune directory-name``
* ``graft directory-name``


## 5. Creating Built Distributions

* A built distro is like a binary package or installer. 
* It's platform specific--RPM, debian package, whatever.
* 'Packagers' are intermediate tools that do the heavy lifting for different platforms
* Built distributions are created with ``setup.py bdist``
* By itself that'll build a 'fake' install in the ``build`` directory and create the default type of built distro for the current platform.
* tarball for *nix, exe for windows
* ``bdist`` takes a ``--formats`` option, which can be a comman separated list of ``gztar``, ``ztar``, ``tar``, ``zip``, ``rpm``, ``pkgtool``, ``sdux``, ``wininst``, ``msi``
* Or you can use a command directly implementing one of those: ``bdist_dumb`` (tar, ztar, gztar, zip), ``bdist_rpm``, ``bdist_wininst``, ``bdist_msi``

### 5.1 Creating Dumb Built Distributions

* No notes here, just run ``bdist_dumb``

### 5.2 Creating RPM Packages

* Use ``bdist_rpm`` or ``bdist --formats=rpm``
* You can pass PRM specific options to ``bdist_rpm`` like ``--packager``
* The creation is driven by a ``.spec`` file, which ``bdist_rpm`` will create based on your setup script, command line, and config files
* ``.spec`` option names in ``setup``: ``name``, ``description``, ``version``, ``author``, ``author_email``, ``maintainer``, ``maintainer_email``, ``license``, ``url``, ``long_description``.
* There are ``.spec`` options that don't have a distutils equivalent, and must be arguments to ``bdist_rpm``: ``release``, ``group``, ``vendor``, ``packager``, ``provides``, ``requires``, ``conflicts``, ``obsoletes``, ``distribution_name``, ``build_requires``, ``icon``
* You can provide them in the config file or on the command line.
* Steps to building the RPM:
    1. Create a ``.spec`` file describing the package
    1. Create the source RPM
    1. Create the "binary" RPM
* You can separate the steps with ``--spec-only``

### 5.3 to 5.5: Creating Windows Installers

* LOL, don't care.


## 6. The Python Package Index (PyPI)

* Stores metadata describing distributions packaged with distutils, and distro files if the author wants it to
* Distutils gives you ``register`` and ``upload`` commands for pushing to PyPI

### 6.1 PyPI Overview

* You can submit any number of versions of your distro
* If you alter the metadata for a version, submit again and the index updates
* Has a record for each (name,version) combination

### 6.2 Distutils commands

#### 6.2.1 The ``register`` command

* Submits the distribution's metadata to an index server.
* Calling it gives an interactive set of stuff if you haven't saved username and password.
* You can store credentials in a ``.pypirc`` file

#### 6.2.2 The ``upload`` command

* Pushes the distribution files to PyPI
* Invoked immediately after building one or more distribution files: ``python setup.py sdist bdist_rpm upload``
* You can use ``--sign`` to tell upload to sign uploaded files with GPG (also the ``--identity=name`` option)

#### 6.2.3 Additional Command Options

* ``--repository|-r`` lets you specify the PyPI server
* If the .pypirc file is configured to do so you can use a name from there as the argument to ``-r``
* ``--show-response`` displays full response text from the server

#### 6.2.4 The ``.pypirc`` File

* Format:

```
[distutils]
index-servers =
    pypi

[pypi]
repository: <repository-url>
username: <username>
password: <password>
```

### 6.3 PyPI Package Display

* The ``long_dscription`` field displays a homepage for a registered package
* It can take reStructuredText syntax, will convert to HTML
* Can be attached to a text file located in the package:

```Python
from distutils.core import setup

with open('README.txt') as file:
    long_description = file.read()

setup(name='Distutils', long_description=long_description)
```

* You can check reStructuredText content with the ``rst2html`` program from the ``docutils`` package: ``setup.py --long-description | rst2html.py > output.html``

## 7. Examples

* See [https://docs.python.org/2/distutils/examples.html](https://docs.python.org/2/distutils/examples.html)
