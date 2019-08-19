# Notes on Learning PostgreSQL 10, Second Edition

By Andrey Volkov, Salahaldin Juba; Packt Publishing, Dec. 2017

ISBN 9781788392013

# Relational Databases

* CAP Theorem
    * Consistency
    * Availabilty
    * Partition tolerance
* ACID
    * Atomicity - transactions complete or roll back in their entirety
    * Consistency - db transitions from one valid state to another
    * Isolation - concurrent execution results in same state as serial
    * Durability - committed transactions can survive power loss or crashes
* BASE
    * Basically available
    * Soft state
    * Eventually consistent
* DB Types
    * KV store
    * Columnar store
    * Document
    * Graph
    * Relational
    * Object relational (user defined types and inheritance)
* SQL parts
    * DDL, data definition language, for structure
    * DML, data manipulation language, for retrieval
    * DCL, data control language, for access control
* Relational model parts
    * Relation
        * Tabular data form
        * Rows are 'tuples', have the same ordered attributes
        * Attributes have a domain, which is a type and name
    * Tuple - a finite set of ordered attributes
    * NULL - unknown and currently unknowable
    * Attribute - value with name and domain
        * Value should be atomic in formal relational model
    * Constraint - controls on data integrity, redundancy, validity
        * redundancy - no duplicate tuples in a relation
        * validity - domain constraints
        * integrity - relations in a database are linked
        * Constraint categories:
            * those inherited from relational model: domain integrity, entity integrity, referential integrity
            * semantic constraint, business rules, app specific constraints
    * Domain Integrity Constraint
        * ensures data validity
        * first determine the data type, then the check constraints
    * Entity integrity constraint
        * all tuples must be distinct within a relation

## Relational Algebra

* Formal language of the relational model
* Closed set of operations over relations (the result of each operation is a new relation)
* Operations in two groups:
    * Inherited from set theory: union, intersection, set difference, cartesian product / cross product
    * Specific to relational model: select, project, etc. Binary and unary ops.
* Primitive operators
    * SELECT - unary op with some logical predicate, produces relation consisting of tuples where the predicate holds true
    * PROJECT - unary op that slices the relation vertically, into attributes
    * CARTESIAN PRODUCT - join of all to all
    * UNION - combination of two compatible relations
    * DIFFERENCE - binary op on union compatible operands. Creates a new relation from the tuples which exist in one relation but not the other
    * RENAME - unary operation on attributes
* Also have aggregation functions like SUM, COUNT, MIN, MAX

## Select and Project operations

# PostgreSQL Basic Building Blocks

## Database Coding

* Database naming conventions
    * Book uses the following conventions:
        * Names of tables and views are not suffixed
        * DB object names are unique across the database
        * Identifiers are singulars, including table, view, column names
        * Underscore (snake case) used for compound names
        * PK name is table name with suffix `id`
        * Foreign key has name of referenced PK in the linked table
        * Internal postgres naming conventions used to rename PKs, FKs, sequences
* PostgreSQL identifiers
    * Object names must be 63 characters or fewer
    * PG follows ANSI SQL re: case sensitivity--non-quoted identifiers are case insensitive, quoted ones are case sensitive
    * PG identifier name constraints:
        * Must start with underscore or letter
        * can be letters, digits, underscore, and dollar sign (do not use)
        * Length between 1 and 63 characters
        * Don't use keywords as table names.
* Documentation
    * Syntax for comments:
        * single line starts with double dash, `--`
        * multi line between `/* ... */`
    * PG lets you store a db object description using `COMMENT ON`
* Version control system
    * Book proposes the following for seperating concerns in DB code:
        * For each DB in a cluster, maintain the DDL script for objects that are part of the physical schema, and the DML script (that populates the tables) together.
        * Store DDL for objects NOT part of the physical schema (like views and functions) seperate from the DDL for the tables.
        * Maintain the DCL script separately. (DCL = data control language, grant and revoke mostly)
