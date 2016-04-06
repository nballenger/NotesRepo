# Notes on Learning PostgreSQL

By Salahaldin Juba; Achim Vannahme; Andrey Volkov, Packt Publishing, 2015

ISBN 978-1-78398-918-8

## Chapter 1: Relational Databases

* Covers ACID, CAP, relational algebra, constraints, data modeling, ER
* Book uses a sample app that's a web portal for buying and selling cars
* Covers UML briefly

## Chapter 2: PostgreSQL in Action

### An overview of PostgreSQL

#### PostgreSQL history

* Was a UC Berkeley project, Ingres, '77 to '85
* '86 to '94, postgres
* 1995, Postgres95
* 1996, PostgreSQL, open source

#### The advantages of PostgreSQL

* Free/OSS, standards complaint, wide adoption, real stable, can do HA
* actively developed, well documented, bunch of extensions

#### PostgreSQL applications

* Main app domains are:
    * OLTP, online transactional processing -- lots of CRUD ops, real fast, good data integrity
    * OLAP, online analytical processing -- small requests but real complex
* Can be used out of the box for OLTP
* For OLAP there's lots of extensions, and foreign data wrappers are useful

#### PostgreSQL architecture

* Basic client/server model
* Forks a new process for each connection

##### PostgreSQL abstract architecture

* Server has roughly four subsystems:
    * Process manager - manages client connections, forking, terminating
    * Query processor - has a parser, a traffic cop, a utilities subsystem, a rewriter, and a planner
    * Utilities - maintenance, like claiming storage, updating stats, export/import
    * Storage manager - handles memory cache, disk buffers, storage allocation
* Most components can be configured

### PostgreSQL Capabilities

#### Replication

* Allows for high availability, load balancing, faster execution
* Out of the box supports streaming, master-slave replication
* Other open source solutions for different kinds of replication

#### Security

* Supports trust, password, LDAB, GSSAPI, SSPI, Kerberos, ident, RADUIS, certificate, and PAM authentication
* Security updates are minor updates, all patched at major releases
* Has database, table, view, function, sequence, and column level permissions

#### Extension

* Can be extended to support new data types
* `CREATE EXTENSION` loads extensions to the current database
* Allows internal functions to be written in SQL, C, PL/pgSQL, Perl, and Tcl
* External functions in Java, R, PHP, Ruby, and shell scripts

#### NoSQL Capabilities

* Has a JSON data type, Hstore for KV, and XML types

#### Foreign Data Wrapper

* You can have foreign data wrappers that act like tables but connect to external data sources

#### Performance

* Has granular locking at both table and row levels
* Has four index types, B-Tree, hash, generalized inverted index (GIN), and generalized search tree (GiST)
* Allows partial, unique, and multi-column indexes
* Allows indexes on expressions and operator classes
* Transparency commands like `EXPLAIN`, `ANALYSE`, `VACUUM`, `CLUSTER`
* Table structure can be inherited

#### Very rich SQL constructs

* Supports correlated and non-correlated subqueries
* Allows common table expression (CTE), window functions, recursive queries

### Installing PostgreSQL

* Covers ubuntu and windows installs

#### The PostgreSQL clients

* Ships with several client tools, including:
    * Wrappers around commands like `CREATE USER`
    * Backup and replication tools
    * Utilities for troubleshooting
* Has a number of environment variables supported by `libpq`, like `PGHOST`, `PGDATABASE`, `PGUSER`

##### The psql client

* Part of the binary distribution
* Very configurable
* Integrates with editors and pagers
* Has autocomplete and syntax help
* Can output in different formats like html, latex
* Bunch of stuff available via `\d+ [pattern]`, which describes a relation
* `\df+ [pattern]` describes a function
* `\z [pattern]` shows relation acccess privileges
* Has numerous command line flags
* Can send CLI options to the server at run time via `PGOPTIONS`
* Shell scripting flags to the `psql` executable:
    * `-A` - don't align output
    * `-q` - quiet
    * `-t` - write tuples only, no headers
    * `-X` - ignore the config in `~/.psqlrc`
    * `-o` - output the query to a location
    * `-F` - sets the field separator between fields
    * `PGOPTIONS` env var - string of command line options* 

##### Psql advanced settings

