# Notes on Redis 4.x Cookbook

# Introduction

* Strictly speaking, Redis is a data structure server
* Author of Redis, Salvatore Sanfilippo, says it stands for REmote DIctionary Server
* It supports high performance command processing, high availability / scalability architectures, and data persistence features
* More and more popular with high-concurrency, low-latency systems

## Building Redis in Ubuntu

```bash
sudo apt-get install build-essential
mkdir /redis;cd /redis
wget http://download.redis.io/releases/redis-4.0.1.tar.gz
tar zxvf redis-4.0.1.tar.gz
cd redis-4.0.1

mkdir /redis/conf
cp redis.conf /redis/conf/

cd deps
make hiredis lua jemalloc linenoise
cd ..
make
make PREFIX=/redis install
```

Doing a package manager install:

```bash
sudo apt-get update && sudo apt-get install redis-server
```

## Redis executables:

* `redis-server`
* `redis-sentinel` - soft link for `redis-server`
* `redis-cli` - console tool
* `redis-check-rdb` - RDB check tool
* `redis-check-aof` - Append Only Files (AOF) check tool
* `redis-benchmark` - benchmarking tool

## Other

* Look up Matt Stancliff's evaluation of Redis performance in re: compilation options
* For security purposes, run as a non-root user, and secure it via this book's recommendations in chapter 8

## Starting and shutting down redis

* Start with the default config: `bin/redis-server`
* Start with a specific config: `bin/redis-server path/to/redis.conf`
* Via init.d: `/etc/init.d/redis-server start`
* As a daemon: Set `daemonize yes` in the conf, start as normal
* Killing: ``kill `pidof redis-server` ``
* Graceful shutdown: `/redis/bin/redis-cli shutdown`
* Shutdown via init.d: `/etc/init.d/redis-server stop`

### How it works

* `instance` in Redis represents a `redis-server` process
* Multiple instances can run on the same host, under different configs for port, paths, etc.
* Starting redis is trivial, stopping it requires some attention for data persistence
* Use `shutdown` to allow Redis to save data in memory to disk
* Shutdown process:
    * `redis-server` stops all clients
    * one persistence action is performed if persistence is enabled
    * cleans up the .pid file and socket file if any
    * quits the process
* You can use `kill` to send `SIGTERM` to the redis process for the same effect as shutdown
* You can add config params on startup, which is very useful if deploying multiple instances on a single host
* You can manage your redis instance using process management tools like systemd, supervisord, or Monit
* Look at https://redis.io/topics/signals to learn about how redis handles signals
* There's an example of systemd config for redis control at https://git.io/v5chR

## Connecting to Redis with redis-cli

```
$ redis-cli
127.0.0.1:6379> set foo value1
OK
127.0.0.1:6379> get foo
"value1"
127.0.0.1:6379> shutdown
not connected> quit
$ 
```

## Getting server information

* Use the `INFO` command in redis-cli
* You can get info on a specific section with `INFO <section>`
* Sections:
    * `Server` - basic server info
    * `Clients` - status/metrics on clients
    * `Memory` - overall memory consumption
    * `Persistence` - data persistence states and metrics
    * `Stats` - general statistics
    * `Replication`
    * `CPU`
    * `Cluster` - state of the cluster
    * `Keyspace` - database statistics

## Understanding the redis event model

* Uses a single thread, non-blocking IO model to process requests rapidly
* Most of the time it uses the non-blocking, multiplexing IO model in a single thread
* Sometimes it will spawn threads or child processes to do certain tasks
* It uses an async library called `ae` to abstract OS level polling facilities
* A polling facility such as `epoll` in linux works like this:
    * You call `epoll_create` to tell the kernel you want to use epoll
    * You call `epoll_ctl` to tell the kernel the file descriptors and what type of event you're interested in when an update occurs
    * Then `epoll_wait` gets called to wait for events of the file descriptors you set
    * When the file descriptors are updated, the kernel will send a notification to you.
    * You just have to create handlers for the events you're interested in.