* Database migration tool
    * You can do CI with something like Flywaydb.

## PostgreSQL objects hierarchy

* Databases, roles, tablespaces, settings, and template languages are at the same level of hierarchy.
* Template Databases
    * By default each created db is cloned from `template1`, which has tables, views, and functions that model relationships between user-defined database objects, and come from the system catalog schema `pg_catalog`.
    * Schemas are roughly like namespaces, used to organize db objects, functionality, security access, and prevent name collisions
    * PG comes with two template databases:
        * `template1` - default db to clone, can be modified to add to all newly created databases.
        * `template0` - safeguard or version db with several purposes:
            * If `template1` is corrupted, can be used to fix it
            * Useful when restoring a db dump. When a dev dumps a DB, all extensions are also dumped. If the extension is already in `template1`, it leads to a collision because the new db already contains the extensions.
            * Unlike `template1`, `template0` does not have encoding-specific or locale-specific data.
* User databases
    * A client connection can only access the data in a single database that was referenced in their connection string.
    * Exceptions to that include foreign data wrappers and `dblink` extensions
    * Every database has an owner and set of associated permissions for each role
    * Privileges on objects (databases, views, tables, sequences) are represented in the psql client as `<user>=<privileges>/granted by`
    * If the user part isn't there, the privileges are applied to the special PUBLIC role
    * `\l` lists all databases in the db cluster, with associated attributes
    * DB access privileges are:
        * create / `-C` - allows the role to create new schemas in the db
        * connect / `-c` - allows connecting to the db
        * temporary / `-T` - allows creating temp tables
    * The PUBLIC role can connect to `template1` by default
    * Each DB has an encoding
    * PG has attributes for other purposes, including:
        * Maintenance - `datfrozenxid` used to determine if vacuum is required
        * Storage management - `dattablespace` determines db tablespace
        * Concurrency - `datconnlimit` used to determine number of allowed conns
        * Protection - `datallowconn` disables connection to a database
    * `\c` in psql accepts a connection string, or a db name, to connect
* Roles
    * Roles belong to the server cluster, not a particular database
    * Can be a user or group
    * Attributes of roles:
        * Superuser - bypasses all permissions checks except login
        * Login - can connect to a database
        * Createdb - can create databases
        * Createrole - can create, delete roles
        * Replication - used for streaming replication
        * Password - can be used with `md5` auth method, has expiry policy settings
        * Connection limit - number of concurrent connections the user can initiate. Recommended to use connection pooling tools like pgpool-II or PgBouncer
        * Inherit - role inherits the privileges assigned to the roles it is a member of. Inherit is the default.
        * Bypassrls - allows bypass of row level security
    * During install, the `postgres` superuser role is created
    * `CREATE ROLE` is equivalent to `CREATE ROLE` with `LOGIN`
    * `CREATE GROUP` is equivalent to `CREATE ROLE` with `NOLOGIN`
    * A role can be a member of another role (non login / 'group' roles)
* Tablespace
    * A tablespace is a defined storage location for a database or db objects
    * Used to achieve:
        * Maintenance - disk storage issues
        * Optimization - placing heavy access items onto SSDs, etc.
    * `CREATE TABLESPACE` creates one.
* Template procedural languages
    * Used to register a new language
    * Two ways to create a programming language:
        * Specify only the name of the language - PG consults the programming language template and determines the parameters.
        * Specify the name and parameters.
    * Command to create is `CREATE LANGUAGE`
    * In 9.1+, you can use `CREATE EXTENSION` to install a PL
