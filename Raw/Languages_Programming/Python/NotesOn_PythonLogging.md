# Notes on Python Logging

## Basic Logging Tutorial Notes

https://docs.python.org/2/howto/logging.html#logging-basic-tutorial

* Logging module gives you convenience functions:
    * ``info()`` - report events during normal operation
    * ``debug()`` - detailed output for diagnostic purposes
    * ``warning()`` - issue warning about a runtime event
    * ``error()``, ``exception()``, ``critical()`` - suppression of an error without raising an exception, as appropriate to the error
* Five log levels:
    * ``DEBUG`` - detailed info for diagnosing problems
    * ``INFO`` - confirmation that things work as expected
    * ``WARNING`` - something unexpected, or an impending problem
    * ``ERROR`` - software failed to perform some function
    * ``CRITICAL`` - possible crash

### Simple example

```Python
import logging
logging.warning('Watch out!') # prints message to console
logging.info('Yep yep.')      # does not print anything, because the
                              # default level is WARNING
```

### Logging to a file:

```Python
import logging
logging.basicConfig(filename='example.log', level=logging.DEBUG)
logging.debug('Goes to log file')
logging.info('Also goes to log file')
logging.warning('And this too')
```

## Advanced Logging Tutorial

* Multiple categories of components in ``logging``:
    * Loggers - expose interface that app code uses
    * Handlers - send log records to a destination
    * Filters - finer grained filtering on what to output
    * Formatters - specify layout of log records in output
* All data passed around as a ``LogRecord`` instance
* Instances of ``Logger`` subclasses each have a name
* Names are in a dot separated namespace hierarchy, indicate origin of a message
* Good convenntion is module level logger: ``logger = logging.getLogger(__name__)``
* Hierarchy root is ``root``, which shows up in output
* Possible to use different kinds of destinations via handler classes
* There's no default destination, you must set one in ``basicConfig`` or it all goes to stderr
* You can change the format of messages by passing a format string to ``basicConfig``

### Logging Flow

#### Logger

1. Logging call in user code
1. Logger enabled for this level of call? If no, stop.
1. Create LogRecord object
1. Record rejected by a filter attached to logger?
1. Pass to handlers of current logger.
1. Is propagate true for current logger?
1. Is there a parent logger?
1. Set current logger to parent, return to 'Pass to handlers of current logger'

#### Handler

1. LogRecord passed into handler
1. Handler enabled for this level of LogRecord?
1. Does a filter attached to handler reject the record?
1. Emit, including formatting

### Loggers

* Loggers do three things:
    * expose methods to app code for logging messages at runtime
    * determine which messages to act on
    * pass along relevant messages to all interested handlers
* Most common config methods:
    * ``Logger.setLevel()`` - sets lowest severity message it'll handle
    * ``Logger.addHandler()`` and ``Logger.removeHandler()`` 
    * ``Logger.addFilter()`` and ``Logger.removeFilter()``
* Methods to create log messages:
    * ``debug()``, ``info()``, ``warning()``, ``error()``, ``critical()``
    * ``exception()`` is like error but dumps a stack trace
    * ``log()`` takes level as an explicit argument
* ``getLogger()`` returns a reference to a logger instance
* multiple calls to ``getLogger(name)`` will return the same logger
* Loggers with names lower in the dot hierarchy are children
* A logger with no specified level takes the level of its parent

### Handlers

* Handlers dispatch appropriate log messages to the handler's destination
* Loggers can attach handlers to themselves
* Standard library has multiple useful handlers
* Handler methods relevant to app devs:
    * ``setLevel()`` sets lowest severity that will be dispatched
    * ``setFormatter()`` selects a Formatter object to use
    * ``addFilter()`` and ``removeFilter()``
* App code should not directly instantiate and use Handler instances--subclass it.

### Formatters

* Configure the final order, structure, contents of a message
* App code can instantiate formatter classes, or subclass it
* Constructor takes two optional args, a format string and date format string: ``logging.Formatter.__init__(fmt=None, datefmt=None)``

### Configuring Logging

* Three ways to configure it:
    1. Creating loggers, handlers, formatters explicitly in code
    1. Create a logging config file, reading it with ``fileConfig()``
    1. Create a dict of config info, pass it to ``dictConfig()``