* How `ae` processes requests (example built on a simple echo):
    * You create an event loop with `aeCreateEventLoop`
    * A TCP server is built with `anetTcpServer` for network binding / listening
    * Call `anetNonBlock` to set the non-block IO action for that socket FD
    * Specify the acceptance event handler `acceptProc` for the socket FD using the event loop
    * Once a TCP connection is established, the server triggers `acceptProc`
    * In `acceptProc`, use `anetTcpAccept` to accept the connection request, and register readable events of the socket FD for `readProc`
    * Then `readProc` gets called, which reads the data sent to the server, and registers the writable event of the socket FD
    * Then the event loop receives the writable event to fire the `writeProc` to send back the data to the socket client
* Redis works basically like the above. A loop is created and processes events continuously.

### More info

* Look at the section on identifying slow ops using SLOWLOG, and the part on troubleshooting latency issues

## Understanding the Redis protocol

* Redis is a non-blocking, IO multiplexing TCP server that accepts and processes requests.
* So despite it being complex internally, you can talk to it via TCP from a bunch of langauges
* It uses the Redis Serialization Protocol (RESP)
* Interacting via straight TCP:

    ```
    $ echo -e "*1\r\n\$4\r\nPING\r\n" | nc 127.0.0.1 6379
    +PONG
    $ echo -e "*3\r\n\$3\r\nset\r\n\$5\r\nmykey\r\n\$1\r\n1\r\n" | nc 127.0.0.1 6379
    +OK
    $ echo -e "*2\r\n\$4\r\nINCR\r\n\$5\r\nmykey\r\n" | nc 127.0.0.1 6379
    :2
    ```

* In the above:
    * In the ping command, it starts with an asterisk to indicate this is an arrays type
    * 1 stands for the size of this array
    * `\r\n` is carriage return line feed (CRLF), which is the terminator for each part in RESP
    * `\$4` is escaping the dollar sign, and `$4` tells you that the following is a bulk string type of four characters long ('PING')
    * The response to the increment command is `:2`, where the colon indicates an integer type

# Data Types

* Redis has no tables or schemas
* The way to think about organizing data in redis is what data types native to redis best support your scenario
* You can't use SQL in redis, so you issue commands directly on the target data with the redis API--so you have to think about whether the operations of specific data types in redis fit your needs.

## Using the string data type

* Fundamental data type in redis; all keys must be strings
* The `SET` command associates a value with a key
* `GET` retrieves a value
* `STRLEN` tells you the integer length of a value
* `APPEND` lets you add to a value
* `SETRANGE` lets you overwrite some or all of a value
* If there's a value associated with a key already, `SET` overwrites the value
* You can test for that with `EXIST` before executing
* The `SETNX` (set if not exists) command sets a value for a key if it does not exist
* There is also the `NX` option to the `SET` command for the same thing
* `MSET` and `MGET` set and get multiple key/value pairs in an atomic operation

    ```
    127.0.0.1:6379> SET "Extreme Pizza" "300 Broadway, New York, NY"
    OK
    127.0.0.1:6379> GET "Extremem Pizza"
    (nil)
    127.0.0.1:6379> GET "Extreme Pizza"
    "300 Broadway, New York, NY"
    127.0.0.1:6379> STRLEN "Extreme Pizza"
    (integer) 26
    127.0.0.1:6379> APPEND "Extreme Pizza" " 10011"
    (integer) 32
    127.0.0.1:6379> GET "Extreme Pizza"
    "300 Broadway, New York, NY 10011"
    127.0.0.1:6379> SETRANGE "Extreme Pizza" 14 "Washington, DC 20009"
    (integer) 34
    127.0.0.1:6379> GET "Extreme Pizza"
    "300 Broadway, Washington, DC 20009"
    127.0.0.1:6379> SETNX "Lobster Palace" "437 Main St, Chicago, IL"
    (integer) 1
    127.0.0.1:6379> SETNX "Extreme Pizza" "100 Broadway, New York, NY"
    (integer) 0
    127.0.0.1:6379> MSET "Sakura Sushi" "123 Ellis St, Chicago, IL" "Green Curry Thai" "Seattle"
    OK
    127.0.0.1:6379> MGET "Sakura Sushi" "Green Curry Thai" "nonexistent"
    1) "123 Ellis St, Chicago, IL"
    2) "Seattle"
    3) (nil)
    ```

