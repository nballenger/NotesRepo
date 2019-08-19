# Notes on PostgreSQL Up and Running, 3rd Edition

By Leo S. Hsu, Regina O. Obe; O'Reilly Media, Nov. 2017

ISBN 9781491963418

# Chapter 1: The Basics

## PostgreSQL Database Objects

* Databases
* Schemas - next level of organization within a database. Most objects first belong to a schema, which belongs to a database.
* Tables / Relations - belong to a schema; inheritable; all table defs create an accompanying custom data type
* Views - saved queries that act like tables. In PG can be used for updates to the underlying data (requires a trigger for multi-table views)
* Extension - packages of functions, data types, casts, custom index types, tables, attribute variables, etc. When you enable extensions, you choose the schemas where their constituent objects will reside. Create a separate schema from the public one for housing extension objects. For an extension with many objects, create a new schema. Some dictate their installation schema.
* Functions - Custom or built-in functions, defined using Procedural Languages
* Languages - Three installed by default: SQL, PL/pgSQL, C. You can install them via extension or CREATE PROCEDURAL LANGUAGE.
* Operators - Symbolic aliases like =, &&, etc. for functions
* Foreign tables and foreign data wrappers - Virtual tables linked to data outside a PostgreSQL database. 
* Triggers and trigger functions - Fire-on-event functions
* Catalogs - system schemas that store PG builtin functions and metadata. Every database has two catalogs: `pg_catalog` that holds functions, tables, system views, casts, and types packaged with Postgres; `information_schema`, gives views exposing metadata
* Types - data types.
* Full text search
* Casts - data type conversions
* Sequences - controls the autoincrementation of a serial data type
* Rules - instructions to rewrite SQL prior to execution. Triggers work better.

# Chapter 2: Database Administration

## Config files

* `postgresql.conf` - general settings
* `pg_hba.conf` - access control
* `pg_ident.conf` - maps OS logins to postgresql roles
* Config file locations:

    ```
    SELECT name, setting
    FROM pg_settings 
    WHERE category = 'File Locations';
    ```

* Reloading config: `pg_ctl reload -D path/to/data/directory`
* Reload as superuser from logged in console: `SELECT pg_reload_conf();`
* Checking settings:

    ```
    SELECT name, context, unit, setting, boot_val, reset_val
    FROM pg_settings
    WHERE name IN ('listen_addresses', 'deadlock_timeout', 'shared_buffers',
                   'effective_cache_size', 'work_mem', 'maintenance_work_mem')
    ORDER BY context, name;
    ```

* Also:

    ```
    SELECT name, sourcefile, sourceline, setting, applied
    FROM pg_file_settings
    WHERE name IN ('listen_addresses', 'deadlock_timeout', 'shared_buffers',
                   'effective_cache_size', 'work_mem', 'maintenance_work_mem')
    ORDER BY name;
    ```

## Database Creation

* Minimum command to create a database: `CREATE DATABASE mydb;`
* Copies the `template1` database; can be done by any role with `CREATEDB`

### Template Databases

* Using another template: `CREATE DATABASE mydb TEMPLATE mytemplatedb;`
* You can use any database as a template
* You can mark any database as a template, though once you do it is not editable or deletable
* To make a database into a template:

    ```
    UPDATE pg_database
    SET datistemplate = TRUE
    WHERE datname = 'mydb';
    ```

* If you need to edit or drop a template db, set datistemplate to FALSE

### Using Schemas

* Create logical groupings within a database
* Objects must have unique names within a schema
* Schemas may be organized by roles
* Creating a schema for new extensions: `CREATE SCHEMA my_extensions;`
* Add it to the searchpath: `ALTER DATABASE mydb SET search_path='$user', public, my_extensions;`
* When you install extensions, make sure you indicate that they should belong to that schema

## Privileges

* Most privileges have a context--ALTER is meaningless without being scoped to a database object
* Some have no context, like CREATEDB and CREATE ROLE
* Creating a role and a database owned by it:

    ```
    CREATE ROLE mydb_admin LOGIN PASSWORD 'mypassword';
    CREATE DATABASE mydb WITH owner = mydb_admin;
    ```