* Settings
    * Stored in `pg_settings`
    * Parameters may be:
        * Boolean: `0`, `1`, `true`, `false`, `on`, `off`, case insensitive
        * Integer: with an implicit unit for each setting
        * Enum: predefined values like `ERROR` and `WARNING`
        * Floating point
        * String
    * Setting context determines how to change a setting's value and when the change can take effect. Contexts are:
        * Internal - cannot be changed directly, probably a compile time thing
        * Postmaster - requires restart to change, mostly come from `postgresql.conf` file
        * Sighup - no restart required, new setting takes effect when server process is sent `SIGHUP`
        * Backend - no server restart, may be set per session
        * Superuser - may only be changed by superuser, can be changed in `postgresql.conf` or via `SET`
        * User - mostly for session local settings
    * `SET` and `SHOW` commands let you change/inspect settings parameters
    * Changing something in `postgresql.conf` typically makes the effect global
    * Settings can have local effects, may be applied to different contexts, like sessions and tables.
    * The `pg_reload_conf()` function or changes in the init script are typically better than sending `SIGHUP`, for safety reasons.
    * You can change the `postgresql.conf` file and issue `pg_reload_conf()` to pick up the changes for variables not requiring restart.
    * Developers typically are concerned with two categories of settings:
        * Client connection defaults
        * Query planning
* PostgreSQL high-level object interaction
    * A server can contain many:
        * databases
        * programming languages
        * roles
        * tablespaces
    * Each database has an owner and default tablespace
    * Each role can be granted permission to access or can own multiple dbs
    * To create a database, you have to specify the owner and encoding. If `template1` does not match the required encoding, `template0` should be used explicitly.
    * The example database from the book should have owner `car_portal_role` adn an encoding of `UTF-8`. Create commands:

        ```SQL
        CREATE ROLE car_portal_app LOGIN;
        CREATE DATABASE car_portal 
            ENCODING 'UTF-8' 
            LC_COLLATE 'en_US.UTF-8'
            LC_CTYPE 'en_US.UTF-8' 
            TEMPLATE template0 
            OWNER car_portal_app;
        ```

## PostgreSQL database components

* Schema
    * Contains all db named objects, including:
        * tables
        * views
        * functions
        * aggregates
        * indexes
        * sequences
        * triggers
        * data types
        * domains
        * ranges
    * By default there is a schema called `public` in the template databases
    * All new databases therefore have that schema
    * All users can access that schema implicitly
    * In multi-user / multi-db setups, remember to revoke the ability of users to create objects in the public schema, by running `REVOKE CREATE ON SCHEMA public FROM PUBLIC;` in the `template1` database
    * To access an object, use `schema_name.object_name`
    * If the `search_path` db setting does not contain that name, or if the dev likes to use fully qualified names, you have to use the full name.
    * Many developers prefer to use the unqualified name for expediency
    * The `search_path` setting is composed of schemas that are used by the server to search for the object.
    * The default search path is `$user, public`
    * If there is a schema with the same name as the user, it is searched first
    * Things not found in the search path throw errors.
* Schema usages
    * Used for:
        * Controlling authorization, grouping objects based on roles
        * Organizing database objects based on business logic
        * Maintaining third party SQL code via extensions
    * In the example db for the book, want to create a schema `car_portal_app` owned by `car_portal_app` role: `CREATE SCHEMA car_portal_app AUTHORIZATION car_portal_app;`
    * If you specify the schema name between `SCHEMA` and `AUTHORIZATION` it uses that, otherwise assumes the schema name is the same as the owner name, which comes last.
* Table
    * Tables can be of the following types:
        * Permanent - starts at create, persists until explicit drop
        * Temporary - dropped automatically at close of session
        * Unlogged - much faster operations, data not written to WAL files, not replicated
        * Child - inherits one or more tables. Often used with constraint exclusion to physically partition the data on disk, and to improve performance by retrieving subsets of data.
    * Summary of input to the create table command:
        * Table name
        * table type
        * storage parameters
        * columns, with data type, default values, constraints
        * cloned table name and options to clone the table
* PostgreSQL native data types
    * Balance between effiency and extensibility
    * There are numeric, character, date and time types
