# Notes on Sharding MySQL

* Sharding partitions database tables, with each partition on a separate server. The data separation lets you distribute workloads.
* Design decisions:
    * Chooisng a sharding key
    * Making schema changes
    * Mapping between sharding key, shards, and physical servers

From https://aws.amazon.com/blogs/database/sharding-with-amazon-relational-database-service/-

* Sharding is always worth it under OLTP (online transaction processing), can be limiting in OLAP (online analytic processing)
* Primary advantage is scalability
* In AWS, you'd build something like a three tier model
    1. Web app tier: application code and auto-scaling group
    1. OLTP tier: sharded groups of DB instance + DB standby
    1. OLAP tier: Redshift + S3
* You build the OLTP environment with sharding, each shard is built for HA using a standalone DB deployed using Multi-AZ
* Data pulled from OLTP to OLAP environment on a schedule

## Data partitioning and schema design

* Pre-requisites are to partition data horizontally and distribute your data across shards. 
* Strategies for partitioning include list partitioning, range partitioning, or hash partitioning. 
* If multiple tables bound by foreign key relations are involved, you can partition by using the same partition key on all the tables involved. Data spanning tables but belonging to a single partition key is distributed to a single shard.
* In that case, shard routing is done at the application tier
* Basic design techniques:
    * Each DB shard has a partition key mapping table, that stores partition keys that reside on that shard. Apps read that table from all shards to construct the data-mapping logic that maps a partition key to a shard. Sometimes apps can use a pre-defined algorithm to determine which DB shard a partition key is on, and you can omit the table.
    * Partition key is added to all other tables as a data isolation point, with direct influence on data and workload distribution to different shards. Queries for a single partition include the partition key so that the data routing logic in the app tier can use it to map to the right shard.
    * Primary keys have unique values across ALL shards to avoid key collisions when data is migrated or merged. That means involving the shard key in primary keys, or using GUID/UUID keys
    * Column with the timestamp data type can be defined in tables as the data consistency point, acting as criteria to merge data from all shards into the global view.
* You have to consider (on RDS):
    * type of db engine
    * db instance class
    * type of RDS storage
* RDS has a DB parameter group that contains a desired set of config values you can apply to all database shards consistently.

## Monitoring for scalability

* RDS automatically publishes data to CloudWatch
* Author always recommends metrics monitoring overall system resource usage, like
    * `CPUUtilization`
    * `FreeableMemory`
    * `ReadIOPS`
    * `WriteIOPS`
    * `FreeStorageSpace`

## Resharding

* All the ways you can do this more or less devolve to migrating existing data across shards, whether you're adding shards, removing them, splitting an existing one.
* In RDS for MySQL, MariaDB, or PostgreSQL, RDS has a push-button scale-out operation for read replicas, to split one standalone db into multiple new ones
* You can use a read replica as a data replication technique to move data between databases:
    1. Read replica created to replicate data from the master db continuously
    1. Master db holds off write activities so the read replica can sync and be promoted to a new standalone db. During this time, mapping and routing logic at the app tier updates the status of multiple data partitions on the master to be read-only
    1. Data mapping and routing logic is modified to route connections to the new database
* If you use Aurora DB cluster to build a shard, its read replicas share the storage volumes with the primary instance, and therefore cannot be used to replicate data between Aurora clusters.
* RDS has the clone database feature to create a new Aurora cluster with the same data as the source DB, and there is an option in Aurora MySQL to replicate its data to another new Aurora MySQL cluster
* You can also use something like AWS Database Migration Service, or user defined data extraction processes.
* Example of a tool-based resharding workflow, migrating one data partition at a time:
    1. Data migration tool set up to replicate a data partition from one database shard to another. Mapping and routing logic at application tier updates the status of the data partition to be read-only. Data migration tool then syncs data between shards.
    1. After data is in sync, data mapping and routing in app tier updates the mapping and status of the partition so it goes live on the new shard.