* Strings are encoded in Redis objects internally in three different ways:
    * `int` - for strings representing 64-bit, singed integers
    * `embstr` - strings whose length is less than or equal to 44 bytes
    * `raw` - strings greater than 44 bytes
* You can use `OBJECT` to inspect the internal encoding of redis value objects

    ```
    127.0.0.1:6379> SET myKey 12345
    OK
    127.0.0.1:6379> OBJECT ENCODING myKey
    "int"
    127.0.0.1:6379> SET myKey "a string"
    OK
    127.0.0.1:6379> OBJECT ENCODING myKey
    "embstr"
    127.0.0.1:6379> SET myKey "a long string whose length is more than 44 bytes in size"
    OK
    127.0.0.1:6379> OBJECT ENCODING myKey
    "raw"
    ```

* `OBJECT` can also let you look at `refcount` and `idletime` for Redis objects

## Using the list data type

* In Redis, the value associated with a key can be a list of strings
* It's more like a doubly linked list than an array
* `LPUSH` lets you insert to the left end of a list
* `LRANGE` gets all names in a list
* `RPUSH` inserts to the right end
* `LINSERT` inserts after an element
* `LINDEX` retrieves based on position
* `LPOP` and `RPOP` remove and return end elements
* `LTRIM` lets you remove multiple elements while only keeping the range specified
* `LSET` lets you set the value of an element at an index

```
127.0.0.1:6379> LPUSH favorite_restaurants "Alpha" "Bravo"
(integer) 2
127.0.0.1:6379> LRANGE favorite_restaurants 0 -1
1) "Bravo"
2) "Alpha"
127.0.0.1:6379> RPUSH favorite_restaurants "Charlie" "Delta"
(integer) 4
127.0.0.1:6379> LRANGE favorite_restaurants 0 -1
1) "Bravo"
2) "Alpha"
3) "Charlie"
4) "Delta"
127.0.0.1:6379> LINSERT favorite_restaurants AFTER "Alpha" "Echo"
(integer) 5
127.0.0.1:6379> LRANGE favorite_restaurants 0 -1
1) "Bravo"
2) "Alpha"
3) "Echo"
4) "Charlie"
5) "Delta"
127.0.0.1:6379> LINDEX favorite_restaurants 3
"Charlie"
127.0.0.1:6379> LPOP favorite_restaurants
"Bravo"
127.0.0.1:6379> RPOP favorite_restaurants
"Delta"
127.0.0.1:6379> LRANGE favorite_restaurants 0 -1
1) "Alpha"
2) "Echo"
3) "Charlie"
127.0.0.1:6379> LTRIM favorite_restaurants 1 -1
OK
127.0.0.1:6379> LRANGE favorite_restaurants 0 -1
1) "Echo"
2) "Charlie"
127.0.0.1:6379> LSET favorite_restaurants 1 "Foxtrot"
OK
127.0.0.1:6379> LRANGE favorite_restaurants 0 -1
1) "Echo"
2) "Foxtrot"
```

`BLPOP` and `BRPOP` are blocking versions of `LPOP` and `RPOP`. They pop, but the client will be blocked if the list is empty. You have to provide a timeout in seconds for the blocking commands--0 means forever. Useful in a job dispatcher, where multiple workers (Redis Clients) are waiting for the dispatcher to assign new jobs. The workers use blocking pop on a job list. When there is a new job, teh dispatcher pushes it into the list, and a worker picks it up.

Example using three clients: a dispatcher and two workers:

Worker 1:

```
127.0.0.1:6379> BRPOP job_queue 0
1) "job_queue"
2) "job1"
(19.11s)
```

Worker 2:

```
127.0.0.1:6379> BRPOP job_queue 0
1) "job_queue"
2) "job2"
(21.33s)
```

Dispatcher:

```
127.0.0.1:6379> LPUSH job_queue job1
(integer) 1
127.0.0.1:6379> LPUSH job_queue job2
(integer) 1
127.0.0.1:6379> LPUSH job_queue job3
(integer) 1
127.0.0.1:6379> LRANGE job_queue 0 -1
1) "job3"
```

Internally, list objects are stored using `quicklist` encoding. Two config options can tweak the memory storage of the list object:

* `list-max-ziplist-size` - max size of an internal list node in a list entry
* `list-compress-depth` - list compress policy. If you are going to use the head and tail elements of a list, use this setting to have a better list compression ratio