* User prefs go in a `psqlrc` file
* You can set `PROMPT1` and `PROMPT2` with `\set`
* Prompt substitutions:
    * `%M` - full host name
    * `%>` - postgresql port number
    * `%n` - session user name
    * `%/` - current database name
    * `%R` - subs in `=`, if disconnected subs `!`
    * `%#` - superuser aware prompt
    * `%x` - transaction status, `*` indicates the block, `!` indicates failed block
* You can also assign arbitrary commands to variables with `\set`, for example `\set myquery 'select 1;'`
* You can sub in vars with `:`, as in `:myquery`
* Example:

```
\set activity 'select datname, pid, usename, application_name, query, state from pg_stat_activity;'

:activity
```

* To control statement and transaction execution, you get three vars
    * `ON_ERROR_STOP` - if set to `OFF`, ignores errors
    * `ON_ERROR_ROLLBACK` - rolls back a block if an error happens inside
    * `AUTOCOMMIT` - any statement outside a transaction, committed implicitly
* Using `\timing` shows query execution time
* `\pset null 'NULL'` - displays null as `NULL`

##### PostgreSQL utility tools

* `dropdb`
* `createdb`
* `dropuser`
* `createuser`
* `droplang`
* `createlang`
* `clusterdb`
* `reindexdb`

##### Backup and replication

* `pg_dump`
* `pg_dumpall`
* `pg_restore`
* `pg_basebackup`
* `pg_receivexlog`

##### Utilities

* `pg_config`
* `pg_isready`
* `vacuumdb`

## Chapter 3: PostgreSQL Basic Building Blocks

### Database Coding

#### Database naming conventions

* Book uses the following conventions:
    * Names of tables and views are not suffixed
    * DB object names are unique across the db
    * Identifiers are singulars including table, view, and column names
    * Underscore used for compound names
    * Primary key is table name plus suffix "id"
    * Foreign key has the same name as its referenced primary key
    * Use internal naming conventions of PostgreSQL to rename primary keys, foreign keys, and sequences

#### PostgreSQL Identifiers

* Object name length is 63 characters
* Follows ANSI SQL for case sensitivity
* Constraints:
    * Must start with underscore or letter
    * Allowed chars are letters, digits, underscores, dollar sign (not recommended)
    * Min length is 1, max is 63

#### Documentation 

* Single line comments start with `--`
* Multiline are between `/* ... */`
* You can store a db object description via `COMMENT ON`

### PostgreSQL Objects Hierarchy

* Top level components of the server:
    * template databases
    * user databases
    * roles
    * tablespaces
    * settings
    * template programming / procedural languages

#### Template databases

* By default a database is cloned from a template db named `template1` on creation
* The tables, views, and functions there are part of the system catalog schema, `pg_catalog`
* The schema is similar to namespaces in OO programming languages
* There are two template databases:
    * `template1`
        * default db
        * can be modified to allow global modification of all new databases
    * `template0`
        * safeguard / version database
        * If `template1` is corrupted by a user, `template0` can fix it
        * Handy when restoring a db dump; if a dev dumps a db, it dumps the extensions too. If an extension is already in `template1` you get a collision on recreation, so you can use `template0` instead
        * Contains no encoding-specific or locale-specific data
* You can also use a user database as a template database

#### User databases

* A client connection to a server can only access the database specified in its connection string
* Data is not shared between databases except via foreign data wrapper or dblink connections
* Every database has an owner and a set of permissions to control actions for a particular role
* Privileges on objects (databases, views, tables, sequences) are represented in the psql client as `<user>=<privileges>/granted by`
* If the user part is missing, the privs are for the `PUBLIC` role
* The `\l` command lists all databases in the cluster
* Access privileges are as follows:
    * `-C` - create new schemas in the database
    * `-c` - connect to the database
    * `-T` - can create temp tables
* The `\c` command connects to a database and closes the current connection
* The catalog tables are useful for automating some tasks like checking for name collisions, duplicate indexes, missing constraints, etc.
* You _can_ alter the catalog tables manually, but you shouldn't.

#### Roles

* Roles belong to the cluster, not to a specific database
* Role can either be a user or a group
* Roles have attributes:
    * super user - can bypass all checks except login check
    * login - can be used by a client to connect to a database
    * create database - can create databases
    * initiating replication - can do streaming replication
    * password - can be used with the `md5` auth method
    * connection limit - number of concurrent sessions user can initiate
    * inherit - if specified, inherits the privileges of the rules it is a member of
