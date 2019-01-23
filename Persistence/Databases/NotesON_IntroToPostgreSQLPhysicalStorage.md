# Notes on Introduction to PostgreSQL Physical Storage

From [http://rachbelaid.com/introduction-to-postgres-physical-storage/](http://rachbelaid.com/introduction-to-postgres-physical-storage/)

* Written in 2015
* PG version was 9.5

## A bit of terminology

* tuple or item is equivalent to row
* relation is equivalent to table
* filenode - an id representing a reference to a table or index
* block or page - an 8kb segment of info in the file storing the table
* heap or heap file - unordered records of variable size, distinct from CS heap
* CTID - physical location of the row version within its table; also a special column available for every table but not visible unless specifically mentioned. Consists of a page number and the index of an item identifier
* OID - Object Identifier
* database cluster - storage area on disk, collection of databases managed by a single instance of a running database server
* VACUUM - PostgreSQL maintenance procedure

## Where is my database stored

* Data files used by the cluster are in the cluster's data directory
* `PGDATA` is the env var that stores that location
* For each database in the cluster, there is a subdirectory within `PGDATA/base` named after the database's OID in `pg_database`
* Queries to list the OID for each database in the cluster:

    ```SQL
    SELECT oid, datname FROM pg_database;

    SELECT oid, datname FROM pg_database WHERE datname = 'foo';
    ```

* Can also be done with the CLI command `oid2name`

## Where tables are stored