## Using the hash data type

* Represents mappings between fields and values, like map or dict types in other languages
* Redis dataset itself can be seen as a hash
* To distinguish from redis keys, we use fields to denote keys in redis hash-value objects
* `HMSET` lets you set info properties
* `HMGET` retrieves values in a hash
* `HGET` gets a single field value
* `HEXISTS` tests for field existence
* `HGETALL` gets all fields and values in a hash (do not use for large hashes)
* `HSET` sets the value of a single field, or modifies the value for an existing field
* `HDEL` deletes fields from a hash
* You don't have to initialize an empty hash before adding values
* If a hash is empty it is automatically cleaned up
* `HSETNX` sets the value of a field only if it does not exist

```
127.0.0.1:6379> HMSET "MyHash" "fieldA" "valueA" "fieldB" "valueB" "fieldC" "valueC"
OK
127.0.0.1:6379> HMGET "MyHash" "fieldA" "fieldC"
1) "valueA"
2) "valueC"
127.0.0.1:6379> HGET "MyHash" "fieldB"
"valueB"
127.0.0.1:6379> HEXISTS "MyHash" "fieldC"
(integer) 1
127.0.0.1:6379> HEXISTS "MyHash" "fieldD"
(integer) 0
127.0.0.1:6379> HGETALL "MyHash"
1) "fieldA"
2) "valueA"
3) "fieldB"
4) "valueB"
5) "fieldC"
6) "valueC"
127.0.0.1:6379> HSET "fieldD" "valueD"
(error) ERR wrong number of arguments for 'hset' command
127.0.0.1:6379> HSET "MyHash" "fieldD" "valueD"
(integer) 1
127.0.0.1:6379> HGETALL "MyHash"
1) "fieldA"
2) "valueA"
3) "fieldB"
4) "valueB"
5) "fieldC"
6) "valueC"
7) "fieldD"
8) "valueD"
127.0.0.1:6379> HDEL "MyHash" "fieldB"
(integer) 1
127.0.0.1:6379> HGETALL "MyHash"
1) "fieldA"
2) "valueA"
3) "fieldC"
4) "valueC"
5) "fieldD"
6) "valueD"
```

* Max number of fields in a hash is (2^^32)-1
* For large hashes, `HGETALL` may block the server
* If that's true, you can use `HSCAN` to incrementally retrieve fields and values
* `HSCAN` is one of the scanning commands (`SCAN`, `HSCAN`, `SSCAN`, `ZSCAN`), which are non-blocking by virtue of being incremental
* The commands are cursor-based iterators, so you have to specify a cursor each time when you call the command. The starting cursor is 0. 
* When the command is finished, redis returns a list of elements and a new cursor for the next iteration
* The call format is `HSCAN <key> <cursor> [MATCH <pattern>] [COUNT <number>]`
* `MATCH` lets you match fields on a glob style pattern
* `COUNT` is a hint on how many elements should return on each iteration. Redis doesn't guarantee the returned number will match the count. Default is 10.
* If the cursor returned is 0, the scan was complete
* Redis stores hash objects using two encodings:
    * `ziplist` - if the hash length is less than `list-max-ziplist-entries` and the size of every element in the list is less than `list-max-ziplist-value`
    * `hashtable` - when ziplist can't be used

```
127.0.0.1:6379> hscan MyHash 0 
1) "0"
2) 1) "fieldA"
   2) "valueA"
   3) "fieldC"
   4) "valueC"
   5) "fieldD"
   6) "valueD"
127.0.0.1:6379> hscan MyHash 0 MATCH "field"
1) "0"
2) (empty list or set)
127.0.0.1:6379> hscan MyHash 0 MATCH "fieldA"
1) "0"
2) 1) "fieldA"
   2) "valueA"
```
## Using the set data type

* Set is a collection of unique and unordered objects
* `SADD` lets you add elements to a set
* `SISMEMBER` lets you test for membership
* `SREM` removes elements
* `SCARD` gets the number of member elements

