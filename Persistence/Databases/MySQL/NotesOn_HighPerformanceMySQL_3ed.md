# Notes on High Performance MySQL, 3rd Edition

By Vadim Tkachenko, Peter Zaitsev, Baron Schwartz; O'Reilly Media, Mar. 2012

ISBN 9781449314286

# Chapter 1. MySQL Architecture and History

## MySQL's Logical Architecture

* Topmost layer is services not unique to MySQL
    * connection handling
    * authentication
    * security
* Second layer is code for
    * Query parsing
    * Analysis
    * Optimization
    * Caching
    * Built-in functions
    * Cross-engine functionality (stored procedures, triggers, views)
* Third layer is storage engines
    * Like filesystems, each with pros/cons
    * Server talks to them via storage engine API
    * Storage engines don't parse SQL or communicate with each other, they just respond to requests from the server layer

### Connection Management and Security

* Every client gets its own thread in the server process
* Connection's queries execute in that thread, which resides on one core/CPU
* Server caches threads, not created/destroyed per connection
* Server has to authenticate clients
    * Based on username, originating host, and password
    * Can use X.509 certs across SSL connection
    * Post authentication, server determines privileges for each query the client issues

### Optimization and Execution

* Queries are parsed to create a parse tree structure
* Optimizations are then applied to the parse tree
* Optimizations can include:
    * Rewriting the query
    * Determining the order of table reads
    * Choosing indexes to use
* You can pass hints to the optimizier via keywords
* You can ask the server to explain the query optimization
* Optimizer doesn't care about storage engines, but the storage engine can affect how the server optimizes a query
* Before parsing the query, the server consults the query cache for SELECT statements

## Concurrency Control

* Two levels of concurrency control: server and storage engine
* Hypothetical: email box on a Unix system, in mbox file format, which has all messages concatenated together in sequence. If two processes attempt to deliver to the mailbox at the same time, it could interleave messages and corrupt the mbox file. So it uses locking to prevent corruption--if a client attempts a delivery while the mailbox is locked, it has to wait to acquire the lock itself before it can succeed.
* Does not support concurrency, so problematic for high-volume mailboxes

### Read/Write Locks

* Reading from the mailbox isn't a problem, you can't corrupt via read
* A delete during a read could give that read a corrupted view of the box
* Consequently even reads require careful orchestration
* If the mailbox were a database and each message a row, modifying a row during a read would also be problematic
* Solution is concurrent read/write access via a locking system via
    * shared/read locks - mutually nonblocking, many clients can read from the resource at one time
    * exclusive/write locks - exclusive, block both reads and other writes
* MySQL lock management is mostly transparent

### Lock Granularity

* You can improve concurrency by being selective about what you lock--only lock the part you need to change.
* Minimizing the amount of data locked improves concurrency, but every lock consumes resources
* Locking strategy is therefore a compromise between lock overhead and data safety, with effects on performance
* Typically you get row level locking
* MySQL storage engines can implement their own locking policies and lock granularities
* Two most important lock strategies:
    * Table locks
        * locks an entire table
        * clients doing insert, delete, update have to get a write lock
        * readers can obtain read locks to prevent writes
        * have variations for specific performance needs
            * `READ LOCAL` table locks allow some concurrent writes
            * Write locks have a higher priority than read locks
        * Storage engines have locking, but MySQL has its own locks at table level, as when the server implements a table-level lock for `ALTER TABLE`, regardless of the storage engine
    * Row locks
        * Best concurrency and highest overhead
        * Available in InnoDB and XtraDB
        * Implemented at the storage engine level, server doesn't know about them

## Transactions

* Group of SQL statements to treat atomically
* Basic ACID compliance
    * Atomicity - treat as single unit of work
    * Consistency - move from one consistent state to the next
    * Isolation - results are invisible until complete
    * Durability - one committed, changes are permanent (crash survivable)
* Downside of this data security is overhead to implement
* You can set your isolation level to mitigate the overhead cost

### Isolation levels

