# Notes on the MySQL 8.0 Reference Manual

From [https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html)

## 1.4 What is New in MySQL 8.0

### Features Added in MySQL 8.0

* Data dictionary - transactional data dictionary about db objects
* Atomic DDL - atomic DDL statement combines data dictionary updates, storage engine operations, and binary log writes into a single, atomic transaction
* Upgrade procedure - Server performs tasks handled by `mysql_upgrade` script automatically after install of a new version.
* Security and account management
    * Grant tables in the `mysql` system db are now InnoDB (transactional) tables, were previously MyISAM.
    * New plugin, `caching_sha2_password` authentication plugin available
    * Now supports roles, named collections of privileges
    * Now has user account categories, like system and regular users
    * Now possible to grant privs that apply globally except for certain schemas, if `partial_revokes` system var is enabled
    * `GRANT` has an `AS user [WITH ROLE]` clause to specify additional info about the privilege context. Mostly for uniform replication across all nodes of grantor privilege restrictions imposed by partial revokes, by causing those restrictions to appear in the binary log.
    * Maintains info about password history, allows dual passwords for phased password changes
    * Now supports FIPS mode, if compiled using OpenSSL. Crypto stuff.
    * SSL context the server uses for new connections is now reconfigurable at runtime.
    * Now sets the access control granted to clients on the named pipe to the minimum necessary for successful communication on Windows.
* Resource management - allows creation and management of resource groups; permits assigning threads running within the server to particular groups. CPU time is a generally manageable resource.
* Table encryption management - can be managed globally via defaults
* InnoDB enhancements:
    * Current max auto-increment counter value is written to the redo log each time the value changes, and saved to an engine-private system table on each checkpoint. Makes the current max auto-increment counter value persistent across restarts. Also:
        * Server restart no longer chancels effect of `AUTO_INCREMENT = N` table option
        * Server restart immediatley after a `ROLLBACK` no longer results in teh reuse of auto-increment values allocated to the rolled back transaction
        * If you modify an `AUTO_INCREMENT` column value to a value larger than the current auto-increment max, the new value is persisted and subsequent `INSERT` statements allocate auto-increment values starting from the new, larger value
    * When encountering index tree corruption, InnoDB writes a corruption flag to the redo log, which makes the corruption flag crash safe.
    * The InnoDB memcached plugin supports multiple get operations (fetching multiple kv pairs in a single memcached query) and range queries
    * New dynamic variable, `innodb_deadlock_detect` may be used to disable deadlock detection. Useful on high concurrency systems.
    * New `INFORMATION_SCHEMA.INNODB_CACHED_INDEXES` table reports number of index pages cached in the InnoDB buffer pool for each index
    * InnoDB temp tables now created in the shared temp tablespace
    * Supports encryption of redo log and undo log data
    * InnoDB supports `NOWAIT` and `SKIP LOCKED` options with `SELECT ... FOR SHARE` and `SELECT ... FROM UPDATE` locking read statements.
    * various partition statements now supported by native partitioning in-place APIs, and may be used with `ALGORITHM={COPY|INPACE}` and `LOCK` clauses
    * InnoDB now uses the MySQL data dictionary rather than its own storage-engine specific data dictionary.
    * `mysql` system tables and data dict tables now created in a single InnoDB tablespace file named `mysql.ibd` in the data directory
    * These undo tablespace changes are introduced in 8.0:
        * By default, undo logs now reside in two undo tablespaces created when the instance is initialized, no longer in the system tablespace
        * Additional undo tablespaces can be created in a chosen location at runtime using `CREATE UNDO TABLESPACE`
        * `innodb_undo_log_truncate` enabled by default
        * `innodb_rollback_segments` var defines number of rollback segments per undo tablespace
    * Default values for vars affecting buffer pool preflush and flush behavior were modified:
        * `innodb_max_dirty_pages_pct_lwm` default now 10
        * `innodb_max_dirty_pages_ct` default went from 75 to 90
    * Default `innodb_autoinc_lock_mode` setting now 2 (interleaved), which allows execution of multi-row inserts in parallel, improves concurrency and scalability
    

# Chapter 3: Tutorial

## 3.1 Connecting / Disconnecting