* `CREATE USER` is equivalent to `CREATE ROLE` with `LOGIN`
* `CREATE GROUP` is equivalent to `CREATE ROLE` with `NOLOGIN`
* A role can be a member of another role to simplify access and management:
    * Create a group role with no login, that has access to db objects
    * create user roles with login, make them members of the group role

#### Tablespace

* Defined storage for a database or database objects
* Used by admins for:
    * Maintenance: if you run out of space on a partition, you can move to tablespace on another disk
    * Optimization: heavily accessed data could be put on an SSD
* Command for it is `CREATE TABLESPACE`

#### Template Procedural Languages

* You can register a programming language with `CREATE LANGUAGE`

#### Settings

* Setting names are case insensitive
* Values can be:
    * boolean - 0, 1, true, false, on, off
    * integer
    * enum - predefined values like `ERROR` or `WARNING`
    * float
    * string
* Settings have a context that determines when the change can take effect
* Contexts are:
    * internal - cannot be changed directly, requires recompile or restart
    * postmaster - requires a restart, stored in the conf file
    * sighup - no restart, amend the conf file and send `SIGHUP` to the server process
    * backend - no restart, can also be set for a session
    * superuser - only changeable by the superuser
    * user - usually session local values
* Settings are changed with `SET` and shown with `SHOW`
* You can reload settings in a running server with the `pg_reload_conf()` function

### PostgreSQL high level object interaction

* A server can have many databases, programming languages, roles, and tablespaces
* Each database has an owner and a default tablespace
* A role can have permissions on multiple databases
* To create a database you must specify the owner and the encoding. If `template1` does not match the encoding, use `template0` explicitly
* Example:

```
CREATE ROLE car_portal_role LOGIN;
CREATE DATABASE car_portal
  ENCODING 'UTF-8' 
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8'
  TEMPLATE template0
  OWNER car_portal_app;
```

### PostgreSQL Database Components

#### Schema

* Schema contains all the database named objects, including:
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
* For multiuser and multidatabase setups, revoke the ability for all users to create objects in the public schema with `REVOKE CREATE ON SCHEMA public FROM PUBLIC;`
* For a user to access an object, he must specify the schema name and object name separated by a period
* At any time you have a `search_path` which may or may not contain the names of the objects you're trying to access
* You can address objects by their fully qualified name
* If you use the unqualified name (no schema prepended), the server will look in the `search_path` schemas
* Default search path is `$user,public`, and shown with `SHOW search_path;`
* Schemas are used for the following:
    * Control authorization - you can group objects based on roles
    * Organize database objects - group by business logic
    * Maintain third party SQL code - extensions in separate schemas is cleaner
* Example:

```
CREATE SCHEMA car_portal_app AUTHORIZATION car_portal_app;
-- Schema owner is the same as schema name if not given
CREATE SCHEMA AUTHORIZATION car_portal_app;
```

#### Table

* You can create multiple kinds of table, or materialize the results of a select into a table
* Table types:
    * permanent - exists from create to drop
    * temporary - exists from create to end of current user session
    * unlogged - data is not written to WAL files; not crash safe; very fast
    * child - inherits from one or more tables
* Normal inputs required on table create:
    * table name
    * table type
    * storage parameters
    * columns with datatype, default, and constraint
    * cloned table name, and options to clone the table

##### PostgreSQL native data types

* When picking a data type for a column, consider:
    * Can it be extended without a full table rewrite and table scan?
    * Is choosing an overbroad type going to have big storage impacts?

##### Numeric types

* Available numeric types:
    * `smallint` - 2 bytes
    * `int` - 4 bytes
    * `Bigint` - 8 bytes
    * `Numeric` or `decimal` - variable size
    * `real`
    * `double`
* Result of an integer operation is itself an integer
* Postgres rounds off numbers when casting double to int
* You can set precision and scale on numeric/decimal types
* Operations on numeric/decimal types are slower than floats and doubles

##### Character Types

* Available character types:
    * `char` - max length 1
    * `name` - used as internal datatype for object names
    * `char(n)` - fixed length character string
    * `Varchar(n)` - variable length up to n
    * `Text` - unlimited length
* For `char` and `varchar` types, a string longer than `n` will cause:
    * an error to be raised on insert or update, unless the overflow is all spaces
    * during casting, extra characters are truncated without erroring
* There is no difference in performance between the character types
* If you always use `text` types, you never worry about extensability

##### Date and time types

