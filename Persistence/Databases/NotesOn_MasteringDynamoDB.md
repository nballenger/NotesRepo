# Notes on Mastering DynamoDB

By Tanmay Deshpande, Packt Publishing, 2014

## Chapter 1: Getting Started

* Blah blah, nosql stuff
* Dynamo is at the level of RDS, SimpleDB, RedShift in AWS

### Data Model Concepts

* Data model: Tables, Items, Attributes
* Table - no fixed schema, needs fixed primary key column (w data type)
* Can have a secondary index
* All other attributes can be decided at runtime
* Attributes are KV pairs
* Size calculated by adding length of attr names and values
* Item size limited to 64k
* Operations supported:
    * ``UpdateTable`` - increase/decrease provisioned throughput
    * ``ListTables``
    * ``DescribeTable``
    * ``UpdateItem`` - CRUD for items
    * ``Query`` - query table on hash key and range key, or secondary indexes
    * ``Scan`` - reads all items in table

#### Provisioned Throughput

* Gives consistent/predictable performance
* You have to specify read/write "capacity unit"
* "Read Capacity Unit" - one strongly consistent read and two eventually consistent reads per second for an item up to 4KB
* "Write Capacity Unit" - one strongly consistent write for an item up to 1K
* For bigger items, capacity units are in multiples of 4/1K, respectively
* If your app exceeds the provisioned throughput for a table, you get an exception
* Reads/writes beyond capacity are throttled, given 400s
* AWS SDK gives auto-retries on ``ProvisinedThroughputExceededException`` when configured to do so--sets the number of retries the client will send

### How do I get started?

#### Creating a table in the AWS console

* Create the table, set the hash key and range key, any secondary indices
* Set the provisioned capacity units, notification alarms
* Create it, let it provision, explore the table, create an item, browse

#### DynamoDB Local

* Lightweight client side db, supports all APIs
* Got to run a service on a port, direct your calls at it
* Get the JAR, JRE 7, run it with ``java -Djava.library.path=. -jar DynamoDBLocal.jar``
* Hit it on :8000, or start it with a different ``--port 1234``

## Chapter 2: Data Models

* Chapter covers primary keys, data types, and operations
* Items are JSON blobs with primary key and arbitrary other attributes

### Primary Key

* Two types of primary key: hash and hash/range
* Hash key is indexed, must be unique for each item
* The range key is used for data distribution across partitions
* Ex: hash key of SSN, range key of birth year

### Secondary Indexes

* Without secondary indexes, only option to get an item is a scan
* Secondary indexes have to be created at table create, no post-hoc adding
* Two types: local and global
* Local secondary index:
    * Extensions of the given hash and range key attributes
    * Gives you more range query options other than table range key
    * Same hash key, different range key
    * Must have both hash and range keys
    * Local secondary looks in a single partition only
    * Supports both eventual and strong consistency, can specify on query
    * Queries and writes count against provisioned throughput
    * Local secondary has a size limit of 10G per hash key
* Global secondary index:
    * Queries against entire table, across partitions
    * Should have a hash key and range key
    * Hash and range key of global secondary are different from table h/r keys
    * Eventually supports only consistent reads
    * Maintains its own separate read/write capacty units
    * No size limits

### Data types

* Two broad types, scalar (string, number, binary) and multivalued (string set, number set, binary set)
* String scalar type:
    * UTF-8, no size limit for attribute, just 64k for items
    * Ordered by ASCII value
    * Cannot store empty strings
* Number scalar type:
    * Signed, exact value decimal or integer
    * Up to 38 digits of precision
    * Serialized numbers transferred as strings
* Binary scalar type:
    * Like a BLOB or CLOB
    * can be files, etc, will be encoded in Base64 for storage
    * You have to decode base64 to read back out
* Set types must be same base type, unique values

### Operations on Tables

* Focuses on Java, .NET, PHP SDKs

### Operations on Items

* Notes subtypes of eventual consistency: casual (causal?), read-your-writes, session
* Conditional writes - allows updates only when conditions are met, like "only update if it matches what I had when I read it", etc
* AWS has support for atomic counters, via the ``ADD`` operation of the ``UpdateItem`` api
* Reduce item size if possible to avoid an impact on your read/write units, particularly writes, which are in 1k increments

### Query and scan operations
