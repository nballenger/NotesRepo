# Notes on Mastering PostgreSQL 10

By Hans-Jurgen Schonig; Packt Publishing, Jan. 2018; ISBN 9781788472296

# Understanding Transactions and Locking

## Working with PostgreSQL transactions

* Everything in PG is a transaction.
* For multi-statement transactions you have to wrap them in `BEGIN`/`COMMIT`
* You can use `ROLLBACK` in place of `COMMIT` to abort a transaction

### Handling Errors Inside a Transaction

* Only error-free transactions can be committed.
* An error is thrown at the point of the mistake, and a subsequent `COMMIT` will trigger a `ROLLBACK` of the entire transaction.

### Making use of SAVEPOINT

* It can be difficult to write long transactions with zero errors.
* A `SAVEPOINT` is a safe place inside a transaction that the application can return to in the event of an error.
* Example:

    ```SQL
    BEGIN;
    SELECT 1;
    SAVEPOINT a;
    SELECT 2 / 0;               <-- throws error, borks tx
    SELECT 2;                   <-- tx in abort state, command ignored
    ROLLBACK TO SAVEPOINT a;    <-- partial rollback to known good state
    SELECT 3;                   <-- works again
    COMMIT;
    ```

* You can use huge numbers of savepoints if necessary.
* To remove a savepoint, use `RELEASE SAVEPOINT a`

### Transactional DDLs

* Postgres lets you run DDL statements inside a transaction block.
* All DDL statements in PG are transactional (with some exceptions like `DROP DATABASE`, `CREATE/DROP TABLESPACE`, etc.)
* Example:

    ```SQL
    BEGIN;
    CREATE TABLE t_test (id int);
    ALTER TABLE t_test ALTER COLUMN id TYPE int8;
    \d              <-- t_test appears in table list
    ROLLBACK;
    \d              <-- t_test not in table list as tx was cancelled
    ```

## Understanding basic locking

* Tables can be read concurrently.
* Multi-Version Concurrency Control (MVCC) - "A transaction will see data only if it has been committed by the writing transaction prior to the initiation of the read transaction. One transaction cannot inspect the changes made by another active connection. A transaction can see only those changes that have already been committed."
* Reads and writes can therefore co-exist, as write transactions don't block read transactions.
* Concurrent write transactions execute in order

### Avoiding typical mistakes and explicit locking

## Making use of FOR SHARE and FOR UPDATE

## Understanding transaction isolation levels

## Observing deadlocks and similar issues

## Utilizing advisory locks

## Optimizing storage and managing cleanup

# Making Use of Indexes

## Understanding Simple Queries and the Cost Model

## Improving speed using clustered tables

## Understanding additional b-tree features

## Introducing operator classes

## Understanding PostgreSQL index types

## Achieving better answers with fuzzy searching

## Understanding full text search

