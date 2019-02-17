# Notes on AWS RDS

From [https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)

* Basic RDS building block is the "db instance"
* Instances are isolated DB environments in the cloud
* An instance can contain multiple databases, is accessible by standard means
* Each instance runs a DB engine (MySQL, Postgres, etc)
* Each DB engine has a set of params in a DB parameter group that control the behavior of the databases it manages
* Compute power is set by the DB instance class
* Three class types:
    * Magnetic
    * SSD
    * Provisioned IOPS
* DB instances can run in a VPC
* time sync is via NTP
* DB instances can be run in several AZs, via Multi-AZ deployment
* Security group controls access to the DB instance, which is via IP ranges or accessing EC2 instances
* Uses DB security groups, VPC security groups, and EC2 security groups
* A db security group controls access to a DB instance inside a VPC
* An EC2 security group controls access to an EC2 instance, and can be used with a DB instance

## Determining requirements

* What DB instance class to use?
* What VPC, subnet, and security group will you use?
* Do you need failover support via multi-AZ?
* Does your account have IAM policies that grant access needed to perform RDS operations?
* What ports does your DB engine listen on? 
* What region do you want the database in?
* What kind of storage system do you want to use at the DB subsystem level? Magnetic, SSD, provisioned IOPS?
    * Magnetic: apps with light or burst IO
    * SSD: faster disk access
    * Provisioned IOPS: highly IO intensive workloads


# Best Practices for RDS

From [https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)

## RDS Basic Operational Guidelines

* RDS SLA requires you follow these guidelines.
* Monitor memory, CPU, and storage usage
* Scale up your instance when approaching storage capacity limits.
* Enable automatic backups and set the backup window to occur at low write IOPS times
* If the DB workload requires more IO than provisioned, recover after failure/failover will be slow. To increase IO capacity, do any or all of:
    * Migrate to a different db instance class
    * Convert from standard storage to SSD or provisioned IOPS
    * If using provisioned IOPS, provision additional capcity
* If the client app is caching DNS data for the DB instances, set the TTL for the cache to less than 30s. Underlying IP for the instance can change in case of failover, so you want your DNS fresher than that time limit.
* Test your failover to know how long the process takes and that your app can auto connect to the new instance.

## DB instance RAM recommendations

* Allocate sufficient RAM such that working set resides almost completely in memory
* To check that, check the ReadIOPS metric in CloudWatch while the instance is under load--ReadIOPS should be small and stable.
* If scaling up your instance class drops the ReadIOPS dramatically, your working set was not in memory. Continue to scale until that number stops dropping.

## RDS Security best practices

* Use IAM accounts to control API actions, especially those that do CRUD on the underlying AWS resources
* Assign an individual IAM account to each person managing RDS resources
* Use least privs.
* Use IAM groups to manage perms for multiple users
* Rotate creds frequently

## Using enhanced monitoring to identify OS issues

* RDS gives you metrics in real time for the OS the instance runs on
* You can get the enhanced monitoring from CloudWatch Logs

## Using metrics to identify performance issues

* Instrument your DB performance.
* Advice on specific metrics:
    * High CPU or RAM consumption - may be appropriate, depends on your app code
    * Disk space consumption - investigate if space used is consistently at or above 85% of total disk capacity. See if you can delete or archive data.
    * Network traffic - check if throughput is consistently lower than expected
    * DB connections - consider constraining connections if you see high numbers of user conns in conjunction with decreases in instance performance / response time.
    * IOPS metrics - expected values depend on disk specification and server configuration, so you need to get a good baseline to know what you're doing modifying those
* Tune your queries.

## Best practices for MySQL storage engines

* Table create limits on a mysql instance:
    * 10k tables on provisioned IOPS, or general purpose if DB instance is 200G+
    * 1k tables on standard storage, or general purpose less than 200G
* If you need lots of tables, set `innodb_file_per_table` to 0
* Max size of any table is 16TB, so partition tables before they get too large.
* Point-in-time restore and snapshot restore features require a crash-recoverable storage engine, and ONLY work for InnoDB.
* MyISAM does not support reliable crash recovery
* If you need MyISAM because it performs better for full text search, make sure you follow steps for automated backups with unsupported engines

## Best practices for working with PostgreSQL

* Two important performance improvement areas:
    * loading data into a db instance
    * using the autovacuum feature
* Loading data into an instance:
    * When loading, modify the db instance settings and db parameter group values to allow for the most efficient importing of data
    * Do the following modifications to the instance:
        * Disable DB instance backups (backup_retention to 0)
        * Disable multi-AZ
    * And these for the DB parameter group (testing to find best values)
        * Increase `maintenance_work_mem` parameter
        * Increase `checkpoint_segments` and `checkpoint_timeout` params to reduce writes to the wal log
        * Disable `synchronous_commit` parameter, but do not turn off FSYNC
        * Disable autovacuum
        * Make sure none of the table you are importing are unlogged. Data stored in unlogged tables can be lost on failover.
    * Use the `pg_dump -Fc` or `pg_restore -j` commands with these settings
* Working with the fsync and full_page_writes db params
    * `fsync` and `full_page_writes` params are not modifiable in PG9.4.1 on RDS
    * Disabling those can lead to data corruption
* Working with autovacuum
    * strongly recommend using this feature to maintain instance health
    * automates the execution of the VACUUM and ANALYZE command
    * Using autovacuum is imposed by Postgres, not RDS
    * Enabled by default for all new instances
    * autovacuum is not a resource free operation, though it works in the background as much as possible. It's also not a high-overhead operation that you could reduce to get extra performance--your tables will deteriorate over time if you don't use it.
    * If you don't use it, you'll eventually have to impose a forced outage to do a manual vacuum, which will take much more time.
    * Parameters you can set:
        * `autovacuum_vacuum_threshold`
        * `autovacuum_vacuum_scale_factor`
        * `autovacuum_max_workers`
        * `autovacuum_nap_time`
        * `autovacuum_cost_limit`
        * `autovacuum_cost_delay`
    * Query to view number of dead tuples:

        ```SQL
        SELECT relname, n_dead_tup, last_vacuum, last_autovacuum
        FROM pg_catalog.pg_stat_all_tables
        WHERE n_dead_tuples > 0 AND relname = 'my_table'
        ORDER BY n_dead_tup DESC;
        ```

## Working with DB Parameter groups

* Try out param group changes on a test db instance before applying to prod
* 