* The GRANT command assigns privileges: `GRANT some_privilege TO some_role;`
* Notes about grants:
    * You must have the privilege you are granting.
    * Some privileges always remain with the owner of an object and cannot be granted away, like DROP and ALTER.
    * The owner of an object retains all privileges, though that ownership does not cascade to child objects.
    * In grants you can add WITH GRANT OPTION, which gives the grantee the right to grant their own privileges to others.
    * To grant privileges on all objects of a type, use ALL instead of an object name:

        ```
        GRANT SELECT, REFERENCES, TRIGGER
        ON ALL TABLES IN SCHEMA my_schema
        TO PUBLIC;
        ```

    * To grant privileges to all roles, use the PUBLIC alias as above.
    * Some privileges are granted to PUBLIC by default:
        * CONNECT
        * CREATE TEMP TABLE
        * EXECUTE
    * Consider revoking those with REVOKE:

        ```
        REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA my_schema FROM PUBLIC;
        ```

* Default Privileges
    * Setting defaults doesn't change existing objects
    * Example where you want all users to have EXECUTE and SELECT on any future tables and functions in a particular schema:

        ```
        GRANT USAGE ON SCHEMA my_schema TO PUBLIC;

        ALTER DEFAULT PRIVILEGES IN SCHEMA my_schema
        GRANT SELECT, REFERENCES ON TABLES TO PUBLIC;

        ALTER DEFAULT PRIVILEGES IN SCHEMA my_schema
        GRANT ALL ON TABLES TO mydb_admin WITH GRANT OPTION;

        ALTER DEFAULT PRIVILEGES IN SCHEMA my_schema
        GRANT SELECT, UPDATE ON SEQUENCES TO PUBLIC;

        ALTER DEFAULT PRIVILEGES IN SCHEMA my_schema
        GRANT ALL ON FUNCTIONS TO mydb_admin WITH GRANT OPTION;

        ALTER DEFAULT PRIVILEGES IN SCHEMA my_schema
        GRANT USAGE ON TYPES TO PUBLIC;
        ```
    
* Privilege idiosyncracies
    * Being the owner of a database does not give you access to all objects in it
    * After you grant privileges to tables and functions in a schema, don't forget to grant usage on the schema itself.

## Extensions

* Not all extensions need to be in all databases
* Install to your individual database on an as-needed basis
* If you want all your databases to have a set of extensions, create a template db
* Prune extensions you no longer need to avoid bloat.
* Show extensions installed in a database:

    ```
    SELECT name, default_version, installed_version, LEFT(comment,30) AS comment
    FROM pg_available_extensions
    WHERE installed_version IS NOT NULL
    ORDER BY name;
    ```

* To see all installed extensions, leave out `WHERE installed_version IS NOT NULL`
* To get more info about an extension: `\dx+ extensionname`
* Or use a query:

    ```
    SELECT pg_describe_object(D.classid, D.objid, 0) AS description
    FROM pg_catalog.pg_depend AS D INNER JOIN pg_catalog.pg_extension AS E
    ON D.refobjid = E.oid
    WHERE D.refclassid = 'pg_catalog.pg_extension'::pg_catalog.regclass
      AND deptype = 'e'
      AND E.extname = 'fuzzystrmatch';
    ```

* Extensions can include:
    * functions
    * tables
    * data types
    * casts
    * languages
    * operators
    * other object types