* Numeric types
    * `smallint` - 2 bytes, -32768 to 32767
    * `Int` - 4 bytes, -2.14M to 2.14M
    * `Bigint` - 8 bytes, real big numbers
    * numeric or decimal - variable storage, up to 131072 digits before decimal, 16383 after
    * real - 4 bytes, platform dependent range, has inf, -inf, NaN values
    * double - 8 bytes, platform dependent range, has inf, -inf, NaN values
    * `smallserial`, `serial`, `bigserial` are wrappers on top of int types, used typically as surrogate keys, not allowed to be null
    * Serial types use sequences, which are db objects that generate values based on a min, max, and increment
    * This code: `CREATE TABLE customer (customer_id SERIAL);` creates this code:

        ```SQL
        CREATE SEQUENCE customer_customer_id_seq;
        CREATE TABLE customer (
            customer_id integer NOT NULL DEFAULT nextval('customer_customer_id_seq')
        );
        ALTER SEQUENCE customer_customer_id_seq OWNED BY customer.Customer_id;
        ```

    * Things to remember about serial type columns:
        * A sequence is created at `table_col_seq`
        * A not null constraint is imposed on the column
        * The column has a default value generated by `nextval()`
        * sequence is owned by the column, so it is dropped automatically if the column is dropped
        * Common mistake with serials is forgetting grant permissions to the generated sequence, because the sequence has to be owned by the column.
    * The result of an integer operation is also an integer.
    * PG uses round half to even to cast a double to int
    * Use numeric and decimal types for financial data or stuff that needs precision
    * You can specify with numeric(precision, scale)
    * Operations on numeric types are slower than floats and doubles, so only use them when you must use specific precision
* Character types
    * `char` - like char(1)
    * `name` - like varchar(64), used by PG for object names
    * `char(n)` - fixed length char string of length n, up to 10485760
    * `Varchar(n)` - variable length character string, up to 10485760
    * `Text` - variable character, unlimited length
    * There's no difference in performance between character types, so recommended to use the `text` type.
* Date and time types
    * timestamp without time zone
    * timestamp with time zone
    * date
    * time without time zone
    * time with time zone
    * interval
    * All stored in UTC format
    * Two important, related settings:
        * time zone
        * date style
    * `pg_timezone_names` and `pg_timezone_abbrevs` views give list of zones
    * The `AT TIME ZONE` statement converts a timestamp to a specified time zone, behavior depending on the type of data. `SELECT now(), now()::timestamp, now() AT TIME ZONE 'CST';`
    * The interval data type is real important for handling timestamp ops and describing some business cases.

# PostgreSQL advanced building blocks

## Views

* Materialized query / wrapper around a specific SELECT
* Used for:
    * simplifying complex queries and increasing code modularity
    * tuning performance by caching view results
    * decreasing amount of SQL code
    * bridging the gap between relational databases and OO langauges
    * implementing authorization at row level by excluding rows from the view
    * implementing interfaces and abstraction layers between high level langauges and the db
    * implementing last minute changes
