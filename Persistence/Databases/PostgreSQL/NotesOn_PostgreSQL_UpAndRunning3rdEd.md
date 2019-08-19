# Notes on PostgreSQL: Up and Running, 3rd Ed.

by Leo S. Hsu, Regina O. Obe; O'Reilly Media, Nov. 2017

ISBN 9781491963418

# Chapter 1: The Basics

* Principal advice: don't treat the db as dumb storage, it has the potential to be a great application platform
* Not great for lightweight applications, has some overhead.

## PostgreSQL Database Objects

* Has more db objects than other RDBMSs
* Limited overview of objects to be aware of:
    * Databases
    * Schemas - part of ANSI SQL, next level of organiztion under db
    * Tables - inheritable, automatically represent a data type
    * Views - reusable queries that act like tables
    * Extension - adds modular functionality
    * Functions - custom and built in functions
    * Languages - three by default, SQL, PL/pgSQL, C. You can also add PL/Python, PL/V8 (javascript), PL/R, and others.
    * Operators - symbolic aliases for functions
    * Foreign tables and foreign data wrappers - linked to an outside source
    * Triggers and trigger functions - event based functionality
    * Catalogs - system schemas that store builtin functions and metadata. Every db has pg\_catalog for functions, tables, system views, casts, and types, and information\_schema, with views for metadata
    * Types - data types. Has basic and composite types. Every table defines a new composite type.
    * Full text search - natural language search
    * Casts - data type conversions
    * Sequences - autoincrement for serial data types
    * Rules - Instructions to rewrite sql prior to execution. Use triggers instead.

# Chapter 2: Database Administration

## Configuration Files

* Three main files:
    * `postgresql.conf` - general settings like memory allocation, default storage locations, IP addresses, etc.
    * `pg_hba.conf` - access control to the server
    * `pg_ident.conf` - if present, maps an authenticated OS login to a postgres user
* Under defaults, they all live in the main data folder
* Location can be found with this query as superuser:

        SELECT name, setting
        FROM pg_settings
        WHERE category = 'File Locations';

* Some settings require a restart, some require a reload only
* If the context is `postmaster` you need a restart, if the context is `user` a reload
* To reload via `pg_ctl`:

        pg_ctl reload -D path/to/data/directory

* Under RHEL, CentOS, Ubuntu, run a service reload: `service postgresql-9.5 reload`
* As a superuser, you can also call the `pg_reload_conf()` function
* To restart, you can stop and start the service with `service postgresql-9.5 restart` or `pg_ctl restart -D path/to/data/directory`
* You shouldn't edit `postgresql.conf` directly--add overrides to it in a file called `postgresql.auto.conf`
* To read settings by query, you look at the view named `pg_settings`:

        SELECT name, context, unit, setting, boot_val, reset_val
        FROM pg_settings
        WHERE name IN ('listen_addresses', 'deadlock_timeout', 'shared_buffers',
            'effective_cache_size', 'work_mem', 'maintenance_work_mem')
        ORDER BY context, name;

* 'context' here is the setting scope:
    * `user` context can be changed per user
    * `superuser` settings can only be changed by the SU
    * `postmaster` settings affect the entire server, require a restart
* `user` and `superuser` settings can be set for a DB, user, session, and function level
* Be careful when looking at memory settings, some are in 8K blocks, some are in kilobytes. Always look at the `unit` column to see which it is
* The `SHOW` command will show settings with units, as:

        SHOW shared_buffers;
        SHOW deadlock_timeout;
        SHOW all;

* There's a system view called `pg_file_settings` that tells you a setting and the source file it comes from, as well as whether it is in effect:

        SELECT name, sourcefile, sourceline, setting, applied
        FROM pg_file_settings
        WHERE name IN ('listen_addresses', 'deadlock_timeout', 'shared_buffers',
            'effective_cache_size', 'work_mem', 'maintenance_work_mem')
        ORDER BY name;

* Make sure these settings are correct, because they can prevent client connections:
    * `listen_addresses` - which IP to listen on
    * `port` - defaults to 5432
    * `max_connections`
    * `log_destination` - The format of the logfiles, defaults to 'stderr'. May be worth changing to 'csvlog', which is easier to export to analytics tools
* These settings affect performance, and should be tuned:
    * `shared_buffers` - amount of memory shared among all connections to store recently accessed pages. Should be fairly high, maybe as much as 25% of your RAM. Diminishing returns above 8GB.
    * `effective_cache_size` - estimate of how much memory postgres expects the OS to devote to it. Doesn't affect actual allocation, but the query planner uses the figure to guess about how to do its job. If you set this much lower than available RAM, the planner may not use indexes. Half your RAM is a good starting point.
    * `work_mem` - max memory allocated for each operation like sorting, hash join, table scan. Can be set at a very granular level.
    * `maintenance_work_mem` - total memory allocated for housekeeping, shouldn't be higher than 1GB
    * `max_parallel_workers_per_gather` - max number of parallel worker threads that can be spawned for each gather operation. Defaults to 0 (parallelism turned off). If you've got a multicore machine, you want to bump this up. Should be less than `max_worker_processes`, since parallel workers are a subset of max allowed processes.
* To change settings you can use the `ALTER SYSTEM` command:

        ALTER SYSTEM SET work_mem = '500MB';

* ALTER SYSTEM statements will make changes in `postgresql.auto.conf`
* If you have to track a bunch of settings, you can use `include` and `include_if_exists` statements in your main conf file to bring in modular conf files

## Managing Connections

* Get a list of recent connections and PIDs:

        SELECT * FROM pg_stat_activity;

* Cancel active queries for a specific connection (PID 1234):

        SELECT pg_cancel_backend(1234);

* Terminate a connection:

        SELECT pg_terminate_backend(1234);

* Killing multiple connections (all belonging to a role here):

        SELECT pg_terminate_backend(pid) 
        FROM pg_stat_activity
        WHERE usename = 'some_role';

* You can set some operational parameters at the server, db, user, session, or function level. Any queries that exceed the parameter will be automatically cancelled by the server. Setting something to 0 disables that parameter.
* Params you can set:
    * `deadlock_timeout` - amount of time a deadlocked query should wait before timing out, defaults to 1000ms
    * `statement_timeout` - amount of time a query can run before it is forced to cancel. If you have long running functions, set this in the definition of the function instead of globaly
    * `lock_timeout` - amount of time a query should wait for a lock before giving up, most useful for update queries