* Typically functions are the majority of the extension
* Installing extensions
    * Two steps: download and install to server, then install to database
    * Install to server:
        * Download binaries and libraries
        * copy binaries to `bin`
        * copy libraries to `lib`
        * copy script files to `share/extension`
    * Which makes it available for step 2, install to DB:
        * Use `CREATE EXTENSION` to install into each databases
        * `CREATE EXTENSION fuzzystrmatch;`
        * alternatively: `psql -p 5432 -d mydb -c "CREATE EXTENSION fuzzystrmatch;"
    * Note that C based extensions require superuser privileges to install.
    * It's good practice to create a schema to house extensions
    * Create the schema, then do `CREATE EXTENSION foo SCHEMA my_extensions;`
* Popular Extensions
    * `btree_gist` - gives GiST index operator classes that implement B-Tree equivalent behavior for common B-Tree services data types
    * `btree_gin` - gives GIN index operator classes that implement B-Tree equivalent behavior for common B-Tree serviced data types
    * `postgis` - spatial database extension
    * `fuzzystrmatch` - functions like `soundex`, `levenshtein`, metaphone algorithms
    * `hstore` - adds key-value pair storage and index support. In many cases replaced by the `jsonb` datatype
    * `pg_trgm` (trigram) - fuzzy string search library
    * `dblink` - lets you query a Postgres db on another server
    * `pgcrypto` - encryption tools

## Backup and Restore

* Ships with three utils for backup, in the postgres bin folder:
    * `pg_dump` - back up specific databases
    * `pg_dumpall` - back up all databases in plain text, plus server globals
    * `pg_basebackup` - system-level disk backup of all databases

## Managing Disk Storage with Tablespaces

* Tablespaces assign logical names to physical storage locations
* Initializing a cluster automatically creates two tablespaces:
    * `pg_default` - user data
    * `pg_global` - system data
* Those live in the same folder as the default data cluster

### Creating Tablespaces

Specify a logical name and a physical folder that the postgres service has full access to:

```
CREATE TABLESPACE secondary LOCATION '/usr/data/pgdata94_secondary';
```

### Moving Objects Among Tablespaces

To move all objects in the database to the secondary tablespace:

```
ALTER DATABASE mydb SET TABLESPACE secondary;
```

To move a table:

```
ALTER TABLE mytable SET TABLESPACE secondary;
```

To move a group of objects (Postgresql 9.4+):

```
ALTER TABLESPACE pg_default MOVE ALL TO secondary;
```

If the user running it is a superuser, moves all objects, otherwise all owned objects. During the move the database or table is locked.

## Verboten Practices

* This section is a list of common mistakes
* If you don't know what you did wrong, the logfile helps. Look for `pg_log` in the data folder or the root of the data folder.
* If the server shut down before a log entry could be written, the log won't help
* If the server won't restart, try `path/to/bin/pg_ctl -D my_pgsql_data_folder`

### Don't Delete PostgreSQL Core System Files and Binaries

* Manage the log files in `pg_log`, but don't delete the folder.
* Files in other folders (except `pg_xlog`) should NEVER be deleted. `pg_clog` is, for instance, the active commit log.
* `pg_xlog` stores transaction logs. Deleting files in teh root of that folder will screw with the process of synchronous replication, continuous archiving, etc. 

### Don't Grant Full OS Admin Privileges to the Postgres System Account

* Postgres does not need system admin access.
* The `postgres` account should always be created as a regular system user, with privileges just to the data cluster and any additional tablespace folders.
* You may need to give postgres read/write/delete to folders or executables outside the cluster. Scheduled jobs that execute batch files and foreign data wrappers that have foreign tables in files have this as a common practice. Use least permissions.

### Don't Set shared_buffers Too High

* You cannot set `shared_buffers` as high as your physical RAM.
* On some unix systems, `shared_buffers` cannot be higher than `SHMMAX`
* 9.3 changed how kernel memory is used, so this may not be as much of an issue

### Don't Try to Start PostgreSQL on a Port Already in Use

* You'll see log entries like `make sure PostgreSQL is not already running`
* Common causes:
    * You already started it
    * You're trying to run it on a port already in use by something else
    * The service crashed and you have an orphan `postgresql.pid` file in the data folder. Delete it and try again.
    * You have an orphaned PostgreSQL process. If nothing else works, try killing all running postgres processes and starting again.

# Chapter 3: psql

## Environment Variables

* `PSQL_HISTORY` - name of the history file, default is `~/.psql_history`
* `PSQLRC` - custom config file, overrides defaults

## Interactive vs Noninteractive psql

* `\?` - list of available commands
* `\h something` - like `apropos`
* Run noninteractively by writing a script and calling `psql myscript.sql`
* Scripts can have an unlimited mix of SQL and psql commands
* You can also pass one or more SQL statements surrounded by double quotes directly to psql
* Noninteractive mode doesn't have that many options:
    * `psql -f some_script_file` - executes that file
    * `psql -d postgresql_book -c "DROP TABLE IF EXISTS foo;"` - executes command against db
* You can embed interactive commands in scripts:

    ```
    \a
    \t
    \g create_script.sql
    SELECT
        'CREATE TABLE staging.factfinder_import (
            geo_id varchar(255), geo_id2 varchar(255), geo_display varchar(255),' ||
            array_to_string(array_ag('s' ||
            lpad(i::text,2,'0') || ' varchar(255,s' ||
            lpad(i::text,2,'0') || '_perc varchar(255)'),',') ||
        ');'
    FROM generate_series(1,51) As i;
    \o
    \i create_script.sql
    ```

* The above writes the create table to a file, then executes the file:
    * `\t` removes the headers from the output (short for `--tuples-only`)
    * `\a` gets rid of the extra breaking elements psql normally puts in
    * `\g` forces query output to be redirected to a file
    * `\o` without file args stops redirection of query results to file
    * `\i` executes the named script

## psql Customizations

* You can put config directives into `~/.psqlrc` (or wherever, using `PSQLRC` env var)
* It can include any psql commands
* Example file:

    ```
    \pset null 'NULL'
    \encoding latin1
    \set PROMPT1 '%n@%m:%>%x %/# '
    \pset pager always
    \timing on
    \set qstats92 '
        SELECT usename, datname, left(query,100) || ''...'' As query
        FROM pg_stat_activity WHERE state != ''idle'' ;
    '
    ```

* Each command has to be on a single line without breaks--examples in the book sometimes add line breaks for readability, but the last line above should be all in one
* To bypass the config file, start psql with `-X`
* You can change settings inside a session, but they will only be for the session. 
* To remove a config var or reset it to the default, use `\unset`
* Variables you set are case sensitive
* All caps for system options
* Lowercase for your own variables

### Custom Prompts

* Set with `\set PROMPT1` and a symbol string

### Timing executions

* `\timing on` makes all executions report their times

### Autocommit commands

* Autocommit is on by default; each command is its own transaction and is irreversible
* If you want a safety net for batches of commands, start with `\set AUTOCOMMIT off`
* That lets you execute commands, then issue `ROLLBACK;` or `COMMIT;`

### Shortcuts

* You can use `\set` to create keyboard shortcuts
* For instance, in `~..psqlrc`, do `\set eav 'EXPLAIN ANALYZE VERBOSE'`
* Then while working, type `:eav` (colon resolves the variable)

### Retrieving prior commands

* Up arrow recalls command history
* `HISTSIZE` determines number of commands to save
* To save to a file: `\set HISTFILE ~/.psql_history - :DBNAME`

## psql Gems

### Executing shell commands

* Call out to the shell with `\! some_cmd`

### Watching statements

* `\watch` lets you run a statement at fixed intervals so you can monitor the output
* Example of watching connection traffic every 10 seconds:

    ```
    SELECT datname, query
    FROM pg_stat_activity
    WHERE state = 'active' AND pid != pg_backend_pid();
    \watch 10
    ```

* Mostly for monitoring query output, but can also be used to execute statements at fixed intervals. This logs activity to a table every five seconds (the last statement is the subject of the watch call):

    ```
    SELECT * INTO log_activity FROM pg_stat_activity;
    INSERT INTO log_activity SELECT * FROM pg_stat_activity; \watch 5
    ```

* Kill a watch with `ctrl-x ctrl-c`

### Retrieving Details of Database Objects

* List tables whose names match a pattern: `\dt+ pg_catalog.pg_t*`
* Details on a particular object: `\d+ pg_ts_dict`

### Crosstabs

* `\crosstabview` simplifies crosstab queries
* Example:

    ```
    SELECT student, subject, AVG(score)::numeric(5,2) As avg_score
    FROM test_scores
    GROUP BY student, subject
    ORDER BY student, subject
    \crosstabview student subject avg_score
    ```

* Produces output like:

    ```
     student | algebra | calculus | chemistry | physics | scheme
    ---------+---------+----------+-----------+---------+--------
     alex    |   74.00 |    73.50 |     82.00 |   81.00 |
     leo     |   82.00 |    65.50 |     75.50 |   72.00 |
     regina  |   72.50 |    64.50 |     73.50 |   84.00 |  90.00
     sonia   |   76.50 |    67.50 |     84.00 |   72.00 |
    (4 rows)
    ```

* After the `\crosstabview` you should list three columns selected by the query, with an optional fourth column to control sorting.
* In the output, you get a table where the first column serves as a row header, the second column is a column header, and the last is the value that goes in each cell. 
* If you omit the column headers, your SELECT must request exactly three columns

### Dynamic SQL Execution

* In 9.6+, you can execute generated SQL directly (instead of outputting to file then running the file, or using `DO`), by using `\gexec`, which iterates through each cell of a query and executes the SQL in it.
* Iteration is by row then by column.
* It can't actually tell if each cell contains legitimate SQL, and it is oblivious to the result of the execution. If a cell errors, it just keeps going.
* Example of creating two tables and inserting one row:

    ```
    SELECT
        'CREATE TABLE ' || person.name || '( a integer, b integer)' As create,
        'INSERT INTO ' || person.name || ' VALUES(1,2) ' AS insert
    FROM (VALUES ('leo'), ('regina')) AS person (name) \gexec
    ```

* Getting metadata by querying `information_schema`:

    ```
    SELECT
    'SELECT ' || quote_literal(table_name) || ' AS table_name, COUNT(*) AS count FROM ' ||
    quote_ident(table_name) AS cnt_q
    FROM information_schema.tables
    WHERE table_name IN ('leo','regina') \gexec
    ```

## Importing and Exporting Data

* There's a `\copy` command to let you import data from and export data to a text file
* Default delimiter is tab, newline breaks separate rows

### psql Import

* Normal sequence is:
    * Create a staging schema to accept raw data
    * Write exploratory queries
    * Distribute data into normalized production tables
    * Delete the staging schema
* Staging table has to match file on columns and data types
* The entire import is a single transactions--on error, whole thing fails
* Example import via psql interactive session:

    ```
    \connect postgresql_book
    \cd /postgresql_book/ch03
    \copy staging.factfinder_import FROM somefile.csv CSV
    ```

* Nonstandard delimiter: `\copy sometable FROM somefile.txt DELIMITER '|';`
* Null replacement: `\copy sometable FROM somefile.txt NULL AS '';`
* Don't confuse `\copy` (a psql command) with `COPY` in SQL

### psql Export

* Example export:

    ```
    \connect postgresql_book
    \copy (SELECT * FROM staging.factfinder_import WHERE s01 ~ E'^[0-9]+' ) TO '/test.tab' WITH DELIMITER E'\t' CSV HEADER
    ```

* Default for exporting data without qualifications is tab delimited
* That does NOT export header columns, use `HEADER` option with CSV format:

    ```
    \connect postgresql_book
    \copy staging.factfinder_import TO '/test.csv' WITH CSV HEADER QUOTE '"' FORCE QUOTE *
    ```

* Using `FORCE QUOTE *` double quotes all columns (the default, included explicitly above for clarity)

### Copying from or to Program

* Since 9.3, PostgreSQL can get data from the output of CLI utils like curl, ls, wget
* Example of importing a directory using a windows `dir` command:

    ```
    \connect postgresql_book
    CREATE TABLE dir_list (filename text);
    \copy dir_list FROM PROGRAM 'dir C:\projects /b'
    ```

* See further examples here: https://www.depesz.com/2013/02/28/waiting-for-9-3-add-support-for-piping-copy-tofrom-an-external-program/

## Basic Reporting

* Using psql for basic html report generation:

    ```
    psql -d postgresql_book -H -c "
    SELECT category, COUNT(*) AS num_per_cat
    FROM pg_settings 
    WHERE category LIKE '%Query%'
    GROUP BY category
    ORDER BY category
    " -o test.html
    ```

* Outputting a fully qualified HTML document via script:

    ```
    \o settings_report.html
    \T 'cellspacing=0 cellpadding=0'
    \qecho '<html><head><style>H2{color:maroon}</style>'
    \qecho '<title>PostgreSQL Settings</title></head><body>'
    \qecho '<table><tr valign=''top''><td><h2>Planner Settings</h2>'
    \x on
    \t on
    \pset format html
    SELECT category,
    string_agg(name || '=' || setting, E'\n' ORDER BY name) AS settings
    FROM pg_settings
    WHERE category LIKE '%Planner%'
    GROUP BY category
    ORDER BY category
    \H
    \qecho '</td><td><h2>File Locations</h2>'
    \x off
    \t on
    \pset format html
    SELECT name, setting FROM pg_settings WHERE category = 'File Locations'
    ORDER BY name;
    \qecho '<h2>Memory Settings</h2>'
    SELECT name, setting, unit FROM pg_settings WHERE category ILIKE '%memory%'
    ORDER BY name;
    \qecho '</td></tr></table>'
    \qecho '</body></html>'
    \o
    ```

* Notes on the above:
    * `\o` redirects output to a file
    * `\x on` turns on expand mode, which repeats the column headers for each row, and outputs each column of each row as a separate row
    * `\t on` forces the queries to output as an HTML table
    * `string_agg` is being used to concatenate all properties in the same category into a single column
    * Because the second and third queries should output one table per row, there is `\x off` before those happen

# Chapter 4: Using pgAdmin

# Chapter 5: Data Types

## Numerics

* PostgreSQL has the regular stuff: integers, decimals, floats

### Serials

* Serial and bigserial are auto-incrementing integers
* Often used as primary keys
* Sometimes called 'autonumber'
* If you specify a column as serial, postgres first makes an integer column, then creates a sequence object named `table_name_column_name_seq` in the same schema as the table
* Then it sets the default of the new int column to read its value from the sequence
* Dropping the column also drops the sequence object
* The sequence type is a database asset, you can inspect and edit them with ALTER SEQUENCE
* You can create them separately with CREATE SEQUENCE
* You can use the same sequence across multiple tables
* Example:

    ```
    CREATE SEQUENCE s START 1;
    CREATE TABLE stuff(id bigint DEFAULT nextval('s') PRIMARY KEY, name text);
    ```

### Generate Series Function

* The `generate_series` function comes in two forms:
    * A numeric version, creates a sequence of integers incremented by some value
    * One that creates a sequence of dates or timestamps incremented by an interval
* Lets you mimic a for loop in SQL
* Example of the numeric way:

    ```
    SELECT x FROM generate_series(1,51,13) AS x;
    ```

## Textuals

* Three primitive textual types:
    * character / char
    * character varying / varchar
    * text
* Max length modifier for varchar is optional, without it the field acts mostly like text
* Differences appear when you connect with different drivers, which handle field types differently
* If you want to make your character types case insensitive, you have to override comparison operators that take case into consideration. That's easier for varchar than text.

### String Functions

* Common ones: `lpad`, `rpad`, `rtrim`, `ltrim`, `trim`, `btrim`, `substring`, concatenation with `||`

### Splitting strings into arrays, tables, or substrings

* `split_part` extracts an element from a delimited string:

    ```
    SELECT split_part('abc.123.z45', '.', 2) AS x;
    ```

* The above returns `123`
* `string_to_array` creates an array from a delimited string:

    ```
    SELECT unnest(string_to_array('abc.123.z45', '.')) AS x;
    ```

* The `unnest` function turns the array into a set of rows

### Regex and pattern matching

* You can use regex to return matches as tables or arrays, do replaces and updates
* It supports backrefs and other advanced regex operations
* Example to reformat a phone number with backrefs:

    ```
    SELECT regexp_replace(
    '6197306254',
    '([0-9]{3})([0-9]{3})([0-9]{4})',
    E'\(\\1\) \\2-\\3'
    ) AS x;
    ```

* You can use `regexp_replace`, `regexp_matches` (returns a string array with matches)
* You can also use a regex in `substring` calls, and with the tilde SIMILAR TO operators

## Temporals

* Supports normal temporal types, also time zones, handles DST conversions
* There's an `interval` type that does datetime arithmetic
* Understands inf and -inf
* At publication time, there were 9 temporal types
* All except `range` abide by ANSI SQL
* Types (time zone aware types change times if you change your server's time zone):
    * `date` - month, day, year, no time zone awareness, no hours, minutes, seconds
    * `time` or `time without time zone` - hours, minutes, seconds, no date or timezone
    * `timestamp` or `timestamp without time zone` - date and time, no time zone
    * `timestamptz` or `timestamp with time zone` - timezone aware timestamp, stored as UTC internally, display defaults to the timezone of the server, service config, database, user, or session.
    * `timetz` or `time with time zone` - time zone aware, no date
    * `interval` - duration in hours, days, months, minutes, etc. Useful for arithmetic.
    * `tsrange` - open and closed ranges of `timestamp with no time zone`
    * `tstzrange` - open and close ranges of `timestamp with timezone`
    * `daterange` - open and closed ranges of dates

### Time Zones: What They Are and Are Not
