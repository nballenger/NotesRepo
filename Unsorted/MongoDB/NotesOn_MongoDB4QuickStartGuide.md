# Notes on MongoDB 4 Quick Start Guide

By Doug Bierer; Packt Publishing, Sept. 2018; ISBN 9781789343533

# 1. Introducing MongoDB

## Overview of MongoDB

* Departure from relational data modeling
* First version from 2009, mostly to address big data and modeling complex objects

### Handling Big Data

* RDBMS systems have a lot of overhead around relations
* That's compounded by big data
* MongoDB incorporates stuff like map-reduce to allow parallel, distributed processing
* Has sharding, which fans out fragments of a database across servers
* Intended as a general purpose platform, if you just need big data stuff see Hadoop and Cassandra

### Modeling objects without SQL

* Paradox of OOP code that requires DB access is that complex objects can be represented in code, but in the database their nested structure requires a lot of relational overhead.
* Mongo has no rigid db schema, since it's document based
* A set of documents is a 'collection', and each document can directly model an object class
* Has its own query language, but not SQL

# 2. Understanding MongoDB Data Structures

## What is NoSQL?

* No formal definition of NoSQL
* Common characteristics
    * does not adhere to the relational model
    * Mongo: no fixed schema, no tables, columns, rows
    * Driven by the needs of big data, so tend to be scalable/distributed
    * Mongo: sharding
* Different modeling paradigms in NoSQL:
    * Graph databases
    * KV stores
    * Wide column
    * Document (this is MongoDB)
* Document databases use objects as their smallest logical unit, does not enforce a schema on collected objects

## Documents, collections, and database

* 'Document' - equivalent to an RDBMS 'row', is a self-contained JSON doc
* 'Field' - equivalent to an RDBMS 'column', is a property / attribute in a document
* 'Collection' - equivalent to 'table', collection of related documents
* No primary keys, but `_id` added to every doc on insert
* `_id` is an `ObjectId` instance, guarantees uniqueness

## Data-modeling considerations

### References

* References let you create a series of related collections, so you can establish a normalized data model
* "By imposing an SQL-esque solution on a MongoDB dataset, however, you defeat the purpose of using a NoSQL database. Unless your database driver provides support for DBRefs, which allows for an embedded link between collections, you are forced to write code to traverse the references manually, which introduces the very overhead you wanted to avoid by choosing MongoDB in the first place!"
* Both Python and Node support DBRefs

### Embedded documents

* Better data-modeling solution would be to collapse the normalized relationships and fold the related information into embedded documents.
* Embedded documents are just sub-objects within a parent document
* They let you use a single query to obtain a consolidated block of information
* MongoDB also supports creating indexes on any given field

### Document design

* One way to start is to get an understanding of what outputs you'll eventually need
* Then work backwards to decide what documents to create
* Example of customers, products, and purchases
    * If you need a customer report at some point, you design a customer collection, and include ONLY that information that needs to go into the report
    * If you have an inventory collection, you would include only the information needed to display a report or on screen display of the inventory
    * Purchases is trickier
        * SQL way to do it would be a minimal purchase document, with a reference to the associated customer and product documents
        * That would give you difficulties in terms of querying and producing output
        * More expedient design would be to just embed the associated documents inside the purchase document
* Another problematic situation in translating from SQL solutions is lookup tables.
    * Problem example: you want to populate an HTML select form element from a database, to choose between social media platforms. You also want to populate a second select element with a list of categories of clothing.
    * In SQL you'd probably create a table for each type, with a single row for each item.
    * In MongoDB, you might create a collection `select_options`, with two documents. The first doc would have a field `type` set to `Social Media`, and a second field would have an array of the values to display. Second document would be set up the same way.
* "Any time you find yourself creating a large set of small documents, consider collapsing the collection into a single document with an embedded array."

## Creating a MongoDB database and collection

* Just shows you how to get MongoDB compass and click some buttons.

# 3. Using the MongoDB Shell

## Overview

### Why use the mongo shell?

* Small operating footprint to the CLI shell
* Can run scripts remotely.

### Options when invoking the shell

