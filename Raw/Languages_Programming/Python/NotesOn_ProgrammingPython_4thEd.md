# Notes on Programming Python, 4th Edition

By Mark Lutz, O'Reilly Media, 2010. ISBN 978-0-596-15810-1

## Chapter 2: System Tools

### System Scripting Overview

* Starts by looking at ``sys`` and ``os`` modules
* Additional standard modules in the systems domain:
    * ``glob`` - filename expansion
    * ``socket`` - low level networking and inter-process communication
    * ``threading._thread``, ``queue`` - concurrent threads
    * ``time``, ``timeit`` - system time info
    * ``subprocess``, ``multiprocessing`` - parallel processes
    * ``signal``, ``select``, ``shutil``, ``tempfile``, etc.
* In principle, ``sys`` exports components related to the Python interpreter, and ``os`` has variables/functions that map to the OS.
* ``os`` also tries to give some code portability across operating systems
* You can read a module's attribute list with ``dir(modulename)``
* You can read its docstring with ``modulename.__doc__``
* ``help(modulename)`` formats via PyDoc

### Introducing the sys module

* Has a bunch of attributes that give system info
* Lets you inspect and change the module search path via ``sys.path``
* Also has hooks into the interpreter: ``sys.modules`` lists imported modules
* Can give info related to most recent exception, via ``sys.exc_info()``
* Command line args in ``sys.argv``
* Streams in ``sys.stdin``, ``sys.stdout``, ``sys.stderr``
* Program exit: ``sys.exit``

### Introducing the os module

* Common tools:
    * ``os.environ`` - shell variables
    * ``os.system``, ``os.popen``, ``os.execv``, ``os.spanv`` - running programs
    * ``os.fork``, ``os.pipe``, ``os.waitpid``, ``os.kill`` - spawning processes
    * ``os.open``, ``os.read``, ``os.write`` - descriptor file, locks
    * ``os.remove``, ``os.rename``, ``os.mkfifo``, ``os.mkdir``, ``os.rmdir`` - file processing
    * ``os.getcwd``, ``os.chdir``, ``os.chmod``, ``os.getpid``, ``os.listdir``, ``os.access`` - administrative tools
    * ``os.sep``, ``os.pathsep``, ``os.curdir``, ``os.path.split``, ``os.path.join`` - portability
    * ``os.path.exists()``, ``os.path.isdir()``, ``os.path.getsize()`` - pathnames
* Running shell commands from scripts:
    * ``os.system`` - runs a shell command from inside python
    * ``os.popen`` - runs a shell command, connects to IO streams

## Chapter 3: Script Execution Context

### I'd like to have an argument, please

* Scripts can have lots of contextual info:
    * ``os.getcwd``
    * ``sys.argv``
    * ``os.environ``
    * ``sys.stdin``, ``sys.stdout``, ``sys.stderr``

### Current working directory

* ``os.getcwd`` fetches the current working directory, ``os.chdir`` changes it
* A script's home directory is always added to the start of its module search path

### Command line arguments

* ``sys.argv`` is an iterable
* Possible to use raw, easier to use after processing into a structure with ``getopt`` or ``optparse`` (generally better)

### Shell Environment Variables

* You get them out of ``os.environ``
* If you change members of ``os.environ`` the change is reflected in that program's parent shell
* Changes to the env always propagate down, not up
* Env values are loaded into ``os.environ`` on startup, not dynamically.

### Standard Streams

* Access is via ``sys.stdin``, ``sys.stdout``, ``sys.stderr``
* You can reset those to file-like objects:
    * Anything with file-like read methods can be assigned to ``sys.stdin``
    * Anything with file-like write methods can be assigned to ``sys.stdout``
* There's a standard library module for a bunch of cases like this. ``io.StringIO`` and ``io.BytesIO`` will give an object that maps a file object interface to/from in-memory strings:

```Python
from io import StringIO
buff = StringIO()
buff.write('aaa')
buff.write('bbb')
buff.getvalue()          # returns 'aaabbb'
```

* Redirecting another command's streams from inside a python program:

```Python
import os
pipe = os.popen('python somefile.py')
pipe.read()
pipe.close()
```

```Python
import os
pipe = os.popen('python somefile.py', 'w')
pipe.write('foo')
pipe.close()
```

```Python
from subprocess import Popen, PIPE, call
X = call('python somefile.py')

pipe = Popen('python somefile.py', stdout=PIPE)
pipe.communicate()[0]
pipe.returncode

pipe.stdout.read()
pipe.wait()
```

## Chapter 4: File and Directory Tools

## Chapter 5: Parallel System Tools

### Telling the monkeys what to do

* Two fundamental ways to get tasks to happen concurrently in Python:
    * Process forks
    * Spawned threads
* Chapter looks at built in tools for starting parallel work and talking to worker tasks
*
