# Notes on Learn PostgreSQL

By Luca Ferrari, Enrico Pirozzi; Packt Publishing, Oct. 2020; ISBN 9781838985288

# Section 3: Administering Your Cluster

# Users, Roles, and Database Security

# Transactions, MVCC, WALs, and Checkpoints

* Two transaction types:
    * Implicit transactions - normal statements wrapped in a transaction by the db
    * Explicit transactions - statements in a user-issued `BEGIN`/`COMMIT` pair
* Any transaction has a unique transaction identifier (`xid`)
* The `xid` that generates or modifies a tuple is stored in the tuple itself
* You can see the current `xid` with `txid_current()`:

    ```SQL
    SELECT current_time, txid_current();
    ```

* Every table has hidden columns `xmin`, `xmax`, `cmin`, `cmax`