* `mongo` - open shell
* `mongo -u username -p password -h host --port 27107 --ssl`
* `mongo some_js_file.js`
* `mongo --eval 'javascript;commands;'`
* `mogno --help`
* `exit` - invokes `quit()`

### .mongorc.js File

* Any command line option flags can be put into `mongorc.js`
* That file is parsed unless you give `--norc`
* Two primary locations, home dir and system's `/etc`
* global file processed first, local second
* `--norc` only suppresses the local file, not hte global
* Sample file customizing the prompt:

    ```JavaScript
    host = db.serverStatus().host;
    upTime = db.serverStatus().uptime;
    prompt = function() {
        return db+"@"+host+"[up:"+upTime+"]> ";
    }
    ```

### Informational commands

* Type `help` inside the shell to get a quickref list

```
> help
	db.help()                    help on db methods
	db.mycoll.help()             help on collection methods
	sh.help()                    sharding helpers
	rs.help()                    replica set helpers
	help admin                   administrative help
	help connect                 connecting to a db help
	help keys                    key shortcuts
	help misc                    misc things to know
	help mr                      mapreduce

	show dbs                     show database names
	show collections             show collections in current database
	show users                   show users in current database
	show profile                 show most recent system.profile entries with time >= 1ms
	show logs                    show the accessible logger names
	show log [name]              prints out the last segment of log in memory, 'global' is default
	use <db_name>                set current database
	db.foo.find()                list objects in collection foo
	db.foo.find( { a : 1 } )     list objects in foo where a == 1
	it                           result of the last line evaluated; use to further iterate
	DBQuery.shellBatchSize = x   set default number of items to display on shell
	exit                         quit the mongo shell
```

## Performing simple queries

* `db.<collection>.find({<filter>},{<projection>}).<aggregation>()` - returns 1+ documents based on the filter expression. Projection includes/excludes fields. Aggregation manipulates the output set via `sort()`, `limit()`, etc.
* `db.<collection>.findOne({<filter>},{<projection>})` - returns 1 document based on filter expression.
* Primary query command is `db.<collection>.find()` (or `findOne()`)
* With no args, `find()` returns all docs in collection
* Return value of `find()` is not the result set itself, but a cursor that can be used to extract results
* Command shell will automatically iterate the cursor 20 times by default, prompt for more
* Aggregation / 'cursor modification' is the term for additional treatment of the cursor result

### Defining a query filter

* The filter is a JSON expression with criteria for include/exclude of documents from the result set
* Typically two elements, a document field name and an expression
* Expressions may be
    * literal value
    * regex
    * statement with 1+ query selectors / operators
* Some of the built-in query selectors:
    * `$eq`, `$ne`, `$lt`, `$lte`, `$gt`, `$gte`
    * `$in [<array of values>]`, `$nin [<array>]`
    * `$and`, `$or`, `$not`
    * `$exists` - true if document has field
    * `/regex/modifier`
* Lots of other expression operator categories for arithmetic, array, boolean, conditional, date, literal, object, set, string, text, types, accumulators, and variable expressions.
* Example:

    ```
    > db.products.find(
        {
            price:{$gt:"2",$lt:"8"},
            title:/chocolate/i
        },
        {
            _id:0,description:0
        }
    ).sort({sku:1});
    ```

### Defining a projection

* A projection defines which fields in a doc to include/exclude from final output
* Form is a JSON expression of KV pairs
* Key is field name, value is `0` (exclude) or `1` (include)
* All fields included by default
* The `_id` field is auto-included even if you explicitly scope to just a subset of included fields. To suppress it, add `_id:0` to your projection.
* Example:

    ```
    > db.products.find({title:/Cookies/},{sku:1,title:1,price:1,_id:0})
    ```

### Modifying the cursor

* Cursor modifiers include things like `sort()` and `limit()`
* They can be chained.
* `sort()` takes a JSON expression arg, with KV pairs forming the sort criteria
* key is field name, value is `1` (ascending) or `-1` (descending)
* Example:

    ```
    > db.products.find({}, {_id:0,description:0}).sort({price:1}).limit(5);
    ```

## Database and collection operations

### Working with databases