* Four standard levels from SQL
* Lower levels have higher concurrency, lower overhead
* `READ UNCOMMITTED` - transactions can view the results of uncommitted transactions. Can cause problems, rarely used in practice. Also known as a 'dirty read'
* `READ COMMITTED` - default for most db systems, though not MySQL. Satisfies simple isolation--transactions only see those changes already committed at their start. Still allows nonrepeatable read.
* `REPEATABLE READ` - mysql default level, doesn't allow unrepeatable read, does have phantom reads, where you select some range of rows, another transaction inserts a new row into the range, and then you select the same range, giving you a phantom row.
* `SERIALIZABLE` - highest level, doesn't allow phantom reads because transactions must be ordered so they cannot conflict. Places a lock on every row it reads. Can cause a lot of timeouts and lock contention.

### Deadlocks

* When two or more transactions are mutually holding and requesting locks on the same resources, creating a dependency cycle. Happens when transactions try to lock resources in a different order.
* DB systems have deadlock detection and timeouts
* InnoDB storage engine will notice circular dependencies and instantly error
* To break a deadlock requires rolling back one of the transactions.

### Transaction Logging

* Makes transactions more efficient
* Instead of updating on-disk tables, storage engine can change its in-memory copy of the data, write a record to the transaction log on disk, then update the data on disk as resources are available.
* That's 'write-ahead' logging

### Transactions in MySQL

* Has two transactional storage engines, InnoDB and NDB cluster
* Third party engines were XtraDB and PBXT at time of writing
* Autocommit
    * On by default
    * Unless you explicitly start a transaction, every statement is executed in one
    * Enable or disable via `SET AUTOCOMMIT = {0|1};`
    * You can also set the isolation level via `SET TRANSACTION ISOLATION LEVEL ...`
* You can't reliably mix storage engines within a single transaction, because the underlying storage engines are self-managed.
* If you mix transactional (InnoDB) and nontransactional (MyISAM) tables in a transaction, the transaction will work if everything goes well.
* If a rollback is required though, the nontransactional table can't be rolled back, leaving the database in an inconsistent state.
* InnoDB uses two phase locking
    * Can acquire locks at any time during a transaction
    * Will not release them until COMMIT or ROLLBACK
    * All locks are released at the same time
* Those are all implicit locks, but InnoDB also supports explicit locking
    * Outside the SQL standard
    * `SELECT ... LOCK IN SHARE MODE`
    * `SELECT ... FOR UPDATE`
* MySQL also supports `LOCK TABLES` and `UNLOCK TABLES` at the server level (not the storage engine level). Not a substitute for transactions.

## Multiversion Concurrency Control (MVCC)

* MVCC is not unique to MySQL
* Used by the transactional storage engines
* No standard for how it should work
* It's a twist on row level locking--avoids the need for locking at all in many cases
* Can have much lower overhead
* May allow nonlocking reads, while locking only the necessary rows during writes
* Keeps a snapshot of the data as it existed at some point in time
* Transactions get a consistent view of the data, no matter their run time
* Different transactions can see different data in the same tables at the same time, which can be confusing
* Each storage engine implements it differently, may be 'optimistic' or 'pessimistic'
* InnoDB implementation:
    * Stores each row with two additional, hidden values that record the record's create time and expiry/deletion time.
    * It's not the actual time, it's the system version number at the time the event occurred.
    * That number increments with every transaction that gets started
    * Each transaction keeps its own record of the current system version, as of the time it started
    * Each query checks each row's version numbers against the transaction's version, only showing data that was current at the start of the transaction
* If isolation is set to `REPEATABLE READ`, this applies to operations as follows:
    * `SELECT` - has to look at each row for two criteria:
        1. Must find a version of the row at least as old as the transaction
        1. Rows deletion version must be undef or greater than tx version
    * `INSERT` - records current system version number with new row
    * `DELETE` - records system version number as row's deletion ID
    * `UPDATE` - writes a new row copy, using the system version number for the new row's version, and writes the system version number as the old row's deletion version
* MVCC only works with `REPEATABLE READ` and `READ COMMITTED`

## MySQL's Storage Engines

* Each DB (or schema) is stored as a subdirectory of its data directory in the file system
* Table defs are stored in `.frm` files
* The filesystem stores DB names and table defs, case sensitivity is platform dependent
* `SHOW TABLE STATUS` or queries against `INFORMATION_SCHEMA` display table info

