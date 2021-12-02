# Notes on SQLAlchemy Documentation

# v1.3.24 Engine and Connection Use

From [https://docs.sqlalchemy.org/en/13/core/engines_connections.html](https://docs.sqlalchemy.org/en/13/core/engines_connections.html)

## Engine Configuration

* An `Engine` references a `Dialect` and a `Pool`, which together interpret the DBAPI's module functions and the behavior of the database.
* Created via `create_engine()` with a db conn string:

    ```Python
    from sqlalchemy import create_engine
    engine = create_engine('postgresql://u:p@host:port/dbname')
    ```

* That creates a `Dialect` object for postgres, and a `Pool` object that establishes a DBAPI connection to `host:port` when a connection request is first received
* Note that no connection is created until `engine.connect()` is called, or an operation dependent on that method like `Engine.execute()` is called.
* The `Engine` can be used directly to interact with the database, or passed to a Session object to work with the ORM
* DB urls follow RFC-1738, typical form is `dialect+driver://user:pass@host:port/database`
* Because it's a URL, special characters need to be URL encoded to be parsed correctly

    ```
    import urllib.parse
    password = "kx%jj5/g"
    escaped_pw = urllib.parse.quote_plus(password)
    db_conn_str = f'postgresql+pg8000://dbuser:{escaped_pw}@pghost10/appdb`
    ```

* For Postgres, psycopg2 is the default DBAPI, but pg8000 is also available

### Engine Creation API

* `create_engine(*args, **kwargs)` - create a new `Engine` instance
* `engine_from_config(configuration[, prefix], **kwargs)` - create using conf dictionary
* `make_url(name_or_url` - given a string, produce a new URL instance
* `URL` - represents components of a URL for connection to a DB

#### Functions

* `sqlalchemy.create_engine(*args, **kwargs)`
    * creates a new `Engine` instance
    * standard form is to pass the URL as the first arg
    * Keywords can follow it that set options on the resulting `Engine` and its `Dialect` and `Pool` constructs
    * Keyword args can be specific to the `Engine`, `Dialect`, or `Pool`
    * This section covers the most common options
    * Once established, the `Engine` requests a connection from the `Pool`
    * The `Pool` in turn establishes the first DBAPI connection
    * Keyword parameters:
        * `case_sensitive=True` - if False, result column names match case-insensitive
        * `connect_args` - dict of options that get passed directly to the DBAPI's `connect()` method as additional keyword args
        * `creator` - callable that returns a DBAPI connection, passed to the underlying connection pool, used to create all new db connections. Use `db_connect` hook instead, more flexible
        * `echo=False` - if True, engine logs all statements and a repr() of their params to the default log handler. If set to `"debug"`, result rows are also output
        * `echo_pool=False` - if True, connection pool logs output
        * `empty_in_strategy` - SQL compilation strategy to use when rendering an `IN` or `NOT IN` expression for `ColumnOperators.in_()` where the right-hand side is an empty set. Can be `static`, `dynamic`, or `dynamic_warn`, where `static` is the default, and a comparison to an empty set
        * `encoding` - defaults to `utf-8`
        * `execution_options` - dict of execution options applied to all connections
        * `hide_parameters` - when True, SQL statement params will not be displayed in INFO logging or formatted into `StatementError` objects
        * `implicit_returning=True` - some stuff
        * `isolation_level` - accepts some subset of `[SERIALIZABLE|REPEATABLE READ|READ COMMITTED|READ UNCOMMITTED|AUTOCOMMIT]`
        * `json_deserializer` - for dialects with the JSON datatype, this is a callable that will convert a JSON string to a Python object, by default its `json.loads`
        * `json_serializer` - defaults to `json.dumps`
        * `label_length=None` - integer limiting size of dynamically generated column labels
        * `listeners` - list of 1+ `PoolListener` objects
        * `logging_name` - string used in name field of logging records
        * `max_identifier_length` - int, overrides the setting for the dialect
        * `max_overflow=10` - number of connections to allow in connection pool overflow
        * `module=None` - reference to a Python module object, specifies an alternate DBAPI module to be used by the engine's dialect
        * `paramstyle=None` - style to use when rendering bound parameters
        * `pool=None` - already constructed instance of `Pool` like a `QueuePool` instance. If not None, this pool is used directly as the underlying connection pool for the engine
        * `poolclass=None` - `Pool` subclass that gets used to create a connection pool instance
        * `pool_logging_name`
        * `pool_pre_ping` - if True, enables connection pool pre-ping feature that tests connections fro liveness on each checkout
        * `pool_size=5` - number of connections to keep open inside the connection pool. Used by `QueuePool` and `SingletonThreadPool`. With `QueuePool`, a `pool_size` of 0 indicates no limit. To disable pooling, set `poolclass` to `NullPool`
        * `pool_recycle=-1` - causes the pool to recycle connections after the given number of seconds has passed. -1 is no timeout.
        * `pool_reset_on_return='rollback'` - set the `Pool.reset_on_return` parameter of the underlying `Pool` object, which can be `"rollback"`, `"commit"`, or `None`
        * `pool_timeout=30` - n seconds to wait before giving up on getting a connection from the pool, only used with `QueuePool`
        * `pool_use_lifo=False` - use LIFO when getting connection from `QueuePool` instead of FIFO. With LIFO, a server-side timeout scheme can reduce the number of connections used during non-peak periods of use.
        * `plugins` - string list of plugin names to load
        * `strategy='plain'` - selects alternate engine implementations, from `threadlocal` and `mock`
        * `executor=None` - function taking args `(sql, *multiparams, **params)` to which the `mock` strategy will dispatch all statement execution. Used only with `strategy='mock'`
* `sqlalchemy.engine_from_config(config, prefix='sqlalchemy.', **kwargs)`
    * Creates a new Engine instance from a config dict
    * Keys of interest to the function should be prefixed, like `sqlalchemy.url`
    * Each matching key after stripping the prefix is treated as through it were the corresponding keyword arg to `create_engine()`
    * Only required key is `sqlalchemy.url` for the db url
    * Select set of keyword args are coerced to expected type by based on string values
    * Set of args is extensible per-dialect via `engine_config_types` accessor
* `sqlalchemy.engine.url.make_url(name_or_url)`
    * given a string, produce a new URL instance
* `sqlalchemy.engine.url.URL(drivername, username=None, password=None, host=None, port=None, database=None, query=None)`
    * represent the components of a connection string url
* `sqlalchemy.engine.url.URL.get_dialect()` - returns db dialect class
* `sqlalchemy.engine.url.URL.translate_connect_args(names=[], **kwargs)`
    * translate url attributes to a dict of connection args

### Pooling

* The `Engine` asks the connection pool for a connection when `connect()` or `execute()` are called
* Default connection pool is `QueuePool`
* Pool opens connections to the database on an as-needed basis
* As concurrent statements are executed, `QueuePool` will grow its pool to a size of 5 by default
* Allows a default overflow of 10
* You should keep a single `Engine` per database established within an app, rather than creating a new one for each connection

### Custom DBAPI connect() arguments / on-connect routines

* Mostly you can use hooks for special connection methods
* You can pass special keyword arguments to dbapi.connect() by two main methods:
    * Adding parameters to the URL query string
    * Using the `connect_args` dictionary parameter
* There's lots of detail here, but I'm skipping it for now.

### Configuring Logging

* Uses the standard library `logging` module
* Also two parameters to `create_engine()` that let you log to stdout, `create_engine.echo` and `create_engine.echo_pool`
* All logging happens under the `sqlalchemy` namespace
* General namespace of SQLAlchemy loggers that can be turned on by configuring logging:
    * `sqlalchemy.engine` - controls SQL echoing, set to INFO for query output, DEBUG for query + result set output
    * `sqlalchemy.pool` - connection pool logging
    * `sqlalchemy.dialects` - custom logging for SQL dialects
    * `sqlalchemy.orm` - logging of ORM functions
* By default the log level is `logging.WARN` in the entire namespace
* Note:
    * The `Engine` conserves function call overhead by only emitting log statements when the current logging level is detected as INFO or DEBUG
    * That level is only checked when a new connection is drawn from the pool
    * Changing the logging config for a running app won't change the output for any active `Connection` or `Session`

# Working with Engines and Connections

From [https://docs.sqlalchemy.org/en/13/core/connections.html](https://docs.sqlalchemy.org/en/13/core/connections.html)

* Covers direct usage of `Engine` and `Connection` objects
* Not typically done from ORM usage, when the `Session` is used as the interface

## Basic Usage

* `Engine` objects are created by `create_engine(db_conn_string)`
* Typical usage is once per database URL, to create an engine held globally for the lifetime of an app process
* A single `Engine` manages multiple DBAPI connections on behalf of the app process
* The engine is intended to be called concurrently for multiple connections
* It's not synonymous with the DBAPI `connect` function, which represents a single connection resource
* The `Engine` is most efficient when created just once at the module level of an app, not per-object or per-function
* Most basic function of the `Engine` is to give access to a `Connection` that can invoke SQL statements

    ```Python
    with engine.connect() as connection:
        result = connection.execute("SELECT username FROM users")
        for row in result:
            print("username:", row['username'])
    ```

* By calling `connect()` in a context manager, `Connection.close()` gets automatically called at the block exit
* The `Connection` object is a proxy object for an actual DBAPI connection
* The DBAPI connection is retrieved from the connection pool at the point at which `Connection` is created
* The object you get back is a `ResultProxy`, that references a DBAPI cursor and gives you row fetch methods
* The DBAPI cursor is closed by the `ResultProxy` when all its result rows if any are exhausted
* A `ResultProxy` that returns no rows, like an UPDATE statement, releases cursor resources immediately
* When the `Connection` is closed at the end of the `with` block, the DBAPI connection referenced is released back to the connection pool
* The database doesn't see the connection as closed if the connection pool has room to store it for another use
* When the connection is returned to the pool, the pooling mechanism issues a `rollback()` call on the DBAPI connection so any transactional state or locks are removed, and the connection is ready for next use

## Using Transactions

* The `Connection` object provides a `Connection.begin()` method that returns a `Transaction` object
* Like the `Connection` object, the `Transaction` is usually used in a `with` block:

    ```Python
    with engine.connect() as connection:
        with connection.begin():
            r1 = connection.execute(table1.selecT())
            connection.execute(table1.insert(), {"col1": 7, "col2": "some data"})
    ```

* Simpler restating of the above, using `Engine.begin()`:
    
    ```Python
    # runs a transaction
    with engine.begin() as connection:
        r1 = connection.execute(table1.select())
        connection.execute(table1.insert(), {"col1": 7, "col2": "some data"})
    ```