* In postgres, a view is internally modeled as a table with a `_RETURN` rule, so you could create a table and convert it to a view (though you shouldn't)
* Views have a dependency tree, so you can't drop or alter a view if another view depends on it

## View Synopsis

* Outline of the `CREATE VIEW` statement:

    ```
    CREATE [ OR REPLACE ] [ TEMP | TEMPORARY ] [ RECURSIVE ] VIEW name [ ( col_name [,...]) ]
        [ WITH (view_option_name [= view_option_value] [,...] ) ]
        AS query
        [ WITH [ CASCADED | LOCAL ] CHECK OPTION ]
    ```

## View Categories

* Temporary - dropped on user session end
* Recursive - Similar to recursive functions. Can write complex queries against hierarchical data
* Updatable - lets the user treat the view as a table, allows INSERT, UPDATE, DELETE
* Materialized - a table whose contents are periodically refreshed based on a query. More performant for long running source queries executed against static data.

## Materialized views

* Synopsis:

    ```
    CREATE MATERIALIZED VIEW [ IF NOT EXISTS ] table_name
        [ (column_name [, ...] ) ]
        [ WITH (storage_param [= value] [, ...] ) ]
        [ TABLESPACe tablespace_name ]
        AS query
        [ WITH [ NO ] DATA ]
    ```

* The `REFRESH MATERIALIZED VIEW` statement can populate the view

    ```
    REFRESH MATERIALIZED VIEW [ CONCURRENTLY ] name [ WITH [ NO ] DATA ]
    ```

* Refreshing views is a blocking statement, so concurrent selects will be blocked. If you refresh the view concurrently you allow access, but the materialized view should have a unique index.
* Typical uses:
    * Generating summary reports
    * caching the results of recurring queries
    * optimizing performance by processing data only once
* Since they're tables, they can be indexed.

## Updateable views

* By default simple views are auto updatable
* If the view is not updatable due to an underlying constraint, you can make it so with triggers and rules
* Conditions for having a table be automatically considered updatable:
    * View must be built on top of one table or an updatable view
    * Definition must not contain: `DISTINCT`, `WITH`, `GROUP BY`, `OFFSET`, `HAVING`, `LIMIT`, `UNION`, `EXCEPT`, `INTERSECT`
    * View's select list must be mapped to the underlying table directly, without functions or expressions, and columns in the select list cannot be repeated.
    * The `security_barrier` property must not be set
* You should specify `WITH CHECK OPTION` if some rows are excluded by the view, since without it the base table can be modified even in rows which are not shown by the view.

## Indexes

* Physical database object defined on one or more table columns
* In general used for:
    * Optimizing performance
    * Validating constraints across rows, like `UNIQUE`
* Synopsis of `CREATE INDEX`
    
    ```
    CREATE [ UNIQUE ] INDEX [ CONCURRENTLY ] [ [ IF NOT EXISTS name ] ON table_name [ USING method ]
        ( { column_name | ( expression ) } [ COLLATE collation ] [ opclass ] [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [,...] )
        [ WITH ( storage_param = value [,...] ) ]
        [ TABLESPACe tablespace_name ]
        [ WHERE predicate ]
    ```

* Index selectivity
    * Indexes aren't used on very small tables
    * You can see the query plan with `EXPLAIN`

TODO: Come back to this.



## Functions

* Out of the box, you can define functions in C, SQL, and PL/pgSQL
* PL/Tcl, PL/Python, and PL/Perl all come in the standard distribution, though must be enabled with CREATE EXTENSION or the `createlang` CLI utility
* Simplest way to create a language and make it accessible to all databases is to put it in template1, right after the cluster comes up.
* Creating a function in C
    * Four steps:
        1. Install the `postgresql-server-dev-$PGMAJOR` library
        1. Define a function in C, create a Makefile, compile it as a shared library `.so`
        1. Specify the location of the shared library containing the function, by either
            * Giving the absolute path to the lib when creating the function
            * OR copying the function-shared library created to the PostgreSQL library directory
        1. Create the function in the database with CREATE FUNCTION
    * Example Makefile:

        ```Makefile
        MODULES = fact

        PG_CONFIG = pg_config
        PGXS = $(shell $(PG_CONFIG) --pgxs)
        INCLUDEDIR = $(shell $(PG_CONFIG) --includedir-server)
        include $(PGXS)

        fact.so: fact.o
            cc -shared -o fact.so fact.o

        fact.o: fact.c
            cc -o fact.o -c fact.c $(CFLAGS) -I$(INCLUDEDIR)
        ```

    * Source for C function in fact.c:

        ```C
        #include "postgres.h"
        #include "fmgr.h"
        #ifdef PG_MODULE_MAGIC
        PG_MODULE_MAGIC;
        #endif
        Datum fact(PG_FUNCTION_ARGS);
        PG_FUNCTION_INFO_V1(fact);
        Datum
        fact(PG_FUNCTION_ARGS) {
        int32 fact = PG_GETARG_INT32(0);
        int32 count = 1, result = 1;
        for (count = 1; count <= fact; count++)
            result = result * count;
        PG_RETURN_INT32(result);
        }
        ```

    * Compilation and file copy:

        ```bash
        make -f Makefile
        sudo cp fact.so $(pg_config --pkglibdir)/
        ```

    * As a postgres user, create the function in the `template` library and test it:

        ```bash
        psql -d template1 -c "CREATE FUNCTION fact(INTEGER) RETURNS INTEGER AS 'fact', 'fact' LANGUAGE C STRICT;"
        psql -d template1 -c "SELECT fact(5);"
        ```

    * SQL example function:

        ```
        CREATE OR REPLACE FUNCTION is_updatable_view (text) RETURNS BOOLEAN AS
        $$
            SELECT is_insertable_into='YES' FROM information_schema.tables 
            WHERE table_type = 'VIEW' AND table_name = $1
        $$ LANGUAGE SQL;
        ```

    * PL/pgSQL functions can contain variable declaration, conditionals and loops, exception trapping, etc.

        ```
        CREATE OR REPLACE FUNCTION fact(fact INT) RETURNS INT AS
        $$
        DECLARE
            count INT = 1;
            result INT = 1;
        BEGIN
            FOR count IN 1..fact LOOP
                result = result* count;
            END LOOP;
            RETURN result;
        END;
        $$ LANGUAGE plpgsql;
        ```

* Function dependency
    * Be careful not to end up with dangling functions
    * Dependencies between functions not well maintained in the pg system catalog
    * Example that creates a dangling function in `test_dep_2`:

        ```
        CREATE OR REPLACE FUNCTION test_dep (INT) RETURNS INT AS $$
        BEGIN
            RETURN $1;
        END;
        $$ LANGUAGE plpgsql;
        CREATE OR REPLACE FUNCTION test_dep_2(INT) RETURNS INT AS $$
        BEGIN
            RETURN test_dep($1);
        END;
        $$ LANGUAGE plpgsql;
        DROP FUNCTION test_dep(int);
        ```

    * Invoking `test_dep_2` raises an error.
* PostgreSQL function categories
    * Functions are marked volatile by default if the volatility classification is not specified.
    * If the created function is not volatile, you should mark it stable or immutable, since that helps the query planner.
    * Three volatility classifications:
        * Volatile - can return a different result on successive calls even if the function argument did not change, or it can change data in the database.
        * Stable and Immutable - functions that cannot modify the database, and are guaranteed to return the same result for the same argument.
    * `random()` is by nature volatile
    * `round()` is immutable
    * `now()` is stable, since it always gives the same result within the statement or transaction
* PostgreSQL anonymous functions
    * The `DO` statement can execute anonymous code blocks.
    * Reduces the need to create shell script for administrative purposes.
    * Note that all postgres functions are transactional, so if you want to create indexes (for example), shell scripts are better
    * Example of creating a select only user, and then programmatically granting their permissions on each table:

        ```
        CREATE user select_only;

        DO $$
            DECLARE r record;
        BEGIN
            FOR r IN 
                SELECT table_schema, table_name FROM information_schema.tables 
                WHERE table_schema = 'car_portal_app' 
            LOOP
                EXECUTE 'GRANT SELECT ON ' || quote_ident(r.table_schema) || '.'|| 
                quote_ident(r.table_name) || ' TO select_only';
            END LOOP;
        END$$;
        ```

## User defined data types

* Two methods for implementing user defined data types:
    * `CREATE DOMAIN` - lets devs create a user defined type with constraints
    * `CREATE TYPE` - often used to create a composite type, and ENUM types
* Domain objects should have a unique name within the schema scope.
* First use case of domains is to use them for common patterns, like a text type that does not allow nulls or contain spaces:

    ```
    CREATE DOMAIN text_without_space_and_null AS TEXT NOT NULL CHECK (value != '\s');
    ```

* Another good use is to create distinct identifiers across several tables, by creating a sequence and wrapping it with a domain:

    ```
    CREATE SEQUENCe global_id_seq;
    CREATE DOMAIN global_serial INT DEFAULT NEXTVAL('global_id_seq') NOT NULL;
    ```

* If a new constraint is added to a domain, it causes all attributes using that domain to be validated against the new constraint. If you don't want that, you can suppress constraint validation on existing values and clean up table individually.
* Example that adds a constraint on the text length of `text_without_space_and_null`:

    ```
    ALTER DOMAIN text_without_space_and_null
    ADD CONSTRAINT text_without_space_and_null_length_chk check (length(value)<=15)
    NOT VALID;  # <-- this part causes existing values not to be validated
    ```

* After cleaning up the data manually, you'd want to run `ALTER DOMAIN ... VALIDATE CONSTRAINT`
* You can describe domains with the `\dD+` psql command
* Composite data types are really useful for creating functions, when the return type is a row of several values.
* This is a type that could handle that, and a function that uses it:

    ```
    CREATE TYPE seller_information 
    AS (seller_id INT, seller_name TEXT, number_of_advertisements BIGINT, total_rank float);
    
    CREATE OR REPLACE FUNCTION seller_information (account_id INT) RETURNS seller_information AS
    $$
    SELECT seller_account.seller_account_id, first_name || last_name as seller_name, 
            count(*), sum(rank)::float/count(*)
    FROM account 
        INNER JOIN seller_account ON account.account_id = seller_account.account_id
        LEFT JOIN advertisement ON advertisement.seller_account_id = seller_account.seller_account_id
        LEFT JOIN advertisement_rating ON advertisement.advertisement_id = advertisement_rating.advertisement_id
    WHERE account.account_id = $1
    GROUP BY seller_account.seller_account_id, first_name, last_name
    $$ LANGUAGE SQL;
    ```

* `CREATE TYPE` can also be used to define enum types, which reduce the number of joins needed for some queries

## Triggers and rule systems

* Triggers and rule systems perform functions on events
* They can't be defined on SELECT, except on `_RETURN`, which is used in views
* Rule System
    * Creating a rule either rewires the default rule or creates a new rule for an action on a table or view
    * It's based on C macros, so can give strange results if you use it with volatile functions or sequence functions
* Trigger System
    * Triggers call a function when an event happens on a table, view, or foreign table
    * Executed when any DML (data manipulation language) events happen, including:
        * `INSERT`
        * `UPDATE`
        * `DELETE`
        * `TRUNCATE`
    * Trigger synopsis:

        ```
        CREATE [ CONSTRAINT ] TRIGGER name { BEFORE | AFTER | INSTEAD OF } { event [ OR ... ] }
            ON table_name
            [ FROM referenced_table_name ]
            [ NOT DEFERRABLE | [ DEFERRABLE ] [ INITIALLY IMMEDIATE | INITIALLY DEFERRED ] ]
            [ REFERENCING { { OLD | NEW } TABLE [ AS ] transition_relation_name } [ ... ] ]
            [ FOR [ EACH ] { ROW | STATEMENT }
            [ WHEN ( condition ) ]
            EXECUTE PROCEDURE function_name ( arguments )

        Where event may be one of:

            INSERT
            UPDATE [ OF column_name [,...] ]
            DELETE
            TRUNCATE
        ```

    * The trigger time context is one of:
        * `BEFORE` - applied on tables only, applied before constraints are checked and the operation is performed. Useful for checking data constraints on several tables when it is not possible to model using referential integrity constraints.
        * `AFTER` - also tables only, fires after operation is performed. Useful for cascading changes to other tables.
        * `INSTEAD OF` - applied on views, makes them updatable
    * When a trigger is marked for each row, the trigger will be executed for each row affected by a CRUD op
    * A statement trigger is only executed once per operation.
    * If you supply a `WHEN` condition, only rows fulfilling the condition will be handled by the trigger.
