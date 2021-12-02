# Notes on Python 3 Logging

From [https://docs.python.org/3/library/logging.html](https://docs.python.org/3/library/logging.html)

Basic classes from the `logging` module:

* Loggers - expose the interface used by app code
* Handlers - send log records created by loggers to the appropriate place
* Filters - determine which log records to output
* Formatters - specify layout of log records in final output

## Logger Objects

* Don't instantiate directly, get from `logging.getLogger(name)`
* `name` is a period separated hierarchical value
* Loggers further down the hierarchy are children of loggers higher up
* Analogous to the package hierarchy, identical if you organize loggers on a per module basis via `logging.getLogger(__name__)`

Methods/attributes of `logging.Logger`:

* `logging.Logger.propagate` (attr)
    * If true, events logged to this logger are passed to the handlers of ancestor loggers in addition to this logger's own handlers
    * Constructor sets the attribute to True
    * If you attach a handler to a logger AND one or more of its ancestors, it may emit the same record multiple times.
* `logging.Logger.setLevel(level)` (method)
    * Sets the threshold to `level`
    * Messages less severe than the level are ignored
    * Messages with level or higher are emitted by whichever handler(s) service this logger, unless a handler's level is set higher
    * When a logger is created the level is `NOTSET`
        * for the root logger, causes all messages to be processed
        * for all others, delegates to the parent logger
    * If `NOTSET`, traverses ancestor chain until either a logger with a level other than `NOTSET` is reached, or the root is reached
    * if the root is reached and it is `NOTSET`, all messages a processed
    * otherwise the root's level is the effective level
* `logging.Logger.isEnabledFor(level)`
    * indicates if a message of `level` would be processed by this logger
* `logging.Logger.getEffectiveLevel()`
    * returns effective level for the logger
    * If a value has been set it is returned, otherwise the hierarchy is traversed towards the root until a value other than `NOTSET` is found.
    * Returns an integer that matches up to `logging.DEBUG`, `logging.INFO`, etc.
* `logging.Logger.getChild(suffix)`
    * returns a logger descendant to the current one as determined by `suffix`
    * Ex.: `logging.getLogger('abc').getChild('def.ghi')` returns the same logger as `logging.getLogger('abc.def.ghi')`
* `logging.Logger.debug(msg, *args, **kwargs)`
    * Logs a message with level `DEBUG` on this logger 