* Timestamps are stored in UTC format with time zone
* Time can be stored without timezone

## Chapter 4: PostgreSQL Advanced Building Blocks

### Views

* A view is like a named query, or a wrapper for a `SELECT`
* The views dependency tree is maintained in the database, so altering views may be forbidden due to cascading effects
* View dependencies can be very expensive, consider migrating business logic to the app
* Views are internally modeled as a table with a `_RETURN` rule
* These are equivalent:

```
CREATE VIEW test AS SELECT 1 AS one;

CREATE TABLE test (one INTEGER);
CREATE RULE "_RETURN" AS ON SELECT TO test DO INSTEAD SELECT 1;
```

* When selecting from a view, you are actually executing a nested query

#### View synopsis

```
CREATE [ OR REPLACe ] [ TEMP | TEMORARY ] [ RECURSIVE ]
VIEW name [ ( column_name [,...] ) ]
    [ WITH ( view_option_name [= view_option_value] [,...] ) ]
    AS query
    [ WITH [ CASCADED | LOCAL ] CHECK OPTION ]
```

Examples:

```
CREATE VIEW account_information AS
SELECT account_id, first_name, last_name, email
FROM account;

-- Same, but with different named columns in the view:
CREATE VIEW account_information 
(account_id, first_name, last_name, email) AS
SELECT account_id, first_name, last_name, email FROM account;
```

#### Views categories

* Can be categorized based on usage as:
    * temporary - drops at close of session
    * recursive - for very complex queries on hierarchical data
    * updatable - allow the user to see the view as a table, and run `INSERT`, `UPDATE`, `DELETE`
    * materialized - table whose contents are periodically refreshed based on a query

#### Materialized Views

```
CREATE MATERIALIZED VIEW table_name
    [ (column_name [,...] ) ]
    [ WITH ( storage_parameter [= value] [,...] ) ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
```

* You can either fill with data on create or not
* To refill you can use `REFRESH MATERIALIZED VIEW test_mat_view;`
* Can be indexed since they're tables

#### Updatable Views

* By default simple views are auto updatable, allowing `DELETE`, `INSERT`, `UPDATE`
* Automatically updatable views are created if:
    * view is built on top of a table or updatable view
    * view def cannot have these clauses at the top level: `DISTINCT`, `WITH`, `GROUP BY`, `OFFSET`, `HAVING`, `LIMIT`, `UNION`, `EXCEPT`, `INTERSECT`
    * View's select list is mapped to the underlying table directly without functions or expressions, and no columns are repeated
    * The `security_barrier` property is not set

### Indexes

* A physical database object defined on a table column or list of columns
* In general can be used to:
    * optimize performance
    * validate constraints instead of checking constraints

#### Index types

* b-tree - default, stands for 'balanced tree'; can be used for equality, ranges, and null predicates; supports all data types
* hash - not well supported; not transaction safe; not replicated during streaming; useful for equality predicates, but a b-tree is preferred
* generalized inverted (GIN) - useful when several values need to map to one row; can be used with complex data structures like arrays, and with full text searches
* generalized search tree (GiST) - allows building of general balanced tree structures, useful in indexing geometric data types and full text search
* block range (BRIN) - new in 9.5, useful for very large tables where size is limited

#### Partial Indexes

* Indexes only a subset of the data that meets a predicate condition
* Uses the `WHERE` clause to isolate rows
* Example:

```
ALTER TABLE advertisement
ADD COLUMN advertisement_deletion_date TIMESTAMP WITH TIME ZONE;

CREATE INDEX ON advertisement(advertisement_id) WHERE
advertisement_deletion_date IS NOT NULL;
```

#### Indexes on expressions

* Indexes can be created on expressions and function results
* Example:

```
CREATE INDEX ON account(lower(first_name));

SELECT * FROM account WHERE lower(first_name) = 'foo';
```

#### Unique Indexes

* Guarantees uniqueness across the table
* Suffix for unique indexes is `key`, for index it's `idx`
* You can create unique and partial indexes together
* Ex: each employee must have a supervisor except the company head:

```
CREATE TABLE employee (employee_id INT PRIMARY KEY, supervisor_id INT);

ALTER TABLE employee
ADD CONSTRAINT supervisor_id_fkey
FOREIGN KEY (supervisor_id) REFERENCES employee(employee_id);

-- Assure only one row is assigned to a supervisor:
CREATE UNIQUE INDEX ON employee ((1)) WHERE supervisor_id IS NULL;
```