* Creating a db: `use <dbName>; db.<collection>.insertOne({ //document });`
* Dropping: `use <dbName>; db.dropDatabase();`
* Note that the db is not created by `use` alone--it doesn't exist until a document is inserted into a collection.

### Working with collections

* Create a collection: 
    * `use <db>; db.<collection>.insertOne({ // document });`, or
    * `use <db>; db.createCollection(<collection>);`
* Delete a collection: `use <db>; db.<collection>.drop();`

## Creating, updating, or deleting documents

* The document is the atomic unit in MongoDB
* Documents are JSON expressions containing KV pairs
* Key is the field anme, value is the data used to form the document
* Methods exist for operating on both single and multiple documents
* Generic form: `(insert|update|delete)(One|Many)()`

### Creating one or more documents

* `db.<collection>.insertOne({ // document });`
* `db.<collection>.insertMany([ { //doc }, { //doc }, { //doc } ]);`
* Doc to insert must be well formed JSON
* Fields may contain arrays or other documents (objects)
* Examples:

    ```
    > db.customers.insertOne(
        {
            "name": "Alfred Alpha",
            "address": "111 Elm Street"
        }
    );

    > db.customers.insertMany(
        [
            { "name": "Bob Bravo", "address": "222 Elm Street" },
            { "name": "Cate Charlie", "address": "333 Elm Street" }
        ]
    );
    ```

### Updating one or more documents

* `db.<collection>.updateOne({<filter>}, {<update>}[, {upsert:true}]);`
* `db.<collection>.updateMany({<filter>}, {<update>}[, {upsert:true}]);`
* `db.<collection>.replaceOne({<filter>}, {//doc}[, {upsert:true}]);`
* Filter syntax is same as for `find()`
* For `updateOne()` you only have to supply the fields to change
* For `replaceOne()` you have to supply an entire replacement doc
* If `upsert` is true, a new doc is inserted if the update/replace command fails to find a document that matches the filter.
* First arg to `update*()` is a filter, second must use an 'update operator'
* Syntax of update operators is `{ operator: { field: value,... } }`
* Operators include
    * `$inc` - increment the value of an integer field
    * `$set` - used to assign a value. If field is not present, adds it.
    * `$unset` - removes a field from a doc
    * `$rename` - changes the name of a field
* Example:
    
    ```
    > db.customers.updateOne(
         { name: "Conrad Perry" },
         { $set:
            {
                "phone": "123-456-7890",
                "balance": 544.44
            }
         }
      );

    > db.customers.updateMany(
        { name: { $in: ["Alfred", "Barbara", "Charles"] }},
        { $set: { "balance": 0.0 } }
    );
    ```

### Deleting one or more documents

* `db.<collection>.deleteOne({<filter>});`
* `db.<collection>.deleteMany({<filter>});`
* Since you can accidentally delete all documents in a collection with `deleteMany()`, use `deleteOne()` whenever possible.

## Creating and running shell scripts

* Command summary:
    * `mongo [<database>] --eval "command"` - direct command execution
    * `mongo <js_file.js>` - runs provided shell script

### Running a direct command

* Getting status info: `mongo --eval "db.serverStatus();"`
* Periodically run query:

    ```
    mongo sweetscomplete --eval "db.customers.find(
        { balance: 0 },
        { name:1, email:1, balance:1 }
    ).pretty();"
    ```

### Running a shell script

* Scripts must follow standard JS syntax
* You can use any built in mongo shell methods
* May not use mongo command helpers (not valid JS functions)
* Example:

    ```JavaScript
    conn = new Mongo();
    db = conn.getDB("sweetscomplete");

    db.customers.insertOne({"name": "Alfred", "address": "111 Elm St"});
    db.customers.updateOne({"name": "Alfred"}, {$unset: {"password":1}});
    ```

* You can run it from the command line with `mongo <script_name>`
* Can also run it from within the shell with `load(<filename>)`
* Most mongo command helpers have JS equivalents

# 4. Developing with Program Language Drivers

# 5. Building Complex Queries using Aggregation

## An overview of aggregation

### What is aggregation?

* Primary purpose is to refine query results by
    * grouping together field values from multiple documents
    * then performing one or more transformations
