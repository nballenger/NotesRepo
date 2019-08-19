# Notes on Troubleshooting PostgreSQL

By Hans-Jurgen Schonig, Packt Publishing 2015
ISBN 978-1-78355-532-1

## Chapter 5: Getting Transactions and Locking Right

### The PostgreSQL transaction model

* Transaction blocks are bounded by `BEGIN` and `COMMIT`
* All statements in a block must be correct
* Ex: `BEGIN; SELECT now(); COMMIT;`, which returns the transaction time
* The transaction will roll back if it contains errors

#### Understanding Savepoints

* A savepoint lets you jump back inside a transaction
* Can be used to avoid errors and ensure success
* In this example, after the initial `SELECT`, a savepoint is created
* That identifies the spot later to return to
* Note that savepoints are only valid within a transaction, and does not exist after the transaction is committed or rolled back.

```
BEGIN;
SELECT 1;
SAVEPOINT s1;
SELECT 1/0;
ROLLBACK TO SAVEPOINT s1;
COMMIT;
```

#### Understanding basic locking and deadlocks

* Example of a table create, and a lock between two users:

```
CREATE TABLE t_test AS SELECT 1 AS id;

User 1                          User 2

BEGIN;
                                BEGIN;
UPDATE t_test SET id
= id + 1 RETURNING *;
                                UPDATE t_test SET id
                                = id + 1 RETURNING *;
COMMIT;
                                
                                COMMIT;
```

* User 2's update cannot complete until User 1's does, due to row locking
* It will complete though, and maintain integrity
* Example that creates a deadlock:

```
User 1                          User 2

BEGIN;                          BEGIN;

UPDATE t_test SET id = 4        UPDATE t_test SET id = 6
WHERE id = 3;                   WHERE id = 4;

                                UPDATE t_test SET id = 4
                                WHERE id = 3;

UPDATE t_test SET id = 6
WHERE id = 5;

...deadlock

                                COMMIT;
```

* First update for both users works
* Second update of user 2 has to wait for user 1 because it changes the same row
* In the final update, both users wait on the other until Postgres resolves the situation by saying `ERROR: deadlock detected` and describing the lock
* There is a pg parameter, `deadlock_timeout`, which is how long the server waits before checking for a deadlock, since detection is an expensive operation

#### Locking in FOR UPDATE mode

* To prevent instant overwrites from two users attempting to update the same information at the same time, PG has `SELECT ... FOR UPDATE`
* Example:

```
User 1                          User 2

BEGIN;                          BEGIN;

SELECT * from t_test
WHERE 1 > 0 FOR UPDATE;

                                SELECT * FROM t_test
                                WHERE 1 > 0 FOR UPDATE;

                                wait ...

COMMIT;
                                returns updated data...
                                do some work...
                                COMMIT;
```

* The `SELECT ... FOR UPDATE` locks the rows returned by the query, just as an `UPDATE` would have locked those rows, so teh second transaction has to wait to run its select until the first one commits or exits.
* This can cause serious performance issues because it causes resource contention.
* Using `SELECT ... FOR UPDATE NOWAIT` will cause the query to stop if a lock cannot be obtained
* Using `SELECT ... FROM a,b,c,d,e,f,g WHERE ... FOR UPDATE of a,b;` will only establish a lock on data in `a` and `b`
*

#### Avoiding Table Locks

* To explicitly trigger a table lock, you can use `LOCK`
* Eight locking levels:
    * `ACCESS SHARE`
    * `ROW SHARE`
    * `ROW EXCLUSIVE`
    * `SHARE UPDATE EXCLUSIVE`
    * `SHARE`
    * `SHARE ROW EXCLUSIVE`
    * `EXCLUSIVE`
    * `ACCESS EXCLUSIVE`

### Transaction Isolation

#### Demonstrating read committed mode

* Idea behind transaction isolation is to give users control over what they see inside a transaction
* A realistic example:

```
CREATE TABLE t_test (id int);
INSERT INTO t_test VALUES (4), (5);


User 1                          User 2

BEGIN;

SELECT sum(id) FROM t_test;
... returns 9 ...

                                INSERT INTO t_test VALUES (9);

SELECT sum(id) FROM t_test;
... returns 18 ...

COMMIT;
```

* By default, PostgreSQL uses read committed mode, which means that a transaction will see changes committed by somebody else every time a new statement is started.
* Once a statement is running, it is working from a snapshot taken at its start
*