* In the above, a unique index on a constant expression (1) allows only one row with a null value. A second attempt to add a row with a null value will cause an error because 1 is already indexed.

#### Multicolumn Indexes

* Can be used for a certain pattern of query conditions
* Only b-tree, GIN, and GiST support multicolumn
* Column order in a multicolumn index is important
* Can be used if the leftmost columns are used with equality and inequality expressions
* Planner may prefer a sequential scan, because multicolumn indexes are often quite large

#### Best practices on indexes

* Often useful to index columns with predicates and foreign keys, to allow index scan on join
* There are catalog tables and functions that help in maintaining indexes
* `pg_stat_all_indexes` gives statistics about index usage
* `pg_index_size` can be used with `pg_size_pretty` to get human readable index size
* Make sure indexes don't exist before creating, or you may create a duplicate index
* The `REINDEX` command rebuilds the index, but is a blocking command
* Example of non-locking rebuild: `CREATE INDEX concurrently a_index_1 ON a(id);`

### Functions

#### PostgreSQL native programming languages

* Supports user defined functions in C, SQL, PL/pgSQL out of the box
* Can also add PL/Tcl, PL/Python, PL/Perl via `CREATE EXTENSION` or `createlang`

##### Creating a function in the C language

* Four steps to create a factorial function:
    1. Install the PostgreSQL server development library
    1. Define the function in C, create a make file, compile it as a shared library
    1. Specify the location of the shared library that contains the function
    1. Create the function in the database using `CREATE FUNCTION`
* Makefile for the function:

```
MODULES = fact

PG_CONFIG = pg_config
PGXS = $(shell $(PG_CONFIG --pgxs)
INCLUDEDIR = $(shell $(PG_CONFIG) --includedir-server)
include $(PGXS)

fact.so: fact.o
  cc -shared -o fact.so fact.o

fact.o: fact.c
  cc -o fact.o -c fact.c $(CFLAGS) -I$(INCLUDEDIR)
```

Source code of the function:

```
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

Compilation is via `make -f makefile`

##### Creating functions in the SQL language

Determines if a view is updatable or not:

```
CREATE OR REPLACE FUNCTION is_updatable_view (text)
RETURNS BOOLEAN AS
$$
  SELECT is_insertable_into='YES' FROM
  information_schema.tables WHERE table_type = 'VIEW' and table_name = $1
$$
LANGUAGE SQL;
```

##### Creating a function in the PL/pgSQL language

Factorial again:

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
$$
LANGUAGE plpgsql;
```

#### PostgreSQL function usages

* For complex logic difficult to perform with SQL
* In dynamic SQL a function arg can pass table and view names via `EXECUTE`
* Performing actions before or after a statement via triggers
* Performing exception handling and additional logging via `EXCEPTION` and `RAISE`
* Cleaning SQL by reusing common code, bundling code into modules

#### PostgreSQL function dependency

* You need to be careful not to end up with dangling functions
* Dependency between functions is not well maintained in hte system catalog
* Example of creating a dangling function:

```
CREATE OR REPLACe FUNCTION test_dep (INT) RETURNS INT AS $$
BEGIN
RETURN $1;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACe FUNCTION test_dep_2(INT) RETURNS INT AS $$
BEGIN
RETURN test_dep($1);
END;
$$
LANGUAGE plpgsql;

DROP FUNCTION test_dep(int);

SELECT test_dep_2(5);

-- The above call generates an error due to a missing dependency.
```

#### PostgreSQL function categories

* A function is marked as 'volatile' by default if no volatility is specified
* If the function is stable or immutable, it's important to mark it that way, because it helps the optimizer
* Functions can have one of three volatility classifications:
    * volatile - can return a different result on successive calls even with the same argument, or it can change the data in the database
    * stable - cannot modify the database, guaranteed to return the same result for a given argument within the scope of a statement
    * immutable - cannot modify the database, returns the same result for the same input globally

#### PostgreSQL anonymous functions

* The `DO` statment allows execution of anonymous code blocks
* Example:

```
CREATE user select_only;

DO $$DECLARE r record;
BEGIN
    FOR r in SELECT table_schema, table_name 
    FROM information_schema.tables
    WHERE table_schema = 'car_portal_app'
    LOOP
        EXECUTE 'GRANT SELECT ON ' || quote_ident(r.table_schema) || '.' ||
          quote_ident(r.table_name) }} ' TO select_only';
    END LOOP;
END$$;
DO
```

