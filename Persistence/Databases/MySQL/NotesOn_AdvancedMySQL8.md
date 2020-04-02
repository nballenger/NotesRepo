# Notes on Advanced MySQL 8

By Tejaswi Malepati, Birju Shah, Eric Vanier; Packt Publishing Jan 2019

ISBN 9781788834445

* New features include
    * Common Table Expression (CTE) - temp table type associated witha  query that lets you use the WITH command for recursion
    * Invisible indexes - invisible to the optimizer--maintained by the optimizer but not used by it. Lets you test the behavior of the server during evaluation and not the index.
    * Persisting configuration variables
    * Data dictionary has been optimized
    * Better replication
    * Roles, etc. for user management

# MySQL 8's New Features

* Topics
    * Global data dictionary
    * MySQL support roles and history
    * Creation/management of resource groups and permissions
    * InnoDB enhancements
    * JSON functionality enhancements
    * Invisible indexes
    * Deprecated features
    * Removed features
* Global Data Dictionary
    * Oracle created a new enhanced transactional data dictionary in MySQL 8
    * Motivations:
        * INFORMATION_SCHEMA db has been historically poorly performant, in 8.0 it's implemented as a view over dictionary tables, avoids temp table creation.
        * In previous versions, the data dict was oriented as a shared center, where the server and InnoDB had their own separate data dictionary, but that duplicated some data which could get out of sync.
        * Standardization was totally absent in the data dictionary, across files on disk, mysql system myisam, and innodb system tables.
        * There was no atomic data dictionary
        * It was difficult to recover a non-atomic data dictionary
        * In 8, data dict has a version table that allows automatic updating from 8.0 and later.
        * In 8, no MyISAM tables by default.
* Support roles and history
    * On the server, you can create roles, specify their privileges, and assign them to users
* Resource Groups and Permissions
    * You can assign threads to particular groups, so that those threads run according to the resources available to the group
    * Assign virtual CPU resources
    * Limitations:
        * Resource groups not available if you install the thread pool plugin
        * Not available on Mac
        * Thread priorities ignored on FreeBSD/Solaris
        * On linus, resource group thread priorities are ignored unless `CAP_SYS_NICE` is configured
        * In windows, threads run on one of 5 priority levels
        * Resource group management applies specifically and exclusively to the server in question. Changes made to the group's data dictionary table or SQL statements made in the resource group are not logged or repeated
* InnoDB Enhancements
    * Auto-increment counter survives restart
    * Added `Innodb_deadlock_detect`, which you can use in dynamic config to disable/enable behavior--useful in highly competitive systems
    * All temp InnoDB tables no wcreated in a single shared temp tablespace
    * Number of `InnoDB_undo_tablespaces` can be changed during startup or reboot
    * New `innodb_dedicated_server` config option (disabled by default) lets InnoDB automatically configure based on memory detected:
        * `Innodb_buffer_pool_size`
        * `Innodb_log_file_size`
        * `innodb_flush_method`
    * InnoDB storage engine now supports atomic DDL, guarantees that DDL ops will be fully committed or rolled back even if a server stop occurs during execution.
* JSON enhancements
    * Automatic validation
    * JSON document normalization
    * Automatic loading of values
    * JSON columns cannot be indexed
    * Path expressions for JSON type now support ranges


# Advanced Data Techniques for Large Queries

## Most important variables are full-scan indicators

* You can query `Select_scan` and `Select_full_join` counters in the `SHOW GLOBAL STATUS` report to see the number of full scans since last restart, and number of joins since last restart.
* Full scans of small tables are fast, so don't worry about indexes until load increases

## Partitioning a Table

* Partitioning is how MySQL divides actual data into separate tables, but it is always treated as a single table by the SQL layer.
* Critical to find a partition key, so that all commands go to the correct partition.
* Best practice is to add the partition key to the primary key with auto increment enabled.
* You can partition by range or hash
* Range partitioning is popular because you have known groups of IDs in each table
* Hash partitioning balances the load on the table, lets you write simultaneously to the partitions
* Two major types of partition, horizontal and vertical
* Four subtypes: range, list, hash, key
* Horizontal partitions put all columns defined in each table into each partition. The whole partition can be organized individually or as a set

### RANGE partitioning

* Organized by an interval between non-overlappign values
* You set it with the `VALUES LESS THAN` operator
* Basic syntax:

    ```SQL
    CREATE TABLE employees (
        id INT NOT NULL,
        firstname VARCHAR(30),
        lastname VARCHAR(30),
        resto_id INT NOT NULL
    )
    PARTITION BY RANGE (resto_id) (
        PARTITION p0 VALUES LESS THAN (10),
        PARTITION p1 VALUES LESS THAN (20),
        PARTITION P2 VALUES LESS THAN (30),
        PARTITION p3 VALUES LESS THAN (40)
    );
    ```

* You can use `ALTER TABLE` to add new partitions
* You can partition on Timestamp in 8.0+

### LIST partitioning

* Partitions selected on the basis of columns corresponding to a discrete set of values
* Difference from RANGE is that rather than basing partition definition and selection on a value from a group of intervals, it's based on a column value from one of the lists of value groups
* Done using `PARTITION BY LIST`
* Syntax:

    ```SQL
    CREATE TABLE employees (
        id INT NOT NULL,
        firstname VARCHAR(30),
        lastname VARCHAR(30),
        resto_id INT NOT NULL
    )
    PARTITION BY LIST(resto_id) (
        PARTITION pR1 VALUES IN (1,2,3,5),
        PARTITION pR2 VALUES IN (4,7,8,9),
        PARTITION pR3 VALUES IN (10,22,23,13),
        PARTITION pR4 VALUES IN (14,12,16,17)
    );
    ```

### HASH partitioning

* Choose a partition based on a user defined expression that works on column values of the records to be added:

    ```SQL
    CREATE TABLE employees (
        id INT NOT NULL,
        firstname VARCHAR(30),
        lastname VARCHAR(30),
        resto_id INT NOT NULL
    )
    PARTITION BY HASH(resto_id)
    PARTITIONS 4;
    ```

* Done with `PARTITION BY HASH` clause to `CREATE TABLE`, where the expression returns an integer.

### KEY partitioning

* Similar to hash partitioning, but one or more columsn are provided for evaluation and the hash function is supplied by mysql
* 