```
127.0.0.1:6379> SADD "MySet" "apple" "banana" "carrot" "dirt"
(integer) 4
127.0.0.1:6379> SISMEMBER "MySet" "apple"
(integer) 1
127.0.0.1:6379> SREM "MySet" "dirt"
(integer) 1
127.0.0.1:6379> SCARD "MySet"
(integer) 3
```

* Max elements in a set is (2^^23)-1
* `SMEMBERS` lists all elements in a set, don't use for large sets
* `SSCAN` does an iterative scan
* Set operations:
    * Union: `SUNION`, `SUNIONSTORE`
    * Intersection: `SINTER`, SINTERSTORE`
    * Difference: `SDIFF`, `SDIFFSTORE`
* Commands without `STORE` return the result set
* With `STORE` they store the result to a destination key
* Two encodings used to store set objects:
    * `intset` - for sets where all elements are integers and the number of elements is less than `set-max-intset-entries`
    * `hashtable` - when intset can't be used

```
127.0.0.1:6379> SMEMBERS "MySet"
1) "apple"
2) "banana"
3) "carrot"
127.0.0.1:6379> SADD "MyOtherSet" "apple" "carrot"
(integer) 2
127.0.0.1:6379> SINTER "MySet" "MyOtherSet"
1) "apple"
2) "carrot"
127.0.0.1:6379> SINTERSTORE "MyCommonElements" "MySet" "MyOtherSet"
(integer) 2
127.0.0.1:6379> SMEMBERS "MyCommonElements"
1) "apple"
2) "carrot"
```

## Using the sorted set data type

* Sorted in this context means each element in the set owns a weight that can be used for sorting, and that you can retrieve items from the set in their weighted order
* Useful for scenarios where sorting is needed constantly on a set of items
* `ZADD` lets you add weights and items to a sorted set
* `ZREVRANGE` lets you retrieve the ranking of items in the sorted set
* `ZINCRBY` increases the weight of an item
* `ZREVRANK` shows the ranking of an item
* `ZSCORE` shows the weight of an item
* `ZUNIONSTORE` combines two rankings across sets

```
127.0.0.1:6379> ZADD ranking:alpha 100 "alpha" 23 "bravo" 34 "charlie" 45 "delta" 88 "echo"
(integer) 5
127.0.0.1:6379> ZREVRANGE ranking:alpha 0 -1 WITHSCORES
 1) "alpha"
 2) "100"
 3) "echo"
 4) "88"
 5) "delta"
 6) "45"
 7) "charlie"
 8) "34"
 9) "bravo"
10) "23"
127.0.0.1:6379> ZINCRBY ranking:alpha 1 "delta"
"46"
127.0.0.1:6379> ZREVRANK ranking:alpha "alpha"
(integer) 0
127.0.0.1:6379> ZSCORE ranking:alpha "alpha"
"100"
127.0.0.1:6379> ZADD ranking2:alpha 50 "alpha" 33 "bravo" 55 "charlie" 190 "delta"
(integer) 4
127.0.0.1:6379> ZUNIONSTORE totalranking 2 ranking:alpha ranking2:alpha
(integer) 5
127.0.0.1:6379> ZREVRANGE totalranking 0 -1 WITHSCORES
 1) "delta"
 2) "236"
 3) "alpha"
 4) "150"
 5) "charlie"
 6) "89"
 7) "echo"
 8) "88"
 9) "bravo"
