# Notes on Mastering PostgreSQL 13 - 4th Ed.

By Hans-Jurgen Schonig; Packt Publishing, Nov. 2020; ISBN 978-1-80056-749-8

# Understanding Transactions and Locking

## Working with PostgreSQL transactions

* Everything in PG is a transaction
* For multi-statement, you need `BEGIN; ... COMMIT;`
* You can end a tx with `COMMIT`, `COMMIT WORK`, `COMMIT TRANSACTION`, `END`
* Counterpart is `ROLLBACK` or `ABORT`
* `BEGIN` syntax:
    
    ```SQL
    BEGIN [ WORK | TRANSACTION ] [ transaction_mode [, ...] ]

    where transaction_mode is one of

        ISOLATION LEVEL { SERIALIZABLE | REPEATABLE READ | READ COMMITTED | READ UNCOMMITTED }
        READ WRITE | READ ONLY 
        [ NOT ] DEFERRABLE
    ```

* `COMMIT` syntax:

    ```SQL
    COMMIT [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
    ```

* If `AND CHAIN` is used, a new transaction is immediately started with the same transaction characteristics. Otherwise no new transaction is started.
* `ROLLBACK` syntax:

    ```SQL
    ROLLBACK [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
    ```

* Only error-free transactions can be committed.

### Making use of SAVEPOINT

* It can be hard to write long transactions without ever encountering a single error, so there are savepoints, which are safe places in transactions that the application can return to if something goes wrong

    ```SQL
    BEGIN;
    SELECT 1;
    SAVEPOINT a;
    SELECT 2/0;         <-- causes div zero error
    SELECT 2;           <-- commands ignored after error till end of tx block
    ROLLBACK TO SAVEPOINT a;
    SELECT 3;
    COMMIT;
    ```

* To remove a savepoint from inside a transaction, there's `RELEASE SAVEPOINT`:

    ```SQL
    RELEASE [ SAVEPOINT ] savepoint_name;
    ```

### Transactional DDLs

* You can run DDLs that change data structure inside a transaction block
* Most DDL statements are transactional in postgres

## Understanding Basic Locking

* Reads can occur concurrently.
* Reads and writes are done concurrently according to Multi-Version Concurrency Control (MVCC)
* A transaction only sees data committed before the start of the transaction.
* Concurrent writes are done sequentially, to prevent overwrites

### Avoiding typical mistakes and explicit locking

* Example issue--two transactions open, read a max id value, decide to explicitly insert the next value, both try and either you get a duplicate entry or a key failure.
* One fix is to use explicit table locking
* `LOCK` syntax:

    ```
    LOCK [ TABLE ] [ ONLY ] name [ * ] [, ...] [ IN lockmode MODE ] [ NOWAIT ]

    where lockmode is one of:

        ACCESS SHARE | ROW SHARE | ROW EXCLUSIVE | 
    ```