### The InnoDB Engine

* Default transactional engine for MySQL, most important/useful overall
* Designed for processing many short-lived transactions that usually complete rather than being rolled back.
* Use it unless you have a compelling reason not to.
* Stores data in a series of one or more data files collective called a 'tablespace'
* InnoDB entirely manages the tablespace, though you can store data and indexes separately.
* Uses MVCC for high concurrency
* Implements all 4 SQL standard isolation levels
* Tables are built on a clustered index
* Extremely fast primary key lookups
* Secondary indexes contain primary keys, so if the primary key is large the other indexes will also be large.
* Storage format is platform neutral, you can copy data/index files across systems.
* Has lots of internal optimizations like
    * read-ahead prefetch from disk
    * adaptive hash index that builds hash indexes in memory for fast lookups
    * insert buffer to speed inserts
* Read the manual.

### The MyISAM Engine

* Supports full text index, compression, spatial functions
* Does not support transactions or row-level locking
* Not even remotely crash-safe
* Usable for:
    * Read-only data
    * Small tables that will be easy to repair
* Features
    * Locks tables, not rows, using read and write locks
    * MySQL can do manual and automatic checking/repair of MyISAM tables, though this isn't transactions or crash recovery
    * Repairs are slow, can lose data.
    * Can create indexes on first 500 characters of BLOB and TEXT cols
    * Can do delayed key writes, which don't write changed index data to disk at the end of a query. Instead the changes are buffered in the in-memory key buffer, which is flushed to disk.
* You can compress myisam tables that will never be written to, to reduce the disk IO of access--rows are compressed individually, so it doesn't have to unpack a table or memory page to get a row
* Doesn't scale well.

# Chapter 2: Benchmarking MySQL

# Chapter 3: Profiling Server Performance

# Chapter 4: Optimizing Schema and Data Types

# Chapter 5: Indexing for High Performance

# Chapter 6: Query Performance Optimization

# Chapter 7: Advanced MySQL Features

# Chapter 8: Optimizing Server Settings

# Chapter 9: Operating System and Hardware Optimization

# Chatper 10: Replication

# Chapter 11: Scaling MySQL

## What is Scalability

* In a nutshell it's the system's ability to deliver equal marginal performance as you add resources to perform more work.
* Capacity is a related concept: capacity is the amount of work a system can perform in a given amount of time.
* Max throughput isn't capacity, because you can't actually push a prod system as hard as you do at max without making performance unpredictable
* Capacity and scalability are independent of performance. Analogy based on cars on a highway:
    * Performance is how fast a car is
    * Capacity is the number of lanes times max safe speed
    * Scalability is the degree to which you can add cars and lanes without slowing traffic
* Capacity means ability to handle load. Angles from which to view load:
    * Quantity of data
    * Number of users
    * User activity - what users do and how often they do it matters
    * Size of related datasets - highly interrelated data creates combinatorial complexity

### A Formal Definition

* Useful to look at a mathematical definition for scalability
* Linear scalability is when you get the same marginal performance increase every time you add the same resources.
* A system that doesn't scale linearly sees decreasing marginal performance increases at some point of adding resources
* Most systems eventually reach a point of max throughput, beyond which additional resource allocation provides negative marginal performance.
* There's a model, Gunther's Universal Scalability Law (USL)
* Short intro to USL:
    * Deviation from linear scalability can be modeled by 2 factors:
        * A portion of the work cannot be done in parallel
        * A portion of the work requires crosstalk
    * The first one results in Amdahl's Law, which causes throughput to level off. (Amdahl's law means that a process's run time can't be reduced beyond the total static time of the non-parallelizable parts plus the parallelizable part divided by the number of parallel resources.)
    * The second factor, intra-node or intra-process comms, gives the USL, which has a dropoff at some relatively early part of the Amdahl curve due to comms overhead.
* Most real systems scale more like USL than Amdahl curves
* USL is a best-case upper bound for most things.

## Scaling MySQL

* Vertical scaling involves more performance on individual nodes
* Horizontal scaling involves adding nodes
* Also known as "scale up" and "scale out"

### Planning for Scalability

