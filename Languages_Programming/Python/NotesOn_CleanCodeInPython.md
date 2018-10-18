# Notes on Clean Code in Python

By Mariano Anaya; Packt Publishing, August 2018; ISBN 9781788835831

* Benefits of a code style standard like PEP8
    * Easier to search code (difference between 'varname =' and 'varname='
    * Reading uniformly laid out code is easier
    * Readable code makes it easier to debug and maintain
* Documenting code:
    * Avoid comments
    * Use docstrings
    * Annotate and use type hinting
* Type hinting with Mypy
    * Does optional static type checking
    * Analyzes files, reports on type inconsistencies
    * Ignore false positives with `# type: ignore` after a declaration line it complains about
* Pylint
    * Fairly complete and strict
    * configs from `pylintrc`
* Automatic checks
    * Use makefiles to define them
    * Something like

            typehint:
              mypy src/ tests/

            test:
              pytest tests/

            lint:
              pylint src/ tests/

            checklist:
              lint typehint test

            .PHONY: typehint test lint checklist

    * Suggests using Black to auto format code
    * "If the code always respects the same structure, changes in the code will only show up in pull requests with the actual changes that were made, and no extra cosmetic modifications"

# Chapter: Pythonic Code

* Goals:
    * understand indices and slices, correctly implement objects that can be indexed
    * implement sequences and other iterables
    * learn good use cases for context managers
    * implement more idiomatic code through magic methods
    * avoid common mistakes that lead to side-effects
* Indexes and slices
    * Always use slice syntax rather than random roll-your-own indexing
* Creating your own sequences
    * If you want to implement `__getitem__` on a custom class:
        * In wrapper code, delegate it to the underlying class implementation
        * In a real custom sequence with no base sequence object:
            * When indexing by a range, the result should be an instance of the same type as the class
            * In the range provided by `slice`, respect the semantics python uses, excluding the last element
* Context managers
    * Exist to enable a pattern where you have an action with setup and teardown steps
    * Context managers use `__enter__` and `__exit__`
    * `with` calls `__enter__`, then the code enters a new context
    * After the last statement of the nested context, `__exit__` is called
    * If the block raises an exception, `__exit__` is still called, and actually receives the exception if you want to manage it
    * If you write an `__exit__` method, don't accidentally have it return `True`--that means the exception passed to `__exit__` should not propagate, which shouldn't be the behavior unless you explicitly want it to be
* Implementing context managers
    * Any class that implements `__enter__` and `__exit__` can act as a context manager
    * There are more ways to do it via the `contextlib` standard library module
    * Example using a decorator:

            import contextlib

            @contextlib.contextmanager
            def db_handler():
                stop_database()
                yield
                start_database()

            with db_handler():
                db_backup()  # db must be stopped to run this

    * Example using a mixin base class:

            class dbhandler_decorator(contextlib.ContextDecorator):
                def __enter__(self):
                    stop_database()

                def __exit__(self, ex_type, ex_value, ex_traceback):
                    start_database()

            @dbhandler_decorator()
            def offline_backup():
                run("pg_dump_database")

    * Example of a util package that enters a context manager where, if one of the provided exceptions is raised, does not fail:

            import contextlib

            with contextlib.suppress(DataConversionException):
                parse_data(input_json_or_dict)

* Properties, attributes, and different types of methods for objects
    * No real way to have actual private methods, though preceding underscores are convention
    * Underscores in Python
        * Everything not strictly part of an object's interface should be underscore prefixed
        * If you use a double preceding underscore, it DOES NOT actually create a private attribute; for those variables name mangling occurs, and an attribute with name `_<class-name>__<attr-name>` is created
        * The double underscore was created as a means to override different methods of a class that is going to be extended several times, without the risk of method name collisions
        * Don't use double underscores, they're not Pythonic.
    * Properties
        * If you need to hold values, regular attributes are fine
        * If you need object state, properties are a good choice
        * Don't write `get_` and `set_` methods for all attributes, just computed ones
        * Use the `@property` and `@<propety-name>.setter` decorators
* Iterable objects
    * Any object that has `__next__` or `__iter__` can be an iterator
    * Sequences that have `__len__` and `__getitem__` can be iterators
* Creating Iterable Objects
    * When you iterate an object, python calls `iter()` on it
    * That checks for `__iter__` on the object, and executes it if present
    * Reusing iterators doesn't work, because they become empty
    * An iterable constructs an iterator, and that is what gets iterated over
    * If you have your `__iter__` call use a generator (with `yield`), you can have it created every time you loop over it:

            class DateRangeContainerIterable:
                def __init__(self, start_date, end_date):
                    self.start_date = start_date
                    self.end_date = end_date

                def __iter__(self):
                    current_day = self.start_date
                    while current_day < self.end_date:
                        yield current_day
                        current_day += timedelta(days=1)

            r1 = DateRangeContainerIterable(date(2018,1,1), date(2018,1,5))
            ", ".join(map(str, r1))
            max(r1)         # <-- without generator would fail as empty

    * The above is a 'container iterable'. Good to use when using generators.