10) "56"
```

* `ZADD` can only add new elements to an existing sorted list with `NX`
* You can have multiple elements with the same score. Sort order devolves to lexical.
* Encodings for sorted set:
    * `ziplist`, according to config
    * `skiplist` when ziplist can't be used

## Using the HyperLogLog data type

* If you don't need to get the content of a data set and just want a count of it, you can use the HyperLogLog (HLL) data type
* Count distinct on a set is possible, but suffers from poor performance compared to HLL
* `PFADD` counts one element's occurrences
* `PFCOUNT` gives a distinct count
* `PFMERGE` merges different counts

```
127.0.0.1:6379> PFADD "Counting:My HLL" "12345"
(integer) 1
127.0.0.1:6379> PFADD "Counting:My HLL" "54321"
(integer) 1
127.0.0.1:6379> PFCOUNT "Counting:My HLL"
(integer) 2
127.0.0.1:6379> PFADD "Counting:My HLL:Monday" "000" "004" "003"
(integer) 1
127.0.0.1:6379> PFADD "Counting:My HLL:Tuesday" "002" "003" "005"
(integer) 1
127.0.0.1:6379> PFADD "Counting:My HLL:Wednesday" "001" "002" "003"
(integer) 1
127.0.0.1:6379> PFMERGE "Counting:My HLL:Week" "Counting:My HLL:Monday" "Counting:My HLL:Tuesday" "Counting:My HLL:Wednesday"
OK
127.0.0.1:6379> PFCOUNT "Counting:My HLL:Week"
(integer) 6
```

* HLL is stored as string
* It's easy to persist and restore for KV pairs
* HLL uses two storage types:
    * Sparse - HLL objects with length less than `hll-sparse-max-bytes`
    * Dense - when sparse can't be used

## Using the Geo data type

* Supports storing and querying geospatial coordinates
* `GEOADD` lets you add to a Geo set
* `GEOPOS` gets coordinates for a given member of a geo set
* `GEORADIUS` gives you items in a set within a radius
* `GEODIST` gives you straight line distance between points
* `GEORADIUSBYMEMBER` looks for items in the set less than some distance from a particular memember of the set

```
127.0.0.1:6379> GEOADD restaurants:CA -121.896321 37.916750 "Olive Garden" -117.910937 33.804047 "P.F. Chang's" -118.508020 34.453276 "Outback Steakhouse" -119.152439 34.264558 "Red Lobster" -122.276909 39.458300 "Longhorn Charcoal Pit"
(integer) 5
127.0.0.1:6379> GEOPOS restaurants:CA "Red Lobster"
1) 1) "-119.1524389386177063"
   2) "34.26455707283378871"
