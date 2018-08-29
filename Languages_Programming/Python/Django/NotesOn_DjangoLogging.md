# Notes on Django Logging

https://docs.djangoproject.com/en/1.7/topics/logging/

* Uses the standard library's ``logging`` module
* Discussion of Loggers, Handlers, Filters, Formatters

## Using Logging

* Once you configure loggers, handlers, filters, formatters, you need to put logging calls into the code
* Example:

```Python
import logging

logger = logging.getLogger(__name__)

def my_view(request, arg1, arg):
    ...
    if bad_mojo:
        logger.error('Something went wrong!')
```

### Naming Loggers

* Use ``__name__`` at the module level
* Use explicit dot name if getting a specific logger

### Making Logging Calls

* Use ``debug()``, ``info()``, ``warning()``, ``error()``, ``critical()``, ``log()`` and ``exception()``

## Configuring logging

* By default, Django configures via ``dictConfig()``
* Use ``LOGGING`` to create a dict of settings describing loggers, handlers, filters, and formatters you want to use
* By default ``LOGGING`` will get merged with django's default config by:
    * if ``disable_existing_loggers`` is true (default), all loggers from default config will be disabled (silently discards anything passed to it)
    * Probably best to set it to false and redefine some or all of the default loggers
    * You can also set ``LOGGING_CONFIG`` to ``None``
    * It all happens during Django's ``setup()``

### Examples