### PostgreSQL user-defined data types

* Two methods for creating user define data types:
    * `CREATE DOMAIN` - allows creation of a user defined data type with constraints
    * `CREATE TYPE` - often used to create a composite type

TODO: Flesh this out

### Triggers and rule systems

TODO: Flesh this out

## Chapter 5: SQL Language

* Chapter is about Data Manipulation Language (DML)
* Covers fundamentals, lexical structure, SELECT/UPDATE/DELETE

### SQL fundamentals

* Three main parts of the language:
    * Data definition language (DDL) - create and manage structure of the data
    * Data manipulation language (DML) - manage the data itself
    * Data control language (DCL) - control access to the data
* SQL is a declarative language, since you define the format you want data to be produced in and let the database fulfill that

#### SQL lexical structure

* 'Statements' can be executed by the database engine
* They're terminated by a semicolon or end of input
* SQL statements may contain:
    * keywords to determine what you're asking the db to do
    * Identifiers referring to database objects
    * Constants as part of expressions
    * Operators determining how data is processed
    * Special characters with meaning outside of being an operator
    * white space
    * Comments
* SQL is not case sensitive
* Keywords and identifiers can contain letters, digits, underscores, dollar signs
* They may not start with a digit or dollar sign
* Normally keywords are uppercased
* Constants/literals can be numbers, strings, or bitstrings, or other types if explicitly typed
* Numeric constants: `1, 1.2, 0.3, .5, 1e15, 12.65e-6`
* String constants must be quoted:
    * Single quoted constants are as per the SQL standard
    * A single quote inside a string should be doubled as `''`
    * Putting an `E` before a string makes it possible to use C-style backslash escaped chars
    * Putting a `U&amp;` before a string lets you use unicode characters by code
* Examples: `'a', 'aa''aa', E'aa\naa', $$aa'aa$$, U&'\041C\0418\0420'`
* Dollar quoted string constants always have the same value as written, with no escape sequences
* Dollar quoted strings can have their names within the dollar signs, allowing reuse:

```
SELECT $str1$SELECT $$dollar-quoted string$$;$str1$;

-- produces the output
-- SELECT $$dollar-quoted string$$;
```

* Bit strings are preceded by `B` and can only contain `0` or `1`: `B'0101010'`
* Alternatively, you can precede them with `X` and use hex: `X'AB21'::int`
* Operators are used with one or two expressions, returning a value
* Special characters that are not themselves operators:
    * `()` - control precedence of a series of operations, or group expressions
    * `[]` - select elements from an array
    * `:` - access parts of arrays
    * `::` - type casting
    * `,` - separate elements of a list
    * `.` - separate fully qualified name parts
    * `;` - terminate a statement
    * `*` - all fields of a table or elements of a composite value

### Querying data with SELECT

#### The structure of the SELECT query

Simplified syntax diagram:

```
SELECT [ DISTINCT | ALL ]
  <expression>[[AS] <output_name>][, ...]
[FROM <table>[, <table>... | <JOIN clause> ... ]
[WHERE <condition>]
[GROUP BY <expression>|<output_name>|<output_number> [, ...]]
[HAVING <condition>]
[ORDER BY <expression>|<output_name>|<output_number> [ASC | DESC] [NULLS FIRST | LAST] [,...]]
[OFFSET <expression>]
[LIMIT <expression>];
```

Logical sequence of operations for SELECT:

1. If there are subqueries in the FROM, execute those first
1. Take all records from all source tables
1. Build all possible combinations of those records
    * Discard combinations that do not meet the JOIN conditions OR
    * Set some fields to NULL for OUTER JOINs
1. Filter out combinations that do not match the WHERE conditions
1. Build groups based on values of the GROUP BY list
1. Filter groups that match the HAVING conditions
1. Evaluate expressions of the select list
1. Eliminate duplicate rows if DISTINCT is specified
1. Apply set operations UNION, EXCEPT, INTERSECT
1. Sort rows according to the ORDER BY
1. Discard records according to OFFSET and LIMIT

The above is optimized where possible, as with using LIMIT to retrieve only some data.

#### Select-list

* The list of fields or expressions after SELECT is the 'select-list'
* When names for fields/expressions are not provided in the query, the db assigns them
* The AS keyword lets you provide names, though its use is optional
*