127.0.0.1:6379> GEORADIUS restaurants:CA -121.923170 37.878506 5 km
1) "Olive Garden"
127.0.0.1:6379> GEODIST restaurants:CA "P.F. Chang's" "Outback Steakhouse" km
"90.7557"
127.0.0.1:6379> GEORADIUSBYMEMBER restaurants:CA "Outback Steakhouse" 100 km
1) "Red Lobster"
2) "Outback Steakhouse"
3) "P.F. Chang's"
127.0.0.1:6379>
```

* When coordinates are set with GEOADD, they get converted into a 52bit GEOHASH
* There is a slight difference between teh coordinates as entered as as encoded
* You can use WITHDIST in GEORADIUS and GEORADIUSBYMEMBER to get distances
* Internally the geo set is stored as a sorted set (`zset`), and all the sorted set commands can be used with a geo set
* Implementation of GEOHASH is based on a 52-bit integer representation (sub meter accuracy)
* GEORADIUS has time complexity of O(N + log(M)), where N is the number of elements in the bounding box of the circular area

## Managing Keys

* Data in redis is mostly KV pairs, so managing keys is important
* To show the keys operation clearly, you need some fake data in Redis
* Put it there with `fake2db`:

    ```
    mkvirtualenv redis_experiments
    pip install redis fake2db
    fake2db --rows 10000 --db redis
    ```

* `DBSIZE` tells you how many keys are currently in Redis
* `KEYS` can tell you the specific keys
* `SCAN` can do that iteratively with a cursor
* `DEL` and `UNLINK` remove KV pairs
* `EXISTS` tells you if a key exists
* `TYPE` gets the datatype of a key's value
* `RENAME` lets you rename a key
* Key management is fairly simple, but some APIs can have performance problems
* If there are a lot of keys in redis, calling KEYS can make the server block
* Use iterative SCAN ops instead
* If you use DEL on non-string types, the server can have some latency if the number of elements in the key is too large. Use UNLINK instead, since it will do the deletion in a separate thread rather than the main event loop.
* RENAME will delete the target key if it already exists, incurring the same penalty as DEL
* Best practice is to unlink the key then rename.
* The `DUMP` and `RESTORE` commands can be used for serialization and deserialization, so you can do partial backups

# Data Features

* In addition to data types, there are serveral useful data features:
    * Bitmaps - can be used instead of strings to save memory under some circumstances
    * Expiration - you should set transient data to expire, since redis is in-memory
    * Sorting - supported for lists, sets, sorted sets
    * Pipeline - can optimize multiple operations
    * Transactions 
    * PUBSUB - use redis as a message broker
    * Writing/debugging lua in redis - scripting for embedded operations

## Using bitmaps

* Also called a bit array or bit vector
* It's an array of bits!
* Underlying type is string, which is inherently a binary blob, so can be seen as a bitmap
* Bitmaps are great for storing booleans under the right circumstances
* `SETBIT` sets the bit value in a bitmap at a specified offset
* `GETBIT` gets the bit value at a specified offset
* `BITCOUNT` gets you the number of bits set to 1 in the bitmap
* `BITOP` lets you do bitwise operations between bitmaps, supports AND, OR, XOR, NOT

```
127.0.0.1:6379> SETBIT "mybitmap" 100 1
(integer) 0
127.0.0.1:6379> GETBIT "mybitmap" 400
(integer) 0
127.0.0.1:6379> BITCOUNT "mybitmap"
(integer) 1
127.0.0.1:6379> SETBIT "othermap" 100 1
(integer) 0
127.0.0.1:6379> SETBIT "othermap" 400 1
(integer) 0
127.0.0.1:6379> BITOP AND "mybitmap" "othermap"
(integer) 51
127.0.0.1:6379> GETBIT "mybitmap" 100
(integer) 1
127.0.0.1:6379> GETBIT "mybitmap" 400
(integer) 1
```

* Bitmaps can be a real savings on a set of integers that is quite largely populated
* Sparse bitmaps however can be blocking, if for instance you set ten low bits and then an extremely high offset one, since Redis has to immediately allocate all the intervening memory to get to the high offset.

## Setting expiration on keys

* `EXPIRE` lets you set a timeout in seconds on an existing key
* `TTL` lets you check the time to live on a key
* Timeouts are stored as unix timestamps, so even after server shutdown and restart, they expire on clock time, not run time
* If a key is expired and a client tries to access it, redis deletes it immediately
* In general deletion is passive, so it waits for access
* It also actively deletes expired keys periodically (10 times a second, ish)
* Timeout on a key can be cleared by:
    * using `PERSIST` to make it a persistent key
    * if the value at the key is replaced or deleted
    * if the key is renamed by another key that does not have a timeout
* `TTL` returns -1 if the key exists but has no expiration, and -2 if the key does not exist
* `EXPIREAT` lets you set the timestamp of the expiration directly
* `PEXIRE` and `PEXIREAT` can be used to specify millisecond timeouts
* If you need to trigger passive deletion, you can do a `SCAN`

## Using SORT


## Using pipelines

## Understanding Redis transactions

## Using PubSub

## Using Lua

## Debugging Lua

# Developing with Redis

## When to Use Redis in Your Application

### Session Store

### Analytics

### Leaderboards

### Queues

### Latest N records

### Caching

## Using the correct data types

## Using the correct Redis APIs

## Connecting to Redis with Python

## Writing a MapReduce job for Redis

## Writing a Spark job for Redis

# Replication

## Setting up Redis replication

## Optimizing replication

## Troubleshooting Replication

# Persistence

## Manipulating RDB

## Exploring RDB

## Manipulating AOF

## Exploring AOF

## Combining RDB and AOF

# Setting up High Availability and Cluster

## Setting up Sentinel

## Testing Sentinel

## Administering Sentinel

## Setting up Redis Cluster

## Testing Redis Cluster

## Administrating Redis Cluster

# Deploying to a Production Environment

## Deploying Redis on Linux

## Securing Redis

## Setting client connection options

## Configuring memory policy

## Benchmarking

## Logging

# Administrating Redis

## Managing Redis Server Connections

## Operating Redis using bin/redis-cli

## Backup and Restore

## Monitoring memory

## Managing clients

## Data migration

# Troubleshooting Redis

## Health Checking in Redis

## Identifying slow queries using the SLOWLOG

## Troubleshooting latency issues

## Troubleshooting memory issues

## Troubleshooting crash issues

# Extending Redis with Redis Modules

## Loading a Redis module

## Writing a Redis module

# The Redis Ecosystem

## The Redisson client

## Twemproxy

## Codis - a proxy-based high-performance Redis Cluster solution

## The CacheCloud Redis management system

## Pika - a Redis-compatible NoSQL database


