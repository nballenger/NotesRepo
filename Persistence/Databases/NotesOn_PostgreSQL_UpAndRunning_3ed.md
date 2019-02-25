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