* Closest SQL equivalents are probably `LIMIT`, `GROUP BY`, `ORDER BY`, and the functions for grouping

### Why use aggregation?

* Practical use for single-purpose is to present results in an order
* Also limiting the number of results returned
* More complex usage might include
    * manipulating documents, including embedded objects or arrays
    * optimizing results when operating on a sharded cluster
* Docs recommend using aggregation pipelines over map-reduce functions, because the pipeline approach uses native MongoDB classes and methods.

## Using single-purpose aggregation

* Operators that can operate on a collection:
    * `db.collection.count()` - wraps `$count` aggregation operator
    * `db.collection.distinct()` - wraps the `distinct` command
* Single purpose aggregation operations on a cursor:
    * `cursor.count()`
    * `cursor.limit()`
    * `cursor.sort()`

## Using the aggregation pipeline

* Consists of the `aggregate()` collection method and a sequence of operations called 'stages'. The total sequence is a 'pipeline'.
* Example is a collection, `purchases`, where each document has some info as well as embedded `customer` and `product` objects:

    ```
    {
        "_id": ObjectId("..."),
        "customer": {
            "_id": ObjectId("..."),
            "name": "Darrel Roman",
            "state_province": "NT",
            "country": "AU",
            "balance": 357.51
        },
        "product": {
            "_id": ObjectId("..."),
            "sku": "C3000",
            "title": "Chocolate Angelfood Cupcakes",
            "price": 0.3
        },
        "date": "2017-12-30",
        "quantity": 71,
        "amount": 21.3
    }
    ```

* Want to generate a report on total sales for each customer from Australia.
* Can't do it via `db.collection.find()` because it can't group customers
* Also a problem taht the country info is embedded in the `customer` object inside each `purchase`
* To generate the report, have to look at stages

### Aggregation Pipeline Stages

* Stages represented by stage operators.
* Example of a match stage followed by a grouping stage:

    ```
    db.purchases.aggregate([
        { $match: { "customer.country": /AU/ } },
        { $group: { _id: "$customer.name",
                    total: { $sum: "$amount" } } }
    ]);
    ```

#### $bucket

* Lets you break up the output into a set of distinct arrays called buckets
* Criteria for separating documents into buckets is determined by the field identified with the `groupBy` parameter.
* That matches the document field against the limits specified by the `boundaries` parameter. Values in `boundaries` can be numeric or strings
* Example of breaking up the query into buckets based on name, then using a `$project` stage to produce a sum of the amounts for the group of customers:

    ```
    db.purchases.aggregate( [
        {
            $bucket: {
                groupBy: "$customer.name",
                boundaries: [ "A", "G", "M", "S", "Y" ],
                default: "Y-Z",
                output: {
                    "count": { $sum: 1 },
                    "names": { $push: "$customer.name" },
                    "amounts": { $push: "$amount" }
                }
            }
        },
        {
            $project: {
                _id: "$_id",
                count: "$count",
                amounts: { $sum: "$amounts" }
            }
        }
    ] );
    ```

* Which should produce something like

    ```
    { "_id": "A", "count": 263, "amounts": 44894.1 }
    { "_id": "G", "count": 325, "amounts": 51267.2 }
    { "_id": "M", "count": 173, "amounts": 25485.2 }
    { "_id": "S", "count": 51, "amounts": 6113.2 }
    { "_id": "Y-Z", "count": 18, "amounts": 2726.5 }
    ```

#### $group

* Lets you aggregate on a specific field
* Can then apply accumulator operators to the result to get sums, averages, etc.
* Example that produces totals by customer name, with average quantity and total number of purchases:

    ```
    db.purchases.aggregate( [
        { $group: {
            _id: "$customer.name",
            total: { $sum: "$amount" },
            avgQty: { $avg: "$quantity" },
            count: { $sum: 1 }
        }
    }]);
    ```

### Aggregation Pipeline expression operators

### Aggregation pipeline accumulators

### Aggregation pipeline expression operator examples

## Using map-reduce

## Using the MongoDB Compass aggregation pipeline builder

# 6. Maintaining MongoDB Performance

# 7. Securing MongoDB

# 8. Getting from a Web Form to MongoDB

# 9. Using Docker