* Most people start to think about scalability when performance degrades
* Shift in workload goes from CPU-bound to IO-bound
* You get query contention, increased latency
* If the application is highly scalable, you can add nodes, but this requires planning for scalability.
* Most difficult element is estimating how much load you need to handle, to an order of magnitude.
* Also need to know an approximate schedule, where your 'horizon' is for the next scaling event.
* Questions to ask to plan for scalability:
    * How complete is the application's functionality? - Scaling solutions can make it harder to implement some features.
    * What's the expected peak load? The app should work even at that load.
    * If you rely on every part of the system to handle the load, what happens if part of it fails? What spare capacity do you need to build in as failover?

### Buying Time Before Scaling

* Things you might be able to do in the short term:
    * Optimize performance--increasing performance reduces aggregate load, though there's a point of diminishing returns linked to the overhead of things like network connections, disk access speeds, etc.
    * Buy better hardware--vertically scaling can sometimes buy you time. Works best if the application is either small or designed so it can use more hardware well.

### Scaling Up

* You can scale up pretty far on commodity hardware. (this would now translate to cloud resources, I bet)
* At the time the book was written, MySQL didn't scale perfectly as you added hardware resources.
* Point of diminishing returns at the time was around
    * 256GB memory
    * 32 cores
    * PCIe flash storage
* Beyond that the price to performance ratio isn't as good as horizontally scaling
* Scaling up buys you time, but ultimately is expensive and has an upper bound

### Scaling Out

* Three broad groups of scale-out tactics:
    * Replication
    * Partitioning
    * Sharding
* Simplest / most common way is to distribute data across servers with replication, and use the replicas for read queries.
* Works best for a read-heavy application
* Drawbacks include cache duplication if the data size is large
* Other common way is to partition your workload across nodes
* How you partition is a complex decision
* Most large MySQL apps don't automate partitioning, or not completely
* Node - functional unit in your MySQL architecture
* Without planning for redundancy and HA, a node might be one server
* For a redundant system with failover, a node is generally one of:
    * A master-master replication pair, with an active and a passive replica
    * A master and many replicas
    * An active server that uses a distributed replicated block device for a standby
    * A SAN-based "cluster"
* In most cases, all servers in a node should have the same data.
* Authors like master-master replication architecture for two-server active/passive nodes

#### Functional Partitioning

* Functional partiton / division of duties - dedicating different nodes to different tasks.
* Example is using different servers for OLTP vs OLAP
* Functional partitioning takes that strategy further by dedicating individual servers or nodes to different applications, so each contains only the data its particular application needs
* Basically they mean individual services in a multi-service setup.
* Different approach is to split tables that never join to each other onto different nodes. Not common, since it's hard to do effectively and doesn't offer any particular advantages.
* YOu can't scale partitioning indefinitely, since each functional area has to scale vertically if tied to a single MySQL node. An app or functional area will eventually get too big, and if you go too far with functional partitioning you end up architecturally hemmed in by it later.

#### Data Sharding

* Most common and successful approach for scaling today's very large MySQL apps
* Done by splitting data into smaller pieces that are stored on different nodes
* Works well when combined with some type of functional partitioning paired with some set of global data that isn't sharded at all, like lookup datasets, login data, etc.
* Global data usually stored on a single node, often cached with memcached or similar.
* Most apps shard only the data that needs sharding, which is typically the parts of the dataset that will get very large.
* Example of building a blogging service with 10M projected users. You may not need to shard the user registration info since you can probably fit all the users (or the active subset) into memory.
* For 500M users, you probably want to shard the user registration data, and for the user _generated_ data (posts and whatnot), you probably have to shard given the record size and number.
* Most applications reach a sharding strategy via evolution, might look like
    * Single instance
    * Single master with read replicas
    * Functionally partitioned nodes
    * Sharded data stores within functional partitions, and a master/global node
* Sharded applications often have a DB abstraction library that eases the communications between teh app and the sharded data store.
* The sharding isn't usually completely hidden, because the application probably knows something about the data that makes it more efficient to expose something about shard choices to it
* Why choose a sharded architecture?
    * If you want to scale write capacity, you must partition your data.
    * You cannot scale write capacity against a single master.

#### Choosing a Partitioning Key

# Chapter 12: High Availability
